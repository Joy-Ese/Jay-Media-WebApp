using System.Security.Claims;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JayMedia.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController(IAuth authService) : ControllerBase
  {
    private IAuth _authService = authService;

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
      var result = await _authService.Register(request);
      return Ok(result);
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
      var result = await _authService.Login(request);
      if (!result.status) return BadRequest(result);

      return Ok(result);
    }

    // [HttpGet("google-response")]
    // public async Task<IActionResult> GoogleResponse()
    // {
    //     var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
    //     if (!result.Succeeded) return Unauthorized();

    //     var username = result.Principal.FindFirstValue(CustomClaims.Username);
    //     var token = _authService.CreateJwtToken(username!);
    //     return Ok(new { Token = token });
    // }


  }
}
