# YIU Mobile App — Backend & Admin Panel Yol Haritası

Bu doküman, şu anda mock veriyle çalışan **YIU Mobile App**'in ileride gerçek bir backend API'ye
ve web tabanlı bir admin panelden yönetilebilir hale gelmesi için mimari planı tanımlar.

Mobil uygulamanın mevcut mimarisi (React Query + servis/hook katmanı, tema sistemi, type-safe
navigasyon) korunmaktadır.

### Güncel Durum

- **Backend-api ve admin-panel başlatılıyor** — `backend-api/` (ASP.NET Core Web API iskeleti)
  ve `admin-panel/` (React + Vite iskeleti) bu aşamada eklendi. Detaylı plan için
  [`PLATFORM_IMPLEMENTATION_PLAN.md`](./PLATFORM_IMPLEMENTATION_PLAN.md)'ye bakın.
- **Mobil app mock veriyle çalışmaya devam ediyor** — hiçbir mobil dosyaya dokunulmadı, gerçek
  API bağlantısı yok.
- **EAS build ve gerçek cihaz testi en son alınacak** — Faz 2/3/4 tamamlanıp mobil app gerçek
  API'ye bağlandıktan sonra, yayına yakın son build/test turu yapılacak.
- **Mobil app gerçek API'ye backend ve admin panel olgunlaştıktan sonra bağlanacak** (Faz 4,
  aşağıdaki Faz Ayrımı bölümünde detaylandırılmıştır).

### Faz Ayrımı — Netleştirme

- **Mobil app şu an tamamen mock servislerle çalışıyor** (`src/services/*.ts` içindeki `MOCK`
  diziler) — hiçbir gerçek backend çağrısı yapmıyor. Bu, ürünün bilinçli bir aşaması, hata değil.
- **Backend/API kurulumu ayrı bir fazdır** (Faz 2) — mobil app'in mevcut UI/UX çalışmasından
  tamamen bağımsız başlar, mobil kod tabanını beklemez.
- **Admin panel kurulumu ayrı bir fazdır** (Faz 3) — backend API'nin admin endpointleri (bölüm
  6'daki `/api/admin/*`) hazır olmadan başlamaz, ama backend'le paralel/iteratif ilerleyebilir.
- **Mobil app'in gerçek API'ye geçişi Faz 4'tür** — Faz 2 ve 3 tamamlanana kadar mobil app'te
  hiçbir kod değişikliği yapılmaz; geçiş yalnızca bölüm 6'daki servis dosyalarında,
  tek satırlık (`MOCK` → `apiClient.get(...)`) değişikliklerle olacak.

Kısacası: **backend başlamak için mobil app'in "bitmiş" olmasını beklemiyor, ama mobil app'in
gerçek veriye geçmesi backend + admin panel'in belirli bir olgunluğa ulaşmasını bekliyor.**

---

## 1. Neden Admin Panel Gerekiyor?

Mobil uygulama şu anda tüm içeriği (`src/services/*.ts` dosyalarındaki `MOCK` dizileri) kod
içine gömülü sabit veri olarak sunuyor. Bunun pratik sonuçları:

- Bir duyuru eklemek/güncellemek için **kod değişikliği + yeni build** gerekiyor.
- Üniversite personeli (Öğrenci İşleri, Basın-Yayın vb.) içerik güncelleyemiyor.
- Etkinlik/duyuru tarihleri gerçek zamanlı değil (bkz. `src/utils/date.ts` — şu an göreceli
  tarih üretilerek "bayat içerik" görüntüsü geçici olarak çözüldü, ama bu kalıcı bir çözüm değil).
- Fırsatlar, kampüs içerikleri ve iletişim bilgileri de aynı şekilde statik.

Admin panel, bu içerik yönetimini geliştiriciden bağımsızlaştırıp ilgili birimlere devretmeyi
hedefler — klasik bir "headless CMS + mobil istemci" modeli.

---

