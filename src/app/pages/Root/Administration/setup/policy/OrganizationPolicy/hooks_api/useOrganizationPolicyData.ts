import { useQuery } from '@tanstack/react-query'

import organizationPolicyClient from '@/services/organizationPolicyClient'
import { FetchedOrganizationPolicyType } from '@/types/organizationPolicy'

export function useOrganizationPolicyData() {
  const {
    data: organizationPolicyData,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedOrganizationPolicyType[], Error>({
    queryKey: ['organizationPolicy'],
    queryFn: async ({signal}) => {
      const data = await organizationPolicyClient.getOrganizationPolicies({signal})
      return data
    },
    networkMode:"always",
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
    refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
    retry:2,
    retryDelay:2000,
  })
  return { organizationPolicyData, isLoading, error: isError ? error?.message : null }
}
