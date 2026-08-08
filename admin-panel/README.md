# YIU Mobile App — Admin Panel

React + TypeScript + Vite admin paneli. Mobil uygulama (`YIU Mobile App`, kök dizinde) ve
`backend-api/`'nin yönetildiği web arayüzü. Bkz.
[`docs/PLATFORM_IMPLEMENTATION_PLAN.md`](../docs/PLATFORM_IMPLEMENTATION_PLAN.md) ve demo
akışı için [`docs/DEMO_GUIDE.md`](../docs/DEMO_GUIDE.md).

**Frontend tamamlandı, backend henüz yok.** Login ve 7 içerik modülünde (Slider, Duyuru,
Etkinlik, Fırsatlar, Kampüs İçerikleri, Fakülte/Bölüm, İletişim Bilgileri) tam CRUD çalışıyor —
ama veriler `backend-api/` yerine tarayıcının `localStorage`'ında (mock) tutuluyor. Backend
gelince tek yapılacak `.env`'de `VITE_USE_MOCK_API=false` — servis katmanı buna hazır (bkz.
altta "Auth notu" ve `docs/API_CONTRACT_FOR_BACKEND.md`).

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
│   │   ├── client.ts           — merkezi Axios instance (backend-api'ye bağlanacak)
│   │   └── mockClient.ts       — localStorage tabanlı mock CRUD motoru (backend gelince kalkacak)
│   ├── auth/
│   │   ├── AuthContext.tsx     — mock login/logout + oturum kalıcılığı
│   │   └── ProtectedRoute.tsx  — route guard
│   ├── config.ts               — USE_MOCK_API / API_BASE_URL
│   ├── hooks/
│   │   ├── useCrudResource.ts     — liste + create/update/remove için ortak React Query hook'u
│   │   └── useSingletonResource.ts — ContactInfo gibi tekil kaynaklar için
│   ├── lib/
│   │   └── queryClient.ts     — TanStack Query client
│   ├── layouts/
│   │   └── AppLayout.tsx      — sidebar + içerik kabuğu
│   ├── components/             — DataTable, FormModal, ConfirmDialog, StatusBadge, state block'lar...
│   ├── services/                — her modül için mock+gerçek API dalını birlikte tutan servis dosyaları
│   ├── types/models.ts          — tüm entity tipleri (backend DTO'larının kaynağı)
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
│   └── App.tsx                — route tanımları (Login hariç hepsi ProtectedRoute altında)
```

## Sayfalar

| Route | Sayfa | Durum |
|---|---|---|
| `/login` | Login | Çalışıyor — mock kullanıcı (bkz. altta "Mock giriş") |
| `/` | Dashboard | Çalışıyor — canlı özet istatistikler (salt okunur) |
| `/slider` | Slider Yönetimi | Tam CRUD |
| `/announcements` | Duyuru Yönetimi | Tam CRUD |
| `/events` | Etkinlik Yönetimi | Tam CRUD |
| `/opportunities` | Fırsatlar Yönetimi | Tam CRUD |
| `/campus-contents` | Kampüs İçerikleri | Tam CRUD |
| `/faculties` | Fakülte / Bölüm Yönetimi | Tam CRUD (iki sekme, Bölüm→Fakülte FK ilişkili) |
| `/contact-info` | İletişim Bilgileri | Çalışıyor — tekil kayıt, kaydet formu |
| `/settings` | Ayarlar | Placeholder (kapsam dışı) |

Tüm CRUD sayfaları şu an `localStorage` tabanlı mock veriyle çalışır — bkz. altta "Mock veri".

## Mock giriş

```text
E-posta : admin@yiu.edu.tr
Şifre   : ChangeMe123!
```

`src/services/authService.ts` içinde tanımlı, gerçek bir kullanıcı değildir.

## Mock veri

Her servis dosyası (`src/services/*.ts`) iki dalı birden içerir: `USE_MOCK_API` true iken
`src/api/mockClient.ts` üzerinden `localStorage`'a; false iken `src/api/client.ts`
(`apiClient`) üzerinden gerçek backend'e istek atar. Sayfalar/komponentler hangi dalın aktif
olduğunu bilmez — hiçbiri `localStorage`'a doğrudan erişmez.

## Yerel geliştirme

```bash
cd admin-panel
cp .env.example .env   # VITE_USE_MOCK_API=true (varsayılan) — backend hazır olunca false yapın
npm install
npm run dev
```

## Auth notu

Admin panel rolleri (`SuperAdmin`/`Admin`/`Editor`/`Viewer`) mobil uygulamanın kendi
`AuthUser.role` (`student`/`staff`/`admin`) alanından tamamen ayrıdır — bkz.
`docs/ADMIN_PANEL_ROADMAP.md` bölüm 3.
