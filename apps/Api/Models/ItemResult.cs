using System.Collections.Generic;

namespace ItemCatalogue.Api
{
  public class ItemResult(IEnumerable<Item> items, long elapsedTime)
  {
    public long ElapsedTime { get; } = elapsedTime;
    public IEnumerable<Item> Items { get; } = items;
  }
}
