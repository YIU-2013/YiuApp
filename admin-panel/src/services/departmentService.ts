import { apiClient } from '../api/client';
import { createMockListResource } from '../api/mockClient';
import { USE_MOCK_API } from '../config';
import type { Faculty, Department } from '../types/models';

// ─── Faculties ────────────────────────────────────────────────────────────
const FACULTY_ENDPOINT = '/api/admin/faculties';

const FACULTY_SEED: Faculty[] = [
  {
    id: 'fac-1',
    name: 'Tıp Fakültesi',
    description: 'Uluslararası standartlarda tıp eğitimi veren, araştırma odaklı ve modern laboratuvar altyapısına sahip öncü fakültemiz.',
    icon: 'medical-outline',
    dean: 'Prof. Dr. M. Zülküf Önal',
    contactEmail: 'tip@yiu.edu.tr',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'fac-2',
    name: 'Diş Hekimliği Fakültesi',
    description: 'Modern klinik simülasyon üniteleri ve uzman akademik kadrosuyla ağız ve diş sağlığı alanında yetkin hekimler yetiştiren fakültemiz.',
    icon: 'happy-outline',
    dean: 'Prof. Dr. H. Hüseyin Köşger',
    contactEmail: 'dis@yiu.edu.tr',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'fac-3',
    name: 'Sağlık Bilimleri Fakültesi',
    description: 'Sağlık sektörünün ihtiyaç duyduğu uzman fizyoterapist, hemşire, diyetisyen ve dil konuşma terapistlerini yetiştiren çok disiplinli fakültemiz.',
    icon: 'pulse-outline',
    dean: 'Prof. Dr. Fatma Öz',
    contactEmail: 'sbf@yiu.edu.tr',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'fac-4',
    name: 'Sağlık Hizmetleri Meslek Yüksekokulu',
    description: 'Sağlık kurumlarının ara eleman ihtiyacını karşılamak üzere 2 yıllık pratik ağırlıklı ön lisans eğitimi sunan yüksekokulumuz.',
    icon: 'clipboard-outline',
    dean: 'Prof. Dr. Rona Aslan',
    contactEmail: 'shmyo@yiu.edu.tr',
    active: true,
    sortOrder: 4,
  },
];

const facultyMock = createMockListResource<Faculty>('yiu_admin_faculties', FACULTY_SEED);

export const facultyService = {
  list: async (): Promise<Faculty[]> => {
    if (USE_MOCK_API) return facultyMock.list();
    const { data } = await apiClient.get<Faculty[]>(FACULTY_ENDPOINT);
    return data;
  },
  create: async (input: Omit<Faculty, 'id'>): Promise<Faculty> => {
    if (USE_MOCK_API) return facultyMock.create(input);
    const { data } = await apiClient.post<Faculty>(FACULTY_ENDPOINT, input);
    return data;
  },
  update: async (id: string, patch: Partial<Omit<Faculty, 'id'>>): Promise<Faculty> => {
    if (USE_MOCK_API) return facultyMock.update(id, patch);
    const { data } = await apiClient.put<Faculty>(`${FACULTY_ENDPOINT}/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return facultyMock.remove(id);
    await apiClient.delete(`${FACULTY_ENDPOINT}/${id}`);
  },
};

// ─── Departments ──────────────────────────────────────────────────────────
const DEPARTMENT_ENDPOINT = '/api/admin/departments';

const DEPARTMENT_SEED: Department[] = [
  { id: 'dept-1-1', facultyId: 'fac-1', name: 'Tıp Pr. (Türkçe)', degreeType: 'Lisans', duration: 6, language: 'Türkçe', description: '6 yıllık temel ve klinik tıp eğitimi programı.', active: true, sortOrder: 1 },
  { id: 'dept-1-2', facultyId: 'fac-1', name: 'Tıp Pr. (İngilizce)', degreeType: 'Lisans', duration: 6, language: 'İngilizce', description: 'Tümüyle İngilizce yürütülen 6 yıllık tıp eğitimi programı.', active: true, sortOrder: 2 },
  { id: 'dept-2-1', facultyId: 'fac-2', name: 'Diş Hekimliği Pr.', degreeType: 'Lisans', duration: 5, language: 'Türkçe', description: '5 yıllık lisans programı, preklinik ve klinik staj eğitimi.', active: true, sortOrder: 1 },
  { id: 'dept-3-1', facultyId: 'fac-3', name: 'Hemşirelik', degreeType: 'Lisans', duration: 4, language: 'Türkçe', description: 'Koruyucu ve tedavi edici sağlık hizmetlerinde profesyonel hemşireler yetiştirir.', active: true, sortOrder: 1 },
  { id: 'dept-3-2', facultyId: 'fac-3', name: 'Beslenme ve Diyetetik', degreeType: 'Lisans', duration: 4, language: 'Türkçe', description: 'Uzman diyetisyenler yetiştiren lisans programı.', active: true, sortOrder: 2 },
  { id: 'dept-4-1', facultyId: 'fac-4', name: 'İlk ve Acil Yardım (Paramedik)', degreeType: 'Ön Lisans', duration: 2, language: 'Türkçe', description: 'Hastane öncesi acil bakım eğitimi veren 2 yıllık program.', active: true, sortOrder: 1 },
];

const departmentMock = createMockListResource<Department>('yiu_admin_departments', DEPARTMENT_SEED);

export const departmentService = {
  list: async (): Promise<Department[]> => {
    if (USE_MOCK_API) return departmentMock.list();
    const { data } = await apiClient.get<Department[]>(DEPARTMENT_ENDPOINT);
    return data;
  },
  create: async (input: Omit<Department, 'id'>): Promise<Department> => {
    if (USE_MOCK_API) return departmentMock.create(input);
    const { data } = await apiClient.post<Department>(DEPARTMENT_ENDPOINT, input);
    return data;
  },
  update: async (id: string, patch: Partial<Omit<Department, 'id'>>): Promise<Department> => {
    if (USE_MOCK_API) return departmentMock.update(id, patch);
    const { data } = await apiClient.put<Department>(`${DEPARTMENT_ENDPOINT}/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return departmentMock.remove(id);
    await apiClient.delete(`${DEPARTMENT_ENDPOINT}/${id}`);
  },
};
