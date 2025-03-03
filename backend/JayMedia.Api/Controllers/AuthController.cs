using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
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


  }
}
