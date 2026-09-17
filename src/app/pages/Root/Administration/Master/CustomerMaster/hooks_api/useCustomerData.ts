import { useQuery, useQueryClient } from '@tanstack/react-query'

import customerClient from '@/services/customerClient'
import { CustomerFetchedType } from '@/types/customer'

export function useCustomerData(id?: number) {
  const { data, isLoading, error, isError } = useQuery<CustomerFetchedType[], Error>({
    queryKey: id ? ['customers', id] : ['customers'], // ✅ Conditionally adjust query key
    queryFn: async ({ signal }) => {
      if (id !== undefined) {
        // Fetch specific customer
        return await customerClient.getCustomers({ id, signal })
      }
      // Fetch all customers
      return await customerClient.getCustomers({ id: 0, signal })
    },
    staleTime: 5 * 60 * 1000, // ✅ Cache data for 5 minutes
    refetchOnWindowFocus: true, // ✅ Refetch when the window gains focus
    retry: 2, // ✅ Retry twice on failure
    retryDelay: 2000, // ✅ Wait 2 seconds between retries
    enabled: id !== undefined || id === 0, // ✅ Enable only when id is valid or fetching all
    networkMode: 'always',
  })

  return {
    customerData: id !== undefined && id !== 0 ? data?.[0] : data, // ✅ Return first element if id is not 0
    error: isError ? error.message : null,
    isLoading,
  }
}

export function useFetchCustomerMasterById() {
  const queryClient = useQueryClient()

  const fetchCustomerById = async (id: number) => {
    if (!id || id <= 0) {
      throw new Error('Invalid Customer ID')
    }

    const data = await queryClient.fetchQuery<CustomerFetchedType>({
      queryKey: ['customers', id], // ✅ Use a unique cache key for this query
      queryFn: async ({ signal }) => {
        const response = await customerClient.getCustomers({ id, signal }) // API call to fetch customer
        if (Array.isArray(response) && response.length > 0) {
          return response[0] // ✅ Return the first element if it's an array
        }
        throw new Error('No customer found') // Handle cases where the array is empty
      },
      staleTime: 5 * 60 * 1000, // ✅ Cache for 5 minutes
    })

    return data
  }

  return { fetchCustomerById }
}
