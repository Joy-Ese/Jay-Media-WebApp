using System;
using System.Security.Cryptography;
using JayMedia.Data.Data;
using JayMedia.Data.Entities;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace JayMedia.Services.Services;

public class AuthService : IAuth
{
  private readonly DataContext _context;
  private readonly IConfiguration _configuration;
  private readonly ILogger<AuthService> _logger;

  public AuthService(DataContext context, IConfiguration configuration, ILogger<AuthService> logger) {
    _context = context;
    _configuration = configuration;
    _logger = logger;
    _logger.LogDebug(1, "Nlog injected into AuthService");
  }

// Write method logic for registering a new user
  public async Task<ResponseModel> Register(RegisterDto request) 
  {
    ResponseModel response = new ResponseModel();
    try 
    {
      var userExists = await _context.Users.AnyAsync(x => x.Username == request.username || x.Email == request.email);

      if (userExists) 
      {
        _logger.LogWarning($"Duplicate username/email supplied {request.username}/{request.email}");
        response.status = false;
        response.message = "Username or Email already exists";
        return response;
      }

      if (!request.password.Equals(request.confirmPassword)) 
      {
        response.status = false;
        response.message = "Passwords do not match";
        return response;
      }

      if (request.termsAgreed == false) 
      {
        response.status = false;
        response.message = "Please agree to the Terms of Service and Privacy Policy";
        return response;
      }

      CreatePasswordHash(request.password, out byte[] passwordHash, out byte[] passwordSalt);

      User newUser = new()
      {
        FirstName = request.firstname,
        LastName = request.lastname,
        Username = request.username,
        PasswordHash = passwordHash,
        PasswordSalt = passwordSalt,
        Email = request.email
      };
      await _context.Users.AddAsync(newUser);
      await _context.SaveChangesAsync();

      response.status = true;
      response.message = "Registration successful. You will be redirected to the login page in 5 seconds";  
      return response;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      _logger.LogInformation(DateTime.UtcNow.ToLongTimeString(), "----Time Error Occurred----");
      return response;
    }
  }

  // Write method logic for logging in a user

  // Write method to Hash Password before saving to the db
  public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) 
  {
    using var hmac = new HMACSHA512();
    passwordSalt = hmac.Key;
    passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
  }

  // Write method to verfiy hashed passwords retrieved from the db
  public static bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt) 
  {
    using var hmac = new HMACSHA512(passwordSalt);
    var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    return computedHash.SequenceEqual(passwordHash);
  }

}
