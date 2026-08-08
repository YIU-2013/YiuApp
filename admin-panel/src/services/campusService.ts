import { apiClient } from '../api/client';
import { createMockListResource } from '../api/mockClient';
import { USE_MOCK_API } from '../config';
import type { CampusContent } from '../types/models';

const ENDPOINT = '/api/admin/campus';

const SEED: CampusContent[] = [
  {
    id: 'camp-1',
    title: 'Kütüphane',
    description: 'Hafta içi 08:00–20:00, Cumartesi 10:00–18:00 saatleri arasında hizmet veriyor. Sessiz çalışma alanları ve grup çalışma odaları mevcuttur.',
    icon: 'library-outline',
    category: 'Kütüphane',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'camp-2',
    title: 'Yemekhane',
    description: 'Öğle arası 11:30–14:30, akşam 17:00–19:30 saatleri arasında ana yemekhane ve kafeteryalarımızdan faydalanabilirsin.',
    icon: 'restaurant-outline',
    category: 'Yemekhane',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'camp-3',
    title: 'Kulüpler',
    description: '20\'den fazla öğrenci kulübüyle sosyal, sanatsal ve akademik etkinliklere katıl; kampüs hayatının aktif bir parçası ol.',
    icon: 'people-outline',
    category: 'Kulüpler',
    sortOrder: 3,
    active: true,
  },
  {
    id: 'camp-4',
    title: 'Ulaşım',
    description: 'Kampüs servisleri şehir merkezinden düzenli seferler yapar. Güncel güzergah ve saatler için servis noktalarındaki panoları kontrol et.',
    icon: 'bus-outline',
    category: 'Ulaşım',
    sortOrder: 4,
    active: true,
  },
  {
    id: 'camp-5',
    title: 'Sosyal Alanlar',
    description: 'Kampüs içi açık ve kapalı sosyal alanlarda arkadaşlarınla vakit geçir, etkinliklere katıl.',
    icon: 'sunny-outline',
    category: 'Sosyal Alanlar',
    sortOrder: 5,
    active: false,
  },
];

const mock = createMockListResource<CampusContent>('yiu_admin_campus_contents', SEED);

export const campusService = {
  list: async (): Promise<CampusContent[]> => {
    if (USE_MOCK_API) return mock.list();
    const { data } = await apiClient.get<CampusContent[]>(ENDPOINT);
    return data;
  },
  create: async (input: Omit<CampusContent, 'id'>): Promise<CampusContent> => {
    if (USE_MOCK_API) return mock.create(input);
    const { data } = await apiClient.post<CampusContent>(ENDPOINT, input);
    return data;
  },
  update: async (id: string, patch: Partial<Omit<CampusContent, 'id'>>): Promise<CampusContent> => {
    if (USE_MOCK_API) return mock.update(id, patch);
    const { data } = await apiClient.put<CampusContent>(`${ENDPOINT}/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return mock.remove(id);
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
