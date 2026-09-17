import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
//import { useEffect } from 'react'

//import { StoreMasterFormatter } from '../../helper/StoreMasterFormatter'
import mapStoreMasterFetchedTypeToTableData from '../../helper/StoreMasterDataTbleExtracter'
import { StoreMasterFormatter } from '../../helper/StoreMasterFormatter'
import { useCreateStoreMaster } from '../../hooks_api/useCreateStoreMaster'
import { useStoreMasterById } from '../../hooks_api/useFetchStoreMasterById'
import { StoreMasterHeadSchema } from '../../schemas/StoreMasterHeadSchema'
import { useStoreMasterDataStore } from '../../store/useStoreMasterDataStore'
import useStoreMasterHead, { useStoreMasterStore } from '../../store/useStoreMasterStore'
import StoreMasterTab from '../StoreMasterTab'
import StoreMasterTableViewer, {
  StoreMasterTableData,
} from '../StoreMasterTable/components/StoreMasterTableViewer/StoreMasterTableViewer'

import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { Button } from '@/components/ui/button'

function StoreMasterForm() {
  const storeId = useStoreMasterDataStore((state) => state.currentStoreMasterId)
  const { storeMaster, isLoading } = useStoreMasterById(Number(storeId))
  const { isPending, error, createStoremaster } = useCreateStoreMaster()
  const closeModal = useStoreMasterHead((state) => state.close)

  const mode = useStoreMasterStore((state) => state.mode)
  const formMethods = useForm({
    resolver: zodResolver(StoreMasterHeadSchema),
    defaultValues: {
      storeCode: '0022',
      storeName: 'store234',
      startDate: new Date().toISOString(),
      closeDate: '',
      storeSize: 0,
      defaultWarehouseCode: '',
      defaultWarehouseName: '',
      defaultSaleWarehouseCode: '',
      defaultReturnWarehouseCode: '',
      GSTIN: '',
      GSTINDate: new Date().toISOString(),
      stateCode: '',
      stateName: '',
      priceList: '',
      factorIfAny: '',
      storeTypeCode: '',
      storeTypeName: '',
      storeCategoryCode: '',
      storeCategoryName: '',
      franchiseCode: '',
      franchiseName: '',
      operationTypeCode: '',
      operationTypeName: '',
      isActive: 'N',
      billToAddress: '',
      shipToAddress: '',
      billToCity: '',
      billToPostalCode: '',
      billToState: '',
      shipToCity: '',
      shipToPostalCode: '',
      shipToState: '',
      contactPerson: '',
      contactNumber: '',
      emailId: '',
      sourcingWarehouse: [],

      objPayMode: [],

      objPettyCash: [],
      objSeries: [],
      objLedger: [],
    },
  })

  useEffect(() => {
    if (mode === 'Edit' && storeMaster) {
      formMethods.reset({
        storeCode: storeMaster.storeCode ?? '',
        storeName: storeMaster.storeName ?? '',
        startDate: storeMaster?.startDate
          ? new Date(storeMaster?.startDate.split('-').reverse().join()).toDateString()
          : '',
        closeDate: storeMaster?.closeDate
          ? new Date(storeMaster?.closeDate.split('-').reverse().join()).toDateString()
          : '',
        // startDate: storeMaster.startDate
        //   ? new Date(storeMaster?.startDate).toDateString()
        //   : '',
        // closeDate: storeMaster.closeDate
        //   ? new Date(storeMaster.closeDate).toDateString()
        //   : '',
        storeSize: storeMaster.storeSize ?? 0,
        defaultWarehouseCode: storeMaster.defaultWarehouseCode ?? '',
        defaultWarehouseName: storeMaster.defaultWarehouseName ?? '',
        defaultSaleWarehouseCode: storeMaster.defaultSaleWHCode ?? '',
        defaultReturnWarehouseCode: storeMaster.defaultReturnWHCode ?? '',
        GSTIN: storeMaster.gstin ?? '',
        GSTINDate: storeMaster.gstinDate
          ? new Date(storeMaster?.gstinDate.split('-').reverse().join()).toDateString()
          : '',

        stateCode: storeMaster.gstinState ?? '',
        stateName: storeMaster.gstinState ?? '',
        priceList: storeMaster.priceListName ?? '',
        factorIfAny: storeMaster.factor ?? '',
        storeTypeCode: storeMaster.storeTypeCode ?? '',
        storeTypeName: storeMaster.storeTypeName ?? '',
        storeCategoryCode: storeMaster.storeCategoryCode ?? '',
        storeCategoryName: storeMaster.storeCategoryName ?? '',
        franchiseCode: storeMaster.franchiseCode ?? '',
        franchiseName: storeMaster.franchiseName ?? '',
        operationTypeCode: storeMaster.operationTypeCode ?? '',
        operationTypeName: storeMaster.operationTypeName ?? '',
        isActive: storeMaster.isActive ?? 'N',
        billToAddress: storeMaster.billAddress ?? '',
        shipToAddress: storeMaster.shipAddress ?? '',
        billToCity: storeMaster.billCity ?? '',
        billToPostalCode: storeMaster.billPostalCode ?? '',
        billToState: storeMaster.billStateCode ?? '',
        shipToCity: storeMaster.shipCity ?? '',
        shipToPostalCode: storeMaster.shipPostalCode ?? '',
        shipToState: storeMaster.shipStateCode ?? '',
        contactPerson: storeMaster.contactPerson ?? '',
        contactNumber: String(storeMaster.contactNumber) || '',
        emailId: storeMaster.email ?? '',
        // sourcingWarehouse: storeMaster.objWareHouse || [],
        // objPayMode: storeMaster.objPayMode || [],
        // objPettyCash: storeMaster.objPettyCash || [],
        // objSeries: storeMaster.objSeries || [],
        // objLedger: storeMaster.objLedger || [],
      })
    }
  }, [storeMaster, mode, formMethods.reset])

  const onSubmit = formMethods.handleSubmit(
    async (data) => {
      const transformData = StoreMasterFormatter(data, 1)
      console.log(transformData)

      try {
        await createStoremaster(transformData)
        closeModal()
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

  if (isLoading && mode === 'View') {
    return <GlobalViewerLoader />
  }

  if (!isLoading && mode === 'View') {
    if (!storeMaster) return <h3>No data available</h3> // ✅ Handle undefined case
    const formattedStoremasterData: StoreMasterTableData = Array.isArray(storeMaster)
      ? mapStoreMasterFetchedTypeToTableData(storeMaster[0]) // ✅ Extract first element
      : mapStoreMasterFetchedTypeToTableData(storeMaster) // ✅ Direct mapping if object
    return <StoreMasterTableViewer data={formattedStoremasterData} />

    // JSON.stringify(storeMaster)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        {/* {JSON.stringify(storeMaster)} */}
        <div className="border p-4 border-black border-solid h-[650px] overflow-y-auto">
          <StoreMasterTab />
        </div>

        <div className="h-[60px]  bottom-0 right-0 flex gap-3 justify-end items-center">
          <Button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </div>
        {error && <p className="text-end">{error.message}</p>}
      </form>
    </FormProvider>
  )
}

export default StoreMasterForm
