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
    // [HttpPost("TokenOpenVerse")]
    // public async Task<IActionResult> TokenOpenVerse(OpenVerseTokenReq req)
    // {
    //   var result = await _searchService.TokenOpenVerse(req);
    //   return Ok(result);
    // }

// OpenVerse Search
    [HttpGet("ImagesSearch")]
    public async Task<IActionResult> ImagesSearch(string query)
    {
      var result = await _searchService.ImagesSearch(query);
      return Ok(result);
    }

    [HttpGet("AudiosSearch")]
    public async Task<IActionResult> AudiosSearch(string query)
    {
      var result = await _searchService.AudiosSearch(query);
      return Ok(result);
    }

    [HttpGet("SearchMedia")]
    public async Task<IActionResult> SearchMedia(string query)
    {
      var result = await _searchService.SearchMedia(query);
      return Ok(result);
    }

    [HttpGet("ImageFiltering")]
    public async Task<IActionResult> ImageFiltering(string query, string license, string category, string size)
    {
      var result = await _searchService.ImageFiltering(query, license, category, size);
      return Ok(result);
    }

    [HttpGet("AudioFiltering")]
    public async Task<IActionResult> AudioFiltering(string query, string license, string category, string length)
    {
      var result = await _searchService.AudioFiltering(query, license, category, length);
      return Ok(result);
    }




  }
}
