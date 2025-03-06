using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace JayMedia.Data.Entities;

public class UserSearch
{
  public int Id { get; set; }

  public string SearchQuery { get; set; } = string.Empty;

  public bool SoftDelete { get; set; } // this is to ensure the user searches never gets deleted forever

  // should add a datetime for DateSearched... Incase user wants to manage searched queries based on date

  [ForeignKey("User")]
  public int UserId { get; set; }
  public virtual User? User { get; set; }
}
