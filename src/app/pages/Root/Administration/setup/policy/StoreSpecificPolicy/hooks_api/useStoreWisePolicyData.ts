import { useQuery, useQueryClient } from '@tanstack/react-query';

import StoreWiseClient from '@/services/storeWisePolicyClient'
import { FetchedStoreWisePolicyType } from '@/types/storeWisePolicy'

// ✅ Automatically fetch store policy data
export function useStorePolicyData(storeSpecificId: number, storeId: number) {
  const { data, isLoading, error, isError } = useQuery<FetchedStoreWisePolicyType, Error>({
    queryKey: ['storeWisePolicy', storeSpecificId, storeId],
    queryFn: async ({ signal }) => {
      return await StoreWiseClient.getStoreWisePolicy({ storeSpecificId, storeId, signal });
    },
    enabled: storeSpecificId !== undefined && storeId !== undefined, // ✅ Ensure IDs are valid
    staleTime: 5 * 60 * 1000, // ✅ Cache data for 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 2000,
    networkMode: 'always',
  });

  return {
    storePolicyData: data || null, // ✅ Returns object directly
    error: isError ? error.message : null,
    isLoading,
  };
}

// ✅ Manually fetch store policy by ID (onClick behavior)
export function useFetchStorePolicyById() {
  const queryClient = useQueryClient();

  const fetchPolicyById = async (storeSpecificId: number, storeId: number) => {
    if (!storeSpecificId || storeSpecificId < 0) {
      throw new Error('Invalid Store Policy ID');
    }

    const data = await queryClient.fetchQuery<FetchedStoreWisePolicyType>({
      queryKey: ['storeWisePolicy', storeSpecificId, storeId],
      queryFn: async ({ signal }) => {
        return await StoreWiseClient.getStoreWisePolicy({ storeSpecificId, storeId, signal });
      },
      staleTime: 5 * 60 * 1000, // ✅ Cache for 5 minutes
    });

    return data || null; // ✅ Returns object directly
  };

  return { fetchPolicyById };
}
