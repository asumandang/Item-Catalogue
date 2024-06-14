using System.Text.Json.Serialization;

namespace ItemCatalogue.Api
{
  public class BaseUser
  {
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("email")]
    public string Email { get; set; }
  }

  public class User : BaseUser
  {
    [JsonPropertyName("password")]
    public string Password { get; set; }
  }
}
