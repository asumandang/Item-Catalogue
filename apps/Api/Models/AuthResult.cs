using System.Collections.Generic;

namespace ItemCatalogue.Api
{
  public class AuthResult(User user, string accessToken, int expiresIn)
  {
    public BaseUser User { get; } = user;
    public string AccessToken { get; } = accessToken;
    public int ExpiresIn { get; } = expiresIn;
  }
}
