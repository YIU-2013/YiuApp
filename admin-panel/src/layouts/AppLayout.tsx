import { NavLink, Outlet } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard' },
  { to: '/slider', label: 'Slider Yönetimi' },
  { to: '/announcements', label: 'Duyuru Yönetimi' },
  { to: '/events', label: 'Etkinlik Yönetimi' },
  { to: '/opportunities', label: 'Fırsatlar Yönetimi' },
  { to: '/campus-contents', label: 'Kampüs İçerikleri' },
  { to: '/faculties', label: 'Fakülte / Bölüm Yönetimi' },
  { to: '/contact-info', label: 'İletişim Bilgileri' },
  { to: '/settings', label: 'Ayarlar' },
];

/**
 * Giriş yapılmış admin panel sayfalarını saran kabuk: yan menü + içerik alanı.
 * Yetkilendirme (route guard) Faz-2'de Auth modülüyle birlikte eklenecek.
 */
export default function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">YIU Admin</div>
        <nav>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
