using System;
using JayMedia.Data.Data;
using JayMedia.Models.DTOs;
using JayMedia.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace JayMedia.Services.Services;

public class UserService : IUser
{
  private readonly DataContext _context;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly ILogger<UserService> _logger;

  public UserService(DataContext context, IHttpContextAccessor httpContextAccessor, ILogger<UserService> logger) {
    _context = context;
    _httpContextAccessor = httpContextAccessor;
    _logger = logger;
    _logger.LogDebug(1, "Nlog injected into UserService");
  }

// fetch user details for frontend
  public async Task<UserDetailsModel> GetUserDetails() 
  {
    try 
    {
      // Get user logged in
      int userID;
      if (_httpContextAccessor.HttpContext == null)
      {
        return new UserDetailsModel();
      }

      userID = Convert.ToInt32(_httpContextAccessor.HttpContext.User?.FindFirst(CustomClaims.UserId)?.Value);

      var userDetails = await _context.Users.Where(x => x.Id == userID).Select(x => new UserDetailsModel 
      {
        Username = x.Username,
        FirstName = x.FirstName,
        LastName = x.LastName,
        Email = x.Email
      }).FirstOrDefaultAsync();

      if (userDetails == null) return new UserDetailsModel();
      return userDetails;
    }
    catch (Exception ex)
    {
      _logger.LogError($"AN ERROR OCCURRED... => {ex.Message}");
      return new UserDetailsModel();
    }
  }

// Edit User Details
  public async Task<ResponseModel> EditUserDetails(ProfileDto request) 
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

      var userDetails = await _context.Users.Where(x => x.Id == userID).FirstOrDefaultAsync();
      if (userDetails == null) return new ResponseModel{status = false, message = "User not found"};

      userDetails.FirstName = request.firstname;
      userDetails.LastName = request.lastname;
      await _context.SaveChangesAsync();

      response.status = true;
      response.message = "Profile successfully updated";
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
