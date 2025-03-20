using System;
using JayMedia.Data.Data;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RestSharp;

namespace JayMedia.Services.Services;

public class SearchService : ISearch
{
  private readonly string _baseUrl;
  private readonly string _apiToken;
  private readonly DataContext _context;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly IConfiguration _configuration;
  private readonly ILogger<SearchService> _logger;

  public SearchService(DataContext context, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ILogger<SearchService> logger) {
    _baseUrl = configuration["OpenVerseBaseUrl"] ?? throw new Exception("Openverse Base Url is missing");
    _apiToken = configuration["OpenverseApiToken"] ?? throw new Exception("Openverse API token is missing");
    _context = context;
    _httpContextAccessor = httpContextAccessor;
    _configuration = configuration;
    _logger = logger;
    _logger.LogDebug(1, "Nlog injected into SearchService");
  }

// OpenVerse Auth
  public async Task<OpenVerseRegisterResp> RegisterOpenVerse(OpenVerseRegisterReq req) 
  {
    try 
    {
      string url = $"{_baseUrl}/auth_tokens/register/";
      var body = JsonConvert.SerializeObject(req);
      var client = new RestClient(url);
      var request = new RestRequest(url, Method.Post);
      request.AddHeader("Content-Type", "application/json");

      request.AddParameter("application/json", body, ParameterType.RequestBody);
      RestResponse response = await client.ExecuteAsync(request);
      var content = response.Content;

      if (content == null) 
      {
        _logger.LogWarning($"Cannot register openverse api-----{content} is null-----");
        return new OpenVerseRegisterResp();
      }
      var result = JsonConvert.DeserializeObject<OpenVerseRegisterResp>(content);
      if (result == null) 
      {
        _logger.LogWarning($"Cannot register openverse api-----{result} is null-----");
        return new OpenVerseRegisterResp();
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new OpenVerseRegisterResp();
    }
  }

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

  public async Task<OpenVerseKeyInfoResp> KeyInfoOpenVerse() 
  {
    try 
    {
      string url = $"{_baseUrl}/rate_limit/";
      var options = new RestClientOptions(url) 
      {
        RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true,
      };
      RestClient client = new RestClient(options);
      RestRequest request = new RestRequest() { Method = Method.Get };
      request.AddHeader("Authorization", $"Bearer {_apiToken}");
      request.AddHeader("content-type", "application/json");
      RestResponse response = await client.ExecuteAsync(request);
      var content = response.Content;
      _logger.LogWarning($"Response from Key Info with url----{url}---- {response.Content}");

      if (content == null) 
      {
        _logger.LogWarning($"Cannot get openverse KeyInfo-----{content} is null-----");
        return new OpenVerseKeyInfoResp();
      }
      var result = JsonConvert.DeserializeObject<OpenVerseKeyInfoResp>(content);
      if (result == null) 
      {
        _logger.LogWarning($"Cannot get openverse KeyInfo-----{result} is null-----");
        return new OpenVerseKeyInfoResp();
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new OpenVerseKeyInfoResp();
    }
  }

  





}
