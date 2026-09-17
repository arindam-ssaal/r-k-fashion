import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import AssortmentManagementTab from './components/AssortmentManagementTabs'
import { assortmentFormatter } from '../../helper/assortmentPostFormatter'
import { useGeneratedItemsDataStore } from '../../hooks/useGeneratedItemsDataStore'
import { useAssortmentDataById } from '../../hooks_api/useAssortmentDataById'
import { useCreateAssortment } from '../../hooks_api/useCreateAssortment'
import { useAssortmentManagementDataStore } from '../../store/useAssortmentManagementDataStore'
import { useAssortmentManagementStore } from '../../store/useAssortmentManagementStore'
import AssortmentManagementTableViewer from '../AssortmentMangementTable/components/AssortmentManagementTbleViewer'
import { AssortmentManagementTableData } from '../AssortmentMangementTable/components/AssortmentManagementTbleViewer/AssortmentManagementTbleViewer'

import { customerDataFormatter } from '@/app/pages/Root/Administration/Master/CustomerMaster/helper/customerDataFormatter'
import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { Button } from '@/components/ui/button'
import { useGetGeneratedItems } from '@/hooks_api/useGetItemFilterWise'

export const FormSchema = z.object({
  assortmentName: z.string().min(2).max(50),
  description: z.string().optional(),
  typeOfAssortment: z.enum(['P', 'B', 'C']).optional(),
  isActive: z.boolean().optional(),
  assortmentDetail: z
    .array(
      z.object({
        assortmentID: z.number(),
        itemCode: z.string(),
        itemName: z.string(),
        tableID: z.number(),
        lineNum: z.number(),
        barcode: z.string(),
        group: z.string(),
      })
    )
    .optional(),
})

function AssortmentManagementForm({ type }: { type: 'P' | 'D' | 'S' }) {
  const queryClient = useQueryClient()
  const assortmentId = useAssortmentManagementDataStore((state) => state.currentAssortmentId)
  const clearId = useAssortmentManagementDataStore((state) => state.clearCurrentAssortmentId)
  const { assortmentData, isLoading } = useAssortmentDataById(assortmentId, type)
  const mode = useAssortmentManagementStore((state) => state.mode)
  const setMode = useAssortmentManagementStore((state) => state.setMode)
  const { createAssortment, isPending } = useCreateAssortment()
  const closeModal = useAssortmentManagementStore((state) => state.close)
  const { generatedItems } = useGetGeneratedItems()
  const selectedGeneratedItems = useGeneratedItemsDataStore((state) => state.selections)
  const clearSelections = useGeneratedItemsDataStore((state) => state.clearSelections)

  let includedCount = 0
  let excludedCount = 0
  //console.log('Generated Items:', generatedItems)
  const assortmentDetail = generatedItems
    .filter((item) => {
      const status = selectedGeneratedItems[item.itemCode]
      return status && status !== 'default'
    })
    .map((item) => {
      const status = selectedGeneratedItems[item.itemCode]
      let lineNum = 0

      if (status === 'included') {
        includedCount += 1
        lineNum = includedCount
      } else if (status === 'excluded') {
        excludedCount += 1
        lineNum = excludedCount
      }
      return {
        assortmentID: mode === 'Create' ? 0 : assortmentId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        tableID: status === 'included' ? 1 : 2,
        lineNum,
        barcode: item.barCode || '',
        group: String(item.itemGroup),
      }
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      assortmentName: '',
      description: '',
      typeOfAssortment: 'P',
      isActive: false,
      assortmentDetail: [],
    },
  })

  useEffect(() => {
    if (assortmentData && mode === 'Edit') {
      form.reset({
        assortmentName: assortmentData.assortmentName || '',
        description: assortmentData.description || '',
        typeOfAssortment: assortmentData.typeOfAssortment || 'P',
        isActive: assortmentData.isActive ?? false,
        assortmentDetail: assortmentData.assortmentDetail || [],
      })
    }
  }, [assortmentData, mode, form])

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const sendedData = assortmentFormatter(
        values,
        mode,
        Number(assortmentId),
        assortmentDetail,
        type
      )
      await createAssortment(sendedData)
      clearSelections()
      queryClient.removeQueries({ queryKey: ['generatedAssortmentItems'] })
      form.reset()
      clearId()
      setMode('Create')
      closeModal()
    } catch (err: unknown) {
      if (err instanceof Error) throw new Error(err.message)
    }
  }

  function handleClose() {
    clearSelections()
    queryClient.removeQueries({ queryKey: ['generatedAssortmentItems'] })
    form.reset()
    clearId()
    setMode('Create')
    closeModal()
  }

  if (isLoading && mode === 'View') return <GlobalViewerLoader />
  if (mode === 'View') {
    if (!assortmentData) return <h3>No data available</h3>

    const formattedCustomerData: AssortmentManagementTableData = Array.isArray(assortmentData)
      ? {
          ...customerDataFormatter(assortmentData[0]),
          objDetails: assortmentDetail,
          assortmentID: assortmentId,
          assortmentName: assortmentData[0].assortmentName,
          description: assortmentData[0].description,
          assortmentType: assortmentData[0].assortmentType,
          store: assortmentData[0].store,
        }
      : {
          ...assortmentFormatter(
            { ...assortmentData, assortmentType: assortmentData.assortmentType as 'P' | 'B' | 'C' },
            mode,
            Number(assortmentId),
            assortmentDetail,
            type
          ),
          objDetails: assortmentDetail,
          assortmentID: assortmentData.assortmentID,
          assortmentName: assortmentData.assortmentName,
          description: assortmentData.description,
          assortmentType: assortmentData.assortmentType,
          store: assortmentData.store,
        }

    return <AssortmentManagementTableViewer data={formattedCustomerData} />
  }

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <AssortmentManagementTab />
          <div className="ms-auto">
            <ul className="flex gap-3 justify-end">
              <li>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Submitting' : 'Submit'}
                </Button>
              </li>
              <li>
                <Button type="button" onClick={handleClose}>
                  Cancel 
                </Button>
              </li>
            </ul>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default AssortmentManagementForm
