using System.Text.Json.Serialization;

namespace ItemCatalogue.Api
{
  public class Item
  {
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("category")]

    public string Category { get; set; }

    [JsonPropertyName("slug")]

    public string Slug { get; set; }

    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; }
  }
}
