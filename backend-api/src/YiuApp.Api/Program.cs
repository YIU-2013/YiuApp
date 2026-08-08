using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using YiuApp.Api.Common;
using YiuApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ─── Database (PostgreSQL) ─────────────────────────────────────────────────
// Connection string appsettings içine gömülmez — appsettings.json'daki
// "ConnectionStrings:Default" alanı yalnızca örnek/local placeholder içerir.
// Gerçek değer ortam değişkeni (ConnectionStrings__Default) veya
// `dotnet user-secrets` ile sağlanmalı. Bkz. README.md.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// ─── Authentication (JWT) ───────────────────────────────────────────────────
// Auth modülü Faz-2'de implemente edilecek; burada yalnızca middleware
// altyapısı kuruluyor. Gerçek Key/Issuer/Audience değerleri de appsettings'e
// gömülmez — ortam değişkeninden (Jwt__Key vb.) okunur.
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = jwtSection["Key"] ?? "dev-placeholder-key-change-me";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(Roles.SuperAdmin, p => p.RequireRole(Roles.SuperAdmin))
    .AddPolicy(Roles.Admin, p => p.RequireRole(Roles.SuperAdmin, Roles.Admin))
    .AddPolicy(Roles.Editor, p => p.RequireRole(Roles.SuperAdmin, Roles.Admin, Roles.Editor))
    .AddPolicy(Roles.Viewer, p => p.RequireRole(Roles.All));

// ─── CORS (admin panel için) ────────────────────────────────────────────────
// Gerçek origin listesi appsettings.Development.json / prod ortam
// değişkeninden okunur; boşsa hiçbir origin'e izin verilmez (güvenli varsayılan).
const string AdminPanelCors = "AdminPanelCors";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy(AdminPanelCors, policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
    });
});

// ─── Controllers + OpenAPI ──────────────────────────────────────────────────
// .NET'in yerleşik OpenAPI üretimi (Microsoft.AspNetCore.OpenApi) + Scalar
// interaktif dokümantasyon arayüzü kullanılıyor — Swashbuckle yerine, çünkü
// Swashbuckle'ın şu an paylaştığı Microsoft.OpenApi 1.x sözleşmesi, .NET 9'un
// paylaşılan çerçevesindeki Microsoft.OpenApi 2.x ile çalışma zamanında
// çakışıyor (ReflectionTypeLoadException). Sonuç aynı: interaktif, taranabilir
// API dokümantasyonu.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ─── Pipeline ────────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "YIU Mobile App API";
    });
}

app.UseCors(AdminPanelCors);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Basit health endpoint — yükleme dengeleyici / uptime kontrolü için.
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
    .WithName("Health")
    .WithTags("Health");

app.Run();

// WebApplicationFactory<Program> ile entegrasyon testi yazabilmek için.
public partial class Program { }
