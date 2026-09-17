import { useQuery } from '@tanstack/react-query'

import itemsGroupClients from '@/services/ItemGroupClient'
import { FetchedItemPropertiesType } from '@/types/item'

// id ko optional bana diya taaki hum check kar sakein ki kabhi absent ho toh query run na ho.
export function useGetPropertiesByGroupID(id?: number) {
  const {
    data: itemsGroupsProperties,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedItemPropertiesType[], Error>({
    queryKey: ['itemsGroupsProperties', { groupId: id }],
    queryFn: async () => {
      // Agar id valid nahi hai, toh API call ko skip karne ke liye yahan throw kar sakte hain ya return empty result.
      if (id == null) {
        // Yahan aap alternatively empty array return kar sakte ho.
        throw new Error('Group ID is required for fetching item groups')
      }
      const data = await itemsGroupClients.getAllItemsPropertiesByGroupId({ groupId: id })
      return data
    },
    networkMode: 'always',
    staleTime: 5 * 60 * 1000, // 5 minutes cache time
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 2000,
    enabled: !!id, // Sirf tabhi query chalegi jab id truthy ho (agar id undefined ya 0 hai, toh false)
  })

  return { itemsGroupsProperties, isLoading, error: isError ? error?.message : null }
}
