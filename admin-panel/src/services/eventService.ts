import { apiClient } from '../api/client';
import { createMockListResource } from '../api/mockClient';
import { USE_MOCK_API } from '../config';
import type { Event } from '../types/models';

const ENDPOINT = '/api/admin/events';

const SEED: Event[] = [
  {
    id: 'evt-1',
    title: 'Tıp Etiği Konferansı',
    description: 'Sağlık profesyonelleri ve akademisyenlerin bir araya geleceği konferansta tıp etiğinin güncel sorunları ele alınacaktır.',
    location: 'Konferans Salonu A',
    eventDate: '2026-08-12T14:00:00.000Z',
    category: 'Akademik',
    active: true,
  },
  {
    id: 'evt-2',
    title: 'Ar-Ge Tanıtım Günü',
    description: 'Üniversitemiz Araştırma-Geliştirme birimlerinin proje ve çalışmalarını tanıttığı yıllık etkinlik.',
    location: 'Merkez Lab',
    eventDate: '2026-08-16T10:00:00.000Z',
    category: 'Araştırma',
    active: true,
  },
  {
    id: 'evt-3',
    title: 'Kariyer Günleri',
    description: 'Türkiye\'nin önde gelen sağlık kuruluşlarının katılımıyla düzenlenen Kariyer Günleri.',
    location: 'Spor Salonu',
    eventDate: '2026-08-23T09:00:00.000Z',
    category: 'Kariyer',
    active: true,
  },
  {
    id: 'evt-4',
    title: 'Uluslararası Öğrenci Tanışma Töreni',
    description: 'Bu akademik yılda üniversitemize katılacak uluslararası öğrencileri tanıma ve hoş geldin etkinliği.',
    location: 'Açık Amfi',
    eventDate: '2026-08-29T11:00:00.000Z',
    category: 'Sosyal',
    active: false,
  },
];

const mock = createMockListResource<Event>('yiu_admin_events', SEED);

export const eventService = {
  list: async (): Promise<Event[]> => {
    if (USE_MOCK_API) return mock.list();
    const { data } = await apiClient.get<Event[]>(ENDPOINT);
    return data;
  },
  create: async (input: Omit<Event, 'id'>): Promise<Event> => {
    if (USE_MOCK_API) return mock.create(input);
    const { data } = await apiClient.post<Event>(ENDPOINT, input);
    return data;
  },
  update: async (id: string, patch: Partial<Omit<Event, 'id'>>): Promise<Event> => {
    if (USE_MOCK_API) return mock.update(id, patch);
    const { data } = await apiClient.put<Event>(`${ENDPOINT}/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return mock.remove(id);
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
