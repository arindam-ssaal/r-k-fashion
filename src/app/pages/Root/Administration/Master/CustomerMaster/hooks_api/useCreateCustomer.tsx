import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useSalesPerson from '../../SalesPersonMaster/store/useSalesPerson'
import { useCustomerMaster } from '../store/useCustomerMaster'

import customerClient from '@/services/customerClient'
import { CustomerFetchedType, CustomerMasterResponseType } from '@/types/customer'


const messages = {
  Create: 'Operation SuccessFully',
  Edit: 'Operation SuccessFully',
  Delete: 'Operation SuccessFully',
  View: 'Operation SuccessFully',
}

export type CustomerPostType = Omit<CustomerFetchedType, 'status'> & {
  customerID: number | null;
};


export function useCreateCustomer() {
  const queryClient = useQueryClient() // ✅ React Query's cache manager
  const setGlobalLoading=useCustomerMaster(state=>state.setIsLoading);
  const mode = useSalesPerson((state) => state.mode)
  const { mutate, mutateAsync, data, error, isPending } = useMutation<
    CustomerMasterResponseType,
    Error,
    CustomerPostType
  >({
    mutationFn: async (customerData: CustomerPostType) => {
      // Call the client to make an API request
      setGlobalLoading(true)
      return await customerClient.createCustomer(customerData)
    },
    onSuccess: () => {
      // ✅ Invalidate the 'customers' query to refetch updated data
      
      queryClient.invalidateQueries({ queryKey: ['customers'] })
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
      const errorMessage = err.message.split('\n').map((msg, index) => (
        <p key={index}>{msg}</p>
      ));

      toast.error(<div>{errorMessage}</div>, {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      });

    },
    onSettled:()=>{
      setGlobalLoading(false)
    }
  })
console.log(mode);
  

  return {
    createCustomer: mutate, // For immediate calls
    createCustomerAsync: mutateAsync, // For async/await usage
    customer: data, // Data returned from the mutation
    error, // Error object (if any)
    isPending, // Loading state
  }
}
