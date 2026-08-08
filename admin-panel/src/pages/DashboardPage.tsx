import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import { announcementService } from '../services/announcementService';
import { eventService } from '../services/eventService';
import { opportunityService } from '../services/opportunityService';
import { featuredSlideService } from '../services/featuredSlideService';
import { facultyService } from '../services/departmentService';

export default function DashboardPage() {
  const announcements = useQuery({ queryKey: ['announcements'], queryFn: announcementService.list });
  const events = useQuery({ queryKey: ['events'], queryFn: eventService.list });
  const opportunities = useQuery({ queryKey: ['opportunities'], queryFn: opportunityService.list });
  const slides = useQuery({ queryKey: ['featured-slides'], queryFn: featuredSlideService.list });
  const faculties = useQuery({ queryKey: ['faculties'], queryFn: facultyService.list });

  const isLoading =
    announcements.isLoading || events.isLoading || opportunities.isLoading || slides.isLoading || faculties.isLoading;

  if (isLoading) return <LoadingState label="Özet yükleniyor…" />;

  const today = new Date().toISOString().slice(0, 10);
  const upcomingEvents = (events.data ?? [])
    .filter((e) => e.eventDate.slice(0, 10) >= today && e.active)
    .sort((a, b) => (a.eventDate < b.eventDate ? -1 : 1));

  const recentAnnouncements = [...(announcements.data ?? [])].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );

  const stats = [
    { label: 'Toplam Duyuru', value: announcements.data?.length ?? 0 },
    { label: 'Aktif Slider', value: (slides.data ?? []).filter((s) => s.active).length },
    { label: 'Yaklaşan Etkinlik', value: upcomingEvents.length },
    { label: 'Aktif Fırsat', value: (opportunities.data ?? []).filter((o) => o.active).length },
    { label: 'Aktif Fakülte', value: (faculties.data ?? []).filter((f) => f.active).length },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="YIU Admin Panel genel özeti" />

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-panel">
          <h2>Son Eklenen Duyurular</h2>
          {recentAnnouncements.length === 0 ? (
            <p>Henüz duyuru yok.</p>
          ) : (
            <ul className="dashboard-list">
              {recentAnnouncements.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <span>{a.title}</span>
                  <span className="data-table__muted">{new Date(a.publishedAt).toLocaleDateString('tr-TR')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-panel">
          <h2>Yaklaşan Etkinlikler</h2>
          {upcomingEvents.length === 0 ? (
            <p>Yaklaşan etkinlik yok.</p>
          ) : (
            <ul className="dashboard-list">
              {upcomingEvents.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <span>{e.title}</span>
                  <span className="data-table__muted">{new Date(e.eventDate).toLocaleDateString('tr-TR')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
