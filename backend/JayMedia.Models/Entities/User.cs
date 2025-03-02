using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace JayMedia.Models.Entities;

public class User
{
  public int Id { get; set; }

  [Column(TypeName = "varchar(50)")]
  public string FirstName { get; set; } = string.Empty;

  [Column(TypeName = "varchar(50)")]
  public string LastName { get; set; } = string.Empty;

  [Column(TypeName = "varchar(50)")]
  public string Username { get; set; } = string.Empty;

  public byte[]? PasswordHash { get; set; }

  public byte[]? PasswordSalt { get; set; }

  [Column(TypeName = "varchar(50)")]
  public string Email { get; set; } = string.Empty;

  public DateTime? LastLogin { get; set; }

  public virtual List<UserSearch>? UserSearches { get; set; }
}
