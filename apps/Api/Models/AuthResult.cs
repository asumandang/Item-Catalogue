using System.Collections.Generic;

namespace ItemCatalogue.Api
{
  public class AuthResult(string accessToken, long expiresIn)
  {
    public string AccessToken { get; } = accessToken;
    public long ExpiresIn { get; } = expiresIn;
  }
}
