using System;
using JayMedia.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JayMedia.Data.Data;

public class DataContext : DbContext
{
  public DataContext(DbContextOptions<DataContext> options) : base(options) 
  { 

  }

  public DbSet<User> Users { get; set; }
  public DbSet<UserSearch> Searches { get; set; }

}
