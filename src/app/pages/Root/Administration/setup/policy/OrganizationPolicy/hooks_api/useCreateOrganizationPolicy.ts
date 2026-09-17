import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { OrganizationPolicyFormatter } from '../helper/OrganizationPolicyFormatter'
import useOrganizationPolicyHead from '../store/useOrganizationPolicyHead'

import organizationPolicyClient from '@/services/organizationPolicyClient'
import { OrganizationPolicyResponseType } from '@/types/organizationPolicy'

const messages = {
  Create: 'Created Successfully',
  Edit: 'Updated Successfully',
  Delete: 'Deleted Successfully',
  View: 'Viewed Successfully',
}

export type OrganizationPolicyPostType = ReturnType<typeof OrganizationPolicyFormatter>

export function useCreateOrganizationPolicy() {
  const queryClient = useQueryClient() // ✅ For Query Invalidation
  const mode = useOrganizationPolicyHead((state) => state.mode)
  const setIsLoading = useOrganizationPolicyHead((state) => state.setIsLoading)

  const mutation = useMutation<OrganizationPolicyResponseType, Error, OrganizationPolicyPostType>({
    mutationFn: async (organizationPolicyData: OrganizationPolicyPostType) => {
      setIsLoading(true) // Set loading state
      return (await organizationPolicyClient.createOrganizationPolicy(
        organizationPolicyData
      )) 
    },
    onSuccess: () => {
      // ✅ Refetch after successful creation/update/deletion
      queryClient.invalidateQueries({ queryKey: ['organizationPolicy'] })

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
    createOrganizationPolicy: mutation.mutate, // Direct mutation function
    createOrganizationPolicyAsync: mutation.mutateAsync, // Async mutation function
    organizationPolicy: mutation.data, // Mutation result data
    error: mutation.error, // Any errors
    isPending: mutation.isPending, // Loading state
  }
}
