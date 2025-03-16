using System.Text.Json;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayMedia.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController(IAuth authService) : ControllerBase
  {
    private IAuth _authService = authService;

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] EncryptedRequest request)
    {
      // Decrypt incoming frontend request
      string decryptedData = EncryptionHelper.DecryptData(request.Data);
      var userData = JsonSerializer.Deserialize<RegisterDto>(decryptedData);

      // Error Handling when userData is null
      if (userData == null) return BadRequest("Incorrect User Information");

      // Pass decrypted data to service
      var result = await _authService.Register(userData);
      if (!result.status) return BadRequest(result);

      // Encrypt response before sending it back
      string encryptedResponse = EncryptionHelper.EncryptData(JsonSerializer.Serialize(result));
      return Ok(encryptedResponse);
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] EncryptedRequest request)
    {
      // Decrypt incoming frontend request
      string decryptedData = EncryptionHelper.DecryptData(request.Data);
      var userData = JsonSerializer.Deserialize<LoginDto>(decryptedData);

      // Error Handling when userData is null
      if (userData == null) return BadRequest("Incorrect User Information");

      // Pass decrypted data to service
      var result = await _authService.Login(userData);
      if (!result.status) return BadRequest(result);

      // Encrypt response before sending it back
      string encryptedResponse = EncryptionHelper.EncryptData(JsonSerializer.Serialize(result));
      return Ok(encryptedResponse);
    }

    [HttpPost("Google-Login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto request)
    {
      var result = await _authService.GoogleLogin(request);
      if (!result.status) return BadRequest(result);
      return Ok(result);
    }

  }
}
