import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { transformFormData } from '../../helper/dataFormatter'
import { useCreatePaymode } from '../../hooks_api/useCreatePaymode'
import { usePaymodeDataById } from '../../hooks_api/usePaymodeMasterDataById'
import { formSchema } from '../../schema/schema'
import { usePaymodeMasterDataStore } from '../../store/usePaymentMethodStore'
import { usePaymodeMaster } from '../../store/usePaymodeMaster'
import PaymentMethods from '../PaymentMethod'
import PaymodeConditions from '../PaymodeConditions'
import PayModeViewer from '../PaymodeTable/components/PayModeViewer'
import SupportedCurrencies from '../SupportedCurrencies'

import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const defaultValues = {
  paymentModeName: '', // Initialize as empty
  shortCode: '', // Initialize as empty
  paymentMethod: 'cash',
  objCondition: [
    {
      conditionId: 1, // Use numbers instead of strings as per schema
      paymentModeID: 0,
      conditionDesc: 'Accept Denomination-Based Payments',
      isEnabled: 'N',
    },
    {
      conditionId: 2,
      paymentModeID: 0,
      conditionDesc: 'Allow Reference Details Capturing',
      isEnabled: 'N',
    },
    {
      conditionId: 3,
      paymentModeID: 0,
      conditionDesc: 'Accept Only Negative Payment Values',
      isEnabled: 'N',
    },
    {
      conditionId: 4,
      paymentModeID: 0,
      conditionDesc: 'Restrict Payments in This Mode',
      isEnabled: 'N',
    },
    {
      conditionId: 5,
      paymentModeID: 0,
      conditionDesc: 'Count-Based Payment Transfers',
      isEnabled: 'N',
    },
    {
      conditionId: 6,
      paymentModeID: 0,
      conditionDesc: 'Restrict Customer Loyalty Points',
      isEnabled: 'N',
    },
  ],
  objCurrency: [
    {
      currencyID: 1, // Use numbers instead of strings
      paymentModeID: 0,
      currencyCode: 'INR',
      currencyName: 'Indian Rupees (INR)',
    },
  ],
}

function PaymodeMasterForm() {
  const mode = usePaymodeMaster((state) => state.mode)
  const paymodeMastedId = usePaymodeMasterDataStore((state) => state.currentPaymodeMasterId)
  const clearID = usePaymodeMasterDataStore((state) => state.clearCurrentPaymodeMasterId)
 
  const { paymodeData, isLoading, error } = usePaymodeDataById(paymodeMastedId)
  const { createPaymodeAsync, isPending } = useCreatePaymode()
  const closeModal = usePaymodeMaster((state) => state.close)
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const isInitialRender = useRef(true)

  useEffect(() => {
    if (paymodeData && mode === 'Edit' && isInitialRender.current) {
      // Normalize objCondition
      const normalizedConditions = defaultValues.objCondition.map((defaultCondition) => {
        const matchedCondition = paymodeData.objCondition?.find(
          (condition) => condition.conditionID === defaultCondition.conditionId
        )
        return {
          ...defaultCondition,
          isEnabled: matchedCondition?.isEnabled || 'N', // Default to "N" if not found
        }
      })

      // Reset form with normalized data
      form.reset({
        ...defaultValues,
        paymentModeName: paymodeData.paymentModeName || '',
        shortCode: paymodeData.shortCode || '',
        paymentMethod: paymodeData.availablePaymentmethod || '',
        objCondition: normalizedConditions,
        objCurrency: paymodeData.objCurrency || [],
      })

      isInitialRender.current = false // Prevent further resets
    }
  }, [paymodeData, mode, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = transformFormData(values, mode, paymodeMastedId)

    try {
      await createPaymodeAsync(data)
      closeModal()
      clearID()
    } catch (error) {
      console.error('Failed to submit data:', error)
    }
  }

  if (isLoading && mode === 'View') {
    return <GlobalViewerLoader />
  }

  if (!isLoading && mode === 'View' && paymodeMastedId) {
    return <div><PayModeViewer data={paymodeData} /></div>
  }
//{JSON.stringify(paymodeData)}
  if (error) {
    return <div>{error}</div>
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items px-10 space-y-5 border-e border-solid p-5 relative z-30 ">
          <div className="grid grid-cols-2 gap-7">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="paymentModeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Mode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Payment Mode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Short Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>{/* Placeholder for Image or Additional Content */}</div>
          </div>

          <div className="grid grid-cols-2 items-start">
            <PaymentMethods />
            <PaymodeConditions />
          </div>
          <SupportedCurrencies />
        </div>
        <div className="text-end pb-4 ">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'submiting' : 'submit'}
          </Button>
          <Button type='button' className='m-3' onClick={closeModal}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default PaymodeMasterForm
