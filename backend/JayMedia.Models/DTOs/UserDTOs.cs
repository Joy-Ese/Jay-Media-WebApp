using System;
using System.ComponentModel.DataAnnotations;

namespace JayMedia.Models.DTOs;

public class ResponseModel
{
  public bool status { get; set; }
  public string message { get; set; } = string.Empty;
}

public class RegisterDto
{
  public string firstname { get; set; } = string.Empty;
  public string lastname { get; set; } = string.Empty;
  public string username { get; set; } = string.Empty;
  public string email { get; set; } = string.Empty;
  public string password { get; set; } = string.Empty;
  public string confirmPassword { get; set; } = string.Empty;
  public bool termsAgreed { get; set; }
}

public class LoginDto
{
  [Required]
  public string username { get; set; } = string.Empty;
  [Required]
  public string password { get; set; } = string.Empty;
}

public class EncryptedRequest
{
  public string Data { get; set; } = string.Empty;
}

public class GoogleLoginDto
{
  public string idToken { get; set; } = string.Empty;
}

public class UserDetailsModel
{
  public string Username { get; set; } = string.Empty;
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
}

public class OpenVerseRegisterReq 
{
  public string name { get; set; } = string.Empty;
  public string description { get; set; } = string.Empty;
  public string email { get; set; } = string.Empty;
}

public class OpenVerseRegisterResp 
{
  public string msg { get; set; } = string.Empty;
  public string name { get; set; } = string.Empty;
  public string client_id { get; set; } = string.Empty;
  public string client_secret { get; set; } = string.Empty;
}

public class OpenVerseTokenReq 
{
  public string grant_type { get; set; } = string.Empty;
  public string client_secret { get; set; } = string.Empty;
  public string client_id { get; set; } = string.Empty;
}

public class OpenVerseTokenResp 
{
  public string access_token { get; set; } = string.Empty;
  public string scope { get; set; } = string.Empty;
  public int expires_in { get; set; }
  public string token_type { get; set; } = string.Empty;
}

public class OpenVerseKeyInfoResp 
{
  public int requests_this_minute { get; set; }
  public int requests_today { get; set; }
  public string rate_limit_model { get; set; } = string.Empty;
}





