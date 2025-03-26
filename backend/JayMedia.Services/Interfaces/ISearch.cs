using System;
using JayMedia.Models.DTOs;

namespace JayMedia.Services.Interfaces;

public interface ISearch
{
// OpenVerse Auth
  Task<OpenVerseRegisterResp> RegisterOpenVerse(OpenVerseRegisterReq req);
  Task<OpenVerseTokenResp> TokenOpenVerse(OpenVerseTokenReq req);

// OpenVerse Search
  Task<OpenVerseImageSearchResp> ImagesSearch(string query);

}
