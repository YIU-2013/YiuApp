# YIU Mobile App — Admin Panel

React + TypeScript + Vite admin paneli. Mobil uygulama (`YIU Mobile App`, kök dizinde) ve
`backend-api/`'nin yönetildiği web arayüzü. Bkz.
[`docs/PLATFORM_IMPLEMENTATION_PLAN.md`](../docs/PLATFORM_IMPLEMENTATION_PLAN.md).

**Bu commit yalnızca proje iskeletidir** — sayfalar boş layout, backend henüz canlı değil,
gerçek API bağlantısı yapılmadı (Faz-3'te implemente edilecek).

## Teknoloji

- React 19 + TypeScript
- Vite
- React Router (`react-router-dom`)
- TanStack Query (`@tanstack/react-query`)
- Axios (`src/api/client.ts`)

## Klasör yapısı

```text
admin-panel/
├── src/
│   ├── api/
│   │   └── client.ts          — merkezi Axios instance (backend-api'ye bağlanacak)
│   ├── lib/
│   │   └── queryClient.ts     — TanStack Query client
│   ├── layouts/
│   │   └── AppLayout.tsx      — sidebar + içerik kabuğu
│   ├── components/
│   │   └── PagePlaceholder.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── SliderPage.tsx
│   │   ├── AnnouncementsPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── OpportunitiesPage.tsx
│   │   ├── CampusContentsPage.tsx
│   │   ├── FacultiesPage.tsx
│   │   ├── ContactInfoPage.tsx
│   │   └── SettingsPage.tsx
│   └── App.tsx                — route tanımları
```

## Sayfalar (Faz 1 — iskelet)

| Route | Sayfa | Durum |
|---|---|---|
| `/login` | Login | Form UI hazır, submit inert (backend bekliyor) |
| `/` | Dashboard | Placeholder |
| `/slider` | Slider Yönetimi | Placeholder |
| `/announcements` | Duyuru Yönetimi | Placeholder |
| `/events` | Etkinlik Yönetimi | Placeholder |
| `/opportunities` | Fırsatlar Yönetimi | Placeholder |
| `/campus-contents` | Kampüs İçerikleri | Placeholder |
| `/faculties` | Fakülte / Bölüm Yönetimi | Placeholder |
| `/contact-info` | İletişim Bilgileri | Placeholder |
| `/settings` | Ayarlar | Placeholder |

Her placeholder Faz-3'te gerçek CRUD ekranıyla değiştirilecek — bkz.
`docs/ADMIN_PANEL_ROADMAP.md` bölüm 5.

## Yerel geliştirme

```bash
cd admin-panel
cp .env.example .env   # VITE_API_BASE_URL — backend-api hazır olunca gerçek adresi yazın
npm install
npm run dev
```

## Auth notu

Admin panel rolleri (`SuperAdmin`/`Admin`/`Editor`/`Viewer`) mobil uygulamanın kendi
`AuthUser.role` (`student`/`staff`/`admin`) alanından tamamen ayrıdır — bkz.
`docs/ADMIN_PANEL_ROADMAP.md` bölüm 3.
