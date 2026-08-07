import * as Sentry from '@sentry/react-native';
import { Config } from '../config/env';

/**
 * Sentry başlatma.
 * Sadece production build + geçerli DSN varlığında aktif olur.
 * Expo Go'da ve dev build'lerinde devre dışı — console.error yeterli.
 *
 * Tam native crash reporting için:
 *   1. Sentry.io'da proje oluşturun
 *   2. DSN'yi .env.production dosyasına ekleyin
 *   3. app.config.ts'deki Sentry plugin satırını uncomment edin
 *   4. EAS build çalıştırın
 */
export function initSentry(): void {
  if (!Config.isProd || !Config.sentryDsn) return;

  Sentry.init({
    dsn: Config.sentryDsn,
    environment: Config.env,
    tracesSampleRate: 0.15,  // %15 trace örneği — production için dengeli
    enableNative: false,      // true → native crash için dev build gerektirir
    debug: false,
    beforeSend(event) {
      // Kişisel veri filtreleme — KVKK uyumu için
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
  });
}

/**
 * Hata yakalama helper.
 * try/catch bloklarında kullanın.
 */
export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!Config.isProd) {
    console.error('[captureError]', error, context);
    return;
  }
  Sentry.withScope(scope => {
    if (context) scope.setExtras(context);
    Sentry.captureException(error);
  });
}

export { Sentry };
