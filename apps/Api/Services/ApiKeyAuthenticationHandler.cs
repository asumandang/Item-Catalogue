// Custom API key authentication handler
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

public class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationOptions>
{
  private readonly ILogger<ApiKeyAuthenticationHandler> _logger;

  public ApiKeyAuthenticationHandler(
      IOptionsMonitor<ApiKeyAuthenticationOptions> options,
      ILoggerFactory loggerFactory,
      UrlEncoder encoder,
      ISystemClock clock,
      ILogger<ApiKeyAuthenticationHandler> logger)
      : base(options, loggerFactory, encoder, clock)
  {
    _logger = logger;
  }

  protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
  {
    if (!Request.Headers.TryGetValue("ApiKey", out var apiKey))
    {
      return AuthenticateResult.Fail("API key not found in request headers.");
    }

    // Validate the API key (e.g., check against a list of valid keys)
    if (!IsValidApiKey(apiKey))
    {
      return AuthenticateResult.Fail("Invalid API key.");
    }

    // You can also set additional claims or identity information here if needed
    var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "username"),
            // Add other claims as needed
        };

    var identity = new ClaimsIdentity(claims, Scheme.Name);
    var principal = new ClaimsPrincipal(identity);
    var ticket = new AuthenticationTicket(principal, Scheme.Name);

    return AuthenticateResult.Success(ticket);
  }

  // Validate the API key
  // Return true if the API key is valid; otherwise, return false
  private bool IsValidApiKey(string apiKey)
  {
    var envApiKey = Environment.GetEnvironmentVariable("API_KEY");
    return apiKey == envApiKey;
  }
}
