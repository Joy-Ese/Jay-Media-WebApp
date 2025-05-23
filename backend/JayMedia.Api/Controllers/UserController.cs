using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JayMedia.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UserController(IUser userService) : ControllerBase
  {
    private IUser _userService = userService;

    [HttpGet("GetUserDetails")]
    [Authorize]
    public async Task<IActionResult> GetUserDetails()
    {
      var result = await _userService.GetUserDetails();
      return Ok(result);
    }

    [HttpPost("EditUserDetails")]
    [Authorize]
    public async Task<IActionResult> EditUserDetails(ProfileDto request) 
    {
      var result = await _userService.EditUserDetails(request);
      return Ok(result);
    }

  }
}
