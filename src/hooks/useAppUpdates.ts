import { useEffect } from 'react';
import * as Updates from 'expo-updates';

/**
 * OTA (Over-The-Air) güncelleme hook.
 *
 * Uygulama açılışında yeni bir EAS Update olup olmadığını kontrol eder.
 * Güncelleme varsa: indir ve yeniden yükle (kullanıcı müdahalesi gerekmez).
 *
 * Çalıştığı durumlar:
 *   ✅ EAS production build
 *   ✅ EAS preview build
 *   ❌ Expo Go (checkForUpdateAsync throws)
 *   ❌ __DEV__ mode (skip)
 */
export function useAppUpdates(): void {
  useEffect(() => {
    // Expo Go ve development'ta güncelleme kontrolü yok
    if (__DEV__) return;

    const checkAndApply = async (): Promise<void> => {
      try {
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (!isAvailable) return;

        await Updates.fetchUpdateAsync();

        // Küçük gecikme — aktif network işlemlerinin tamamlanması için
        await new Promise(resolve => setTimeout(resolve, 500));
        await Updates.reloadAsync();
      } catch {
        // Güncelleme hatası fatal değil — mevcut versiyon çalışmaya devam eder
      }
    };

    void checkAndApply();
  }, []); // Sadece mount'ta çalış
}
