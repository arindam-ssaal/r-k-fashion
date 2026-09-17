import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { designationSchema } from './schema/designationSchema'
import { designationFormatter } from '../../helper/designationFormatter'
import { useCreateDesignation } from '../../hooks_api/useCreateDesignation'
import { useDesignationData } from '../../hooks_api/useDesignationData'
import { useDesignationMasterDataStore } from '../../store/useDesignationDataStore'
import { useDesignationStore } from '../../store/userDesignation'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

function DesignationForm() {
  const form = useForm<z.infer<typeof designationSchema>>({
    resolver: zodResolver(designationSchema), // Bind the schema for validation
    defaultValues: {
      designationCode: '',
      designationName: '',
    },
  })
  const designationId = useDesignationMasterDataStore((state) => state.currentDesignationMasterId)
  const clearId = useDesignationMasterDataStore((state) => state.clearCurrentDesignationMasterId)
  const mode = useDesignationStore((state) => state.mode)
  const closeModal = useDesignationStore((state) => state.close)
  const { createDesignationAsync, isPending } = useCreateDesignation()
  const { DesignationData, isLoading } = useDesignationData(Number(designationId))

  useEffect(() => {
    if (!isLoading && mode !== 'Create') {
      form.reset({
        designationCode: String(DesignationData?.[0].designationID),
        designationName: String(DesignationData?.[0].designationName),
      })
    }
  }, [mode, isLoading, form.reset])

  const onSubmit = async (data: z.infer<typeof designationSchema>) => {
    try {
      console.log('Form Data Submitted:', data)

      const formData = designationFormatter(data, mode, Number(designationId))

      await createDesignationAsync(formData)
      closeModal()

      console.log(formData)

      clearId()
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Failed to submit designation. Please try again.')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  // console.log(DesignationData.designationName);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="space-y-1 mb-3">
          <FormField
            control={form.control}
            name="designationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation Code</FormLabel>
                <FormControl>
                  <Input placeholder="Designation Code" {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1">
          <FormField
            control={form.control}
            name="designationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation Name</FormLabel>
                <FormControl>
                  <Input placeholder="Designation Name" {...field} disabled={mode==="View"} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting' : 'Submit'}
          </Button>
          <Button type="button" className='ml-3' onClick={closeModal}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
}

export default DesignationForm
