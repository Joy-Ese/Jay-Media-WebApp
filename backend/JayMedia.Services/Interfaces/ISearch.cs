using System;
using JayMedia.Models.DTOs;

namespace JayMedia.Services.Interfaces;

public interface ISearch
{
// OpenVerse Auth
  Task<OpenVerseTokenResp> TokenOpenVerse(OpenVerseTokenReq req);

// OpenVerse Search
  Task<OpenVerseImageSearchResp> ImagesSearch(string query);
  Task<OpenVerseAudioSearchResp> AudiosSearch(string query);
  Task<SearchMedia> SearchMedia(string query, string username);
  Task<OpenVerseImageSearchResp> ImageFiltering(string query, string license, string category, string size);
  Task<OpenVerseAudioSearchResp> AudioFiltering(string query, string license, string category, string length);
  Task<List<SearchObj>> GetActiveSearches();
  Task<List<SearchObj>> GetInActiveSearches();
  Task<ResponseModel> RestoreOrDelete(string action, int searchId);

}
