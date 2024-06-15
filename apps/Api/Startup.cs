using ItemCatalogue.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System;
using System.IO;
using System.Reflection;
using System.Security.Cryptography.Xml;
using System.Text;

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

      // Add singleton services
      services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect("localhost"));
      services.AddSingleton<IItemService, RedisItemService>();
      services.AddSingleton<IUserService, RedisUserService>();

      // Configure JWT Bearer options
      services.Configure<JwtBearerOptions>(options =>
      {
        Console.WriteLine("services.Configure<JwtBearerOptions>");
        Console.WriteLine(Configuration["JwtSettings:Issuer"]);
        Console.WriteLine(Configuration["JwtSettings:Issuer"]);
        // Configure TokenValidationParameters
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuer = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = Configuration["JwtSettings:Issuer"],
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtSettings:Key"]))
        };
      });

      // Print the JwtSettings values
      foreach (var childSection in Configuration.GetSection("JwtSettings").GetChildren())
      {
        Console.WriteLine($"{childSection.Key}: {childSection.Value}");
      }

      services.AddAuthentication()
      .AddJwtBearer(options => // Add JWT Authentication
      {
        Console.WriteLine("TokenValidationParameters");
        Console.WriteLine(Configuration["JwtSettings:Issuer"]);
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuer = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = Configuration["JwtSettings:Issuer"],
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtSettings:Key"]))
        };
      }).AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>("ApiKeyScheme", null);


      services.AddAuthorization(options =>
      {
        options.AddPolicy("ApiKeyPolicy", policy =>
        {
          policy.AuthenticationSchemes.Add("ApiKeyScheme");
          policy.RequireAuthenticatedUser();
        });
      });

      // Register the Swagger generator, defining one or more Swagger documents
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
        {
          Version = "v1",
          Title = "Item Catalogue API",
          Description = "API Documentation"
        });

        // Add JWT Bearer authentication to Swagger UI
        var jwtSecurityScheme = new OpenApiSecurityScheme
        {
          Name = "Authorization",
          Description = "JWT Authorization header using the Bearer scheme.",
          Type = SecuritySchemeType.Http,
          Scheme = "bearer",
          BearerFormat = "JWT",
          In = ParameterLocation.Header,
          Reference = new OpenApiReference
          {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
          }
        };

        // Add API key authentication to Swagger UI
        var apiKeySecurityScheme = new OpenApiSecurityScheme
        {
          Name = "ApiKey",
          Description = "API key authentication",
          Type = SecuritySchemeType.ApiKey,
          In = ParameterLocation.Header,
          Scheme = "ApiKey",
          Reference = new OpenApiReference
          {
            Type = ReferenceType.SecurityScheme,
            Id = "ApiKey"
          }
        };

        c.AddSecurityDefinition("Bearer", jwtSecurityScheme);
        c.AddSecurityDefinition("ApiKey", apiKeySecurityScheme);

        var securityRequirement = new OpenApiSecurityRequirement
        {
            { jwtSecurityScheme, new[] { "AuthScheme"} },
            { apiKeySecurityScheme, new[] {"AuthScheme"} }
        };
        c.AddSecurityRequirement(securityRequirement);
      });

      // Read the Imgur client ID from environment variables
      var imgurClientId = Environment.GetEnvironmentVariable("IMGUR_CLIENT_ID");
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

      app.UseAuthentication();

      app.UseRouting();

      app.UseAuthorization();


      app.UseCors("AllowSpecificOrigins");

      // Enable middleware to serve generated Swagger as a JSON endpoint
      app.UseSwagger();

      // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
      app.UseSwaggerUI(c =>
      {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        c.RoutePrefix = string.Empty; // To serve Swagger UI at application's root (http://localhost:<port>/), set the RoutePrefix to an empty string
      });

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
