using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public class ApiKeyMiddleware
{
  private readonly RequestDelegate _next;
  private const string ApiKeyHeaderName = "ApiKey";

  public ApiKeyMiddleware(RequestDelegate next)
  {
    _next = next;
  }

  public async Task InvokeAsync(HttpContext context)
  {
    if (!context.Request.Headers.TryGetValue(ApiKeyHeaderName, out var extractedApiKey))
    {
      context.Response.StatusCode = 401;
      await context.Response.WriteAsync("Api Key was not provided.");
      return;
    }

    // Validate the API key
    var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
    var apiKey = appSettings.GetValue<string>("ApiKey");

    if (!apiKey.Equals(extractedApiKey))
    {
      context.Response.StatusCode = 401;
      await context.Response.WriteAsync("Unauthorized client.");
      return;
    }

    await _next(context);
  }
}
