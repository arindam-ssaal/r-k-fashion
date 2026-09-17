import { useQuery, useQueryClient } from '@tanstack/react-query'

import DiscountAssortmentClient from '@/services/DiscountAssortmentClient'
import { FetchedAssortmentType } from '@/types/assortment'

export function useAssortmentDataById(id: number | null, type: 'D' | 'S' | 'P') {
  const {
    data: assortmentData,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedAssortmentType>({
    queryKey: ['assortment', { assortmentID: id, assortmentType: type }], // ✅ Unique key for caching and refetching
    queryFn: async () => {
      if (id === null) throw new Error('Invalid Assortment ID')
      return await DiscountAssortmentClient.getAssortmentById({ id })
    },
    enabled: !!id, // ✅ ID jab tak valid nahi hai tab tak fetch nahi karega
    staleTime: 3 * 60 * 1000, // ✅ 5 min tak data fresh rahega
  })

  return { assortmentData, isLoading, error: isError ? error.message : null }
}

export function useFetchAssortmentDataById(type: 'D' | 'S' | 'P') {
  const queryClient = useQueryClient()

  const fetchAssortmentDataById = async (id: number) => {
    if (!id) throw new Error('Invalid SalesPerson ID')

    const data = await queryClient.fetchQuery<FetchedAssortmentType>({
      queryKey: ['assortment', { assortmentID: id, assortmentType: type }],
      queryFn: async () => await DiscountAssortmentClient.getAssortmentById({ id }),
      staleTime: 5 * 60 * 1000, // ✅ 5 min cache
    })

    return data
  }

  return { fetchAssortmentDataById }
}
