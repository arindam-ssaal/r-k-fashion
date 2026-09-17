import { useQuery } from '@tanstack/react-query'

import salesPersonClient from '@/services/salesPersonClient'
import { FetchedSalesPersonType } from '@/types/salesPerson'

export function useSalesPersonData() {
  const {
    data: salesPersonData,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedSalesPersonType[], Error>({
    queryKey: ['salesPerson'],
    queryFn: async ({signal}) => {
      const data = await salesPersonClient.getSalesPerson({signal})
      return data
    },
    networkMode:"always",
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry:2,
    retryDelay:2000,
  })
  return { salesPersonData, isLoading, error: isError ? error?.message : null }
}
