# YIU Mobile Platform

Yüksek İhtisas Üniversitesi öğrenci mobil uygulaması ve onu besleyecek yönetim
platformu (admin panel + backend API). Repo şu an üç parçayı bir arada barındırıyor:

```text
YiuApp/
├── src/, App.tsx, app.config.ts, ...   — Mobil uygulama (Expo / React Native / TypeScript) — kökte
├── admin-panel/                        — İçerik yönetim paneli (React + TypeScript + Vite)
├── backend-api/                        — Backend API iskeleti (ASP.NET Core, henüz iş mantığı yok)
└── docs/
    ├── DEMO_GUIDE.md                   — Demo/sunum için adım adım rehber
    ├── API_CONTRACT_FOR_BACKEND.md     — Backend geliştirici için endpoint + DTO sözleşmesi
    ├── ADMIN_PANEL_ROADMAP.md          — Mimari plan ve gerekçeler
    └── PLATFORM_IMPLEMENTATION_PLAN.md — Faz faz uygulama durumu
```

Mobil uygulama bilinçli olarak repo kökünde bırakıldı (henüz `mobile-app/` altına
taşınmadı) — bkz. `docs/PLATFORM_IMPLEMENTATION_PLAN.md`.

---

## Mevcut Durum

| Parça | Durum |
|---|---|
| **Mobil uygulama** | Arayüz (UI/UX) tamamlandı, mock veriyle çalışıyor. Gerçek API'ye **henüz bağlanmadı**. |
| **Admin panel** | Frontend tamamlandı — 7 modülde tam CRUD (ekle/düzenle/pasife al/sil) çalışıyor, mock auth ile giriş var. Veriler **localStorage**'da (mock), gerçek backend yok. |
| **Backend API** | Yalnızca proje iskeleti var (`backend-api/`) — health endpoint dışında iş mantığı **yazılmadı**. |
| **EAS build (store'a giden)** | **Bilinçli olarak en sona bırakıldı** — mobil app gerçek API'ye bağlanana kadar yeni bir "nihai" build alınmayacak. |

Detaylı demo akışı ve ekran sırası için: **[`docs/DEMO_GUIDE.md`](./docs/DEMO_GUIDE.md)**.

---

## Mobil Uygulamayı Çalıştırma

```bash
npm install
npx expo start --clear
```

Açılan Expo Dev Tools'tan bir simülatör/gerçek cihaz/tarayıcı seçilebilir. Uygulama şu an
tamamen mock veriyle (`src/services/*.ts` içindeki sabit diziler) çalışır, internet veya
backend gerekmez.

## Admin Paneli Çalıştırma

```bash
cd admin-panel
npm install
npm run dev
```

Panel şu adreste açılır:

```text
http://localhost:5173
```

**Mock giriş bilgileri:**

```text
E-posta : admin@yiu.edu.tr
Şifre   : ChangeMe123!
```

Admin panel de mock veriyle çalışır — tüm CRUD işlemleri tarayıcının `localStorage`'ında
saklanır, backend gerekmez. Detaylar için `admin-panel/README.md`.

## Backend API (iskelet — henüz çalıştırılabilir bir ürün değil)

`backend-api/` altında bir ASP.NET Core Web API iskeleti var (health endpoint + auth stub).
Gerçek modüller (Announcements, Events, Faculties, ...) henüz yazılmadı. Çalıştırma adımları
ve mimari kurallar için `backend-api/README.md`.

---

## Backend Gelince Ne Değişecek

Admin panel şu an mock servislerle çalışmaktadır. Backend tamamlandığında
`admin-panel/.env` dosyasında `VITE_USE_MOCK_API=false` yapılacak. Servis yapısı
(`admin-panel/src/services/*.ts`) buna zaten hazırdır — her servis dosyasında hem mock hem
gerçek API dalı yan yana duruyor, tek satırlık bir flag değişimiyle geçiş yapılır; hiçbir
sayfa/komponent kodu değişmeyecek.

Backend, `docs/API_CONTRACT_FOR_BACKEND.md` dosyasındaki endpoint listesini ve DTO
sözleşmesini birebir karşılamalıdır — admin panelin alan adları (camelCase) ve validasyon
beklentileri bu dokümanda tanımlıdır.

Mobil uygulamanın gerçek API'ye geçişi ayrı ve daha sonraki bir fazdır (Faz 4) — bkz.
`docs/ADMIN_PANEL_ROADMAP.md` bölüm 6.

## En Son Alınacak Adım: EAS Build

Güncel koddan yeni bir Android/iOS preview build'i, **mobil uygulama gerçek API'ye
bağlandıktan sonra** alınacak — bu sayede build artık mock değil gerçek veriyle uçtan uca
test edilebilir. Daha önce (Faz 1'de) alınmış bir EAS preview build zaten mevcut ve
geçerlidir, ama **nihai/store'a giden build değildir**. Bkz.
`docs/PLATFORM_IMPLEMENTATION_PLAN.md` bölüm 4.
