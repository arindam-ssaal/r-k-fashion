import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { designationFormatter } from '../helper/designationFormatter'
import { useDesignationStore } from '../store/userDesignation'

import designationClient from '@/services/designationClient'
import { DesginationResponseType } from '@/types/designation'

const messages = {
  Create: 'Created SuccessFully',
  Edit: 'Updated SuccessFully',
  Delete: 'Deleted SuccessFully',
  View: 'Deleted SuccessFully',
}

export type DesignationPostType = ReturnType<typeof designationFormatter>

export function useCreateDesignation() {
  const queryClient = useQueryClient() // ✅ React Query's cache manager
  const setGlobalLoading = useDesignationStore((state) => state.setIsLoading)
  const mode = useDesignationStore((state) => state.mode)
  const { mutate, mutateAsync, data, error, isPending } = useMutation<
    DesginationResponseType,
    Error,
    DesignationPostType
  >({
    mutationFn: async (DesignationData: DesignationPostType) => {
      // Call the client to make an API request
      setGlobalLoading(true)
      return await designationClient.createDesignation(DesignationData)
    },
    onSuccess: () => {
      // ✅ Invalidate the 'customers' query to refetch updated data
      queryClient.removeQueries({ queryKey: ['designation'] })
      
      queryClient.invalidateQueries({ queryKey: ['designations'] })
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
    createDesignation: mutate, // For immediate calls
    createDesignationAsync: mutateAsync, // For async/await usage
    Designation: data, // Data returned from the mutation
    error, // Error object (if any)
    isPending, // Loading state
  }
}