## 2. Yönetilecek İçerikler — Mevcut Mobil Koddaki Karşılıkları

Aşağıdaki tablo, admin panelden yönetilecek her içerik türünü mobil uygulamadaki **mevcut**
TypeScript tipi / servis dosyasıyla eşleştirir. Backend DTO'ları bu tiplerden türetilecek.

| İçerik | Mobil tip (`src/types/models.ts` veya ilgili dosya) | Mevcut mock servis | Mevcut ekran(lar) |
|---|---|---|---|
| Ana sayfa slider | `FeaturedSlide` (`src/components/FeaturedSlider.tsx`) | Yok — `HomeScreen.tsx` içinde `useMemo` ile duyuru/etkinlik/fırsattan türetiliyor | HomeScreen |
| Duyurular | `Announcement` | `announcementService.ts` | HomeScreen, AnnouncementDetailScreen |
| Etkinlikler | `Event` | `eventService.ts` | HomeScreen, EventDetailScreen |
| Öğrenci fırsatları | `Opportunity` | `opportunityService.ts` | OpportunitiesScreen |
| Kampüsüm içerikleri | Yok — `CampusScreen.tsx` içinde `CAMPUS_LIFE` sabit dizisi | Yok (statik) | CampusScreen |
| Fakülte / Bölüm | `Faculty`, `Department` | `departmentService.ts` | DepartmentsScreen, DepartmentDetailScreen |
| İletişim bilgileri | Yok — `ContactScreen.tsx` içinde sabit sabitler (`GENERAL_PHONE`, `GENERAL_EMAIL`) | Yok (statik) | ContactScreen |
| Push notification içerikleri | — (mobilde henüz yok) | — | — |
| Mağaza ürünleri (ileride) | — | — | — |
| Sipariş/ödeme kayıtları (ileride) | — | — | — |

**Not:** `FeaturedSlide`, `CampusContents` ve `ContactInfo` şu anda mobil tarafta ayrı bir model
olarak tanımlı değil (ya türetilmiş ya da sabit). Backend modülleri bunları birinci sınıf
varlıklar (entity) olarak tanımlayacak; mobil taraf bu turda **modellenmedi**, Faz 4'te
`types/models.ts`'e eklenecek.

---

## 3. Önerilen Mimari

```text
Mobile App     : Expo React Native TypeScript   (mevcut — korunuyor)
Backend API    : ASP.NET Core Web API
Database       : PostgreSQL
Admin Panel    : React + TypeScript
Authentication : JWT + Refresh Token
Roller         : SuperAdmin, Admin, Editor, Viewer
```

**Neden bu seçimler:**
- **ASP.NET Core Web API**: Güçlü tip sistemi (mobil tarafın TS tip disipliniyle uyumlu), EF Core
  ile PostgreSQL entegrasyonu olgun, role-based auth (`[Authorize(Roles=...)]`) built-in.
- **PostgreSQL**: İlişkisel veri (Fakülte→Bölüm, Duyuru→Etiket gibi) için uygun; JSON kolon
  desteğiyle `FeaturedSlide` gibi esnek/az yapılandırılmış alanlar da rahatça saklanabilir.
