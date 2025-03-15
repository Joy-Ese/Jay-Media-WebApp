using System;
using JayMedia.Data.Entities;
using JayMedia.Models.DTOs;

namespace JayMedia.Services.Interfaces;

public interface IAuth
{
  Task<ResponseModel> Register(RegisterDto request);
  Task<ResponseModel> Login(LoginDto request);
  Task<ResponseModel> GoogleLogin(GoogleLoginDto request);
}
