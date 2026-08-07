import { useQuery, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../services/announcementService';

export const ANNOUNCEMENTS_KEY = ['announcements'] as const;

/** Tüm duyuruları getir + cache */
export function useAnnouncements() {
  return useQuery({
    queryKey: ANNOUNCEMENTS_KEY,
    queryFn: ({ signal }) => announcementService.getAll(signal),
    staleTime: 5 * 60 * 1000,   // 5 dakika taze
    gcTime: 60 * 60 * 1000,     // 1 saat bellekte
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10_000),
  });
}

/** Duyuruları arka planda yenile (pull-to-refresh için) */
export function useRefreshAnnouncements() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY });
}
