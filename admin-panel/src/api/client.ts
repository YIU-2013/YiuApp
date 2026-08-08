import axios from 'axios';

const TOKEN_STORAGE_KEY = 'yiu_admin_token';

/**
 * Merkezi Axios instance — backend-api hazır olduğunda /api/admin/* ve
 * /api/auth/* endpointlerine buradan bağlanılacak.
 *
 * Bu iskelet commit'inde backend henüz canlı değil; sayfalar bu client'ı
 * import edebilir ama gerçek bir istek atmak (backend hazır olana kadar)
 * hata dönecektir — bu beklenen bir durumdur.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.warn('[API Error]', error.config?.url, error.response?.status);
    }
    return Promise.reject(error);
  },
);

export const authTokenStorage = {
  get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};
