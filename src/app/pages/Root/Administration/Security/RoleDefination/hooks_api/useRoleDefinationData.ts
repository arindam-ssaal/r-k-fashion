import { useQuery } from "@tanstack/react-query"

import RoleDefination from "@/services/roleDefination"


export function useRoleDefinationData() {
    const { data, isLoading, error, isError } = useQuery<unknown[], Error>({
      queryKey:  ['roles'], // ✅ Conditionally adjust query key
      queryFn: async ({ signal }) => {
    
        // Fetch all customers
        return await RoleDefination.getRoleDefination({signal })
      },
      staleTime: 5 * 60 * 1000, // ✅ Cache data for 5 minutes
      refetchOnWindowFocus: true, // ✅ Refetch when the window gains focus
      retry: 2, // ✅ Retry twice on failure
      retryDelay: 2000, // ✅ Wait 2 seconds between retries
      networkMode: 'always',
    })
  
    return {
      rolesData: data, // ✅ Return first element if id is not 0
      error: isError ? error.message : null,
      isLoading,
    }
  }