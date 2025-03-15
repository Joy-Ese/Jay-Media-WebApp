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

    [HttpPost("Google-Login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto request)
    {
      var result = await _authService.GoogleLogin(request);
      if (!result.status) return BadRequest(result);
      return Ok(result);
    }


  }
}
