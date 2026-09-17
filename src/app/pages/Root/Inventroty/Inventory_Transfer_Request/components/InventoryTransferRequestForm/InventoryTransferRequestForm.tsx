import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'


import useInventoryTransferRequestType from '../../store/useInventoryTransferRequestType'
import InventryTransferRequestDetailForm from '../InventryTransferRequestDetailForm/InventryTransferRequestDetailForm'

import { combinedSchema } from '@/app/pages/Root/Administration/Master/StoreMaster/schemas/storeMaster.schema'
import { Button } from '@/components/ui/button'
// Schema for validation

function InventoryTransferRequestForm() {
 const closeModal = useInventoryTransferRequestType((state) => state.close) 
  const formMethods = useForm({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      storeDetail: {
        storeName: 'Demo Store',
        storeCode: 'DS123',
        startDate: '2024-01-01',
        closeDate: '2025-01-01',
        storeSize: '2000 sqft',
        default: 'Default Warehouse 1',
        defaultSale: 'Sale Warehouse A',
        defaultReturn: 'Return Warehouse B',
        GSTIN: '29ABCDE1234F2Z5',
        date: '2024-01-01',
        state: 'Karnataka',
        factor: '1.5',
        priceList: 'Standard Price List',
        factorIfAny: 'Special Factor',
        storeType: 'Retail',
        category: 'Electronics',
        franchise: 'Demo Franchise',
        operationType: 'Retail Operation',
        inActive: false,
      },
      logistics: {
        billToAddress: '123 Demo Street, Demo City',
        city: 'pune',
        postalCode: '560001',
        state: 'Karnataka',
        cityTo: 'pune',
        postalCodeTo: '560001',
        stateTo: 'Karnataka',
        contactPerson: 'John Doe',
        contactNo: '1234567890',
        alcontactNo: '0987654321',
        emailId: 'john.doe@example.com',
        shipToAddress: '456 Ship St, Demo City',
        sourcingWH: [
          {
            warehouse:"",
            transitDays:"",
          }
        ],
       
      },
      mop: {
        mopValues: [
          {
            payMode: '',
            ledgers: '',
            subLedger: '',
            paymentCode: '',
            crossStore: false,
            discontinue: false,
          },
        ],
      },
      pettyCash: {
        pettycashValues: [
          {
            pettycahHead: '',
            limit: '',
            typeofTransaction: '',
            ledger: '',
            subLedger: '',
            discontinue: false,
          },
        ],
      },
      documentSeries: {
        documentValues: [
          {
            transactionType: '',
            seriesname: '',
            prefix: '',
            noOfDigits: '',
            suffix: '',
            checkbox: false,
          },
        ],
      },
      ledgers: {
        ledgerValue: [
          {
            ledger: '',
            subLedger: '',
            costCentre: '',
            discontinue: false,
          },
        ],
      },
    },
  })

  // Handle form submission
  const onSubmit = formMethods.handleSubmit(
    (data) => {
      console.log('Form Data Submitted: ', data) // Logs if submission is successful
    },
    (errors) => {
      console.log('Validation Errors: ', errors) // Logs validation errors, if any
    }
  )

  return (
    <FormProvider {...formMethods}>
      <form
      className=''
        onSubmit={(e) => {
          e.preventDefault() // Ensure default form submission behavior is prevented
          onSubmit() // Trigger submission
        }}
      >
        <InventryTransferRequestDetailForm />
       
       
        <div className="h-[60px]  flex  gap-3 justify-end items-center  ">
          <Button type="submit" className=" btn btn-primary">
            Save 
          </Button>
          <Button  onClick={closeModal}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default InventoryTransferRequestForm
