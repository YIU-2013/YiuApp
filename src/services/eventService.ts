import { Event } from '../types/models';
import { Cache } from '../utils/cache';
import { relativeEventDate } from '../utils/date';

const CACHE_KEY = 'events';
const CACHE_TTL = 24 * 60 * 60 * 1000;

// NOT: day/month/year alanları relativeEventDate ile üretilir (sabit yıl
// hardcode edilmez) — "Yaklaşan Etkinlikler" listesi her zaman gelecekte
// kalan, mantıklı tarihler gösterir.
const MOCK: Event[] = [
  {
    id: '1',
    ...relativeEventDate(4),
    title: 'Tıp Etiği Konferansı',
    time: '14:00',
    endTime: '17:00',
    location: 'Konferans Salonu A',
    description:
      'Sağlık profesyonelleri ve akademisyenlerin bir araya geleceği bu konferansta tıp etiğinin güncel sorunları ele alınacaktır.\n\nKonuşmacılar:\n• Prof. Dr. Ahmet Yılmaz (Tıp Etiği Anabilim Dalı Başkanı)\n• Doç. Dr. Fatma Kaya (Biyoetik Araştırma Merkezi)\n• Dr. Mehmet Öztürk (Hasta Hakları Derneği)\n\nKonferansa katılım ücretsizdir. Kayıt olmak için öğrenci bilgi sistemini kullanınız.',
    category: 'Akademik',
  },
  {
    id: '2',
    ...relativeEventDate(8),
    title: 'Ar-Ge Tanıtım Günü',
    time: '10:00',
    endTime: '16:00',
    location: 'Merkez Lab',
    description:
      'Üniversitemiz Araştırma-Geliştirme birimlerinin proje ve çalışmalarını tanıttığı yıllık etkinlik.\n\nProgram:\n• 10:00 - Açılış Konuşması\n• 10:30 - Laboratuvar Turları\n• 12:00 - Öğle Yemeği\n• 13:00 - Proje Sunumları\n• 15:00 - Panel: Geleceğin Araştırmaları\n• 16:00 - Kapanış',
    category: 'Araştırma',
  },
  {
    id: '3',
    ...relativeEventDate(15),
    title: 'Kariyer Günleri',
    time: '09:00',
    endTime: '18:00',
    location: 'Spor Salonu',
    description:
      'Türkiye\'nin önde gelen sağlık kuruluşlarının katılımıyla düzenlenen Kariyer Günleri\'nde öğrenciler, iş fırsatları ve staj imkânları hakkında bilgi edinebilecektir.\n\n40\'tan fazla kurum ve 200+ iş fırsatı için şimdiden özgeçmişinizi hazırlayın.',
    category: 'Kariyer',
  },
  {
    id: '4',
    ...relativeEventDate(21),
    title: 'Uluslararası Öğrenci Tanışma Töreni',
    time: '11:00',
    endTime: '13:00',
    location: 'Açık Amfi',
    description:
      'Bu akademik yılda üniversitemize katılacak uluslararası öğrencileri tanıma ve hoş geldin etkinliği.',
    category: 'Sosyal',
  },
];

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

export const eventService = {
  getAll: async (signal?: AbortSignal): Promise<Event[]> => {
    try {
      await delay(500);
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

      // TODO: await apiClient.get<Event[]>('/events', { signal })
      await Cache.set(CACHE_KEY, MOCK, CACHE_TTL);
      return MOCK;
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      const cached = await Cache.get<Event[]>(CACHE_KEY);
      if (cached) return cached;
      throw err;
    }
  },

  getById: async (id: string): Promise<Event | null> => {
    const all = await eventService.getAll();
    return all.find(e => e.id === id) ?? null;
  },
} as const;
