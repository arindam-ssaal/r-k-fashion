import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner"

import { StoreMasterFormatter } from '../helper/StoreMasterFormatter'
import useStoreMasterStoreType from '../store/useStoreMasterStore'

import storeMasterClient from '@/services/storeMasterClient'
import { StoreMasterResponseType } from '@/types/storeMaster'


const messages = {
  Create: 'Created SuccessFully',
  Edit: 'Updated SuccessFully',
  Delete: 'Deleted SuccessFully',
  View: 'Deleted SuccessFully',
}

export type StoreMasterPostType = ReturnType<typeof StoreMasterFormatter>

export function useCreateStoreMaster(){
    const queryClient = useQueryClient() // ✅ Query Invalidation ke liye
    const mode = useStoreMasterStoreType((state) => state.mode)
    const setIsLoading = useStoreMasterStoreType((state) => state.setIsLoading)
    const { mutateAsync, data, error, isPending, } = useMutation<
      StoreMasterResponseType,
      Error,
      StoreMasterPostType
    >({
      mutationFn: async (storeMasterData: StoreMasterPostType) => {
        setIsLoading(true) 
        return await storeMasterClient.createStoreMaster(storeMasterData)
      },
      onSuccess: () => {
        // ✅ Refetch after successful creation
        queryClient.invalidateQueries({ queryKey: ['storeMaster'] })
  
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
      onSettled:()=>{
        setIsLoading(false)
      }
    })
  
    return { createStoremaster: mutateAsync, data, error, isPending }
}