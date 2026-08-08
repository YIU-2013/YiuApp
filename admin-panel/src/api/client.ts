import axios from 'axios';
import { API_BASE_URL } from '../config';

const TOKEN_STORAGE_KEY = 'yiu_admin_token';

/**
 * Merkezi Axios instance — backend-api hazır olduğunda /api/admin/* ve
 * /api/auth/* endpointlerine buradan bağlanılacak.
 *
 * `USE_MOCK_API` true olduğu sürece (varsayılan) servisler bu client'ı hiç
 * çağırmaz — bkz. src/api/mockClient.ts ve src/services/*.ts.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
