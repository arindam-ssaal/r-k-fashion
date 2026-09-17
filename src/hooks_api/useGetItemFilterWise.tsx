import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ItemGenerationType } from '@/components/AssortmentManagement/helper/assortmentFilterFormatter'
import ItemGroupClient from '@/services/ItemGroupClient'
import { ItemFilterType, ItemsResponseType } from '@/types/item'

export function useGetItemFilterWise() {
  const queryClient = useQueryClient() // ✅ React Query's cache manager

  const { mutate, mutateAsync, data, error, isPending } = useMutation<
    ItemsResponseType, // Mutation function returns ItemsResponseType
    Error,
    ItemGenerationType // Mutation function takes ItemGenerationType as argument
  >({
    mutationFn: async (filterData: ItemGenerationType) => {
      return await ItemGroupClient.getAllItemsAfterFiltering(filterData)
    },
    onSuccess: (responseData) => {
      //console.log(responseData)

      queryClient.setQueryData(['generatedAssortmentItems'], responseData)
      toast.success('Item Generated Successfully', {
        style: {
          backgroundColor: '#e3ffea',
          color: '#3ed665',
        },
      })
    },
    onError: (err: Error) => {
      const errorMessage = err.message.split('\n').map((msg, index) => <p key={index}>{msg}</p>)

      toast.error(<div>{errorMessage}</div>, {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      })
    },
  })

  return {
    generateItems: mutate, // For immediate calls
    generateItemsAsync: mutateAsync, // For async/await usage
    itemsData: data, // Data returned from the mutation
    error, // Error object (if any)
    isPending, // Loading state
  }
}

export function useGetGeneratedItems() {
  const queryClient = useQueryClient()

  const { data: generatedItems = [], isLoading } = useQuery<ItemFilterType[]>({
    queryKey: ['generatedAssortmentItems'],

    queryFn: () => {
      // Returning an empty array so that it never refetches.
      return queryClient.getQueryData(['generatedAssortmentItems']) || []
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return { generatedItems, isLoading }
}
