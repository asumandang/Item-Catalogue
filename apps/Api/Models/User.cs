using System.Text.Json.Serialization;

namespace ItemCatalogue.Api
{
  public class BaseUser
  {
    [JsonPropertyName("email")]
    public string Email { get; set; }
  }

  public class UserCredentials : BaseUser
  {
    [JsonPropertyName("password")]
    public string Password { get; set; }

    public User GetUser(string id)
    {
      return new User
      {
        Email = Email,
        Password = Password,
        Id = id
      };
    }
  }

  public class User : BaseUser
  {
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("password")]
    public string Password { get; set; }
  }
}
