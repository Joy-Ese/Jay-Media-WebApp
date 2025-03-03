using JayMedia.Data.Data;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JayMedia.Api
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly DataContext _context;
    private IAuth _authService;

    public AuthController(DataContext context, IAuth authService)
    {
      _context = context;
      _authService = authService;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
      var result = await _authService.Register(request);
      return Ok(result);
    }


  }
}
