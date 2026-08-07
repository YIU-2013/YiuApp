import { Opportunity } from '../types/models';
import { Cache } from '../utils/cache';

const CACHE_KEY = 'opportunities';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat

// ─── Mock Veri ────────────────────────────────────────────────────────────────
// Gerçek API hazır olduğunda bu bloğu kaldırın,
// aşağıdaki apiClient.get() satırını uncomment edin.
const MOCK: Opportunity[] = [
  {
    id: '1',
    title: 'Öğrenci Kimlik Kartı İndirimleri',
    description:
      'YİÜ öğrenci kimlik kartınızla şehir içi ulaşımda, kırtasiye ve kitabevlerinde özel indirim oranlarından faydalanabilirsiniz.',
    category: 'İndirim',
    icon: 'card-outline',
  },
  {
    id: '2',
    title: 'Kütüphane & Dijital Kaynak Erişimi',
    description:
      'Ulusal ve uluslararası akademik veritabanlarına, e-kitap ve makale arşivlerine kampüs dışından da erişim imkanı.',
    category: 'Kampüs Fırsatı',
    icon: 'library-outline',
  },
  {
    id: '3',
    title: 'Anlaşmalı Sağlık Merkezleri',
    description:
      'Üniversitemizle protokollü özel poliklinik ve optik merkezlerinde öğrencilere özel muayene ve ürün indirimleri.',
    category: 'Anlaşmalı Kurum',
    icon: 'medkit-outline',
  },
  {
    id: '4',
    title: 'Spor Salonu ve Kampüs Tesisleri',
    description:
      'Kampüs içi spor salonu, yüzme havuzu ve halı sahalardan öğrenci kimliğiyle ücretsiz veya indirimli faydalanın.',
    category: 'Kampüs Fırsatı',
    icon: 'fitness-outline',
  },
  {
    id: '5',
    title: 'Öğrenci Kulüpleri ve Topluluklar',
    description:
      '20’den fazla öğrenci kulübüyle sosyal, sanatsal ve akademik etkinliklere katılarak kampüs hayatının bir parçası olun.',
    category: 'Sosyal İmkan',
    icon: 'people-outline',
  },
  {
    id: '6',
    title: 'Kariyer Merkezi Danışmanlığı',
    description:
      'CV hazırlama, mülakat teknikleri ve staj/iş fırsatları için kariyer merkezimizden ücretsiz bireysel danışmanlık alın.',
    category: 'Anlaşmalı Kurum',
    icon: 'briefcase-outline',
  },
];

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

// ─── Service ──────────────────────────────────────────────────────────────────
export const opportunityService = {
  getAll: async (signal?: AbortSignal): Promise<Opportunity[]> => {
    try {
      await delay(600);
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

      // TODO: Gerçek API'ye geçiş:
      // const { data } = await apiClient.get<Opportunity[]>('/opportunities', { signal });
      // await Cache.set(CACHE_KEY, data, CACHE_TTL);
      // return data;

      await Cache.set(CACHE_KEY, MOCK, CACHE_TTL);
      return MOCK;
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      // Offline fallback
      const cached = await Cache.get<Opportunity[]>(CACHE_KEY);
      if (cached) return cached;
      throw err;
    }
  },

  getById: async (id: string): Promise<Opportunity | null> => {
    const all = await opportunityService.getAll();
    return all.find(o => o.id === id) ?? null;
  },
} as const;
