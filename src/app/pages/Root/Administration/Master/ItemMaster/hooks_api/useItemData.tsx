import { useQuery } from '@tanstack/react-query'

import itemsClients from '@/services/itemsClients'
import { FetchedItemMaster } from '@/types/item'

export function useItemData() {
  const {
    data: itemmasterData,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedItemMaster[], Error>({
    queryKey: ['itemMaster'],
    queryFn: async ({ signal }) => {
      const data = await itemsClients.getAllItems({ signal })
      return data
    },
    networkMode: 'always',
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry: 2,
    retryDelay: 2000,
  })
  return { itemmasterData, isLoading, error: isError ? error?.message : null }
}
