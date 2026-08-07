import { Announcement } from '../types/models';
import { Cache } from '../utils/cache';
import { relativeDateLabel } from '../utils/date';

const CACHE_KEY = 'announcements';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat

// ─── Mock Veri ────────────────────────────────────────────────────────────────
// Gerçek API hazır olduğunda bu bloğu kaldırın,
// aşağıdaki apiClient.get() satırını uncomment edin.
// NOT: `date` alanları bilinçli olarak sabit yıl içermez (relativeDateLabel) —
// uygulama ne zaman açılırsa açılsın duyurular güncel görünür.
const MOCK: Announcement[] = [
  {
    id: '1',
    type: 'AKADEMİK',
    title: 'Yaz Okulu Kayıt İşlemleri Hakkında Bilgilendirme',
    excerpt: 'Yaz okulu kayıtları online sistem üzerinden 15 Haziran tarihinde başlayacaktır.',
    content:
      'Yaz okulu kayıtları, online öğrenci bilgi sistemi üzerinden 15 Haziran tarihi itibarıyla başlayacaktır. Kayıtlar 22 Haziran tarihine kadar tamamlanmalıdır.\n\nYaz okulu başvuru şartları:\n• İlgili derslerin kredi toplamı 18 saati geçmemelidir.\n• Öğrenci kaydını yenilemiş olmalıdır.\n• Genel not ortalaması 2.00 ve üzeri olmalıdır.\n\nDetaylı bilgi için Öğrenci İşleri Daire Başkanlığı ile iletişime geçebilirsiniz.',
    date: relativeDateLabel(-2),
    tags: ['yaz okulu', 'kayıt', 'akademik'],
  },
  {
    id: '2',
    type: 'ÖNEMLİ',
    title: 'Mezuniyet Töreni Programı ve Cübbe Dağıtımı',
    excerpt: 'Mezuniyet töreni katılım listesi ve cübbe dağıtım tarihleri fakülte sekreterliklerince ilan edilmiştir.',
    content:
      'Yüksek İhtisas Üniversitesi Mezuniyet Töreni, 30 Haziran Pazar günü saat 10:00\'da Açık Amfi\'de gerçekleştirilecektir.\n\nCübbe Teslim Tarihleri:\n• Tıp Fakültesi: 27 Haziran, 09:00-17:00\n• Diş Hekimliği Fakültesi: 28 Haziran, 09:00-17:00\n• Diğer Fakülteler: 29 Haziran, 09:00-17:00\n\nCübbeler fakülte sekreterliklerinden teslim alınacaktır.',
    date: relativeDateLabel(-5),
    tags: ['mezuniyet', 'tören'],
  },
  {
    id: '3',
    type: 'AKADEMİK',
    title: 'Yeni Akademik Takvim İlan Edildi',
    excerpt: 'Yeni eğitim öğretim yılına ait akademik takvim Senat onayı ile kesinleşmiştir.',
    content:
      'Üniversite Senatosunun son toplantısında alınan kararla, yeni Eğitim-Öğretim Yılı Akademik Takvimi onaylanmıştır.\n\nÖnemli Tarihler:\n• Güz Dönemi Kayıt: 2-6 Eylül\n• Güz Dönemi Başlangıç: 16 Eylül\n• Güz Dönemi Final Sınavları: 13-24 Ocak',
    date: relativeDateLabel(-9),
    tags: ['akademik takvim'],
  },
  {
    id: '4',
    type: 'DUYURU',
    title: 'Kütüphane Yaz Dönemi Çalışma Saatleri',
    excerpt: 'Üniversite Kütüphanesi yaz dönemi boyunca hafta içi 08:00-20:00 saatleri arasında hizmet verecektir.',
    content:
      'Yüksek İhtisas Üniversitesi Kütüphanesi, 17 Haziran - 6 Eylül tarihleri arasında yaz dönemi çalışma saatlerine geçecektir.\n\nYaz Dönemi Saatleri:\n• Pazartesi - Cuma: 08:00 - 20:00\n• Cumartesi: 10:00 - 18:00\n• Pazar: Kapalı\n\nResmi tatil günlerinde kütüphane hizmet vermeyecektir.',
    date: relativeDateLabel(-14),
    tags: ['kütüphane'],
  },
];

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

// ─── Service ──────────────────────────────────────────────────────────────────
export const announcementService = {
  getAll: async (signal?: AbortSignal): Promise<Announcement[]> => {
    try {
      await delay(700);
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

      // TODO: Gerçek API'ye geçiş:
      // const { data } = await apiClient.get<Announcement[]>('/announcements', { signal });
      // await Cache.set(CACHE_KEY, data, CACHE_TTL);
      // return data;

      await Cache.set(CACHE_KEY, MOCK, CACHE_TTL);
      return MOCK;
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      // Offline fallback
      const cached = await Cache.get<Announcement[]>(CACHE_KEY);
      if (cached) return cached;
      throw err;
    }
  },

  getById: async (id: string): Promise<Announcement | null> => {
    const all = await announcementService.getAll();
    return all.find(a => a.id === id) ?? null;
  },
} as const;
