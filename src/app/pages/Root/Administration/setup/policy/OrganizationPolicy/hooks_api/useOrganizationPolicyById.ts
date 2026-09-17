import { useQuery,useQueryClient } from "@tanstack/react-query";

import organizationPolicyClient from "@/services/organizationPolicyClient"
import { FetchedOrganizationPolicyType } from "@/types/organizationPolicy"


export function useOrganizationPolicyDataById(id: number | null) {
    const {
      data: organizationPolicybyId,
      isLoading,
      error,
      isError,
    } = useQuery<FetchedOrganizationPolicyType>({
      queryKey: ['organizationPolicy', id], // ✅ Unique key for caching and refetching
      queryFn: async () => {
        if (id === null) throw new Error('Invalid OrganizationPolicy ID')
        return await organizationPolicyClient.getOrganizationPolicyById({ id })
      },
      enabled: !!id, // ✅ ID jab tak valid nahi hai tab tak fetch nahi karega
      staleTime: 3 * 60 * 1000, // ✅ 5 min tak data fresh rahega
    })
  
    return { organizationPolicybyId, isLoading, error: isError ? error.message : null }
  }

  export function useFetchOrganizationPolicyById() {
    const queryClient = useQueryClient();
    const fetchOrganizationPolicyById = async (id: number) => {
      if (!id) throw new Error('Invalid OrganizationPolicy ID');
  
      const data = await queryClient.fetchQuery<FetchedOrganizationPolicyType>({
        queryKey: ['organizationPolicy', id],
        queryFn: async () => await organizationPolicyClient.getOrganizationPolicyById({ id }),
        staleTime: 5 * 60 * 1000,  // ✅ 5 min cache
      });
  
      return data;
    };
  
    return { fetchOrganizationPolicyById};
}