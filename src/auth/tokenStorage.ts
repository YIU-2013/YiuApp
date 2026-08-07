import * as SecureStore from 'expo-secure-store';

const KEYS = {
  TOKEN: 'yiu_auth_token',
  USER: 'yiu_auth_user',
} as const;

/**
 * Güvenli token/kullanıcı depolama (expo-secure-store).
 *
 * iOS: Keychain (AES-256 encrypted, hardware-backed)
 * Android: Keystore system (hardware-backed when available)
 *
 * WHEN_UNLOCKED_THIS_DEVICE_ONLY:
 *   - Cihaz kilitli iken erişilemez (background fetch dahil)
 *   - iCloud/Android backup'a dahil edilmez
 *   - Uygulama kaldırılınca silinir
 */
const STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const TokenStorage = {
  // ─── Token ──────────────────────────────────────────────────────────────
  getToken: (): Promise<string | null> =>
    SecureStore.getItemAsync(KEYS.TOKEN),

  setToken: (token: string): Promise<void> =>
    SecureStore.setItemAsync(KEYS.TOKEN, token, STORE_OPTIONS),

  removeToken: (): Promise<void> =>
    SecureStore.deleteItemAsync(KEYS.TOKEN),

  // ─── User ────────────────────────────────────────────────────────────────
  getUser: async <T>(): Promise<T | null> => {
    const raw = await SecureStore.getItemAsync(KEYS.USER);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; }
    catch { return null; }
  },

  setUser: <T>(user: T): Promise<void> =>
    SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user), STORE_OPTIONS),

  removeUser: (): Promise<void> =>
    SecureStore.deleteItemAsync(KEYS.USER),

  // ─── Toplu temizleme (logout) ────────────────────────────────────────────
  clearAll: (): Promise<[void, void]> =>
    Promise.all([
      SecureStore.deleteItemAsync(KEYS.TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER),
    ]),
} as const;
