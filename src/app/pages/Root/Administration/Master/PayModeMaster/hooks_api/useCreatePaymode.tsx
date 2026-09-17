import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { PaymodePostType } from '../helper/dataFormatter.tsx'
import { usePaymodeMaster } from '../store/usePaymodeMaster'

import paymodeClient from '@/services/paymodeClient'
import { PaymodeMasterResponseType } from '@/types/paymode'

const messages = {
  Create: 'operation SuccessFully',
  Edit: 'operation SuccessFully',
  Delete: 'operation SuccessFully',
  View: 'operation SuccessFully',
}

export function useCreatePaymode() {
  const queryClient = useQueryClient() // ✅ React Query's cache manager
  const setGlobalLoading = usePaymodeMaster((state) => state.setIsLoading)
  const mode = usePaymodeMaster((state) => state.mode)
  const { mutate, mutateAsync, data, error, isPending } = useMutation<
    PaymodeMasterResponseType,
    Error,
    PaymodePostType
  >({
    mutationFn: async (paymodeData: PaymodePostType) => {
      // Call the client to make an API request
      setGlobalLoading(true)
      return await paymodeClient.createPaymode(paymodeData)
    },
    onSuccess: () => {
      // ✅ Invalidate the 'customers' query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['paymode'] })
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

      console.error('Error creating customer:', err.message)
    },
    onSettled: () => {
      setGlobalLoading(false)
    },
  })

  return {
    createPaymode: mutate, // For immediate calls
    createPaymodeAsync: mutateAsync, // For async/await usage
    paymode: data, // Data returned from the mutation
    error, // Error object (if any)
    isPending, // Loading state
  }
}
