import { useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/departmentService';

export const DEPARTMENTS_KEY = ['departments'] as const;

/** Tüm fakülte ve bölümleri getir + cache */
export function useDepartments() {
  return useQuery({
    queryKey: DEPARTMENTS_KEY,
    queryFn: ({ signal }) => departmentService.getAll(signal),
    staleTime: 10 * 60 * 1000,  // 10 dakika taze
    gcTime: 60 * 60 * 1000,     // 1 saat bellekte
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  });
}

/** Bölümleri arka planda yenile (pull-to-refresh için) */
export function useRefreshDepartments() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: DEPARTMENTS_KEY });
}
