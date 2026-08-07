const MONTHS_TR = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
] as const;

/**
 * "12 Haz 2026" gibi kısa Türkçe tarih etiketi üretir.
 * `offsetDays` negatifse geçmişte, pozitifse gelecekte bir tarih döner.
 *
 * Mock veri servislerinde sabit yıl (örn. "2024") hardcode etmek yerine
 * kullanılır — böylece uygulama ne zaman açılırsa açılsın duyuru/etkinlik
 * tarihleri her zaman güncel/mantıklı görünür (duyuru: yakın geçmiş,
 * etkinlik: yakın gelecek).
 */
export function relativeDateLabel(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
}

/** Etkinlik kartlarının {day, month, year} alanları için — month büyük harf */
export function relativeEventDate(offsetDays: number): { day: string; month: string; year: string } {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return {
    day: String(d.getDate()),
    month: MONTHS_TR[d.getMonth()].toUpperCase(),
    year: String(d.getFullYear()),
  };
}
