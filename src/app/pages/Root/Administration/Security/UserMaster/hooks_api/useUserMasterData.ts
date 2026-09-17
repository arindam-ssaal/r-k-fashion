import { useQuery, useQueryClient } from '@tanstack/react-query'

import userMasterClient from '@/services/userMasterClient'
import { FetchedUserDetail } from '@/types/userMaster'

export function useUserMasterData(id?: number) {
  const { data, isLoading, error, isError } = useQuery<FetchedUserDetail[], Error>({
    queryKey: id ? ['userMaster', id] : ['userMaster'], // ✅ Conditionally adjust query key
    queryFn: async ({ signal }) => {
      if (id !== undefined) {
        // Fetch specific customer
        return await userMasterClient.getUserMaster({ signal }) // ✅ Use id to fetch specific customer
      }
      // Fetch all customers
      return await userMasterClient.getUserMaster({  signal })
    },
    staleTime: 5 * 60 * 1000, // ✅ Cache data for 5 minutes
    refetchOnWindowFocus: true, // ✅ Refetch when the window gains focus
    retry: 2, // ✅ Retry twice on failure
    retryDelay: 2000, // ✅ Wait 2 seconds between retries
    enabled: id !== undefined || id === 0, // ✅ Enable only when id is valid or fetching all
    networkMode: 'always',
  })

  return {
    // userMasterData: id !== undefined && id !== 0 ? data : null, // ✅ Return first element if id is not 0
    userMasterData: data ?? [], // ✅ Return the data directly
    error: isError ? error.message : null,
    isLoading,
  }
}

export function useFetchUserMasterById() {
  const queryClient = useQueryClient()

  const fetchUserMasterById = async (id: number) => {
    if (!id || id <= 0) {
      throw new Error('Invalid User Master ID')
    }

    const data = await queryClient.fetchQuery<FetchedUserDetail>({
      queryKey: ['userMaster', id], // ✅ Use a unique cache key for this query
      queryFn: async ({ signal }) => {
        const response = await userMasterClient.getUserMaster({  signal }) // API call to fetch customer
        if (Array.isArray(response) && response.length > 0) {
          return response[0] // ✅ Return the first element if it's an array
        }
        throw new Error('No User master found') // Handle cases where the array is empty
      },
      staleTime: 5 * 60 * 1000, // ✅ Cache for 5 minutes
    })

    return data
  }

  return { fetchUserMasterById }
}
