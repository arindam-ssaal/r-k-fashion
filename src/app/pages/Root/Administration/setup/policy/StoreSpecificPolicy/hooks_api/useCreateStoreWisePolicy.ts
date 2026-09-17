import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { StoreWisePolicyFormatter } from '../helper/StoreWisePolicyFormatter'
import useStoreWisePolicyHead from '../store/useStoreWisePolicyHead'

import storeWisePolicyClient from '@/services/storeWisePolicyClient'
import { StoreWisePolicyResponseType } from '@/types/storeWisePolicy'

const messages = {
  Create: 'Created Successfully',
  Edit: 'Updated Successfully',
  Delete: 'Deleted Successfully',
  View: 'Viewed Successfully',
}

export type StoreWisePolicyPostType = ReturnType<typeof StoreWisePolicyFormatter>

export function useCreateOrganizationPolicy() {
  const queryClient = useQueryClient() // ✅ For Query Invalidation
  const mode = useStoreWisePolicyHead((state) => state.mode)
  const setIsLoading = useStoreWisePolicyHead((state) => state.setIsLoading)

  const mutation = useMutation<StoreWisePolicyResponseType, Error, StoreWisePolicyPostType>({
    mutationFn: async (storeWisePolicyData: StoreWisePolicyPostType) => {
      setIsLoading(true) // Set loading state
      return await storeWisePolicyClient.createStoreWisePolicy(storeWisePolicyData)
    },
    onSuccess: () => {
      // ✅ Refetch after successful creation/update/deletion
      queryClient.invalidateQueries({ queryKey: ['storewisePolicy'] })

      toast.success(messages[mode] || 'Operation successful', {
        style: {
          backgroundColor: '#e3ffea',
          color: '#3ed665',
        },
      })
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred', {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      })
    },
    onSettled: () => {
      setIsLoading(false) // Reset loading state
    },
  })
  return {
    createStoreWisePolicy: mutation.mutate, // Direct mutation function
    createStoreWisePolicyAsync: mutation.mutateAsync, // Async mutation function
    organizationPolicy: mutation.data, // Mutation result data
    error: mutation.error, // Any errors
    isLoading: mutation.isPending, // Loading state
  }
}
