import { apiClient } from '../api/client';
import { createMockSingletonResource } from '../api/mockClient';
import { USE_MOCK_API } from '../config';
import type { ContactInfo } from '../types/models';

const ENDPOINT = '/api/admin/contact';

const SEED: ContactInfo = {
  generalPhone: '0 (312) 329 10 00',
  generalEmail: 'info@yiu.edu.tr',
  address: 'Yüksek İhtisas Üniversitesi, Ankara',
  mapUrl: '',
  studentAffairsPhone: '0 (312) 329 10 05',
  studentAffairsEmail: 'ogrenciisleri@yiu.edu.tr',
  supportText:
    'Kayıt, akademik takvim ve kampüs hayatıyla ilgili sorularında Öğrenci İşleri Daire Başkanlığı sana yardımcı olmaktan mutluluk duyar.',
};

const mock = createMockSingletonResource<ContactInfo>('yiu_admin_contact_info', SEED);

export const contactService = {
  get: async (): Promise<ContactInfo> => {
    if (USE_MOCK_API) return mock.get();
    const { data } = await apiClient.get<ContactInfo>(ENDPOINT);
    return data;
  },
  update: async (patch: Partial<ContactInfo>): Promise<ContactInfo> => {
    if (USE_MOCK_API) return mock.update(patch);
    const { data } = await apiClient.put<ContactInfo>(ENDPOINT, patch);
    return data;
  },
};
