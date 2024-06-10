using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace ItemCatalogue.Api.Services
{
  public class RedisItemService : IItemService
  {
    private readonly IDatabase _redis;

    public RedisItemService(IConnectionMultiplexer muxer)
    {
      _redis = muxer.GetDatabase();
    }

    public async Task<Item> CreateItemAsync(Item newItem)
    {
      var id = Guid.NewGuid().ToString();
      newItem.Id = id;

      var itemJson = JsonSerializer.Serialize(newItem);
      var existingItem = await GetItemAsync(newItem.Slug);
      if (existingItem != null)
      {
        // Do not create item if slug is not unique
        return null;
      }
      await _redis.StringSetAsync($"item:{newItem.Id}", itemJson);
      await _redis.StringSetAsync($"item:slug:{newItem.Slug}", itemJson);
      await _redis.SetAddAsync("items", $"item:{newItem.Id}");

      return newItem;
    }

    public async Task<bool> DeleteItemAsync(string id)
    {
      var itemJson = await _redis.StringGetAsync($"item:{id}");
      if (itemJson.IsNullOrEmpty)
      {
        return false;
      }

      await _redis.KeyDeleteAsync($"item:{id}");
      await _redis.SetRemoveAsync("items", $"item:{id}");
      return true;
    }

    public async Task<Item> GetItemAsync(string idOrSlug)
    {
      // Check if idOrSlug is an ID or a slug
      bool isId = Guid.TryParse(idOrSlug, out _);

      string key;
      if (isId)
      {
        key = $"item:{idOrSlug}"; // Use ID as key
      }
      else
      {
        key = $"item:slug:{idOrSlug}"; // Use slug as key
      }
      Console.WriteLine(key);

      var itemJson = await _redis.StringGetAsync(key);
      if (itemJson.IsNullOrEmpty)
      {
        return null;
      }

      var item = JsonSerializer.Deserialize<Item>(itemJson);
      return item;
    }

    public async Task<IEnumerable<Item>> GetItemsAsync()
    {
      var keys = _redis.SetMembers("items");
      var items = new List<Item>();

      foreach (var key in keys)
      {
        var redisKey = key.ToString();
        var itemJson = await _redis.StringGetAsync(redisKey);
        if (!itemJson.IsNullOrEmpty)
        {
          var result = JsonSerializer.Deserialize<Item>(itemJson);
          items.Add(result);
        }
      }

      return items;
    }

    public async Task<bool> UpdateItemAsync(string id, Item updatedItem)
    {
      var itemJson = await _redis.StringGetAsync($"item:{id}");
      if (itemJson.IsNullOrEmpty)
      {
        return false;
      }

      updatedItem.Id = id;
      itemJson = JsonSerializer.Serialize(updatedItem);

      await _redis.StringSetAsync($"item:{updatedItem.Id}", itemJson);
      return true;
    }
  }
}
