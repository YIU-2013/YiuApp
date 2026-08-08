namespace YiuApp.Api.Common;

/// <summary>
/// Admin panel yetki rolleri. Mobil uygulamadaki AuthUser.role
/// ("student" | "staff" | "admin") ile karıştırılmamalı — bu roller
/// yalnızca web admin paneli kullanıcıları içindir.
/// </summary>
public static class Roles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string Editor = "Editor";
    public const string Viewer = "Viewer";

    public static readonly string[] All = [SuperAdmin, Admin, Editor, Viewer];
}
