import { useQuery, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';

export const EVENTS_KEY = ['events'] as const;

/** Tüm etkinlikleri getir + cache */
export function useEvents() {
  return useQuery({
    queryKey: EVENTS_KEY,
    queryFn: ({ signal }) => eventService.getAll(signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10_000),
  });
}

/** Etkinlikleri arka planda yenile */
export function useRefreshEvents() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: EVENTS_KEY });
}
