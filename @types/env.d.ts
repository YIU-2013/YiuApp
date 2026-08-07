/**
 * TypeScript declarations for @env module (react-native-dotenv).
 *
 * Bu dosya, '.env*' dosyalarındaki değişkenlerin TypeScript tarafından
 * tanınmasını sağlar. Yeni bir env değişkeni eklendiğinde buraya da ekleyin.
 */
declare module '@env' {
  /** 'development' | 'staging' | 'production' */
  export const APP_ENV: string;
  /** Axios base URL — env'e göre dev/prod seçilir */
  export const API_BASE_URL: string;
  /** Sentry DSN — production'da dolu, dev'de boş bırakın */
  export const SENTRY_DSN: string;
}
