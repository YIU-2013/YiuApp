import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

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

/** Giriş yapılmış admin panel sayfalarını saran kabuk: yan menü + içerik alanı. */
export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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
        <div className="app-sidebar__footer">
          <div className="app-sidebar__user">
            <div className="app-sidebar__user-name">{user?.name}</div>
            <div className="app-sidebar__user-role">{user?.role}</div>
          </div>
          <button type="button" className="app-sidebar__logout" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
