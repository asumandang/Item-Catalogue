using ItemCatalogue.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;

namespace ItemCatalogue.Api
{
  public class Program
  {
    public static void Main(string[] args)
    {
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder.UseStartup<Startup>();
            })
            .ConfigureServices((context, services) =>
            {
              services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect("localhost"));
              services.AddSingleton<IItemService, RedisItemService>();
              services.AddSingleton<IUserService, RedisUserService>();
              services.AddHttpClient();
            });
  }
}
