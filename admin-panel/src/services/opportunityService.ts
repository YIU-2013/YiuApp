import { apiClient } from '../api/client';
import { createMockListResource } from '../api/mockClient';
import { USE_MOCK_API } from '../config';
import type { Opportunity } from '../types/models';

const ENDPOINT = '/api/admin/opportunities';

const SEED: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Öğrenci Kimlik Kartı İndirimleri',
    description: 'YİÜ öğrenci kimlik kartınızla şehir içi ulaşımda, kırtasiye ve kitabevlerinde özel indirim oranlarından faydalanabilirsiniz.',
    category: 'İndirim',
    badge: 'Fırsat',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'opp-2',
    title: 'Kütüphane & Dijital Kaynak Erişimi',
    description: 'Ulusal ve uluslararası akademik veritabanlarına, e-kitap ve makale arşivlerine kampüs dışından da erişim imkanı.',
    category: 'Kampüs Fırsatı',
    badge: 'Kampüs',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'opp-3',
    title: 'Anlaşmalı Sağlık Merkezleri',
    description: 'Üniversitemizle protokollü özel poliklinik ve optik merkezlerinde öğrencilere özel muayene ve ürün indirimleri.',
    category: 'Anlaşmalı Kurum',
    badge: 'Anlaşmalı',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'opp-4',
    title: 'Öğrenci Kulüpleri ve Topluluklar',
    description: '20\'den fazla öğrenci kulübüyle sosyal, sanatsal ve akademik etkinliklere katılarak kampüs hayatının bir parçası olun.',
    category: 'Sosyal İmkan',
    badge: 'Sosyal',
    active: false,
    sortOrder: 4,
  },
];

const mock = createMockListResource<Opportunity>('yiu_admin_opportunities', SEED);

export const opportunityService = {
  list: async (): Promise<Opportunity[]> => {
    if (USE_MOCK_API) return mock.list();
    const { data } = await apiClient.get<Opportunity[]>(ENDPOINT);
    return data;
  },
  create: async (input: Omit<Opportunity, 'id'>): Promise<Opportunity> => {
    if (USE_MOCK_API) return mock.create(input);
    const { data } = await apiClient.post<Opportunity>(ENDPOINT, input);
    return data;
  },
  update: async (id: string, patch: Partial<Omit<Opportunity, 'id'>>): Promise<Opportunity> => {
    if (USE_MOCK_API) return mock.update(id, patch);
    const { data } = await apiClient.put<Opportunity>(`${ENDPOINT}/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return mock.remove(id);
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
