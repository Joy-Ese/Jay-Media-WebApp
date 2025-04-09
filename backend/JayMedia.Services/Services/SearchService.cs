using System;
using JayMedia.Data.Data;
using JayMedia.Data.Entities;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RestSharp;

namespace JayMedia.Services.Services;

public class SearchService : ISearch
{
  private readonly string _baseUrl;
  private readonly string? clientId;
  private readonly string? clientSecret;
  private readonly DataContext _context;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly IConfiguration _configuration;
  private readonly ILogger<SearchService> _logger;

  public SearchService(DataContext context, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ILogger<SearchService> logger) {
    _baseUrl = configuration["OpenVerseBaseUrl"] ?? throw new Exception("Openverse Base Url is missing");
    clientId = configuration.GetValue<string>("Client_Id");
    clientSecret = configuration.GetValue<string>("Client_Secret");
    _context = context;
    _httpContextAccessor = httpContextAccessor;
    _configuration = configuration;
    _logger = logger;
    _logger.LogDebug(1, "Nlog injected into SearchService");
  }

// OpenVerse Auth
  public async Task<OpenVerseTokenResp> TokenOpenVerse(OpenVerseTokenReq req) 
  {
    try 
    {
      var formData = new Dictionary<string, string>
      {
        { "grant_type", req.grant_type },
        { "client_secret",req.client_secret },
        { "client_id", req.client_id }
      };

      string url = $"{_baseUrl}/auth_tokens/token/";
      var client = new RestClient(url);
      var request = new RestRequest(url, Method.Post);
      request.AddHeader("Content-Type", "application/x-www-form-urlencoded");

      // Add form data
      foreach (var item in formData)
      {
        request.AddParameter(item.Key, item.Value);
      }

      RestResponse response = await client.ExecuteAsync(request);
      var content = response.Content;

      if (content == null) 
      {
        _logger.LogWarning($"Cannot get Token openverse api-----{content} is null-----");
        return new OpenVerseTokenResp();
      }
      var result = JsonConvert.DeserializeObject<OpenVerseTokenResp>(content);
      if (result == null) 
      {
        _logger.LogWarning($"Cannot get Token openverse api-----{result} is null-----");
        return new OpenVerseTokenResp();
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new OpenVerseTokenResp();
    }
  }

// Images Search
  public async Task<OpenVerseImageSearchResp> ImagesSearch(string query) 
  {
    try 
    {
      // Get APIToken for OpenVerse
      OpenVerseTokenReq tokenReq = new () 
      {
        grant_type = "client_credentials",
        client_secret = clientSecret!,
        client_id = clientId!
      };
      var accessT = await TokenOpenVerse(tokenReq);

      string url = $"{_baseUrl}/images/";
      var options = new RestClientOptions(url) 
      {
        RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true,
      };
      RestClient client = new RestClient(options);
      RestRequest request = new RestRequest() { Method = Method.Get };
      request.AddHeader("Authorization", $"Bearer {accessT.access_token}");
      request.AddHeader("content-type", "application/json");
      request.AddQueryParameter("q", query);
      RestResponse response = await client.ExecuteAsync(request);
      var content = response.Content;
      _logger.LogWarning($"Response from Images Search with url----{url}---- {response.Content}");

      if (content == null) 
      {
        _logger.LogWarning($"Cannot get openverse Images Search-----{content} is null-----");
        return new OpenVerseImageSearchResp();
      }
      var result = JsonConvert.DeserializeObject<OpenVerseImageSearchResp>(content);
      if (result == null) 
      {
        _logger.LogWarning($"Cannot get openverse Images Search-----{result} is null-----");
        return new OpenVerseImageSearchResp();
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new OpenVerseImageSearchResp();
    }
  }

// Audios Search
  public async Task<OpenVerseAudioSearchResp> AudiosSearch(string query) 
  {
    try 
    {
      // Get APIToken for OpenVerse
      OpenVerseTokenReq tokenReq = new () 
      {
        grant_type = "client_credentials",
        client_secret = clientSecret!,
        client_id = clientId!
      };
      var accessT = await TokenOpenVerse(tokenReq);

      string url = $"{_baseUrl}/audio/";
      var options = new RestClientOptions(url) 
      {
        RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true,
      };
      RestClient client = new RestClient(options);
      RestRequest request = new RestRequest() { Method = Method.Get };
      request.AddHeader("Authorization", $"Bearer {accessT.access_token}");
      request.AddHeader("content-type", "application/json");
      request.AddQueryParameter("q", query);
      RestResponse response = await client.ExecuteAsync(request);
      var content = response.Content;
      _logger.LogWarning($"Response from Audios Search with url----{url}---- {response.Content}");

      if (content == null) 
      {
        _logger.LogWarning($"Cannot get openverse Audios Search-----{content} is null-----");
        return new OpenVerseAudioSearchResp();
      }
      var result = JsonConvert.DeserializeObject<OpenVerseAudioSearchResp>(content);
      if (result == null) 
      {
        _logger.LogWarning($"Cannot get openverse Images Search-----{result} is null-----");
        return new OpenVerseAudioSearchResp();
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new OpenVerseAudioSearchResp();
    }
  }

// Returns both Audios and Images Search
  public async Task<SearchMedia> SearchMedia(string query, string username) 
  {
    // Check if user exists
    var userExists = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
    if (userExists != null) 
    {
      UserSearch newUsersearch = new() 
      {
        SearchQuery = query,
        Category = "Media",
        TimeStamp = DateTime.UtcNow,
        SoftDelete = false,
        UserId = userExists.Id
      };
      await _context.Searches.AddAsync(newUsersearch);
      await _context.SaveChangesAsync();
    }

    var bothMediaTypesSearch = new SearchMedia();
    try 
    {
      bothMediaTypesSearch.audioResult = await AudiosSearch(query);
      bothMediaTypesSearch.imageResult = await ImagesSearch(query);
      return bothMediaTypesSearch;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new SearchMedia();
    }
  }

// Filter Images Search
  public async Task<OpenVerseImageSearchResp> ImageFiltering(string query, string license, string category, string size) 
  {
    try 
    {
      // Get user logged in
      int userID;
      if (_httpContextAccessor.HttpContext == null)
      {
        return new OpenVerseImageSearchResp();
      }

      userID = Convert.ToInt32(_httpContextAccessor.HttpContext.User?.FindFirst(CustomClaims.UserId)?.Value);
      var userExists = await _context.Users.FirstOrDefaultAsync(x => x.Id == userID);

      // Get APIToken for OpenVerse
      OpenVerseTokenReq tokenReq = new () 
      {
        grant_type = "client_credentials",
        client_secret = clientSecret!,
        client_id = clientId!
      };
      var accessT = await TokenOpenVerse(tokenReq);

      string url = $"{_baseUrl}/images/";
      var options = new RestClientOptions(url) 
      {
        RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true,
      };
      RestClient client = new RestClient(options);
      RestRequest request = new RestRequest() { Method = Method.Get };
      request.AddHeader("Authorization", $"Bearer {accessT.access_token}");
      request.AddHeader("content-type", "application/json");
      request.AddQueryParameter("q", query);
      request.AddQueryParameter("license", license);
      request.AddQueryParameter("categories", category);
      request.AddQueryParameter("size", size);
      RestResponse response = await client.ExecuteAsync(request);
      var content = response.Content;
      _logger.LogWarning($"Response from Images Filtering with url----{url}---- {response.Content}");

      if (content == null) 
      {
        _logger.LogWarning($"Cannot get openverse Images Filtering-----{content} is null-----");
        return new OpenVerseImageSearchResp();
      }
      var result = JsonConvert.DeserializeObject<OpenVerseImageSearchResp>(content);
      if (result == null) 
      {
        _logger.LogWarning($"Cannot get openverse Images Filtering-----{result} is null-----");
        return new OpenVerseImageSearchResp();
      }

      if (userExists != null) 
      {
        UserSearch newUsersearch = new() 
        {
          SearchQuery = query,
          Category = category,
          TimeStamp = DateTime.UtcNow,
          SoftDelete = false,
          UserId = userExists.Id
        };
        await _context.Searches.AddAsync(newUsersearch);
        await _context.SaveChangesAsync();
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new OpenVerseImageSearchResp();
    }
  }

// Filter Audios Search
  public async Task<OpenVerseAudioSearchResp> AudioFiltering(string query, string license, string category, string length) 
  {
    try 
    {
      // Get user logged in
      int userID;
      if (_httpContextAccessor.HttpContext == null)
      {
        return new OpenVerseAudioSearchResp();
      }

      userID = Convert.ToInt32(_httpContextAccessor.HttpContext.User?.FindFirst(CustomClaims.UserId)?.Value);
      var userExists = await _context.Users.FirstOrDefaultAsync(x => x.Id == userID);

      // Get APIToken for OpenVerse
      OpenVerseTokenReq tokenReq = new () 
      {
        grant_type = "client_credentials",
        client_secret = clientSecret!,
        client_id = clientId!
      };
      var accessT = await TokenOpenVerse(tokenReq);

      string url = $"{_baseUrl}/audio/";
      var options = new RestClientOptions(url) 
      {
        RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true,
      };
      RestClient client = new RestClient(options);
      RestRequest request = new RestRequest() { Method = Method.Get };
      request.AddHeader("Authorization", $"Bearer {accessT.access_token}");
      request.AddHeader("content-type", "application/json");
      request.AddQueryParameter("q", query);
      request.AddQueryParameter("license", license);
      request.AddQueryParameter("categories", category);
      request.AddQueryParameter("length", length);
      RestResponse response = await client.ExecuteAsync(request);
      var content = response.Content;
      _logger.LogWarning($"Response from Audio Filtering with url----{url}---- {response.Content}");

      if (content == null) 
      {
        _logger.LogWarning($"Cannot get openverse Audio Filtering-----{content} is null-----");
        return new OpenVerseAudioSearchResp();
      }
      var result = JsonConvert.DeserializeObject<OpenVerseAudioSearchResp>(content);
      if (result == null) 
      {
        _logger.LogWarning($"Cannot get openverse Audio Filtering-----{result} is null-----");
        return new OpenVerseAudioSearchResp();
      }

      if (userExists != null) 
      {
        UserSearch newUsersearch = new() 
        {
          SearchQuery = query,
          Category = category,
          TimeStamp = DateTime.UtcNow,
          SoftDelete = false,
          UserId = userExists.Id
        };
        await _context.Searches.AddAsync(newUsersearch);
        await _context.SaveChangesAsync();
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new OpenVerseAudioSearchResp();
    }
  }

// get ACtive Searches
  public async Task<List<SearchObj>> GetActiveSearches() 
  {
    try 
    {
      // Get user logged in
      int userID;
      if (_httpContextAccessor.HttpContext == null)
      {
        return new List<SearchObj>();
      }

      userID = Convert.ToInt32(_httpContextAccessor.HttpContext.User?.FindFirst(CustomClaims.UserId)?.Value);

      var activeSearches = await _context.Searches.Where(x => x.UserId == userID && x.SoftDelete == false).Select(x => new SearchObj
      {
        searchId = x.Id,
        searchQuery = x.SearchQuery,
        category = x.Category,
        timeStamp = x.TimeStamp,
      }).OrderByDescending(x => x.timeStamp).ToListAsync();

      return activeSearches;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new List<SearchObj>();
    }
  }

// Get InActive Searches
  public async Task<List<SearchObj>> GetInActiveSearches() 
  {
    try
    {
      // Get user logged in
      int userID;
      if (_httpContextAccessor.HttpContext == null)
      {
        return new List<SearchObj>();
      }

      userID = Convert.ToInt32(_httpContextAccessor.HttpContext.User?.FindFirst(CustomClaims.UserId)?.Value);

      var activeSearches = await _context.Searches.Where(x => x.UserId == userID && x.SoftDelete == true).Select(x => new SearchObj
      {
        searchId = x.Id,
        searchQuery = x.SearchQuery,
        category = x.Category,
        timeStamp = x.TimeStamp,
      }).OrderByDescending(x => x.timeStamp).ToListAsync();

      return activeSearches;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new List<SearchObj>();
    }
  }

// Delete or Restore Search
  public async Task<ResponseModel> RestoreOrDelete(string action, int searchId) 
  {
    ResponseModel response = new();
    try 
    {
      // Get user logged in
      int userID;
      if (_httpContextAccessor.HttpContext == null)
      {
        response.status = false;
        response.message = "User is not logged in";
        return response;
      }

      userID = Convert.ToInt32(_httpContextAccessor.HttpContext.User?.FindFirst(CustomClaims.UserId)?.Value);

      if (action == "R") 
      {
        var restoreSearch = await _context.Searches.Where(x => x.Id == searchId && x.UserId == userID).FirstOrDefaultAsync();
        if (restoreSearch == null) return new ResponseModel{status = false, message = "Unsuccessful"};

        restoreSearch.SoftDelete = false;
        await _context.SaveChangesAsync();

        response.status = true;
        response.message = "Search sucessfully restored";
        return response;
      }

      if (action == "D") 
      {
        var deleteSearch = await _context.Searches.Where(x => x.Id == searchId && x.UserId == userID).FirstOrDefaultAsync();
        if (deleteSearch == null) return new ResponseModel{status = false, message = "Unsuccessful"};

        deleteSearch.SoftDelete = true;
        await _context.SaveChangesAsync();

        response.status = true;
        response.message = "Search sucessfully deleted";
        return response;
      }

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


}
