import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { PettyCashFormatter } from '../helper/PettyCashFormatter'
import usePettyCashHead from '../store/usePettyCashHead'

import pettyCashClient from '@/services/pettyCashClient'
import { PettyCashResponseType } from '@/types/pettyCash'

const messages = {
  Create: 'Operation SuccessFully',
  Edit: 'Operation SuccessFully',
  Delete: 'Operation SuccessFully',
  View: 'Operation SuccessFully',
}

export type PettyCashPostType = ReturnType<typeof PettyCashFormatter>

export function useCreatePettyCash() {
  const queryClient = useQueryClient() // ✅ Query Invalidation ke liye
  const mode = usePettyCashHead((state) => state.mode)
  const setIsLoading = usePettyCashHead((state) => state.setIsLoading)
  const { mutateAsync, data, error, isPending } = useMutation<
    PettyCashResponseType,
    Error,
    PettyCashPostType
  >({
    mutationFn: async (pettyCashData: PettyCashPostType) => {
      setIsLoading(true)
      return await pettyCashClient.createPettyCash(pettyCashData)
    },
    onSuccess: () => {
      // ✅ Refetch after successful creation
      queryClient.invalidateQueries({ queryKey: ['pettyCash'] })

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

  return { createPettyCash: mutateAsync, data, error, isPending }
}
