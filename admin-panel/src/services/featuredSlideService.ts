import { apiClient } from '../api/client';
import { createMockListResource } from '../api/mockClient';
import { USE_MOCK_API } from '../config';
import type { FeaturedSlide } from '../types/models';

const ENDPOINT = '/api/admin/featured-slides';

const SEED: FeaturedSlide[] = [
  {
    id: 'slide-1',
    title: 'Yaz Okulu Kayıt İşlemleri Hakkında Bilgilendirme',
    description: 'Yaz okulu kayıtları online sistem üzerinden 15 Haziran tarihinde başlayacaktır.',
    badge: 'AKADEMİK',
    type: 'announcement',
    ctaLabel: 'Detayları Gör',
    targetType: 'announcement',
    targetId: 'ann-1',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'slide-2',
    title: 'Tıp Etiği Konferansı',
    description: '12 Ağustos · Konferans Salonu A',
    badge: 'Etkinlik',
    type: 'event',
    ctaLabel: 'Etkinliği Görüntüle',
    targetType: 'event',
    targetId: 'evt-1',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'slide-3',
    title: 'Öğrenci Kimlik Kartı İndirimleri',
    description: 'YİÜ öğrenci kimlik kartınızla şehir içi ulaşımda özel indirim oranlarından faydalanın.',
    badge: 'Fırsat',
    type: 'opportunity',
    ctaLabel: 'Fırsatı İncele',
    targetType: 'opportunity',
    targetId: 'opp-1',
    sortOrder: 3,
    active: true,
  },
  {
    id: 'slide-4',
    title: 'Kampüs Hayatını Keşfet',
    description: 'Kütüphane, kulüpler, yemekhane ve daha fazlası Kampüsüm sekmesinde seni bekliyor.',
    badge: 'Kampüs',
    type: 'campus',
    ctaLabel: 'Keşfet',
    sortOrder: 4,
    active: true,
  },
];

const mock = createMockListResource<FeaturedSlide>('yiu_admin_featured_slides', SEED);

export const featuredSlideService = {
  list: async (): Promise<FeaturedSlide[]> => {
    if (USE_MOCK_API) return mock.list();
    const { data } = await apiClient.get<FeaturedSlide[]>(ENDPOINT);
    return data;
  },
  create: async (input: Omit<FeaturedSlide, 'id'>): Promise<FeaturedSlide> => {
    if (USE_MOCK_API) return mock.create(input);
    const { data } = await apiClient.post<FeaturedSlide>(ENDPOINT, input);
    return data;
  },
  update: async (id: string, patch: Partial<Omit<FeaturedSlide, 'id'>>): Promise<FeaturedSlide> => {
    if (USE_MOCK_API) return mock.update(id, patch);
    const { data } = await apiClient.put<FeaturedSlide>(`${ENDPOINT}/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return mock.remove(id);
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
