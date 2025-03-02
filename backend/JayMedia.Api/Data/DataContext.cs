using System;
using JayMedia.Models.Entities;

namespace JayMedia.Api.Data;

public class DataContext : DbContext
{
  public DataContext()
  {

  }

  public DataContext(DbContextOptions<DataContext> options) : base(options) { }

  public DbSet<User> Users { get; set; }
  public DbSet<UserSearch> Searches { get; set; }

}
