using ItemCatalogue.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ItemCatalogue.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {

    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthController(IUserService userService, IConfiguration configuration)
    {
      _userService = userService;
      _configuration = configuration;
    }

    [HttpPost]
    public async Task<ActionResult<Item>> CreateUser([FromBody] User user)
    {
      var newUser = await _userService.CreateUserAsync(user);
      if (newUser == null)
      {
        return Conflict("Email already exists. Please choose a different email.");
      }
      return CreatedAtAction(nameof(CreateUser), new { id = newUser.Id }, newUser);
    }

    [HttpPost("login")]
    public async Task<ActionResult<List<User>>> GetIAuth([FromBody] User user)
    {
      var retrievedUser = await _userService.GetUserAsync(user.Email);
      if (retrievedUser == null || retrievedUser.Password != user.Password)
      {
        return Unauthorized("Invalid username or password. Please check your credentials and try again.");
      }

      var accessToken = GenerateAccessToken(retrievedUser.Email);
      return Ok(accessToken);
    }

    // Generating token based on user information
    private JwtSecurityToken GenerateAccessToken(string userName)
    {
      // Create user claims
      var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, userName),
        };

      // Create a JWT
      var token = new JwtSecurityToken(
          issuer: _configuration["JwtSettings:Issuer"],
          audience: _configuration["JwtSettings:Audience"],
          claims: claims,
          expires: DateTime.UtcNow.AddMinutes(10), // Token expiration time
          signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])),
              SecurityAlgorithms.HmacSha256)
      );

      return token;
    }
  }
}
