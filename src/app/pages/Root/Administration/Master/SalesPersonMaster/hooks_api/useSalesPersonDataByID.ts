import { useQuery, useQueryClient } from '@tanstack/react-query'

import salesPersonClient from '@/services/salesPersonClient'
import { FetchedSalesPersonType } from '@/types/salesPerson'

export function useSalesPersonDataById(id: number | null) {
  const {
    data: salesPerson,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedSalesPersonType>({
    queryKey: ['salesPerson', id], // ✅ Unique key for caching and refetching
    queryFn: async () => {
      if (id === null) throw new Error('Invalid SalesPerson ID')
      return await salesPersonClient.getSalesPersonById({ id })
    },
    enabled: !!id, // ✅ ID jab tak valid nahi hai tab tak fetch nahi karega
    staleTime: 3 * 60 * 1000, // ✅ 5 min tak data fresh rahega
  })

  return { salesPerson, isLoading, error: isError ? error.message : null }
}


export function useFetchSalesPersonById() {
  const queryClient = useQueryClient();

  const fetchSalesPersonById = async (id: number) => {
    if (!id) throw new Error('Invalid SalesPerson ID');

    const data = await queryClient.fetchQuery<FetchedSalesPersonType>({
      queryKey: ['salesPerson', id],
      queryFn: async () => await salesPersonClient.getSalesPersonById({ id }),
      staleTime: 5 * 60 * 1000,  // ✅ 5 min cache
    });

    return data;
  };

  return { fetchSalesPersonById };
}