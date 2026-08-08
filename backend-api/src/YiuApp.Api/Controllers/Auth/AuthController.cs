using Microsoft.AspNetCore.Mvc;

namespace YiuApp.Api.Controllers.Auth;

/// <summary>
/// Admin panel kullanıcı girişi (JWT + refresh token).
/// Bu iskelet commit'inde yalnızca route/sözleşme kurulu — gerçek kullanıcı
/// doğrulama, token üretimi ve refresh akışı Faz-2'de (Users/Roles modülleriyle
/// birlikte) implemente edilecek.
/// </summary>
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        return StatusCode(StatusCodes.Status501NotImplemented, new
        {
            message = "Auth modülü henüz implemente edilmedi (Faz 2 — Users/Roles ile birlikte gelecek).",
        });
    }
}

public record LoginRequest(string Email, string Password);
