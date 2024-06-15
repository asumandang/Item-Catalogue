using System.Collections.Generic;
using System.Threading.Tasks;

namespace ItemCatalogue.Api.Services
{
  public interface IUserService
  {
    Task<IEnumerable<User>> GetUsersAsync();
    Task<User> GetUserAsync(string idOrEmail);
    Task<User> CreateUserAsync(UserCredentials newUser);
    Task<bool> UpdateUserAsync(string id, User updatedUser);
    Task<bool> DeleteUserAsync(string id);
  }
}
