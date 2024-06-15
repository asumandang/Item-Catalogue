using ItemCatalogue.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ItemCatalogue.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UsersController : ControllerBase
  {
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
      _userService = userService;
    }


    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
      var users = await _userService.GetUsersAsync();

      return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(string id)
    {
      var user = await _userService.GetUserAsync(id);
      if (user == null)
      {
        return NotFound();
      }
      return Ok(user);
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = "ApiKeyScheme")]
    public async Task<ActionResult<User>> CreateUser([FromBody] UserCredentials user)
    {
      var newUser = await _userService.CreateUserAsync(user);
      if (newUser == null)
      {
        return Conflict($"Slug '{user.Email}' already exists. Please choose a different email.");
      }
      return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
    }

    [HttpPut("{email}")]
    public async Task<IActionResult> UpdateUser(string email, [FromBody] User updatedUser)
    {
      var isUpdated = await _userService.UpdateUserAsync(email, updatedUser);
      if (!isUpdated)
      {
        return NotFound();
      }

      return NoContent();
    }

    [HttpDelete("{email}")]
    public async Task<IActionResult> DeleteUser(string email)
    {
      var isDeleted = await _userService.DeleteUserAsync(email);
      if (!isDeleted)
      {
        return NotFound();
      }

      return NoContent();
    }
  }
}
