using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;

namespace ItemCatalogue.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ImagesController : ControllerBase
  {
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public ImagesController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
      _configuration = configuration;
      _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload()
    {
      Console.WriteLine("here");
      var file = Request.Form.Files[0];
      if (file.Length > 0)
      {
        using (var ms = new MemoryStream())
        {
          await file.CopyToAsync(ms);
          var fileBytes = ms.ToArray();
          var base64Image = Convert.ToBase64String(fileBytes);

          // Get current client ID
          var clientId = Environment.GetEnvironmentVariable("IMGUR_CLIENT_ID");

          var content = new MultipartFormDataContent
          {
              { new ByteArrayContent(fileBytes), "image", file.FileName },
              { new StringContent("image"), "type" }
          };

          _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Client-ID", clientId);
          var response = await _httpClient.PostAsync("https://api.imgur.com/3/image", content);

          if (response.IsSuccessStatusCode)
          {
            var responseString = await response.Content.ReadAsStringAsync();
            Console.WriteLine("IsSuccessStatusCode");
            Console.WriteLine("Response: " + responseString);
            Console.WriteLine(response);
            return Ok(responseString);
          }
          Console.WriteLine("Fail");
          Console.WriteLine(response);
          return BadRequest(response.ReasonPhrase);
        }
      }
      return BadRequest("No file uploaded");
    }
  }
}
