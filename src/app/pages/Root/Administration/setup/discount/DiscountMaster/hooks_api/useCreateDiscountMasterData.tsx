import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { DiscountPostType } from '../helper/discountMasterPostFormatter'
import useDiscountMasterStore from '../store/useDiscountMasterStore'

import discountSetupClient from '@/services/discountSetupClient'
import { DiscountResponseType } from '@/types/discountSetup'

const messages = {
  Create: 'Created SuccessFully',
  Edit: 'Updated SuccessFully',
  Delete: 'Deleted SuccessFully',
  View: 'View SuccessFully',
}

export function useCreateDiscountMaster() {
  const queryClient = useQueryClient() // ✅ Query Invalidation ke liye
  const mode = useDiscountMasterStore((state) => state.mode)
  const setIsLoading = useDiscountMasterStore((state) => state.setIsLoading)
  const { mutateAsync, data, error, isPending } = useMutation<
    DiscountResponseType,
    Error,
    DiscountPostType
  >({
    mutationFn: async (DiscountMasterData: DiscountPostType) => {
      setIsLoading(true)
      return await discountSetupClient.createDiscount(DiscountMasterData)
    },
    onSuccess: () => {
      // ✅ Refetch after successful creation
      queryClient.invalidateQueries({ queryKey: ['DiscountMaster'] })

      toast.success(messages[mode], {
        style: {
          backgroundColor: '#e3ffea',
          color: '#3ed665',
        },
      })
    },
    onError: (error) => {
      toast.error(error.message, {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      })
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  return { createDiscountMaster: mutateAsync, data, error, isPending }
}
