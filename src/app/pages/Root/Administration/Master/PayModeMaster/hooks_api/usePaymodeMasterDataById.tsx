import { useQuery, useQueryClient } from '@tanstack/react-query'


import paymodeClient from '@/services/paymodeClient'
import { PaymodeFetchedType } from '@/types/paymode'

export function usePaymodeDataById(id: number | null) {
  const {
    data: paymodeData,
    isLoading,
    error,
    isError,
  } = useQuery<PaymodeFetchedType>({
    queryKey: ['paymode', id], // ✅ Unique key for caching and refetching
    queryFn: async () => {
      if (id === null) throw new Error('Invalid SalesPerson ID')
      return await paymodeClient.getPaymodeById({ id })
    },
    enabled: !!id, // ✅ ID jab tak valid nahi hai tab tak fetch nahi karega
    staleTime: 3 * 60 * 1000, // ✅ 5 min tak data fresh rahega
  })

  return { paymodeData, isLoading, error: isError ? error.message : null }
}


export function useFetchPaymodeById() {
  const queryClient = useQueryClient();

  const fetchPaymodeById = async (id: number) => {
    if (!id) throw new Error('Invalid SalesPerson ID');

    const data = await queryClient.fetchQuery<PaymodeFetchedType>({
      queryKey: ['paymode', id],
      queryFn: async () => await paymodeClient.getPaymodeById({ id }),
      staleTime: 5 * 60 * 1000,  // ✅ 5 min cache
    });

    return data;
  };

  return { fetchPaymodeById };
}