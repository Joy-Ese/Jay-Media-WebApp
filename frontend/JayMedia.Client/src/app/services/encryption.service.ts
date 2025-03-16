import { Injectable } from '@angular/core';
import forge from 'node-forge';

interface HybridEncryptionResult {
  IV: string;
  Key: string;
  Data: string;
}

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private publicKey: string = `-----BEGIN PUBLIC KEY-----
  MIIBCgKCAQEAyM9tV1DehWTP52tZS5mK72iuOUucvuqpg0FIHxUaGbs68/FKyorMa0X+WRZ+QkB2jibIU2gKv5UP3v8pxhPBY10qIV2b8auQqxfBI6dI9treWnrlnQMhvgmGttczyaZ8qTHtOroFp9LDjQddZZi3ilR1twgfLhz/yL8aZqrj6TD4tJuGAW0jMVLO7jU8GP5nRfRU3ngxrICKV585UucjgkEMYcYQykjd1a0wKjIWLwqiDMC8TzcrtC4JDMpXZ/IPx9knuvIy1WQMWO4H2z7zfZS3Kal9ShCkb0PDyOav3WmnVmzkcieg7MBjZn8dxQstHt/uDYMbB7ps8XznY2xvCQIDAQAB
  -----END PUBLIC KEY-----`; // Public Key

  private privateKey: string = `-----BEGIN PRIVATE KEY-----
MIIEpAIBAAKCAQEAyM9tV1DehWTP52tZS5mK72iuOUucvuqpg0FIHxUaGbs68/FKyorMa0X+WRZ+QkB2jibIU2gKv5UP3v8pxhPBY10qIV2b8auQqxfBI6dI9treWnrlnQMhvgmGttczyaZ8qTHtOroFp9LDjQddZZi3ilR1twgfLhz/yL8aZqrj6TD4tJuGAW0jMVLO7jU8GP5nRfRU3ngxrICKV585UucjgkEMYcYQykjd1a0wKjIWLwqiDMC8TzcrtC4JDMpXZ/IPx9knuvIy1WQMWO4H2z7zfZS3Kal9ShCkb0PDyOav3WmnVmzkcieg7MBjZn8dxQstHt/uDYMbB7ps8XznY2xvCQIDAQABAoIBAH6XnWOVPKK1WgeW+hUZt6eTw3mlPCxzPOfc6L2HjQu5p8GPVMn41EOwPVcmQfQ8NUEKG/HQvi3mp7m5/Di9zYV5fwzHuX6R3MKvV/fFBs9wTQqXPVdNWSE3WjC73A78oMv9CIOkL9qLmPG4Od3Jd7OB6S+4tAdbCrkgGGGuy7z+HzGcv7mz1qkV/ZLg8nvGhg+oDhlehdi9G4eSfvpwnzMaby+oNLI78eBJPW4tsR/xZndRCsMCsUpwI1Qyy2XWjhjXmXfiKtGlDuPaUj9EcKs5sWHpGItNfqSkFnepQoueGCK+OysNBL1OF1iUYEjP4IFnrhntAr6c61A3ZCIOCo0CgYEA2LNbTF6jWcDcg7bw+koQO3vYN7409vq/dOq182gv5tQbryOUlfWgONA5R7bI40QQwVpdgux+m4emI+RIGZVCIsK0lQNekEjVn7sIKuAUn6SYspzoTiZJp8BM66KKd+4TemLQsY+yWIrb+xuDpIOWiAGJgvm13TK+31x69Q8EZ1MCgYEA7TpWdJKAOOFS1zjWVrXMUlqoA+khW+YQS6Uftdp1i88FAvZbcF5eE+PklU5rFKhM+UXpfcFXfw8YhKYZyW2G2dvSVxMirA/AVQctiP/CPICEhk1/9x3XS8jXdZyX7Lsw2cLZZm+gkK9aaW3J5Eh8yPIvdxgrXxvAq4voNhIxELMCgYEAtNP2O6Q9a4gke0UNkc57/Sc7JkjyqaZUXZv+eT9XuacF8wAd3YU6Ti5zngRJXlxOHwrpPXdbry1i1lCIWdDTf246gp5tKrmcic3o4t5aV11ijqmgsJYCoJk3lunr4mgomNgcjg77JCe7qa8sCvxDgPrHZSQ7Pno6DOl/MT92zUECgYEAwwolrq4MUbefnmeSgbPyivsSDDUOQjpCx465JZC49/t6yVa3EwnjG0NQ2hihHVjKAGAkekoNn99PbzAJH3y3VELRCtomtYQ1wzKlk2+DyK55RtpNDWUxb5Nu4bmfhvjYTxFOIFRClPI2yVuEk/Ws8qF7uNTcQ9PTcrcScfI++NUCgYANX/GZZ/hPdMzfrHzlAughxbvczXKSgCn8lMn6f07m4BMDusY0cXY9sx3bypdnzuaOhZ9AnziQR0gdCYjTi6P3sqeZGHObGZr7WaXCs6IX6XvD3bpe+MwO6xFCNbo+30thLZPF6ur7rcRyRfno9l/5poVuFBT462QtXMVQt+7a9A==
  -----END PRIVATE KEY-----`; // Private Key

  constructor() { }

  // Encrypt data with RSA
  encryptData(data: any): string {
    if (!this.publicKey) {
      throw new Error('Public key not loaded yet.');
    }

    // For small data, use direct RSA encryption
    try {
      const dataStr = JSON.stringify(data);
      const rsa = forge.pki.publicKeyFromPem(this.publicKey);
      const encrypted = rsa.encrypt(dataStr, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
      });
      return forge.util.encode64(encrypted);
    } catch (error) {
      console.error('RSA encryption failed:', error);
      throw error;
    }
  }

  // Decrypt data with RSA or hybrid encryption
  decryptData(encryptedData: any): any {
    // If it's already an object
    if (typeof encryptedData === 'object' && encryptedData !== null) {
      // Check if it's a hybrid encryption result
      if (encryptedData.IV && encryptedData.Key && encryptedData.Data) {
        return this.decryptHybridData(encryptedData);
      }
      // If it's some other kind of object, stringify it for RSA decryption
      encryptedData = JSON.stringify(encryptedData);
    } else if (typeof encryptedData === 'string') {
      // Try to parse as JSON to check if it's hybrid encrypted
      try {
        const hybridData = JSON.parse(encryptedData) as HybridEncryptionResult;
        if (hybridData && hybridData.IV && hybridData.Key && hybridData.Data) {
          return this.decryptHybridData(hybridData);
        }
      } catch (error) {
        // Not a JSON or not a hybrid encryption, continue with RSA
      }
    }

    // Regular RSA decryption
    try {
      const rsa = forge.pki.privateKeyFromPem(this.privateKey);
      const decryptedBytes = rsa.decrypt(forge.util.decode64(encryptedData), 'RSA-OAEP', {
        md: forge.md.sha256.create()
      });
      return JSON.parse(decryptedBytes);
    } catch (error) {
      console.error('RSA decryption failed:', error);
      throw error;
    }
  }

  // Decrypt hybrid encrypted data (AES + RSA)
  private decryptHybridData(hybridData: HybridEncryptionResult): any {
    try {
      // Decrypt the AES key with RSA
      const rsa = forge.pki.privateKeyFromPem(this.privateKey);
      const encryptedKey = forge.util.decode64(hybridData.Key);
      const aesKey = rsa.decrypt(encryptedKey, 'RSA-OAEP', {
        md: forge.md.sha256.create()
      });
      
      // Decrypt the data with AES
      const iv = forge.util.decode64(hybridData.IV);
      const encryptedData = forge.util.decode64(hybridData.Data);
      const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
      decipher.start({iv: iv});
      decipher.update(forge.util.createBuffer(encryptedData));
      const result = decipher.finish();

      if (!result) {
        throw new Error('AES decryption failed');
      }

      const decryptedStr = decipher.output.toString();
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error('Hybrid decryption failed:', error);
      throw error;
    }
  }

}
