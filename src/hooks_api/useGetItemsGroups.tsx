import { useQuery } from '@tanstack/react-query'

import ItemGroupClient from '@/services/ItemGroupClient'
import { FetchedItemGroupsType } from '@/types/item'

export function useGetAllItemsGroups() {
  const {
    data: itemsGroups,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedItemGroupsType[], Error>({
    queryKey: ['itemsGroups'],
    queryFn: async ({ signal }) => {
      const data = await ItemGroupClient.getAllItemsGroups({ signal })
      return data
    },
    
    networkMode: 'always',
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry: 2,
    retryDelay: 2000,
  })
  return { itemsGroups, isLoading, error: isError ? error?.message : null }
}
