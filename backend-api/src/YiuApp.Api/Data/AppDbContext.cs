using Microsoft.EntityFrameworkCore;

namespace YiuApp.Api.Data;

/// <summary>
/// Tek PostgreSQL veritabanı için EF Core context.
///
/// Bu iskelet commit'inde henüz hiçbir DbSet/entity yok — modüller
/// (Announcements, Events, Faculties, Opportunities, CampusContents,
/// ContactInfo, Users, Roles, MediaFiles, Settings, AuditLogs, ...)
/// docs/PLATFORM_IMPLEMENTATION_PLAN.md'deki plana göre tek tek eklenecek.
/// Her modül eklendiğinde: Entities/ altına entity + burada DbSet + migration.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
