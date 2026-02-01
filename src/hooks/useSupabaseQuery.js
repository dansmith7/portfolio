import { useQuery } from '@tanstack/react-query'

export function useSupabaseQuery(key, queryFn, options = {}) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const result = await queryFn()
      return result
    },
    staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 минут по умолчанию
    ...options,
  })
}
