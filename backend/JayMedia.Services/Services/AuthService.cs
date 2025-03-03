using System;
using JayMedia.Data.Data;
using JayMedia.Services.Interfaces;

namespace JayMedia.Services.Services;

public class AuthService : IAuth
{
  private readonly DataContext _context;

  public AuthService(DataContext context) {
    _context = context;
  }


}
