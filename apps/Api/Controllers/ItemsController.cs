using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ItemCatalogue.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ItemsController : ControllerBase
  {
    private static readonly List<Item> Items = new List<Item>
        {
            new Item { Id = 1, Name = "Item1", Description = "This is item 1", Category = "Shirt", Slug = "item-1" },
            new Item { Id = 2, Name = "Item2", Description = "This is item 2", Category = "Pants", Slug = "item-2" }
        };

    [HttpGet]
    public ActionResult<IEnumerable<Item>> GetItems()
    {
      return Ok(Items);
    }

    [HttpGet("{id}")]
    public ActionResult<Item> GetItem(int id)
    {
      var item = Items.Find(i => i.Id == id);
      if (item == null)
      {
        return NotFound();
      }
      return Ok(item);
    }

    [HttpPost]
    public ActionResult<Item> CreateItem([FromBody] Item newItem)
    {
      newItem.Id = Items.Count + 1;
      Items.Add(newItem);
      return CreatedAtAction(nameof(GetItem), new { id = newItem.Id }, newItem);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateItem(int id, [FromBody] Item updatedItem)
    {
      var item = Items.Find(i => i.Id == id);
      if (item == null)
      {
        return NotFound();
      }
      item.Name = updatedItem.Name;
      item.Description = updatedItem.Description;
      return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteItem(int id)
    {
      var item = Items.Find(i => i.Id == id);
      if (item == null)
      {
        return NotFound();
      }
      Items.Remove(item);
      return NoContent();
    }
  }

  public class Item
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public string Category { get; set; }

    public string Slug { get; set; }
  }
}
