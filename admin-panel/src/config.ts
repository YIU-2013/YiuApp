/**
 * Backend hazır olana kadar tüm servisler mock veriyle çalışır.
 * Backend geldiğinde `.env`'de `VITE_USE_MOCK_API=false` yapmak yeterli —
 * servis dosyalarındaki API çağrıları zaten hazır (bkz. services/*.ts).
 */
export const USE_MOCK_API = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';
