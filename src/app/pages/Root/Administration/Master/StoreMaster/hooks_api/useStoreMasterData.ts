import { useQuery } from '@tanstack/react-query'


import storeMasterClient from "@/services/storeMasterClient"
import { FetchedStoreMasterType } from "@/types/storeMaster"


export function useStoreMasterData() {
    const {
        data: storemasterData,
        isLoading,
        error,
        isError,
      } = useQuery<FetchedStoreMasterType[], Error>({
        queryKey: ['storeMaster'],
        queryFn: async ({signal}) => {
          const data = await storeMasterClient.getStoreMaster({signal})
          return data
        },
        networkMode:"always",
        staleTime: 5 * 60 * 1000, // ✅ 5 minutes cache time
        refetchOnWindowFocus: true, // ✅ Auto refetch on window focus
        retry:2,
        retryDelay:2000,
      })
      return { storemasterData, isLoading, error: isError ? error?.message : null }
}