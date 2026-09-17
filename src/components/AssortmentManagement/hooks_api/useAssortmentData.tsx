import { useQuery } from '@tanstack/react-query'

import DiscountAssortmentClient from '@/services/DiscountAssortmentClient'
import { FetchedAssortmentType } from '@/types/assortment'

export function useAssortmentData(type: 'D' | 'P' | 'S') {
  const {
    data: assortmentData,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedAssortmentType[], Error>({
    queryKey: ['assortment', { assortmentType: type }],
    queryFn: async ({ signal }) => {
      const data = await DiscountAssortmentClient.getAssortment({ signal, type })
      return data
    },
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry: 2,
    retryDelay: 2000,
  })
  return { assortmentData, isLoading, error: isError ? error?.message : null }
}
