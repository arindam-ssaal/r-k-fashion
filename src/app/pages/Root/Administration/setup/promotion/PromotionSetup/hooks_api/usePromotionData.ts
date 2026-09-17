import { useQuery, useQueryClient } from '@tanstack/react-query'

import PromotionSetupClient from '@/services/PromotionSetupClient'
import { FetchedPromotionType } from '@/types/Promotion'

export function usePromotionData(id?: number) {
  const { data, isLoading, error, isError } = useQuery<FetchedPromotionType[], Error>({
    queryKey: id ? ['promotion', id] : ['promotion'], // ✅ Conditionally adjust query key
    queryFn: async ({ signal }) => {
      if (id !== undefined) {
        // Fetch specific customer
        return await PromotionSetupClient.getPromotion({ id, signal })
      }
      // Fetch all customers
      return await PromotionSetupClient.getPromotion({ id: 0, signal })
    },
    staleTime: 5 * 60 * 1000, // ✅ Cache data for 5 minutes
    refetchOnWindowFocus: true, // ✅ Refetch when the window gains focus
    retry: 2, // ✅ Retry twice on failure
    retryDelay: 2000, // ✅ Wait 2 seconds between retries
    enabled: id !== undefined || id === 0, // ✅ Enable only when id is valid or fetching all
    networkMode: 'always',
  })

  return {
    promotionData:  data, // ✅ Return first element if id is not 0
    error: isError ? error.message : null,
    isLoading,
  }
}




export function useFetchPromotionMasterById() {
    const queryClient = useQueryClient();
  
    const fetchPromotionById = async (id: number) => {
      if (!id) throw new Error('Invalid PettyCash ID');
  
      const data = await queryClient.fetchQuery<FetchedPromotionType>({
        queryKey: ['promotion', id],
        queryFn: async ({signal}) => await PromotionSetupClient.getPromotionByID({ id,signal }),
        staleTime: 0,  // ✅ 5 min cache
      });
  
      return data;
    };
  
    return { fetchPromotionById };
  }