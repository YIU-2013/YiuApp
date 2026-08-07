import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Config } from '../config/env';

/**
 * Centralised Axios instance.
 * — 10s timeout
 * — Request interceptor for auth headers (token ekleme hazır)
 * — Response interceptor for 401 handling
 */
export const apiClient = axios.create({
  baseURL: Config.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const token = AuthStore.getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // AuthStore.logout(); — token süresi dolmuş
    }
    if (__DEV__) {
      console.warn('[API Error]', error.config?.url, error.response?.status);
    }
    return Promise.reject(error);
  }
);
