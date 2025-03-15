using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;
using JayMedia.Data.Data;
using JayMedia.Data.Entities;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

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
    ResponseModel response = new();
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

  // Write method logic for logging in a user // Implementing OAuth 2.0
  public async Task<ResponseModel> Login(LoginDto request) 
  {
    ResponseModel response = new();
    try 
    {
      var userExists = await _context.Users.FirstOrDefaultAsync(x => x.Username == request.username);

      if (userExists == null) 
      {
        response.status = false;
        response.message = "Invalid Username or Password";
        _logger.LogWarning($"-----Invalid Username or Password----{request.username}----");
        return response;
      }

      if (userExists.PasswordHash == null || userExists.PasswordSalt == null)
      {
        response.status = false;
        response.message = "Invalid Username or Password";
        _logger.LogWarning($"-----PasswordHash or PasswordSalt returned null----");
        return response;
      }

      if (!VerifyPasswordHash(request.password, userExists.PasswordHash, userExists.PasswordSalt))
      {
        response.status = false;
        response.message = "Invalid Username or Password";
        return response;
      }

      // create token... check if token is null or empty
      string token = CreateJwtToken(userExists);

      if (string.IsNullOrEmpty(token))
      {
        response.status = false;
        response.message = "Login failed";
        _logger.LogWarning($"-----Unable to create jwt token... Token is null {token}----");
        return response;
      }

      userExists.LastLogin = DateTime.UtcNow;
      await _context.SaveChangesAsync();

      response.status = true;
      response.message = "Login successful";

      _logger.LogInformation($"User successfully logged in with {userExists.Username}");

      return response;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      response.status = false;
      response.message = "An exception occured";
      return response;
    }
  }

  // Write method to login with Google
  public async Task<ResponseModel> GoogleLogin(GoogleLoginDto request) 
  {
    ResponseModel response = new();
    try 
    {
      var googleSettings = _configuration.GetSection("Authentication:Google");

      // Verify the Google ID Token coming from the frontend
      var payload = await GoogleJsonWebSignature.ValidateAsync(request.idToken, new GoogleJsonWebSignature.ValidationSettings
      {
        Audience = new[] 
        { 
          googleSettings["ClientId"] 
        }
      });

      // Generate JWT token from credentials
      var userExists = await _context.Users.FirstOrDefaultAsync(x => x.Email == payload.Email);

      if (userExists == null) 
      {
        response.status = false;
        response.message = "Invalid Email or Password";
        _logger.LogWarning($"-----Google Login--- User email does not match email from google payload");
        return response;
      }

      User userObj = new()
      {
        Id = userExists.Id,
        Username = userExists.Username,
        FirstName = userExists.FirstName,
        LastName = userExists.LastName
      };
      var token = CreateJwtToken(userObj);

      response.status = false;
      response.message = token;
      _logger.LogInformation($"User successfully logged in with Google Auth");
      return response;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      response.status = false;
      response.message = "An exception occured";
      return response;
    }
  }

  // Create method to generate jwt token 
  private string CreateJwtToken(User user) 
  {
    var claims = new[] 
    { 
      new Claim(CustomClaims.UserId, user.Id.ToString()),
      new Claim(CustomClaims.Username, user.Username),
      new Claim(CustomClaims.FirstName, user.FirstName),
      new Claim(CustomClaims.LastName, user.LastName),
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
      _configuration.GetSection("JwtSettings:Token").Value!));

    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
      claims: claims,
      expires: DateTime.Now.AddMinutes(30),
      signingCredentials: credentials
    );

    var jwt = new JwtSecurityTokenHandler().WriteToken(token);
    return jwt;
  }

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