- **React + TypeScript admin panel**: Mobil taraftaki tip tanımları (`Announcement`, `Event`,
  `Faculty`, `Opportunity`) backend DTO'ları üzerinden **paylaşılabilir** hale getirilebilir
  (örn. OpenAPI'den otomatik tip üretimi) — mobil ve admin panel arasında tip tutarlılığı.
- **Ayrı auth modeli**: Mobil uygulamada zaten bir `AuthUser` tipi var
  (`src/auth/types.ts` → `role: 'student' | 'staff' | 'admin'`), ama bu **öğrenci girişi** için.
  Admin panelin `SuperAdmin/Admin/Editor/Viewer` rolleri bundan tamamen ayrı, backend'de ayrı bir
  kullanıcı/rol tablosuyla yönetilecek — ikisini karıştırmamak önemli (biri içerik tüketen son
  kullanıcı, diğeri içerik üreten personel).

---

## 4. Backend API Modülleri

### Faz 1 (başlangıç)

```text
Auth              — admin/editor girişi, JWT + refresh token
Users             — admin panel kullanıcıları
Roles             — SuperAdmin, Admin, Editor, Viewer
FeaturedSlides     — Ana sayfa slider içerikleri
Announcements      — Duyurular
Events             — Etkinlikler
Opportunities      — Öğrenci fırsatları
CampusContents     — Kampüsüm içerikleri (kütüphane, yemekhane, kulüpler, ulaşım...)
Faculties          — Fakülte/Yüksekokul
Departments        — Bölüm/Program (Faculty'ye bağlı)
ContactInfo        — Genel iletişim bilgileri (tekil kayıt, telefon/e-posta/adres)
MediaFiles         — Görsel yükleme (duyuru/etkinlik/slider görselleri)
Settings           — Genel uygulama ayarları (örn. bakım modu, min. app versiyonu)
AuditLogs          — Kim, ne zaman, neyi değiştirdi (içerik geçmişi için)
```

### İleride

```text
PushNotifications  — Bildirim içerikleri + gönderim geçmişi
StudentAccounts     — Mobil uygulamadaki öğrenci girişi (AuthUser ile ilişkili)
StoreProducts       — Mağaza ürünleri
Orders              — Sipariş kayıtları
Payments            — Ödeme kayıtları
Invoices            — Fatura/makbuz
PaymentWebhooks     — iyzico/PayTR callback işleme
```

---

## 5. Admin Panel Sayfaları

### Faz 1 (başlangıç)

```text
Login
Dashboard
Slider Yönetimi
Duyuru Yönetimi
Etkinlik Yönetimi
Fırsatlar Yönetimi
Kampüs İçerikleri Yönetimi
Fakülte / Bölüm Yönetimi
İletişim Bilgileri
Kullanıcı Yönetimi
Ayarlar
```

### İleride

```text
Push Bildirimleri
Mağaza Ürünleri
Siparişler
Ödemeler
Raporlar
```

---

## 6. Mobil Uygulama Entegrasyon Planı

### Genel yaklaşım

Mevcut servis dosyaları (`src/services/*.ts`) **aynı arayüzü koruyarak** mock veriden gerçek
API'ye geçecek. Her servisin `getAll()`/`getById()` imzası değişmeyecek — sadece içerideki
`await delay(...)` + `MOCK` bloğu, zaten dosyalarda TODO olarak yorum satırında duran
`apiClient.get(...)` çağrısıyla değiştirilecek. React Query hook katmanı (`src/hooks/*.ts`) ve
ekranlar **hiç değişmeyecek** — bu, mevcut mimarinin en büyük avantajı.

`src/api/client.ts` içindeki merkezi Axios instance (`apiClient`) zaten hazır durumda; sadece
şu an yorum satırında bekleyen request interceptor (`Authorization: Bearer ${token}`) ve 401
handling etkinleştirilecek.

### Public (mobil) endpointler

```text
GET /api/mobile/featured-slides
GET /api/mobile/announcements
GET /api/mobile/announcements/:id
GET /api/mobile/events
GET /api/mobile/events/:id
GET /api/mobile/opportunities
GET /api/mobile/campus
GET /api/mobile/faculties
GET /api/mobile/faculties/:id
GET /api/mobile/contact
```

### Servis dosyası → endpoint eşlemesi

| Dosya | Değişecek satır | Bağlanacak endpoint |
|---|---|---|
| `src/services/announcementService.ts` | `getAll()` içindeki `MOCK` return | `GET /api/mobile/announcements` |
| `src/services/eventService.ts` | `getAll()` içindeki `MOCK` return | `GET /api/mobile/events` |
| `src/services/opportunityService.ts` | `getAll()` içindeki `MOCK` return | `GET /api/mobile/opportunities` |
| `src/services/departmentService.ts` | `getAll()` içindeki `MOCK_FACULTIES` return | `GET /api/mobile/faculties` |
| `src/screens/HomeScreen.tsx` (`featuredSlides` useMemo) | Şu an anno/event/opportunity'den türetiliyor | `GET /api/mobile/featured-slides` — backend hazır olunca istemci-taraflı türetme kaldırılıp doğrudan API'den okunacak |
| `src/screens/CampusScreen.tsx` (`CAMPUS_LIFE` sabiti) | Sabit dizi | `GET /api/mobile/campus` |
| `src/screens/ContactScreen.tsx` (`GENERAL_PHONE`/`GENERAL_EMAIL`) | Sabit değerler | `GET /api/mobile/contact` |

`getById(id)` metodları da aynı desenle `GET /api/mobile/announcements/:id` ve
`GET /api/mobile/events/:id`'ye bağlanacak (fakülte detayı için `GET /api/mobile/faculties/:id`).

### Admin (panel) endpointleri

```text
POST   /api/admin/featured-slides
PUT    /api/admin/featured-slides/:id
DELETE /api/admin/featured-slides/:id

POST   /api/admin/announcements
PUT    /api/admin/announcements/:id
DELETE /api/admin/announcements/:id

POST   /api/admin/events
PUT    /api/admin/events/:id
DELETE /api/admin/events/:id

POST   /api/admin/opportunities
PUT    /api/admin/opportunities/:id
DELETE /api/admin/opportunities/:id
```

(Faculties/Departments/CampusContents/ContactInfo için de aynı CRUD deseni Faz 3'te eklenecek.)

### Korunacaklar

- **`Cache` (`src/utils/cache.ts`) TTL katmanı** — servis içindeki offline fallback deseni
  (`try { API çağrısı + Cache.set } catch { Cache.get fallback }`) aynen korunacak; gerçek API'ye
  geçince offline-first davranış otomatik olarak devam edecek.
- **React Query ayarları** (`staleTime`, `gcTime`, `retry`) — değişmeyecek.
- **Type-safe navigation** — ekranlar arası hiçbir değişiklik gerekmiyor.

---

## 7. Faz Planı

### Phase 1 — Mobile App Store Hazırlığı *(UI tamamlandı, EAS preview build alındı)*
- Mevcut mobil app UI tamamlandı (öğrenci aidiyeti yönü, FeaturedSlider, Kampüsüm, yeniden
  tasarlanmış Fırsatlar/İletişim, Android safe-area/tab-bar düzeltmesi).
- EAS'e bağlanıldı (`@synsy/yiu-mobile-app`), Android preview APK başarıyla build edildi.
- **Kalan (en son yapılacak):** güncel koddan yeni bir preview build daha alınıp gerçek cihazda
  uçtan uca test edilmesi, store listing assetleri (ekran görüntüleri, açıklama metni — repo
  dışı). Bkz. [`PLATFORM_IMPLEMENTATION_PLAN.md`](./PLATFORM_IMPLEMENTATION_PLAN.md) — bu adım
  bilinçli olarak Faz 4'ten sonraya bırakıldı.

### Phase 2 — Backend API *(iskelet kuruldu)*
- `backend-api/` altında ASP.NET Core Web API (.NET 9) projesi, PostgreSQL/EF Core, JWT
  middleware, CORS ve `/health` endpoint'i kuruldu — bkz. `backend-api/README.md`.
- **Kalan:** gerçek modüller (Users/Roles/Announcements/Events/...) entity+DTO+service+controller
  olarak tek tek implemente edilecek; Auth modülünün gerçek token üretimi yazılacak.

### Phase 3 — Admin Panel *(iskelet kuruldu)*
- `admin-panel/` altında React + TypeScript + Vite projesi, route yapısı ve 10 sayfanın boş
  layoutları kuruldu — bkz. `admin-panel/README.md`.
- **Kalan:** her sayfa gerçek CRUD ekranına dönüştürülecek (backend `/api/admin/*` hazır
  olduktan sonra), rol bazlı yetkilendirme (SuperAdmin/Admin/Editor/Viewer) eklenecek.

### Phase 4 — Mobile API Integration
- Mobil app'teki mock servisler (bölüm 6'daki tablo) tek tek gerçek API'ye geçirilecek.
- React Query cache yapısı ve `Cache` TTL katmanı korunacak.
- `FeaturedSlide`/`CampusContents`/`ContactInfo` için `types/models.ts`'e gerçek tipler eklenecek.

### Phase 5 — Store / Payment Module
- Mağaza ürünleri yönetimi (admin) + listeleme (mobil) eklenecek.
- Sipariş sistemi eklenecek.
- iyzico / PayTR ödeme entegrasyonu **backend üzerinden** yapılacak.

---

## 8. Mağaza / Ödeme Modülünün İleride Eklenmesi

Bu modül bilinçli olarak Faz 5'e bırakılmıştır — ilk sürümlerde ödeme altyapısı **yoktur**.
Eklenirken izlenecek akış (önceki ürün dokümanında da belirtildiği gibi):

```text
Mobil Uygulama
   ↓
Backend API
   ↓
iyzico / PayTR
   ↓
Webhook / Callback
   ↓
Sipariş Durumu Güncelleme
```

Kritik kural: **mobil uygulama hiçbir zaman ödeme sırrı veya API key taşımayacak.** Ödeme
başlatma isteği mobilden backend'e gider; backend iyzico/PayTR ile konuşur; sonuç webhook ile
backend'e döner; mobil yalnızca sipariş durumunu (`Orders`) sorgular. Bu, mevcut `apiClient.ts`
deseniyle (merkezi, tek noktadan yönetilen Axios instance) doğrudan uyumludur.

---

## 9. Önerilen Repo Yapısı (İleride Monorepo'ya Geçiş)

Şu anda repo (`YIU-2013/YiuApp`) yalnızca mobil uygulamayı içeriyor — bu **değişmiyor**, backend
ve admin panel için ayrı repo mu yoksa monorepo mu kullanılacağına Faz 2 sonunda karar verilecek
(bkz. bölüm 7, Phase 3 notu). Eğer monorepo'ya geçilirse önerilen üst düzey klasör yapısı:

```text
mobile-app/       — mevcut Expo React Native TypeScript projesi (bu repodaki içerik buraya taşınır)
backend-api/      — ASP.NET Core Web API + PostgreSQL (Faz 2)
admin-panel/      — React + TypeScript admin paneli (Faz 3)
docs/             — bu roadmap ve diğer mimari dokümanlar (repo kökünde kalır)
```

Bu yapıya geçiş **Faz 2 başlamadan hemen önce** değerlendirilecek; mobil app'in `src/`, `assets/`,
config dosyaları vb. `mobile-app/` altına taşınacak, kök dizindeki `docs/` klasörü ortak kalacak.
Bu taşıma işlemi ayrı bir görev olarak ele alınacak, bu commit'te yapılmadı.

---

## 10. Açık Riskler / Notlar

- Mobil tarafta şu an **hiçbir gerçek API çağrısı yok** — `apiClient.ts` tanımlı ama kullanılmıyor.
  Faz 4 öncesi bu durum değişmeyecek, bilinçli bir tercih.
- `AuthUser.role` (`student`/`staff`/`admin`) ile admin panelin `SuperAdmin/Admin/Editor/Viewer`
  rolleri **birbirine karıştırılmamalı** — ayrı kullanıcı tabloları/ayrı auth akışları olacak.
  `staff`/`admin` mobil rolleri gelecekte "personel mobil erişimi" için ayrı bir konu; bu roadmap
  yalnızca **web admin panel** rollerini kapsar.
- `@sentry/react-native` sürüm uyumsuzluğu (bkz. önceki EAS hazırlık raporu) backend
  entegrasyonundan bağımsız, ayrıca çözülmesi gereken bir madde.
