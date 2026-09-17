import { useQuery } from '@tanstack/react-query'

import pettyCashClient from '@/services/pettyCashClient'
import { FetchedPettyCashType } from '@/types/pettyCash'

export function usePettyCashData() {
  const {
    data: pettyCashData,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedPettyCashType[], Error>({
    queryKey: ['pettyCash'],
    queryFn: async ({signal}) => {
      const data = await pettyCashClient.getPettyCash({signal})
      return data
    },
    networkMode:"always",
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry:2,
    retryDelay:2000,
  })
  return { pettyCashData, isLoading, error: isError ? error?.message : null }
}
