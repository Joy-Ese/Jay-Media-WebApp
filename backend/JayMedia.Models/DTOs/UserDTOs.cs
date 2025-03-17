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



