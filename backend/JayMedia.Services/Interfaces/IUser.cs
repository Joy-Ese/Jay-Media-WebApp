using System;
using JayMedia.Models.DTOs;

namespace JayMedia.Services.Interfaces;

public interface IUser
{
  Task<UserDetailsModel> GetUserDetails();
  Task<ResponseModel> EditUserDetails(ProfileDto request);
}
