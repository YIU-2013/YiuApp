# API Kontratı — Backend Geliştirici İçin

Bu doküman, `admin-panel/` ve mobil uygulamanın (ileride) ihtiyaç duyacağı backend API
sözleşmesini tanımlar. **Bu bir plandır — backend kodu bu dokümanla birlikte yazılmamıştır.**
`backend-api/` içindeki mevcut iskelet (ASP.NET Core, `Controllers/Auth/AuthController.cs` stub,
`Common/Roles.cs`) bu kontratla birebir uyumlu olacak şekilde tasarlanmıştır.

Kaynak: Admin panelin `admin-panel/src/types/models.ts` dosyasındaki TypeScript tipleri ve
`admin-panel/src/services/*.ts` dosyalarındaki (şu an mock, yarın gerçek) servis çağrıları.
JSON alan adları **camelCase** — admin panel ve mobil uygulama tarafında hiçbir dönüşüm
yapılmadan doğrudan kullanılabilmesi için.

---

## 1. Gerekli Endpoint Listesi

### Auth
```text
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Admin (yetkilendirme gerektirir)
```text
GET    /api/admin/featured-slides
POST   /api/admin/featured-slides
PUT    /api/admin/featured-slides/:id
DELETE /api/admin/featured-slides/:id

GET    /api/admin/announcements
POST   /api/admin/announcements
PUT    /api/admin/announcements/:id
DELETE /api/admin/announcements/:id

GET    /api/admin/events
POST   /api/admin/events
PUT    /api/admin/events/:id
DELETE /api/admin/events/:id

GET    /api/admin/opportunities
POST   /api/admin/opportunities
PUT    /api/admin/opportunities/:id
DELETE /api/admin/opportunities/:id

GET    /api/admin/campus
POST   /api/admin/campus
PUT    /api/admin/campus/:id
DELETE /api/admin/campus/:id

GET    /api/admin/faculties
POST   /api/admin/faculties
PUT    /api/admin/faculties/:id
DELETE /api/admin/faculties/:id

GET    /api/admin/departments
POST   /api/admin/departments
PUT    /api/admin/departments/:id
DELETE /api/admin/departments/:id

