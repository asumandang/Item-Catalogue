using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace ItemCatalogue.Api.Services
{
  public class RedisUserService : IUserService
  {
    private readonly IDatabase _redis;

    public RedisUserService(IConnectionMultiplexer muxer)
    {
      _redis = muxer.GetDatabase();
    }

    public async Task<User> CreateUserAsync(UserCredentials user)
    {
      var id = Guid.NewGuid().ToString();
      var newUser = user.GetUser(id);

      var userJson = JsonSerializer.Serialize(newUser);
      var existingUser = await GetUserAsync(newUser.Email);
      if (existingUser != null)
      {
        // Do not create user if email is not unique
        return null;
      }
      await _redis.StringSetAsync($"user:{newUser.Id}", userJson);
      await _redis.StringSetAsync($"user:email:{newUser.Email}", userJson);
      await _redis.SetAddAsync("users", $"user:{newUser.Id}");

      return newUser;
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
      var userJson = await _redis.StringGetAsync($"user:{id}");
      if (userJson.IsNullOrEmpty)
      {
        return false;
      }

      await _redis.KeyDeleteAsync($"user:{id}");
      await _redis.SetRemoveAsync("users", $"user:{id}");
      return true;
    }

    public async Task<User> GetUserAsync(string idOrEmail)
    {
      // Check if idOrEmail is an ID or an email
      bool isId = Guid.TryParse(idOrEmail, out _);

      string key;
      if (isId)
      {
        key = $"user:{idOrEmail}"; // Use ID as key
      }
      else
      {
        key = $"user:email:{idOrEmail}"; // Use email as key
      }
      Console.WriteLine(key);

      var userJson = await _redis.StringGetAsync(key);
      if (userJson.IsNullOrEmpty)
      {
        return null;
      }

      var user = JsonSerializer.Deserialize<User>(userJson);
      return user;
    }

    public async Task<IEnumerable<User>> GetUsersAsync()
    {
      var keys = _redis.SetMembers("users");
      var users = new List<User>();

      foreach (var key in keys)
      {
        var redisKey = key.ToString();
        var userJson = await _redis.StringGetAsync(redisKey);
        if (!userJson.IsNullOrEmpty)
        {
          var result = JsonSerializer.Deserialize<User>(userJson);
          users.Add(result);
        }
      }

      return users;
    }

    public async Task<bool> UpdateUserAsync(string id, User updatedUser)
    {
      var userJson = await _redis.StringGetAsync($"user:{id}");
      if (userJson.IsNullOrEmpty)
      {
        return false;
      }

      updatedUser.Id = id;
      userJson = JsonSerializer.Serialize(updatedUser);

      await _redis.StringSetAsync($"user:{updatedUser.Id}", userJson);
      return true;
    }
  }
}
