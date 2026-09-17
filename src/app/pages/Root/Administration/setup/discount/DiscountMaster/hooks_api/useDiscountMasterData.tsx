import { useQuery } from '@tanstack/react-query'

import discountSetupClient from '@/services/discountSetupClient'
import { FetchedDiscountType } from '@/types/discountSetup'



export function useDiscountMasterData() {
  const {
    data: DiscountMasterData,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedDiscountType[], Error>({
    queryKey: ['DiscountMaster'],
    queryFn: async ({signal}) => {
      const data = await discountSetupClient.getDiscount({ signal })
      return data
    },
    networkMode:"always",
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry:2,
    retryDelay:2000,
  })
  return { DiscountMasterData, isLoading, error: isError ? error?.message : null }
}
