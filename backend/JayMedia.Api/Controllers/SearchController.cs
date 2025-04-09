using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
    // [HttpPost("TokenOpenVerse")]
    // public async Task<IActionResult> TokenOpenVerse(OpenVerseTokenReq req)
    // {
    //   var result = await _searchService.TokenOpenVerse(req);
    //   return Ok(result);
    // }

// OpenVerse Search
    [HttpGet("SearchMedia")]
    public async Task<IActionResult> SearchMedia(string query, string username)
    {
      var result = await _searchService.SearchMedia(query, username);
      return Ok(result);
    }

    [HttpGet("ImageFiltering")]
    [Authorize]
    public async Task<IActionResult> ImageFiltering(string query, string license, string category, string size)
    {
      var result = await _searchService.ImageFiltering(query, license, category, size);
      return Ok(result);
    }

    [HttpGet("AudioFiltering")]
    [Authorize]
    public async Task<IActionResult> AudioFiltering(string query, string license, string category, string length)
    {
      var result = await _searchService.AudioFiltering(query, license, category, length);
      return Ok(result);
    }

    [HttpGet("GetActiveSearches")]
    [Authorize]
    public async Task<IActionResult> GetActiveSearches()
    {
      var result = await _searchService.GetActiveSearches();
      return Ok(result);
    }

    [HttpGet("GetInActiveSearches")]
    [Authorize]
    public async Task<IActionResult> GetInActiveSearches()
    {
      var result = await _searchService.GetInActiveSearches();
      return Ok(result);
    }

    [HttpPut("RestoreOrDelete")]
    [Authorize]
    public async Task<IActionResult> RestoreOrDelete(string action, int searchId)
    {
      var result = await _searchService.RestoreOrDelete(action, searchId);
      return Ok(result);
    }


  }
}
