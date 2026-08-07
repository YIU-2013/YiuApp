import { ExpoConfig, ConfigContext } from 'expo/config';

const APP_ENV = process.env.APP_ENV ?? 'development';
const API_BASE_URL =
  APP_ENV === 'production'
    ? 'https://api.yiu.edu.tr/v1'
    : 'https://dev-api.yiu.edu.tr/v1';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Yiu Mobile App',
  slug: 'yiu-mobile-app',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/images/icon.png',

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yiu.mobileapp',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.yiu.mobileapp',
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  platforms: ['ios', 'android', 'web'],

  // ─── Expo Updates (OTA) ────────────────────────────────────────────────────
  // https://expo.dev/accounts/synsy/projects/yiu-mobile-app
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/c780b3f6-4302-4a2c-b0b6-2c4bbee1551a',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },

  // ─── Expo Plugins ─────────────────────────────────────────────────────────
  plugins: ['expo-secure-store'],

  // ─── Build-time config (expo-constants ile erişim) ───────────────────────
  extra: {
    env: APP_ENV,
    apiBaseUrl: API_BASE_URL,
    sentryDsn: process.env.SENTRY_DSN ?? '',
    eas: { projectId: 'c780b3f6-4302-4a2c-b0b6-2c4bbee1551a' },
  },
  owner: 'synsy',
});
