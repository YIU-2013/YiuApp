# YIU Mobile App — Backend API

ASP.NET Core Web API — mobil uygulama (`YIU Mobile App`, kök dizinde) ve ileride kurulacak
admin panel için ortak backend. Bkz. [`docs/PLATFORM_IMPLEMENTATION_PLAN.md`](../docs/PLATFORM_IMPLEMENTATION_PLAN.md)
ve [`docs/ADMIN_PANEL_ROADMAP.md`](../docs/ADMIN_PANEL_ROADMAP.md).

**Bu commit yalnızca proje iskeletidir** — Auth/Users/Announcements gibi modüllerin gerçek
implementasyonu Faz-2'de yapılacak.

## Teknoloji

- ASP.NET Core Web API — .NET 9
- PostgreSQL + Entity Framework Core (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- JWT Bearer authentication (middleware kurulu, gerçek token üretimi Faz-2)
- OpenAPI + Scalar interaktif dokümantasyon — `/scalar/v1` (yalnızca Development ortamında).
  Not: Swashbuckle yerine .NET 9'un yerleşik `AddOpenApi()`'ı kullanıldı — Swashbuckle'ın şu an
  bağımlı olduğu Microsoft.OpenApi 1.x, .NET 9 paylaşılan çerçevesindeki 2.x ile çalışma
  zamanında çakışıyor (`ReflectionTypeLoadException`).
- xUnit test projesi

## Klasör yapısı

```text
backend-api/
├── YiuApp.sln
├── src/
│   └── YiuApp.Api/
│       ├── Program.cs           — DI, middleware pipeline, health endpoint
│       ├── appsettings.json     — placeholder config (secret yok)
│       ├── Common/
│       │   └── Roles.cs         — SuperAdmin/Admin/Editor/Viewer sabitleri
│       ├── Controllers/
│       │   └── Auth/
│       │       └── AuthController.cs   — /api/auth/login (stub, Faz-2'de implemente edilecek)
│       └── Data/
│           └── AppDbContext.cs  — EF Core context, henüz DbSet yok
└── tests/
    └── YiuApp.Api.Tests/
        └── HealthEndpointTests.cs
```

Modüller (Announcements, Events, Faculties, Opportunities, CampusContents, ContactInfo,
Users, Roles, MediaFiles, Settings, AuditLogs, ...) eklendikçe her biri kendi
`Entities/`, `Dtos/`, `Services/`, `Controllers/Mobile|Admin/` dosyalarıyla gelecek —
bkz. `docs/ADMIN_PANEL_ROADMAP.md` bölüm 4.

## Endpoint sözleşmesi

```text
/api/mobile/*   — mobil uygulamanın okuduğu public, read-only endpointler
/api/admin/*    — admin panelin CRUD yaptığı, yetkilendirme gerektiren endpointler
/api/auth/*     — admin panel girişi (JWT + refresh token)
/health         — uptime/health check
```

## Yerel geliştirme

### Gereksinimler
- .NET 9 SDK
- Yerel bir PostgreSQL (örn. Docker): `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`

### Secret'lar

Hiçbir gerçek connection string / JWT key `appsettings.json`'a yazılmaz. İki seçenek:

```bash
# Ortam değişkeni ile (CI/CD ve production için önerilen)
export ConnectionStrings__Default="Host=...;Database=...;Username=...;Password=..."
export Jwt__Key="..."

# veya dotnet user-secrets ile (yerel geliştirme için önerilen)
cd src/YiuApp.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5432;Database=yiuapp_dev;Username=postgres;Password=postgres"
```

`appsettings.Development.json` içinde yalnızca zararsız bir **local-only örnek** bırakıldı
(varsayılan Docker Postgres kimlik bilgileri) — production/staging bilgisi değildir.

### Çalıştırma

```bash
cd backend-api
dotnet build
dotnet run --project src/YiuApp.Api
# API dokümantasyonu (Scalar): http://localhost:5xxx/scalar/v1
# Health:                      http://localhost:5xxx/health
```

### Test

```bash
dotnet test
```

## Mimari kurallar

- Microservice yok — tek proje, tek PostgreSQL veritabanı (sade modüler monolith).
- Entity / DTO / Service / Controller ayrımı her modülde korunur.
- Admin ve mobile endpointleri her zaman ayrı controller/route grubunda tutulur.
- Secret bilgiler asla `appsettings.json`'a gömülmez.
