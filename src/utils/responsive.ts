import { useEffect, useState } from 'react';
import { Dimensions, PixelRatio, Platform, ScaledSize } from 'react-native';

/** Tasarım referans genişliği: 390pt (iPhone 15 Pro / Pixel 7) */
const BASE_WIDTH = 390;

// ─── Canlı ekran boyutu ──────────────────────────────────────────────────────
// Dimensions.get() yalnızca modül yüklenirken bir kez okunursa; rotasyon,
// iPad Split View/Slide Over, Android multi-window veya web pencere resize
// sırasında değerler bayatlar. Bunun yerine bir listener ile güncel tutulur,
// böylece rs()/wp()/hp() her çağrıldığında (örn. render sırasında inline
// kullanımlarda) her zaman güncel genişliği/yüksekliği kullanır.
let current: ScaledSize = Dimensions.get('window');
Dimensions.addEventListener('change', ({ window }) => {
  current = window;
});

/** Ekran genişliğinin yüzdesi */
export const wp = (pct: number): number => (current.width * pct) / 100;

/** Ekran yüksekliğinin yüzdesi */
export const hp = (pct: number): number => (current.height * pct) / 100;

/**
 * Responsive boyutlandırma — base genişliğe göre ölçekler.
 * 0.85x – 1.15x arasında sınırlandırılır (aşırı ölçekleme önlenir).
 */
export const rs = (size: number): number => {
  const ratio = Math.max(0.85, Math.min(1.15, current.width / BASE_WIDTH));
  return Math.round(PixelRatio.roundToNearestPixel(size * ratio));
};

/**
 * NOT: Aşağıdaki sabitler yalnızca modül ilk yüklendiğinde hesaplanır.
 * Ekranın component ömrü boyunca boyut değiştirebileceği durumlarda
 * (rotasyon, iPad multitasking, web resize) bunun yerine useResponsive()
 * hook'unu kullanın — bu sabitler yalnızca ilk render / basit statik
 * kararlar için uygundur.
 */
export const IS_SMALL_DEVICE = current.width < 375;
export const IS_LARGE_DEVICE = current.width >= 428;
export const IS_TABLET = current.width >= 768;
export const SCREEN_W = current.width;
export const SCREEN_H = current.height;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

/**
 * Ekran boyutu değiştiğinde yeniden render tetikleyen reaktif hook.
 *
 * Kolon sayısı, kart genişliği gibi boyuta bağlı layout kararları veren
 * bileşenlerde modül seviyesi sabitler (IS_TABLET, SCREEN_W...) yerine
 * bunu kullanın; aksi halde iPad Split View, Android multi-window veya
 * web pencere resize sırasında layout güncellenmez.
 */
export function useResponsive() {
  const [dims, setDims] = useState<ScaledSize>(() => Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDims(window);
    });
    return () => sub.remove();
  }, []);

  return {
    width: dims.width,
    height: dims.height,
    isSmallDevice: dims.width < 375,
    isLargeDevice: dims.width >= 428,
    isTablet: dims.width >= 768,
    wp: (pct: number) => (dims.width * pct) / 100,
    hp: (pct: number) => (dims.height * pct) / 100,
  };
}
