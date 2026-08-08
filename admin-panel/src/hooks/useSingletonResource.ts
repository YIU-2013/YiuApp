import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface SingletonService<T> {
  get: () => Promise<T>;
  update: (patch: Partial<T>) => Promise<T>;
}

/** ContactInfo gibi tekil/ayar benzeri kaynaklar için — bkz. useCrudResource. */
export function useSingletonResource<T>(queryKey: string, service: SingletonService<T>) {
  const qc = useQueryClient();
  const key = [queryKey];

  const query = useQuery({ queryKey: key, queryFn: service.get });

  const updateMutation = useMutation({
    mutationFn: (patch: Partial<T>) => service.update(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    update: updateMutation.mutateAsync,
    isMutating: updateMutation.isPending,
  };
}
