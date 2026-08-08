# Platform Uygulama Planı

Bu doküman, `docs/ADMIN_PANEL_ROADMAP.md`'deki mimari planın **uygulama sırasını ve güncel
durumunu** özetler. Mimari kararların gerekçeleri (neden ASP.NET Core, neden ayrı roller vb.)
için roadmap dosyasına bakın — burada yalnızca "ne zaman, ne durumda" sorularına cevap var.

## Repo yapısı

```text
YiuApp/                    (repo kökü — mobil app hâlâ kökte, monorepo taşıması yapılmadı)
├── src/, App.tsx, ...      — mobil uygulama (değişmedi)
├── backend-api/            — ASP.NET Core Web API (bu fazda eklendi)
├── admin-panel/            — React + Vite admin paneli (bu fazda eklendi)
└── docs/
    ├── ADMIN_PANEL_ROADMAP.md
    └── PLATFORM_IMPLEMENTATION_PLAN.md   (bu dosya)
```

Mobil uygulama bilinçli olarak kökte bırakıldı — `backend-api/`/`admin-panel/` yalnızca yeni
klasörler olarak eklendi, mevcut hiçbir mobil dosya taşınmadı/değiştirilmedi.

## 1. Backend başlangıç planı

**Durum: iskelet kuruldu, build+test geçiyor.**

- `backend-api/YiuApp.sln` → `src/YiuApp.Api` (Web API) + `tests/YiuApp.Api.Tests` (xUnit).
- Kurulu: PostgreSQL/EF Core (`AppDbContext`, henüz DbSet yok), JWT Bearer middleware (gerçek
  token üretimi yok), rol politikaları (`Common/Roles.cs`), CORS iskeleti, OpenAPI + Scalar
  interaktif dokümantasyon (`/scalar/v1`), `/health` endpoint'i, `/api/auth/login` stub'ı (501).
- **Sıradaki adım:** modüller tek tek eklenecek — her modül için Entity → DbSet + migration →
  DTO → Service → Controller (`/api/mobile/*` ve/veya `/api/admin/*`). Öncelik sırası
  `ADMIN_PANEL_ROADMAP.md` bölüm 4'teki Faz 1 modül listesi.
- Detaylar, yerel çalıştırma ve secret yönetimi için: `backend-api/README.md`.

## 2. Admin panel başlangıç planı

**Durum: iskelet kuruldu, build geçiyor.**

- `admin-panel/` — React + TypeScript + Vite, React Router ile 10 route, TanStack Query +
  Axios altyapısı kurulu (`src/api/client.ts`).
- Şu an tüm sayfalar (Login hariç) `PagePlaceholder` gösteriyor — gerçek veri çekmiyor,
  backend henüz hazır olmadığı için bilinçli olarak bağlanmadı.
- **Sıradaki adım:** backend'de bir modülün `/api/admin/*` endpointleri hazır olduğunda, o
  modülün admin panel sayfası gerçek CRUD ekranına dönüştürülecek (TanStack Query ile
  `useQuery`/`useMutation`).
- Detaylar için: `admin-panel/README.md`.

## 3. Mobil entegrasyon ne zaman yapılacak

**Faz 4'te — backend ve admin panel belirli bir olgunluğa ulaştıktan sonra.**

Sıra şu şekilde işleyecek (bkz. `ADMIN_PANEL_ROADMAP.md` bölüm 6 — servis dosyası → endpoint
eşleme tablosu):

1. Backend'de bir modül tamamlanır (örn. Announcements: entity + migration + `/api/mobile/announcements`).
2. Admin panelde o modülün CRUD ekranı bağlanır — böylece içerik gerçekten admin'den girilebilir hale gelir.
3. Ancak bundan sonra mobildeki ilgili servis dosyası (`src/services/announcementService.ts`)
   `MOCK` yerine `apiClient.get(...)` çağrısına geçirilir — **tek satırlık, izole bir değişiklik**.
4. React Query hook katmanı, `Cache` TTL fallback'i ve ekranlar hiç değişmez.

Mobil uygulamaya bu doküman kapsamında **hiçbir kod değişikliği yapılmadı** — yukarıdaki sıra
tamamlanmadan da yapılmayacak.

## 4. En son build / test süreci

**Bilinçli olarak en sona bırakıldı.** Sıra:

1. Faz 2 (Backend) ve Faz 3 (Admin Panel) modülleri tamamlanır.
2. Faz 4 (Mobil entegrasyon) tamamlanır — mobil app artık gerçek API'ye bağlıdır.
3. Ancak bundan sonra: güncel koddan yeni bir `eas build --platform android --profile preview`
   alınır, gerçek Android/iOS cihazda uçtan uca test edilir (gerçek veriyle — artık mock değil).
4. Store yayın hazırlığı (ekran görüntüleri, açıklama metinleri, gizlilik politikası —
   repo dışı işler) bu son testten sonra başlar.

Not: Faz 1 kapsamında zaten bir EAS preview build alınmıştı (UI/config doğrulamak için,
mock veriyle) — o build hâlâ geçerlidir ama **nihai/store'a giden build değildir**. Bahsedilen
"en son build" adımı, mobil app gerçek API'ye bağlandıktan sonraki build'dir.

## 5. Mağaza / ödeme modülü

**İleri faz olarak kalacak — Faz 5.** Bu fazda hiçbir mağaza/ödeme kodu yazılmadı. Akış ve
kritik kural (mobil uygulama hiçbir zaman ödeme sırrı taşımaz) için
`ADMIN_PANEL_ROADMAP.md` bölüm 8'e bakın — değişiklik yok, aynen geçerli.

## Özet tablo

| Bileşen | Durum |
|---|---|
| Mobil app UI | Tamamlandı (Faz 1) |
| Mobil app ↔ gerçek API | Yapılmadı — Faz 4'te |
| EAS build / gerçek cihaz testi (nihai) | Yapılmadı — en son, Faz 4'ten sonra |
| Backend API | İskelet kuruldu (bu faz) — modüller Faz 2'de tek tek eklenecek |
| Admin panel | İskelet kuruldu (bu faz) — CRUD ekranları Faz 3'te eklenecek |
| Mağaza / ödeme | Planlanmadı — Faz 5 |
