using System;
using System.ComponentModel.DataAnnotations;

namespace JayMedia.Models.DTOs;

public class ResponseModel
{
  public bool status { get; set; }
  public string message { get; set; } = string.Empty;
}

public class RegisterDto
{
  public string firstname { get; set; } = string.Empty;
  public string lastname { get; set; } = string.Empty;
  public string username { get; set; } = string.Empty;
  public string email { get; set; } = string.Empty;
  public string password { get; set; } = string.Empty;
  public string confirmPassword { get; set; } = string.Empty;
  public bool termsAgreed { get; set; }
}

public class LoginDto
{
  [Required]
  public string username { get; set; } = string.Empty;
  [Required]
  public string password { get; set; } = string.Empty;
}

public class EncryptedRequest
{
  public string Data { get; set; } = string.Empty;
}

public class GoogleLoginDto
{
  public string idToken { get; set; } = string.Empty;
}

public class UserDetailsModel
{
  public string Username { get; set; } = string.Empty;
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
}

// OpenVerse Auth
public class OpenVerseTokenReq 
{
  public string grant_type { get; set; } = string.Empty;
  public string client_secret { get; set; } = string.Empty;
  public string client_id { get; set; } = string.Empty;
}

public class OpenVerseTokenResp 
{
  public string access_token { get; set; } = string.Empty;
  public string scope { get; set; } = string.Empty;
  public int expires_in { get; set; }
  public string token_type { get; set; } = string.Empty;
}

// Image Search
public class Warning
{
  public string code { get; set; } = string.Empty;
  public string message { get; set; } = string.Empty;
}

public class Result
{
  public string id { get; set; } = string.Empty;
  public string title { get; set; } = string.Empty;
  public DateTime indexed_on { get; set; }
  public string foreign_landing_url { get; set; } = string.Empty;
  public string url { get; set; } = string.Empty;
  public string creator { get; set; } = string.Empty;
  public string creator_url { get; set; } = string.Empty;
  public string license { get; set; } = string.Empty;
  public string license_version { get; set; } = string.Empty;
  public string license_url { get; set; } = string.Empty;
  public string provider { get; set; } = string.Empty;
  public string source { get; set; } = string.Empty;
  public string? category { get; set; } = string.Empty;
  public int? filesize { get; set; }
  public string? filetype { get; set; } = string.Empty;
  public List<Tag>? tags { get; set; }
  public string attribution { get; set; } = string.Empty;
  public List<string>? fields_matched { get; set; }
  public bool mature { get; set; }
  public int height { get; set; }
  public int width { get; set; }
  public string thumbnail { get; set; } = string.Empty;
  public string detail_url { get; set; } = string.Empty;
  public string related_url { get; set; } = string.Empty;
  public List<object>? unstable__sensitivity { get; set; }
}

public class Tag
{
  public double? accuracy { get; set; }
  public string name { get; set; } = string.Empty;
  public string unstable__provider { get; set; } = string.Empty;
}

public class OpenVerseImageSearchResp
{
  public int result_count { get; set; }
  public int page_count { get; set; }
  public int page_size { get; set; }
  public int page { get; set; }
  public List<Result>? results { get; set; }
  public List<Warning>? warnings { get; set; }
}

// Audio search
public class OpenVerseAudioSearchResp
{
  public int result_count { get; set; }
  public int page_count { get; set; }
  public int page_size { get; set; }
  public int page { get; set; }
  public List<AudioResult>? results { get; set; }
  public List<Warning>? warnings { get; set; }
}

public class AudioResult
{
  public string id { get; set; } = string.Empty;
  public string title { get; set; } = string.Empty;
  public DateTime indexed_on { get; set; }
  public string foreign_landing_url { get; set; } = string.Empty;
  public string url { get; set; } = string.Empty;
  public string creator { get; set; } = string.Empty;
  public string creator_url { get; set; } = string.Empty;
  public string license { get; set; } = string.Empty;
  public string license_version { get; set; } = string.Empty;
  public string license_url { get; set; } = string.Empty;
  public string provider { get; set; } = string.Empty;
  public string source { get; set; } = string.Empty;
  public string? category { get; set; } = string.Empty;
  public List<string>? genres { get; set; }
  public int? filesize { get; set; }
  public string? filetype { get; set; } = string.Empty;
  public List<Tag>? tags { get; set; }
  public object? alt_files { get; set; }
  public string attribution { get; set; } = string.Empty;
  public List<string>? fields_matched { get; set; }
  public bool mature { get; set; }
  public AudioSet? audio_set { get; set; }
  public int? duration { get; set; }
  public int? bit_rate { get; set; }
  public int? sample_rate { get; set; }
  public string thumbnail { get; set; } = string.Empty;
  public string detail_url { get; set; } = string.Empty;
  public string related_url { get; set; } = string.Empty;
  public string waveform { get; set; } = string.Empty;
  public List<object>? unstable__sensitivity { get; set; }
}

public class AudioSet
{
  public string title { get; set; } = string.Empty;
  public string foreign_landing_url { get; set; } = string.Empty;
  public string creator { get; set; } = string.Empty;
  public string creator_url { get; set; } = string.Empty;
  public string url { get; set; } = string.Empty;
  public object? filesize { get; set; }
  public object? filetype { get; set; }
}

public class SearchMedia 
{
  public OpenVerseAudioSearchResp? audioResult {get; set; }
  public OpenVerseImageSearchResp? imageResult {get; set; }
}

public class ImageFilters 
{}

public class AudioFilters 
{}

