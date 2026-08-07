import { useQuery, useQueryClient } from '@tanstack/react-query';
import { opportunityService } from '../services/opportunityService';

export const OPPORTUNITIES_KEY = ['opportunities'] as const;

/** Tüm fırsat/ayrıcalıkları getir + cache */
export function useOpportunities() {
  return useQuery({
    queryKey: OPPORTUNITIES_KEY,
    queryFn: ({ signal }) => opportunityService.getAll(signal),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10_000),
  });
}

/** Fırsatları arka planda yenile (pull-to-refresh için) */
export function useRefreshOpportunities() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: OPPORTUNITIES_KEY });
}
