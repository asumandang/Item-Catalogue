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
