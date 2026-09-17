import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { PromotionPostType } from '../helpers/promotionDataFormatter'
import { usePromotionSetupStore } from '../store/usePromotionSetupStore'

import PromotionClient from '@/services/PromotionSetupClient'
import { PromotionResponseType } from '@/types/Promotion'

const messages = {
  Create: 'Operation SuccessFully',
  Edit: 'Operation SuccessFully',
  Delete: 'Operation SuccessFully',
  View: 'Operation SuccessFully',
}


export function useCreatePromotion() {
  const queryClient = useQueryClient() // ✅ React Query's cache manager
  const setGlobalLoading = usePromotionSetupStore((state) => state.setIsLoading)
  const mode = usePromotionSetupStore((state) => state.mode)
  const { mutate, mutateAsync, data, error, isPending } = useMutation<
    PromotionResponseType,
    Error,
    PromotionPostType
  >({
    mutationFn: async (promotionData: PromotionPostType) => {
      // Call the client to make an API request
      setGlobalLoading(true)
      return await PromotionClient.createPromotion(promotionData)
    },
    onSuccess: () => {
      // ✅ Invalidate the 'customers' query to refetch updated data

      queryClient.invalidateQueries({ queryKey: ['promotion'] })
      toast.success(messages[mode], {
        style: {
          backgroundColor: '#e3ffea',
          color: '#3ed665',
        },
      })
      // ✅ Optionally show a success toast or log
    },
    onError: (err: Error) => {
      // Parse error message
      const errorMessage = err.message.split('\n').map((msg, index) => <p key={index}>{msg}</p>)

      toast.error(<div>{errorMessage}</div>, {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      })
    },
    onSettled: () => {
      setGlobalLoading(false)
    },
  })

  return {
    createPromotion: mutate, // For immediate calls
    createPromotionAsync: mutateAsync, // For async/await usage
    promotion: data, // Data returned from the mutation
    error, // Error object (if any)
    isPending, // Loading state
  }
}
