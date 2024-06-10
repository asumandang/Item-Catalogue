using System.Collections.Generic;
using System.Threading.Tasks;

namespace ItemCatalogue.Api.Services
{
  public interface IItemService
  {
    Task<IEnumerable<Item>> GetItemsAsync();
    Task<Item> GetItemAsync(string id);
    Task<Item> CreateItemAsync(Item newItem);
    Task<bool> UpdateItemAsync(string id, Item updatedItem);
    Task<bool> DeleteItemAsync(string id);
  }
}
