using System;
using JayMedia.Models.DTOs;

namespace JayMedia.Services.Interfaces;

public interface IAuth
{
  Task<ResponseModel> Register(RegisterDto request);
}
