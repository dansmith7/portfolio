import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // всегда стейл — синхронизация с админкой при переключении вкладок
      gcTime: 1000 * 60 * 10, // 10 минут
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})
