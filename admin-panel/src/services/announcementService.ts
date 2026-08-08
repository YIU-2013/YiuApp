import { apiClient } from '../api/client';
import { createMockListResource } from '../api/mockClient';
import { USE_MOCK_API } from '../config';
import type { Announcement } from '../types/models';

const ENDPOINT = '/api/admin/announcements';

const SEED: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Yaz Okulu Kayıt İşlemleri Hakkında Bilgilendirme',
    summary: 'Yaz okulu kayıtları online sistem üzerinden 15 Haziran tarihinde başlayacaktır.',
    content:
      'Yaz okulu kayıtları, online öğrenci bilgi sistemi üzerinden 15 Haziran tarihi itibarıyla başlayacaktır. Kayıtlar 22 Haziran tarihine kadar tamamlanmalıdır.',
    category: 'AKADEMİK',
    publishedAt: '2026-08-01T09:00:00.000Z',
    pinned: true,
    active: true,
  },
  {
    id: 'ann-2',
    title: 'Mezuniyet Töreni Programı ve Cübbe Dağıtımı',
    summary: 'Mezuniyet töreni katılım listesi ve cübbe dağıtım tarihleri fakülte sekreterliklerince ilan edilmiştir.',
    content:
      'Yüksek İhtisas Üniversitesi Mezuniyet Töreni, 30 Haziran Pazar günü saat 10:00\'da Açık Amfi\'de gerçekleştirilecektir.',
    category: 'ÖNEMLİ',
    publishedAt: '2026-07-29T09:00:00.000Z',
    pinned: false,
    active: true,
  },
  {
    id: 'ann-3',
    title: 'Yeni Akademik Takvim İlan Edildi',
    summary: 'Yeni eğitim öğretim yılına ait akademik takvim Senat onayı ile kesinleşmiştir.',
    content:
      'Üniversite Senatosunun son toplantısında alınan kararla, yeni Eğitim-Öğretim Yılı Akademik Takvimi onaylanmıştır.',
    category: 'AKADEMİK',
    publishedAt: '2026-07-25T09:00:00.000Z',
    pinned: false,
    active: true,
  },
  {
    id: 'ann-4',
    title: 'Kütüphane Yaz Dönemi Çalışma Saatleri',
    summary: 'Üniversite Kütüphanesi yaz dönemi boyunca hafta içi 08:00-20:00 saatleri arasında hizmet verecektir.',
    content:
      'Yüksek İhtisas Üniversitesi Kütüphanesi, 17 Haziran - 6 Eylül tarihleri arasında yaz dönemi çalışma saatlerine geçecektir.',
    category: 'DUYURU',
    publishedAt: '2026-07-20T09:00:00.000Z',
    pinned: false,
    active: false,
  },
];

const mock = createMockListResource<Announcement>('yiu_admin_announcements', SEED);

export const announcementService = {
  list: async (): Promise<Announcement[]> => {
    if (USE_MOCK_API) return mock.list();
    const { data } = await apiClient.get<Announcement[]>(ENDPOINT);
    return data;
  },
  create: async (input: Omit<Announcement, 'id'>): Promise<Announcement> => {
    if (USE_MOCK_API) return mock.create(input);
    const { data } = await apiClient.post<Announcement>(ENDPOINT, input);
    return data;
  },
  update: async (id: string, patch: Partial<Omit<Announcement, 'id'>>): Promise<Announcement> => {
    if (USE_MOCK_API) return mock.update(id, patch);
    const { data } = await apiClient.put<Announcement>(`${ENDPOINT}/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return mock.remove(id);
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
