using ItemCatalogue.Api.Services;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace ItemCatalogue.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ItemsController : ControllerBase
  {
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
      _itemService = itemService;
    }


    [HttpGet]
    public async Task<ActionResult<List<Item>>> GetItems()
    {
      var items = await _itemService.GetItemsAsync();

      return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Item>> GetItem(string id)
    {
      var item = await _itemService.GetItemAsync(id);
      if (item == null)
      {
        return NotFound();
      }
      return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Item>> CreateItem([FromBody] Item item)
    {
      var newItem = await _itemService.CreateItemAsync(item);
      if (newItem == null)
      {
        return Conflict("Slug already exists. Please choose a different slug.");
      }
      return CreatedAtAction(nameof(GetItem), new { id = newItem.Id }, newItem);
    }

    [HttpPut("{slug}")]
    public async Task<IActionResult> UpdateItem(string slug, [FromBody] Item updatedItem)
    {
      var isUpdated = await _itemService.UpdateItemAsync(slug, updatedItem);
      if (!isUpdated)
      {
        return NotFound();
      }

      return NoContent();
    }

    [HttpDelete("{slug}")]
    public async Task<IActionResult> DeleteItem(string slug)
    {
      var isDeleted = await _itemService.DeleteItemAsync(slug);
      if (!isDeleted)
      {
        return NotFound();
      }

      return NoContent();
    }
  }
}
