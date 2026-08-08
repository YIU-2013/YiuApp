/**
 * Backend hazır olana kadar tüm servislerin kullandığı generic, localStorage
 * tabanlı "sahte REST kaynağı" motoru.
 *
 * Amaç: her servis dosyasının (announcementService, eventService, ...) kendi
 * CRUD + persistence mantığını tekrar tekrar yazmasını önlemek. Servisler bu
 * fabrikayı çağırıp domain'e özel bir arayüzle sarmalar (bkz. services/*.ts).
 *
 * Gerçek yapay gecikme (LATENCY_MS) ve hata olasılığı kasıtlı olarak eklendi
 * ki UI'daki loading/error state'ler gerçekçi biçimde test edilebilsin.
 */

const LATENCY_MS = 350;
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS));

let idCounter = 0;
function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

function readStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage dolu/erişilemez — mock veri kalıcılığı kritik değil, sessizce yut.
  }
}

// ─── Liste tabanlı kaynaklar (Announcements, Events, ...) ──────────────────
export interface MockListResource<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(input: Omit<T, 'id'>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, 'id'>>): Promise<T>;
  remove(id: string): Promise<void>;
}

export function createMockListResource<T extends { id: string }>(
  storageKey: string,
  seed: T[],
): MockListResource<T> {
  let cache: T[] | null = null;
  const load = (): T[] => {
    if (cache === null) cache = readStorage(storageKey, seed);
    return cache;
  };

  return {
    async list() {
      await delay();
      return [...load()];
    },
    async get(id) {
      await delay();
      return load().find((item) => item.id === id) ?? null;
    },
    async create(input) {
      await delay();
      const item = { ...input, id: generateId(storageKey) } as T;
      cache = [item, ...load()];
      writeStorage(storageKey, cache);
      return item;
    },
    async update(id, patch) {
      await delay();
      const items = load();
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error(`Kayıt bulunamadı: ${id}`);
      }
      const updated = { ...items[index], ...patch } as T;
      cache = [...items.slice(0, index), updated, ...items.slice(index + 1)];
      writeStorage(storageKey, cache);
      return updated;
    },
    async remove(id) {
      await delay();
      cache = load().filter((item) => item.id !== id);
      writeStorage(storageKey, cache);
    },
  };
}

// ─── Tekil kaynak (ContactInfo gibi ayar-benzeri, id'siz) ──────────────────
export interface MockSingletonResource<T> {
  get(): Promise<T>;
  update(patch: Partial<T>): Promise<T>;
}

export function createMockSingletonResource<T extends object>(
  storageKey: string,
  seed: T,
): MockSingletonResource<T> {
  let cache: T | null = null;
  const load = (): T => {
    if (cache === null) cache = readStorage(storageKey, seed);
    return cache;
  };

  return {
    async get() {
      await delay();
      return load();
    },
    async update(patch) {
      await delay();
      cache = { ...load(), ...patch };
      writeStorage(storageKey, cache);
      return cache;
    },
  };
}
