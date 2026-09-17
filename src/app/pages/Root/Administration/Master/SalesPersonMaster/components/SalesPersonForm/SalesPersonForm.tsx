import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import SalesPersonTab from './components/SalesPersonTab'
import StoreAllocationTab from './components/StoreAllocationTab'
import { salesPersonFormatter } from '../../helper/SalesPersonFormatter'
import { useCreateSalesPerson } from '../../hooks_api/useCreateSalesPerson'
import { useSalesPersonDataById } from '../../hooks_api/useSalesPersonDataByID'
import { SalesPersonFormSchema } from '../../schemas/SalesPersonForm.schema'
import useSalesPerson from '../../store/useSalesPerson'
import { useSalesPersonDataStore } from '../../store/useSalesPersonDataStore'

import SalesPersonViewer from '@/app/pages/Root/Administration/Master/SalesPersonMaster/components/SalesPersonTable/components/SalesPersonTableViewer'
import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function SalesPersonForm() {
  const { createSalesPerson, isPending, error } = useCreateSalesPerson()
  const closeModal = useSalesPerson((state) => state.close)
  const SalesPersonId = useSalesPersonDataStore((state) => state.currentSalesPersonId)
  const clearId = useSalesPersonDataStore((state) => state.clearCurrentSalesPersonId)
  const { salesPerson, isLoading } = useSalesPersonDataById(Number(SalesPersonId) || null)
  const mode = useSalesPerson((state) => state.mode)
  const formMethods = useForm({
    resolver: zodResolver(SalesPersonFormSchema),
    defaultValues: {
      salesPerson: {
        firstName: '',
        lastName: '',
        mobileNo: '',
        whatsappNo: '',
        email: '',
        employeeId: '',
        allocateRole: 'admin',
        allocateUser: '0',
        inactive: false,
      },
      storeAllocation: {
        allocations: [
          {
            storeName: '',
            storeCode: '',
            startDate: new Date(),
            endDate: new Date(),
            transferred: false,
          },
        ],
      },
    },
  })

  useEffect(() => {
    if (salesPerson) {
      formMethods.reset({
        salesPerson: {
          firstName: salesPerson?.firstName || 'Tushar',
          lastName: salesPerson?.lastName || 'dutta',
          mobileNo: salesPerson?.mobileNo || '9831112344',
          whatsappNo: salesPerson?.whatsAppNo || '3242324242',
          email: salesPerson?.email || 'tfegegr@gmail.com',
          employeeId: salesPerson?.employeeID || 'emp1',
          allocateRole: salesPerson?.allocateRole || 'admin',
          allocateUser: salesPerson?.allocateUser|| '2',
          inactive: salesPerson?.isActive === 'Y' || false,
        },
        storeAllocation: {
          allocations: salesPerson?.objDetails?.length
            ? salesPerson.objDetails.map((item) => ({
                storeName: item.storeName || '',
                storeCode: item.storeCode || '',
                startDate: item.startDate ? new Date(item.startDate) : new Date(),
                endDate: item.endDate ? new Date(item.endDate) : new Date(),
                transferred: item.isTransfered === 'Y',
              }))
            : [
                {
                  storeName: '',
                  storeCode: '',
                  startDate: new Date(),
                  endDate: new Date(),
                  transferred: false,
                },
              ],
        },
      })
    }
  }, [salesPerson, formMethods.reset]) // ✅ Dependency mein salesPerson aur reset rakho

  const onSubmit = formMethods.handleSubmit(
    async (data) => {
      // console.log('Form Data Submitted: ',) // Logs if submission is successful
      const transformData = salesPersonFormatter(data, Number(salesPerson?.salesPersonID))
      try {
        await createSalesPerson(transformData)
        closeModal()
        clearId()
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(err.message)
        }
      }
    },
  )

  if (isLoading) {
    return <GlobalViewerLoader />
  }

  if (mode === 'View') {
    return <SalesPersonViewer data={salesPerson} />
  }

  return (
    // <div className="border p-4 border-black border-solid h-[430px] overflow-y-auto">
    <FormProvider {...formMethods}>
      <form
        onSubmit={(e) => {
          e.preventDefault() // Ensure default form submission behavior is prevented
          onSubmit() // Trigger submission
        }}
      >
        <Tabs defaultValue="salesPerson" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="salesPerson">Sales Person</TabsTrigger>
            <TabsTrigger value="storeAllocation">Store Allocation</TabsTrigger>
          </TabsList>
          <TabsContent value="salesPerson">
            <div>
              <h3 className="heading-secondary mb-3 mt-3">Sales Person</h3>
              <SalesPersonTab />
            </div>
          </TabsContent>
          <TabsContent value="storeAllocation">
            <h3 className="heading-secondary mb-3 mt-3">Store Allocation</h3>
            <StoreAllocationTab />
          </TabsContent>
        </Tabs>

        <div className="h-[60px]  bottom-0 right-0 flex gap-3 justify-end items-center">
          <Button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
          <Button type='button' onClick={closeModal}>Cancel</Button>
        </div>
        {error && <p className="text-end">{error.message}</p>}
      </form>
    </FormProvider>
  )
}

export default SalesPersonForm
