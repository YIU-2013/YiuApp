import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CrudService<T, TInput> {
  list: () => Promise<T[]>;
  create: (input: TInput) => Promise<T>;
  update: (id: string, patch: Partial<TInput>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

/**
 * 8 CRUD sayfasında (Slider/Announcements/Events/Opportunities/CampusContents/
 * Faculties/Departments) tekrarlanan React Query boilerplate'ini (list query +
 * create/update/remove mutation + cache invalidation) tek noktadan yönetir.
 * Backend'e geçişte servis dosyaları değişecek, bu hook hiç değişmeyecek.
 */
export function useCrudResource<T extends { id: string }, TInput = Omit<T, 'id'>>(
  queryKey: string,
  service: CrudService<T, TInput>,
) {
  const qc = useQueryClient();
  const key = [queryKey];

  const query = useQuery({ queryKey: key, queryFn: service.list });

  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  const createMutation = useMutation({
    mutationFn: (input: TInput) => service.create(input),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<TInput> }) => service.update(id, patch),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: invalidate,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    update: (id: string, patch: Partial<TInput>) => updateMutation.mutateAsync({ id, patch }),
    remove: removeMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || removeMutation.isPending,
  };
}
