using ItemCatalogue.Api.Services;
using Microsoft.AspNetCore.Authorization;
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

    [HttpPost("login")]
    public async Task<ActionResult<AuthResult>> Login([FromBody] UserCredentials user)
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
    private AuthResult GenerateAccessToken(string email)
    {
      // Create user claims
      var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, email),
        };

      // Create a JWT
      var expiresIn = DateTime.Now.AddMinutes(120);
      var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
      var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
      var Sectoken = new JwtSecurityToken(_configuration["JwtSettings:Issuer"],
              _configuration["JwtSettings:Issuer"],
              null,
              expires: expiresIn,
              signingCredentials: credentials
      );
      var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

      var result = new AuthResult(token, new DateTimeOffset(expiresIn).ToUnixTimeMilliseconds());
      return result;
    }
  }
}
