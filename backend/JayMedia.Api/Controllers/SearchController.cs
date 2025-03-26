using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JayMedia.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SearchController(ISearch searchService) : ControllerBase
  {
    private ISearch _searchService = searchService;

// OpenVerse Auth
    [HttpPost("RegisterOpenVerse")]
    public async Task<IActionResult> RegisterOpenVerse(OpenVerseRegisterReq req)
    {
      var result = await _searchService.RegisterOpenVerse(req);
      return Ok(result);
    }

    [HttpPost("TokenOpenVerse")]
    public async Task<IActionResult> TokenOpenVerse(OpenVerseTokenReq req)
    {
      var result = await _searchService.TokenOpenVerse(req);
      return Ok(result);
    }

// OpenVerse Search
    [HttpGet("ImagesSearch")]
    public async Task<IActionResult> ImagesSearch(string query)
    {
      var result = await _searchService.ImagesSearch(query);
      return Ok(result);
    }




  }
}
