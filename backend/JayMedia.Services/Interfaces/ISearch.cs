using System;
using JayMedia.Models.DTOs;

namespace JayMedia.Services.Interfaces;

public interface ISearch
{
  Task<OpenVerseRegisterResp> RegisterOpenVerse(OpenVerseRegisterReq req);
  Task<OpenVerseTokenResp> TokenOpenVerse(OpenVerseTokenReq req);
  Task<OpenVerseKeyInfoResp> KeyInfoOpenVerse();
}
