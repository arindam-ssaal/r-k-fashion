import { useQuery } from '@tanstack/react-query'

import paymodeClient from '@/services/paymodeClient'
import { PaymodeFetchedType } from '@/types/paymode'


export function usePaymodeMasterData() {
  const {
    data: paymodeMasterData,
    isLoading,
    error,
    isError,
  } = useQuery<PaymodeFetchedType[], Error>({
    queryKey: ['paymode'],
    queryFn: async ({signal}) => {
      const data = await paymodeClient.getPaymode({signal})
      return data
    },
    networkMode:"always",
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry:2,
    retryDelay:2000,
  })
  return { paymodeMasterData, isLoading, error: isError ? error?.message : null }
}
