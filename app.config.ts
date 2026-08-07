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
  // EAS dashboard'dan projectId'yi alın:
  // https://expo.dev/accounts/[account]/projects/yiu-mobile-app
  //updates: {
   // fallbackToCacheTimeout: 0,
    // url: 'https://u.expo.dev/YOUR_PROJECT_ID', // EAS kurulduktan sonra ekleyin
  //},
 // runtimeVersion: {
  //  policy: 'appVersion',
//  },

  // ─── Expo Plugins ─────────────────────────────────────────────────────────
  plugins: ['expo-secure-store'],

  // ─── Build-time config (expo-constants ile erişim) ───────────────────────
  extra: {
    env: APP_ENV,
    apiBaseUrl: API_BASE_URL,
    sentryDsn: process.env.SENTRY_DSN ?? '',
    // EAS kurulumundan sonra otomatik eklenir:
    // eas: { projectId: 'YOUR_PROJECT_ID' },
  },
});
