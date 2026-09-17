import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner"



import { UserMasterFormatter } from '../helper/UserMasterFormatter'
import { useUserMasterStore } from '../store/useUserMasterStore'

import userMasterClient from '@/services/userMasterClient'
import { UserResponseType } from '@/types/userMaster'


const messages = {
  Create: 'Created SuccessFully',
  Edit: 'Updated SuccessFully',
  Delete: 'Deleted SuccessFully',
  View: 'Deleted SuccessFully',
}

export type UserMasterPostType = ReturnType<typeof UserMasterFormatter>

export function useCreateUsermaster(){
    const queryClient = useQueryClient() // ✅ Query Invalidation ke liye
    const mode = useUserMasterStore((state) => state.mode) as keyof typeof messages
    const setIsLoading = useUserMasterStore((state) => state.setIsLoading)
    const { mutateAsync, data, error, isPending, } = useMutation<
    UserResponseType,
      Error,
      UserMasterPostType
    >({
      mutationFn: async (userMasterData: UserMasterPostType) => {
        setIsLoading(true) 
        return await userMasterClient.createUserMaster(userMasterData)
      },
      onSuccess: () => {
        // ✅ Refetch after successful creation
        queryClient.invalidateQueries({ queryKey: ['userMaster'] })
  
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
  
    return { createUsermaster: mutateAsync, data, error, isPending }
}