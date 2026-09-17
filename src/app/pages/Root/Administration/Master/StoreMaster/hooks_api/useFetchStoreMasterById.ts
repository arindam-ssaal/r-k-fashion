import { useQuery, useQueryClient } from "@tanstack/react-query";

import storeMasterClient from "@/services/storeMasterClient";
import { FetchedStoreMasterType } from "@/types/storeMaster";


export function useStoreMasterById(id: number | null) {
    const {
      data: storeMaster,
      isLoading,
      error,
      isError,
    } = useQuery<FetchedStoreMasterType>({
      queryKey: ['storeMaster', id], // ✅ Unique key for caching and refetching
      queryFn: async () => {
        if (id === null) throw new Error('Invalid Store Master ID')
        return await storeMasterClient.getStoreMasterById({ id })
      },
      enabled: !!id, // ✅ ID jab tak valid nahi hai tab tak fetch nahi karega
      staleTime: 3 * 60 * 1000, // ✅ 5 min tak data fresh rahega
    })
  
    return { storeMaster, isLoading, error: isError ? error.message : null }
  }


export function useFetchStoreMasterById() {
    const queryClient = useQueryClient();
    
    const fetchStoreMasterById = async (id: number) => {
        if (!id) throw new Error('Invalid StoreMaster ID');
    
        const data = await queryClient.fetchQuery<FetchedStoreMasterType>({
        queryKey: ['storeMaster', id],
        queryFn: async () => {
            const response = await storeMasterClient.getStoreMasterById({ id });
            if (!response || response === undefined) throw new Error('Failed to fetch StoreMaster');
            return response;
        },
        staleTime: 5 * 60 * 1000,  // ✅ 5 min cache
        });
    
        return data;
    };
    
    return { fetchStoreMasterById };
}