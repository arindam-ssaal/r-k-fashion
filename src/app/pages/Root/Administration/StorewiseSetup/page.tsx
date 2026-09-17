
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'



import StoreWiseSetupTab from './components/StoreWiseSetupTab'
import { GeneralSetupSchema } from '../setup/policy/OrganizationPolicy/schemas/GeneralSetup.schema'

import { Button } from '@/components/ui/button'


function StoreWiseSetupPage() {
  const formMethods = useForm({
    resolver: zodResolver(GeneralSetupSchema),
    defaultValues:{
      GeneralSchema:{
        pendingSettlement:"23"
      },
      POSBill:{
        allowItemLevelDiscount:false
      },
      PsOrder:{
        dueDateMandatory:false
      },
      CreditNoteSchema:{
        returnItem:'22'
      },
      GoodsRecRet: {
        excessGoodsReceiptTolerance: '22'
      }
    }
  
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
        onSubmit={(e) => {
          e.preventDefault() // Ensure default form submission behavior is prevented
          onSubmit() // Trigger submission
        }}
      >
        <StoreWiseSetupTab />
        <div className="h-[60px] flex justify-end items-center space-x-2">
          <Button type="submit" className=" btn btn-primary">
            Submit All
          </Button>
          <Button type="reset" className=" btn btn-primary">
            Cancel All
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default StoreWiseSetupPage