GET    /api/admin/contact
PUT    /api/admin/contact
```

### Mobile (public, yalnızca aktif/yayında kayıtları döner)
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

**Fark:** `/api/admin/*` tüm kayıtları (aktif+pasif) döner ve yazma izni ister. `/api/mobile/*`
yalnızca `active: true` olan kayıtları döner, herkese açıktır (auth gerekmez), ve `FeaturedSlide`
için ayrıca `startsAt`/`endsAt` tarih aralığına göre filtreleme yapmalıdır (bkz. bölüm 7).

### Health
```text
GET /health   — zaten backend-api iskeletinde mevcut, değişmedi.
```

---

## 2. Auth Akışı

```text
POST /api/auth/login
Body: { "email": string, "password": string }
200 → { "token": string, "refreshToken": string, "user": AdminUser }
401 → { "message": "E-posta veya şifre hatalı." }
```

```text
POST /api/auth/refresh
Body: { "refreshToken": string }
200 → { "token": string, "refreshToken": string }
```

```text
POST /api/auth/logout
Header: Authorization: Bearer <token>
204
```

Sonraki tüm `/api/admin/*` istekleri `Authorization: Bearer <token>` header'ı taşımalı.
Admin panelin şu anki mock auth'u (`admin-panel/src/services/authService.ts`) bu sözleşmeye
göre yazıldı — backend gelince yalnızca mock dalı kaldırılacak, arayüz değişmeyecek.

**Mevcut admin panel kapsamı (bilgi amaçlı):** Şu an yalnızca `POST /api/auth/login` client
tarafında kablolanmış durumda. `POST /api/auth/refresh` ve `POST /api/auth/logout` bu dokümanda
tanımlı ama admin panel henüz bunları çağırmıyor — çıkış işlemi şu an yalnızca token'ı
`localStorage`'dan silip client-side yönlendirme yapıyor. Backend bu iki endpoint'i kontrata göre
sağlamalı; admin panelin onları gerçekten çağırması, gerçek `/api/auth/login`'e bağlanılacağı
fazda yapılacak. Login response'undaki `refreshToken` alanı da aynı nedenle admin panel
tarafında henüz saklanmıyor.

**AdminUser:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "SuperAdmin | Admin | Editor | Viewer"
}
```

---

## 3. Role / Permission Beklentisi

Roller `backend-api/src/YiuApp.Api/Common/Roles.cs`'te zaten tanımlı:

| Rol | Yetki |
|---|---|
| `SuperAdmin` | Her şey (kullanıcı yönetimi dahil) |
| `Admin` | Tüm içerik modüllerinde tam CRUD |
| `Editor` | İçerik CRUD (kullanıcı/rol yönetimi hariç) |
| `Viewer` | Yalnızca okuma (`GET /api/admin/*`) |

Öneri: `[Authorize(Roles = "SuperAdmin,Admin,Editor")]` yazma endpointlerinde, `[Authorize]`
(rol farketmeksizin) okuma endpointlerinde.

**Önemli:** Bu roller mobil uygulamanın kendi `AuthUser.role` (`student`/`staff`/`admin`)
alanından tamamen ayrıdır — birbirine karıştırılmamalı (bkz. `docs/ADMIN_PANEL_ROADMAP.md`).

---

## 4. Modül DTO'ları

Her modül için ortak kural: `GET` listesi hem `id` hem tüm alanları döner; `POST`/`PUT` body'si
`id` içermez (sunucu üretir/URL'den gelir).

### FeaturedSlide

```ts
{
  id: string;
  title: string;               // zorunlu
  description: string;         // zorunlu
  badge?: string;
  type: "announcement" | "opportunity" | "event" | "campus";   // zorunlu
  ctaLabel?: string;
  imageUrl?: string;
  targetType?: "announcement" | "opportunity" | "event" | "campus";
  targetId?: string;
  sortOrder: number;            // zorunlu, tam sayı
  active: boolean;              // zorunlu
  startsAt?: string;             // ISO 8601 tarih
  endsAt?: string;                // ISO 8601 tarih
}
```

Örnek response (`GET /api/admin/featured-slides`):
```json
[
  {
    "id": "slide-1",
    "title": "Yaz Okulu Kayıt İşlemleri Hakkında Bilgilendirme",
    "description": "Yaz okulu kayıtları online sistem üzerinden 15 Haziran tarihinde başlayacaktır.",
    "badge": "AKADEMİK",
    "type": "announcement",
    "ctaLabel": "Detayları Gör",
    "targetType": "announcement",
    "targetId": "ann-1",
    "sortOrder": 1,
    "active": true,
    "startsAt": null,
    "endsAt": null
  }
]
```

### Announcement

```ts
{
  id: string;
  title: string;                 // zorunlu
  summary: string;               // zorunlu
  content: string;               // zorunlu
  category: "AKADEMİK" | "ÖNEMLİ" | "DUYURU";   // zorunlu
  imageUrl?: string;
  publishedAt: string;            // zorunlu, ISO 8601
  pinned: boolean;                 // zorunlu
  active: boolean;                 // zorunlu
}
```

### Event

```ts
{
  id: string;
  title: string;              // zorunlu
  description: string;
  location: string;            // zorunlu
  eventDate: string;            // zorunlu, ISO 8601
  imageUrl?: string;
  category?: string;
  active: boolean;              // zorunlu
}
```

### Opportunity

```ts
{
  id: string;
  title: string;                 // zorunlu
  description: string;           // zorunlu
  category: "İndirim" | "Kampüs Fırsatı" | "Anlaşmalı Kurum" | "Sosyal İmkan";  // zorunlu
  badge?: string;
  imageUrl?: string;
  actionLabel?: string;
  actionUrl?: string;
  active: boolean;                // zorunlu
  sortOrder: number;               // zorunlu
}
```

### CampusContent

```ts
{
  id: string;
  title: string;         // zorunlu
  description: string;   // zorunlu
  icon: string;            // zorunlu — Ionicons adı (mobil tarafta doğrudan kullanılıyor)
  category: string;         // örn. "Kütüphane", "Yemekhane", "Kulüpler", "Ulaşım", "Sosyal Alanlar"
  sortOrder: number;         // zorunlu
  active: boolean;            // zorunlu
}
```

### Faculty

```ts
{
  id: string;
  name: string;              // zorunlu
  description: string;
  icon: string;                // zorunlu — Ionicons adı
  dean: string;                 // zorunlu
  contactEmail: string;          // zorunlu, e-posta formatı
  active: boolean;                // zorunlu
  sortOrder: number;                // zorunlu
}
```

### Department

```ts
{
  id: string;
  facultyId: string;        // zorunlu, var olan bir Faculty.id'ye referans (FK)
  name: string;                // zorunlu
  degreeType: string;           // "Ön Lisans" | "Lisans" | "Yüksek Lisans"
  duration: number;              // zorunlu, > 0
  language: string;               // zorunlu
  description: string;
  active: boolean;                  // zorunlu
  sortOrder: number;                  // zorunlu
}
```

### ContactInfo *(tekil kayıt — id yok, tek satır/singleton)*

```ts
{
  generalPhone: string;          // zorunlu
  generalEmail: string;           // zorunlu, e-posta formatı
  address: string;                 // zorunlu
  mapUrl?: string;
  studentAffairsPhone: string;       // zorunlu
  studentAffairsEmail: string;        // zorunlu, e-posta formatı
  supportText: string;                 // zorunlu
}
```

`GET /api/admin/contact` ve `PUT /api/admin/contact` — `POST`/`DELETE` yok, her zaman tek kayıt.

---

## 5. Validation Kuralları (özet)

| Kural | Uygulanacağı alanlar |
|---|---|
| Zorunlu (boş olamaz) | Yukarıdaki DTO tablolarında "zorunlu" işaretli tüm alanlar |
| E-posta formatı | `Faculty.contactEmail`, `ContactInfo.generalEmail`, `ContactInfo.studentAffairsEmail` |
| Enum/sabit değer | `Announcement.category`, `Opportunity.category`, `FeaturedSlide.type`/`targetType` |
| Pozitif tam sayı | `*.sortOrder`, `Department.duration` |
| ISO 8601 tarih | `Announcement.publishedAt`, `Event.eventDate`, `FeaturedSlide.startsAt`/`endsAt` |
| Var olan FK | `Department.facultyId` → mevcut bir `Faculty.id` olmalı; yoksa `400` |
| URL formatı (opsiyonel alanlar) | `*.imageUrl`, `Opportunity.actionUrl`, `ContactInfo.mapUrl` |

Validation hatası response'u:
```json
{
  "errors": {
    "title": ["Başlık zorunludur."],
    "sortOrder": ["Sıra numarası pozitif bir tam sayı olmalıdır."]
  }
}
```
(ASP.NET Core'un `ValidationProblemDetails` formatıyla uyumlu — admin panel tarafında ekstra
eşleme gerekmeden gösterilebilir.)

---

## 6. Admin Endpointleri — Davranış Detayları

- `GET /api/admin/{resource}` → tüm kayıtları (aktif+pasif) döner, `sortOrder` artan sırayla.
- `POST /api/admin/{resource}` → body'de `id` olmamalı; başarılıysa `201` + oluşan kayıt (id dahil).
- `PUT /api/admin/{resource}/:id` → **partial update** (yalnızca gönderilen alanlar güncellenir,
  admin panel tarafı zaten yalnızca değişen alanları göndermeye çalışır ama backend tam obje de
  kabul edebilmeli); başarılıysa `200` + güncel kayıt.
- `DELETE /api/admin/{resource}/:id` → kalıcı silme, `204`. (Admin panel ayrıca "pasife alma"
  seçeneği sunuyor — bu bir `PUT` ile `active:false` göndermektir, ayrı bir endpoint değildir.)
- Kayıt bulunamazsa: `404`.
- Yetkisiz erişim: `401` (token yok/geçersiz) veya `403` (rol yetersiz).

---

## 7. Mobile Endpointleri — Davranış Detayları

- Auth **gerektirmez**.
- Yalnızca `active: true` kayıtlar döner.
- `GET /api/mobile/featured-slides`: ayrıca `startsAt`/`endsAt` varsa şu anki tarih bu aralıkta
  olmayan slide'lar **hariç tutulmalı** (admin panelde ileri/geçmiş tarihli slide planlamak için).
- Response şekli admin endpointleriyle aynı DTO'yu kullanır (id dahil) — mobil taraf zaten bu
  şekli bekliyor (bkz. `src/types/models.ts` içindeki `Announcement`/`Event`/... tipleri, mobil
  uygulamanın kök dizinindeki `src/` klasöründe, admin panelinkinden ayrı ama alan isimleri
  büyük ölçüde örtüşüyor — birebir eşleme için bölüm 8'e bakın).
- `GET /api/mobile/announcements/:id` ve `/events/:id`: bulunamazsa `404`; `active:false` ise de
  `404` dönmeli (mobil kullanıcı pasif içeriği görmemeli).

---

## 8. Mobil Uygulama Tipleri ile Eşleme Notu

Mobil uygulamanın (`src/types/models.ts`, repo kökünde) mevcut tipleri admin panelinkinden
biraz farklı adlandırılmış (örn. `Announcement.excerpt` ↔ admin panelin `summary`'si,
`Announcement.date` ↔ admin panelin `publishedAt`'i). Backend, **admin panel DTO şeklini**
kaynak alacak (bu dokümandaki şekil) — mobil uygulama Faz 4'te gerçek API'ye bağlanırken kendi
tipleri bu DTO'ya göre güncellenecek. Bu fazda mobil tiplere dokunulmadı, bilgi amaçlı not
düşülüyor.

---

## 9. Örnek Uçtan Uca Akış

```text
1. Admin login olur:      POST /api/auth/login → { token, user }
2. Duyuru listesini çeker: GET /api/admin/announcements  (Authorization: Bearer <token>)
3. Yeni duyuru ekler:      POST /api/admin/announcements { title, summary, content, category, publishedAt, pinned, active }
4. Mobil uygulama (Faz 4'te) aynı duyuruyu görür: GET /api/mobile/announcements (auth yok, yalnızca active:true dönenler)
```
