import Constants from 'expo-constants';
import { APP_ENV, API_BASE_URL, SENTRY_DSN } from '@env';

/**
 * Unified app configuration.
 *
 * Kaynak önceliği:
 *   1. react-native-dotenv (@env) — babel transform-time injection
 *   2. expo-constants extra    — app.config.ts build-time injection (fallback)
 *   3. Hardcoded defaults      — son çare
 */
const extra = (Constants.expoConfig?.extra ?? {}) as {
  env?: string;
  apiBaseUrl?: string;
  sentryDsn?: string;
};

const appEnv = APP_ENV ?? extra.env ?? 'development';

export const Config = {
  /** 'development' | 'staging' | 'production' */
  env: appEnv as 'development' | 'staging' | 'production',

  /** API kök URL */
  apiBaseUrl: API_BASE_URL ?? extra.apiBaseUrl ?? 'https://api.yiu.edu.tr/v1',

  /** Sentry DSN — boş bırakılırsa Sentry başlatılmaz */
  sentryDsn: SENTRY_DSN ?? extra.sentryDsn ?? '',

  /** Kısayollar */
  isDev: appEnv === 'development' || __DEV__,
  isStaging: appEnv === 'staging',
  isProd: appEnv === 'production',
} as const;
