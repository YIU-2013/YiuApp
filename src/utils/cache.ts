import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@yiu:cache:';

interface CacheEntry<T> {
  data: T;
  ts: number;
  ttl?: number; // milliseconds
}

/**
 * Lightweight AsyncStorage cache utility.
 * Provides TTL-based expiry and silent error handling
 * so network failures never crash the app.
 */
export const Cache = {
  async set<T>(key: string, data: T, ttlMs?: number): Promise<void> {
    try {
      const entry: CacheEntry<T> = { data, ts: Date.now(), ttl: ttlMs };
      await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(entry));
    } catch {
      // Storage full or unavailable — non-fatal
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(`${PREFIX}${key}`);
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (entry.ttl && Date.now() - entry.ts > entry.ttl) {
        void AsyncStorage.removeItem(`${PREFIX}${key}`); // async purge, no await
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${PREFIX}${key}`);
    } catch {}
  },

  async clear(): Promise<void> {
    try {
      const all = await AsyncStorage.getAllKeys();
      const cacheKeys = all.filter(k => k.startsWith(PREFIX));
      if (cacheKeys.length) await AsyncStorage.multiRemove(cacheKeys);
    } catch {}
  },
} as const;
