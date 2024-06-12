using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace ItemCatalogue.Api
{
  public class Startup
  {
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers();
      services.AddHttpClient();

      // Read the Imgur client ID from environment variables
      var imgurClientId = Environment.GetEnvironmentVariable("IMGUR_CLIENT_ID");
      Console.WriteLine(imgurClientId);
      if (string.IsNullOrEmpty(imgurClientId))
      {
        throw new InvalidOperationException("Imgur client ID is not set in the environment variables.");
      }

      var allowedOrigins = Configuration.GetSection("AllowedOrigins").Get<string[]>();

      services.AddCors(options =>
        {
          options.AddPolicy("AllowSpecificOrigins",
              builder =>
              {
                builder.WithOrigins(allowedOrigins)
                         .AllowAnyHeader()
                         .AllowAnyMethod();
              });
        });
      if (allowedOrigins != null)
      {
        foreach (var origin in allowedOrigins)
        {
          Console.WriteLine(origin);
        }
      }
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseRouting();

      app.UseCors("AllowSpecificOrigins");

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
