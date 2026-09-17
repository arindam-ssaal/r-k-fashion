import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { salesPersonFormatter } from '../helper/SalesPersonFormatter'
import useSalesPerson from '../store/useSalesPerson'

import salesPersonClient from '@/services/salesPersonClient'
import { SalesPersonResponseType } from '@/types/salesPerson'

const messages = {
  "Create": 'Operation SuccessFully',
  "Edit": 'Operation SuccessFully',
  "Delete": 'Operation SuccessFully',
  "View": 'Operation SuccessFully',
}

export type SalesPersonPostType = ReturnType<typeof salesPersonFormatter>


export function useCreateSalesPerson() {
  const queryClient = useQueryClient() // ✅ Query Invalidation ke liye
  const mode = useSalesPerson((state) => state.mode)
  const setIsLoading = useSalesPerson((state) => state.setIsLoading)
  const { mutateAsync, data, error, isPending, } = useMutation<
    SalesPersonResponseType,
    Error,
    SalesPersonPostType
  >({
    mutationFn: async (salesPersonData: SalesPersonPostType) => {
      setIsLoading(true) 
      return await salesPersonClient.createSalesPerson(salesPersonData)
    },
    onSuccess: () => {
      // ✅ Refetch after successful creation
      queryClient.invalidateQueries({ queryKey: ['salesPerson'] })

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

  return { createSalesPerson: mutateAsync, data, error, isPending }
}
