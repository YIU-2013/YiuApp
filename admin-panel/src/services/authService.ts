import { apiClient } from '../api/client';
import { USE_MOCK_API } from '../config';
import type { AdminUser } from '../types/models';

const LATENCY_MS = 400;
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS));

/**
 * Development mock kullanıcısı — backend hazır olmadan admin panele giriş
 * yapabilmek için. Backend geldiğinde `login()` gerçek /api/auth/login'e
 * bağlanacak (aşağıdaki else dalı zaten hazır).
 */
const DEV_USER = {
  email: 'admin@yiu.edu.tr',
  password: 'ChangeMe123!',
  profile: {
    id: 'dev-superadmin',
    email: 'admin@yiu.edu.tr',
    name: 'Yönetici',
    role: 'SuperAdmin' as const,
  } satisfies AdminUser,
};

export interface LoginResult {
  token: string;
  user: AdminUser;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResult> => {
    if (USE_MOCK_API) {
      await delay();
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== DEV_USER.email || password !== DEV_USER.password) {
        throw new Error('E-posta veya şifre hatalı.');
      }
      return {
        token: `mock.${btoa(normalizedEmail)}.${Date.now()}`,
        user: DEV_USER.profile,
      };
    }

    const { data } = await apiClient.post<LoginResult>('/api/auth/login', { email, password });
    return data;
  },
};
