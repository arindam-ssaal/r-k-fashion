import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import DiscountMasterFormSetup from './components/DiscountMasterFormSetup'
import DiscountMasterSetupAssortmentModal from './components/DiscountMasterSetupAssortmentModal'
import { DiscountMasterSchema } from './schema'
// import { useDiscountMasterDataStore } from '../../../DiscountAssortmentManagement/store/useDiscountAssortmentManagementDataStore'
import mapdiscountSetupFetchedTypeToTableData from '../../helper/DiscountDataTableExtractor'
import discountMasterPostFormatter from '../../helper/discountMasterPostFormatter'
import { useCreateDiscountMaster } from '../../hooks_api/useCreateDiscountMasterData'
import { useDiscountMasterData } from '../../hooks_api/useDiscountMasterData'
import { useDiscountMasterDataById } from '../../hooks_api/useDiscountMasterDataById'
import useDiscountMasterStore from '../../store/useDiscountMasterStore'
import { useDiscountnMasterDataStore } from '../../store/useDiscountMasterStoreData'
import DiscountMasterTableViewer from '../DiscountMasterTable/components/DiscountMasterTableViewer'
import { DiscountSetupDataType } from '../DiscountMasterTable/components/DiscountMasterTableViewer/DiscountMasterTableViewer'

import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'


function DiscountMasterForm() {
  const mode = useDiscountMasterStore((state) => state.mode)
   const clearId = useDiscountnMasterDataStore((state) => state.clearCurrentDiscountnMasterId)
  const DiscountMasterhId = useDiscountnMasterDataStore((state) => state.currentDiscountnMasterId)
  const closeModal = useDiscountMasterStore((state) => state.close)
  const { DiscountMaster,isLoading } = useDiscountMasterDataById(Number(DiscountMasterhId) || null)
  const {
    DiscountMasterData,
    isLoading: customerLoading,
    error: customerError,
  } = useDiscountMasterData()

  const { createDiscountMaster, error, isPending } = useCreateDiscountMaster()

  if (customerLoading && mode === 'View') {
    return <GlobalViewerLoader />
  }

  if (mode === 'View' && !customerLoading) {
    if (!DiscountMasterData) return <h3>No data available</h3> // ✅ Handle undefined case

    const formattedCustomerData: DiscountSetupDataType = Array.isArray(DiscountMasterData)
      ? mapdiscountSetupFetchedTypeToTableData(DiscountMasterData[0]) // ✅ Extract first element
      : mapdiscountSetupFetchedTypeToTableData(DiscountMasterData) // ✅ Direct mapping if object

    return (
      <h3>
        <DiscountMasterTableViewer data={formattedCustomerData} />
      </h3>
    )
  }
  if (customerError && mode === 'View') {
    return <h3>Sorry there is some problem</h3>
  }

  const formMethods = useForm<z.infer<typeof DiscountMasterSchema>>({
    resolver: zodResolver(DiscountMasterSchema),
    defaultValues: {
      name: '',
      discountType: 'G',
      discountBase: 'P',
      appliedOn: 'L',
      employeeDiscount: 'Y',
      percentage: 0,
      maximumDiscount: 0,
      minimumBilling: 0,
      otpRequired: false,
      allowToChange: false,
      inactive: false,
      assortments: [{ assortmentID: '', assortmentName: '' }],
    },
  })

  useEffect(() => {
    if (DiscountMaster && mode==='Edit') {
      formMethods.reset({
        name: DiscountMaster?.discountName || "",
        discountType: DiscountMaster?.discountType || "G",
        discountBase: DiscountMaster?.discountBase || "P",
        appliedOn: DiscountMaster?.appliedOn || "L",
        employeeDiscount: DiscountMaster?.employeeDiscount || "N",
        discountValue: DiscountMaster?.discountValue || 0,
        percentage: DiscountMaster?.discountValue ?? 0,
       // percentage: DiscountMaster?.percentage ?? 0, // Ensure it's a number
        maximumDiscount: DiscountMaster?.maximumDiscount ?? 0,
        minimumBilling: DiscountMaster?.minimumBilling ?? 0,
        otpRequired: DiscountMaster?.otpRequired === "Y", // Convert to boolean
        allowToChange: DiscountMaster?.allowToChange === "Y",
        inactive: DiscountMaster?.isActive === "Y",
        assortments: DiscountMaster?.discountAssortments?.map((item) => ({
          assortmentID: item.assortmentID.toString(), // Ensure it's a string (if needed)
          assortmentName: item.assortmentName || "",
        })) || [],
      });
    }
  }, [DiscountMaster, formMethods.reset,mode]);
  

console.log(DiscountMaster);


  const onSubmit = formMethods.handleSubmit(
    async (data) => {
      // console.log('Form Data Submitted: ',) // Logs if submission is successful
      const transformData = discountMasterPostFormatter(Number(DiscountMaster?.discountID), data)
      try {
        await createDiscountMaster(transformData)
        closeModal()
        clearId()
        // console.log(transformData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(err.message)
        }
      }
    },
    (err) => {
      console.log(err)
    }
  )

  return (
    <div>
      <FormProvider {...formMethods}>
        <form
          onSubmit={(e) => {
            e.preventDefault() // Ensure default form submission behavior is prevented
            onSubmit() // Trigger submission
          }}
        >
          <Tabs defaultValue="setup" className="w-full  ">
            <TabsList className="grid grid-cols-2 gap-4 mb-6">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
            </TabsList>
            <TabsContent value="setup">
              <DiscountMasterFormSetup />
            </TabsContent>
            <TabsContent value="terms">Change your terms here.</TabsContent>
          </Tabs>
          <DiscountMasterSetupAssortmentModal />
          <div className="h-[60px] sticky bottom-0 right-0 flex gap-3 justify-end items-center">
            <Button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          {error && <p className="text-end">{error.message}</p>}
        </form>
      </FormProvider>
    </div>
  )
}

export default DiscountMasterForm
