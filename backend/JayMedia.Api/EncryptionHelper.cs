using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace JayMedia.Api;

public static class EncryptionHelper
{
  private static readonly RSA rsa = RSA.Create(2048);

  static EncryptionHelper()
  {
    // Load the private key from txt file
    string privateKey = System.IO.File.ReadAllText("privateKey.txt");
    rsa.ImportRSAPrivateKey(Convert.FromBase64String(privateKey), out _);
  }

  // Get Public Key (For frontend)
  public static string GetPublicKey()
  {
    return Convert.ToBase64String(rsa.ExportRSAPublicKey());
  }

  // Decrypt Data
  public static string DecryptData(string encryptedData)
  {
    try
    {
      // Try to parse as a hybrid encryption result
      var hybridData = JsonSerializer.Deserialize<HybridEncryptionResult>(encryptedData);
      if (hybridData != null && !string.IsNullOrEmpty(hybridData.Key))
      {
        return DecryptLargeData(hybridData);
      }
    }
    catch (JsonException)
    {
      // Not a hybrid encryption result, continue with normal RSA decryption
    }

    // Regular RSA decryption
    byte[] encryptedBytes = Convert.FromBase64String(encryptedData);
    byte[] decryptedBytes = rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.OaepSHA256);
    return Encoding.UTF8.GetString(decryptedBytes);
  }

  // Encrypt Data
  public static string EncryptData(string plainData)
  {
    // Check if data is too large
    byte[] dataBytes = Encoding.UTF8.GetBytes(plainData);
    
    // Calculate maximum data size for this key (RSA key size in bytes minus padding overhead)
    int maxDataLength = (rsa.KeySize / 8) - 42; // For OAEP with SHA-256
    
    if (dataBytes.Length > maxDataLength)
    {
      // For large data, use a hybrid approach
      return EncryptLargeData(plainData);
    }
    
    try
    {
      // For small data, direct RSA encryption
      byte[] encryptedBytes = rsa.Encrypt(dataBytes, RSAEncryptionPadding.OaepSHA256);
      return Convert.ToBase64String(encryptedBytes);
    }
    catch (CryptographicException)
    {
      // If encryption fails, fall back to hybrid approach
      return EncryptLargeData(plainData);
    }
  }

  // For large data encryption using hybrid approach (AES + RSA)
  private static string EncryptLargeData(string plainData)
  {
    using (Aes aes = Aes.Create())
    {
      aes.GenerateKey();
      aes.GenerateIV();
      
      // Encrypt the data with AES
      byte[] encryptedData;
      using (var encryptor = aes.CreateEncryptor())
      using (var ms = new MemoryStream())
      {
        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
          sw.Write(plainData);
        }
        encryptedData = ms.ToArray();
      }
      
      // Encrypt the AES key with RSA
      byte[] encryptedKey = rsa.Encrypt(aes.Key, RSAEncryptionPadding.OaepSHA256);
      
      // Create result object
      var result = new HybridEncryptionResult
      {
        IV = Convert.ToBase64String(aes.IV),
        Key = Convert.ToBase64String(encryptedKey),
        Data = Convert.ToBase64String(encryptedData)
      };
      
      return JsonSerializer.Serialize(result);
    }
  }

  // For decrypting large data
  private static string DecryptLargeData(HybridEncryptionResult hybridData)
  {
    // Decrypt the AES key with RSA
    byte[] encryptedKey = Convert.FromBase64String(hybridData.Key);
    byte[] aesKey = rsa.Decrypt(encryptedKey, RSAEncryptionPadding.OaepSHA256);
    
    // Decrypt the data with AES
    using (Aes aes = Aes.Create())
    {
      aes.Key = aesKey;
      aes.IV = Convert.FromBase64String(hybridData.IV);
      
      byte[] encryptedData = Convert.FromBase64String(hybridData.Data);
      
      using (var ms = new MemoryStream(encryptedData))
      using (var decryptor = aes.CreateDecryptor())
      using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
      using (var sr = new StreamReader(cs))
      {
        return sr.ReadToEnd();
      }
    }
  }

  private class HybridEncryptionResult
  {
    public string IV { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty;
  }
}
