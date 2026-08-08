# Demo Rehberi

Bu doküman, YIU Mobile Platform'u rektörlük/ekip sunumunda veya bir backend geliştiriciye
teslim ederken kullanmak için hazırlanmıştır. Amaç: projenin hangi kısmının çalışır durumda,
hangi kısmının mock, hangi kısmının henüz yazılmadığını net şekilde göstermek.

---

## Proje Özeti

YIU Mobile Platform üç parçadan oluşur:

- **Mobil uygulama** (repo kökü) — Expo / React Native / TypeScript. Öğrencinin kullandığı
  uygulama: duyurular, etkinlikler, fırsatlar, kampüs bilgileri, bölüm/fakülte listesi, iletişim.
- **Admin panel** (`admin-panel/`) — React + TypeScript + Vite. Üniversite personelinin
  mobil uygulamadaki içerikleri (duyuru, etkinlik, fırsat, slider, kampüs içeriği, fakülte/bölüm,
  iletişim bilgisi) yönetmesi için web arayüzü.
- **Backend API** (`backend-api/`) — ASP.NET Core. Şu an yalnızca proje iskeleti; admin panel
  ve mobil uygulamayı gerçek veriyle besleyecek olan katman **henüz yazılmadı**.

Şu anki aşamada mobil uygulama ve admin panel **birbirinden bağımsız, kendi mock verileriyle**
çalışıyor — aralarında gerçek bir veri bağlantısı yok. Bu bilinçli bir sıralama: önce her iki
arayüz de (UI/UX) olgunlaştırıldı, backend en son, tek seferde her iki tarafın da ihtiyacını
karşılayacak şekilde yazılacak (bkz. "Backend Gelince Yapılacaklar").

---

## Mobil App Durumu

- Arayüz (tüm ekranlar, navigasyon, tema, responsive davranış) **tamamlandı**.
- Veriler `src/services/*.ts` içindeki sabit (mock) dizilerden geliyor — internet/backend
  gerektirmez.
- Gerçek API'ye **henüz bağlanmadı** (bu, Faz 4'te yapılacak — bkz.
  `docs/ADMIN_PANEL_ROADMAP.md` bölüm 6).
- Daha önce (Faz 1'de) alınmış bir EAS Android preview build zaten mevcut ve geçerlidir, ama
  bu build de mock veri içerir — nihai/store build'i değildir.

## Admin Panel Durumu

- Frontend **tamamlandı** — Login, Dashboard ve 7 içerik modülünde (Slider, Duyuru, Etkinlik,
  Fırsatlar, Kampüs İçerikleri, Fakülte/Bölüm, İletişim Bilgileri) tam CRUD (ekle / düzenle /
  pasife al / sil) çalışıyor.
- Giriş (auth) mock bir kullanıcıyla çalışıyor, oturum tarayıcıda kalıcı (reload sonrası
  çıkış yapmıyor).
- Tüm veriler tarayıcının **localStorage**'ında saklanıyor — backend yok, sayfa verileri
  kalıcıdır ama yalnızca o tarayıcıya özeldir (başka bir cihaz/tarayıcıda görünmez).
- Servis katmanı (`admin-panel/src/services/*.ts`) gerçek API'ye tek satırlık bir
  değişiklikle geçecek şekilde tasarlandı — bkz. "Backend Gelince Yapılacaklar".
- `Ayarlar` sayfası kapsam dışı bırakıldı, hâlâ "yakında" placeholder'ı.

## Admin Panel Giriş Bilgileri

```text
E-posta : admin@yiu.edu.tr
Şifre   : ChangeMe123!
```

Bu, gerçek bir kullanıcı değil — kodda tanımlı, yalnızca geliştirme/demo amaçlı sabit bir
mock hesaptır (bkz. `admin-panel/src/services/authService.ts`).

## Admin Panel Çalıştırma Komutu

```bash
cd admin-panel
npm install
npm run dev
```

```text
http://localhost:5173
```

## Mobil App Çalıştırma Komutu

```bash
npm install
npx expo start --clear
```

---

## Demo Sırasında Gösterilecek Ekranlar

1. Mobil app ana sayfa
2. FeaturedSlider
3. Kampüsüm
4. Bölümler
5. Fırsatlar
6. İletişim
7. Admin panel login
8. Dashboard
9. Slider Yönetimi
10. Duyuru Yönetimi
11. Etkinlik Yönetimi
12. Fırsatlar Yönetimi
13. Fakülte/Bölüm Yönetimi
14. İletişim Bilgileri

Önerilen akış: önce mobil uygulamada bir duyuru/etkinliği gösterin (örn. "Tıp Etiği
Konferansı"), ardından admin panelde aynı kaydı bulup düzenleyin — bu, "içerik buradan
yönetilecek" fikrini somutlaştırır (şu an ikisi arasında canlı bağlantı olmadığı için admin
paneldeki değişiklik mobilde anında görünmez, bu farkı demo sırasında belirtmek faydalı olur).

## Mock Veri Açıklaması

- **Mobil uygulama**: `src/services/*.ts` dosyalarındaki sabit (`MOCK`) diziler. Kod
  değiştirilmeden içerik güncellenemez.
- **Admin panel**: `admin-panel/src/services/*.ts` içindeki başlangıç (`SEED`) verileri, ilk
  açılışta tarayıcının `localStorage`'ına yazılır; sonraki tüm ekle/düzenle/sil işlemleri
  doğrudan `localStorage` üzerinde çalışır (`admin-panel/src/api/mockClient.ts`).
- **İki taraf birbirinden bağımsızdır** — admin panelde yapılan bir değişiklik mobil
  uygulamaya yansımaz (aralarında gerçek bir API yok). Bu bağlantı backend tamamlandığında
  kurulacak.

## Backend Gelince Yapılacaklar

```text
Admin panel şu an mock servislerle çalışmaktadır.
Backend tamamlandığında admin-panel/.env dosyasında VITE_USE_MOCK_API=false yapılacak.
Servis yapısı buna hazırdır.
Backend docs/API_CONTRACT_FOR_BACKEND.md dosyasındaki endpoint ve DTO sözleşmesini karşılamalıdır.
```

Ayrıca:

- Mobil uygulama tarafında da benzer bir geçiş yapılacak (Faz 4) — `src/services/*.ts`
  dosyalarındaki `MOCK` return'leri gerçek `apiClient` çağrılarıyla değiştirilecek. Bkz.
  `docs/ADMIN_PANEL_ROADMAP.md` bölüm 6 (dosya → endpoint eşleme tablosu).
- Backend geliştirici için birincil referans dokümanı: **`docs/API_CONTRACT_FOR_BACKEND.md`**
  (tüm endpoint listesi, auth akışı, rol/izin tablosu, her modül için DTO tanımı ve
  validasyon kuralları).

## En Son Alınacak Adım: Android Preview Build

Sıra bilinçli olarak şu şekilde:

1. Backend (`backend-api/`) gerçek modülleriyle tamamlanır.
2. Admin panel gerçek backend'e bağlanır (`VITE_USE_MOCK_API=false`).
3. Mobil uygulama gerçek API'ye bağlanır (Faz 4).
4. **Ancak bundan sonra** güncel koddan yeni bir
   `eas build --platform android --profile preview` alınır ve gerçek cihazda, artık mock
   olmayan gerçek veriyle uçtan uca test edilir.

Bu görev kapsamında EAS build **alınmamıştır** — kasıtlı olarak en sona bırakılmıştır.
