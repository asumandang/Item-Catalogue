using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ItemCatalogue.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CategoriesController : ControllerBase
  {
    private static readonly List<Category> Categories = new List<Category>
        {
            new Category { Id = 1, Name = "Category1" },
            new Category { Id = 2, Name = "Category2" }
        };

    [HttpGet]
    public ActionResult<IEnumerable<Category>> GetCategories()
    {
      return Ok(Categories);
    }

    [HttpGet("{id}")]
    public ActionResult<Category> GetCategory(int id)
    {
      var category = Categories.Find(i => i.Id == id);
      if (category == null)
      {
        return NotFound();
      }
      return Ok(category);
    }

    [HttpPost]
    public ActionResult<Category> CreateCategory([FromBody] Category newCategory)
    {
      newCategory.Id = Categories.Count + 1;
      Categories.Add(newCategory);
      return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, newCategory);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateCategory(int id, [FromBody] Category updatedCategory)
    {
      var category = Categories.Find(i => i.Id == id);
      if (category == null)
      {
        return NotFound();
      }
      category.Name = updatedCategory.Name;
      return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(int id)
    {
      var category = Categories.Find(i => i.Id == id);
      if (category == null)
      {
        return NotFound();
      }
      Categories.Remove(category);
      return NoContent();
    }
  }

  public class Category
  {
    public int Id { get; set; }
    public string Name { get; set; }
  }
}
