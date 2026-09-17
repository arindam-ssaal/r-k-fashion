import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { PettyCashFormatter } from '../../helper/PettyCashFormatter'
import { useCreatePettyCash } from '../../hooks_api/useCreatePettyCash'
import { usePettyCashDataById } from '../../hooks_api/usePettyCashById'
import { PettyCashHeadSchema } from '../../schemas/PettyCashHeadSchema'
import { usePettyCashDataStore } from '../../store/usePettyCashDataStore'
import usePettyCashHead from '../../store/usePettyCashHead'
import PettyCashViewer from '../PettyCashHeadTable/components/PettyCashTableViewer'

import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
//import { Tabs, TabsContent } from '@/components/ui/tabs'

function PettyCashHeadForm() {
  const { createPettyCash, isPending, error } = useCreatePettyCash()
  const pettyCashId = usePettyCashDataStore((state) => state.currentPettyCashId)
  const closeModal = usePettyCashHead((state) => state.close)
  const { pettyCash, isLoading } = usePettyCashDataById(Number(pettyCashId) || null)
  const mode = usePettyCashHead((state) => state.mode)
  const clearId = usePettyCashDataStore((state) => state.clearCurrentPettyCashId)
  const formMethods = useForm<z.infer<typeof PettyCashHeadSchema>>({
    resolver: zodResolver(PettyCashHeadSchema),
    defaultValues: {
      pettyCashCode: '',
      accountCode: '',
      pettyCashName: '',
      modeOfOperation: '',
      limit: '',
      remarks: '',
      isActive: false,
    },
  })

  useEffect(() => {
    if (pettyCash && mode === 'Edit') {
      formMethods.reset({
        pettyCashCode: pettyCash?.pettyCashCode || '',
        accountCode: pettyCash?.accountCode || '',
        pettyCashName: pettyCash?.pettyCashName?.toString() || '',
        modeOfOperation: pettyCash?.modeOfOperation || '',
        limit: pettyCash?.limit?.toString() || '',
        remarks: pettyCash?.remarks || '',
        isActive: pettyCash?.isActive === 'Y' ? true : false,
        enteredBy: pettyCash?.enteredBy?.toString() || '',
        usedFor: pettyCash?.usedFor || '',
      })
    }
  }, [pettyCash, formMethods.reset, mode]) // ✅ Dependency mein salesPerson aur reset rakho

  const onSubmit = formMethods.handleSubmit(async (data) => {
    // console.log('Form Data Submitted: ',) // Logs if submission is successful
    const transformData = PettyCashFormatter(data, Number(pettyCash?.pettyCashID))
    try {
      await createPettyCash(transformData)
      closeModal()
      clearId()
      //z console.log(transformData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }
    }
  })

  if (isLoading && mode === 'View') {
    return <GlobalViewerLoader />
  }

  if (mode === 'View' && !isLoading) {
    return (
      <h3>
        <PettyCashViewer data={pettyCash} />
      </h3>
    )
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={(e) => {
          e.preventDefault() // Ensure default form submission behavior is prevented
          onSubmit() // Trigger submission
        }}
      >
        <div className="border p-4 border-black border-solid h-[650px] overflow-y-auto">
          <div className="space-y-4">
            <FormField
              control={formMethods.control}
              name="pettyCashCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Petty Cash Code <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Petty Cash Code " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="accountCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Postable Account Code <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Postable Account Code " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="pettyCashName" //pettyCashName = pettyCashHead
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Petty Cash Head <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Petty Cash Head " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="modeOfOperation"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-4 flex-col gap-3">
                  <FormLabel className="mt-2">Mode of Operation</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      className="flex items-center space-x-4 roles-radio"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="p" id="r1" />
                        <Label htmlFor="r1">Payment</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="r" id="r2" />
                        <Label htmlFor="r2">Receipt</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="b" id="r3" />
                        <Label htmlFor="r3">Both</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limit</FormLabel>
                  <FormControl>
                    <Input placeholder="Limit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your message here." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Inactive Checkbox */}
            <FormField
              control={formMethods.control}
              name="isActive"
              render={({ field }) => (
                <FormItem style={{ marginTop: '20px' }} className="flex items-center gap-3 ">
                  {/* <FormLabel>Inactive</FormLabel> */}
                  {/* //! Change on 17-06-2026 - IsActive Checkbox that when its click it shows active  */}
                  <FormLabel>Isactive</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="h-[60px]  bottom-0 right-0 flex gap-3 justify-end items-center">
          <Button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </div>
        {error && <p className="text-end">{error}</p>}
      </form>
    </FormProvider>
  )
}

export default PettyCashHeadForm
