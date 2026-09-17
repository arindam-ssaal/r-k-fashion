import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import StoreWiseSetupTab from './components/StoreSpecificTab'
import { StoreWisePolicyFormatter } from './helper/StoreWisePolicyFormatter'
import { useCreateOrganizationPolicy } from './hooks_api/useCreateStoreWisePolicy'
import { useStorePolicyData } from './hooks_api/useStoreWisePolicyData'
import { PostStoreWisePolicySchema } from './schemas/PostStoreWisePolicySchema'
import { useStoreWisePolicyDataStore } from './store/useStoreWisePolicyDataStore'
import useStoreWisePolicyHead from './store/useStoreWisePolicyHead'

import { Button } from '@/components/ui/button'


function StoreSpecificPolicy() {
  const {storePolicyData}=useStorePolicyData(0,1);
  const { createStoreWisePolicy, error,isLoading } = useCreateOrganizationPolicy()
  const closeModal = useStoreWisePolicyHead((state) => state.toggleOpen)
  const clearId = useStoreWisePolicyDataStore((state) => state.clearStoreWisePolicyId)
const setMode=useStoreWisePolicyHead(state=>state.setMode)
  const formMethods = useForm({
    resolver: zodResolver(PostStoreWisePolicySchema),
    defaultValues: {
      storeID: '1',
      fromDate: '',
      toDate: '',
      pendingSettlementDays: 0,
      footfallEntryRequiredInDaySettlement: 'N',
      maxAllowDiscountPolicyValidationID: 0,
      maxBillAmountSinglePOSBill: 0,
      pan: '',
      creditCardDetailsCapturePolicyID: 0,
      isCCardAuthNoEntryMandatory: 'N',
      allowBackDateEntry: 'N',
      backDateEntryDays: 0,
      negativeStockCheckingModeID: '1',
      allowItemLevelDiscount: 'N',
      maxAllowDiscountPercentage: '0',
      allowBillLevelDiscount: 'N',
      maxAllowDiscountAmount: '0',
      allowToSelectActivePromotionFromList: 'N',
      allowToClearAppliedPromotion: 'N',
      salePersonTaggingMandatory: 'N',
      salePersonTaggingPolicyID: '1',
      customerTaggingMandatory: 'N',
      allowReceiveDamagedGoods:"N",
      returnOfItemWithin: 0,
      creditNoteValidityDays: 0,
      billTaggingMandatoryDuringReturn: 'N',
      noOfCopiesToBePrint: 0,
      excessGoodsReceiptTolerancePercentage: 0,
      shortGoodsReceiptTolerancePercentage: 0,
      dueDateMandatoryInPOSOrder: 'N',
      minPercentageOfAdvanceDuringPOSOrder: 0,
      posOrderCancellationIsMandatory: 'N',
    },
  })

  
  useEffect(() => {
    if (storePolicyData) {
      setMode('Edit');
      formMethods.reset({
        storeID: String(storePolicyData.storeID) || '1',
        fromDate: storePolicyData.fromDate || '',
        toDate: storePolicyData.toDate || '',
        pendingSettlementDays: Number(storePolicyData.pendingSettlementDays) || 20,
        footfallEntryRequiredInDaySettlement: String(storePolicyData.footfallEntryRequiredInDaySettlement) || 'N',
        maxAllowDiscountPolicyValidationID: Number(storePolicyData.maxAllowDiscountPolicyValidationID) || 1,
        maxBillAmountSinglePOSBill: Number(storePolicyData.maxBillAmountSinglePOSBill) || 0,
        pan: storePolicyData.pan || '8844443G',
        creditCardDetailsCapturePolicyID: Number(storePolicyData.creditCardDetailsCapturePolicyID) || 1,
        isCCardAuthNoEntryMandatory: storePolicyData.isCCardAuthNoEntryMandatory || 'N',
        allowBackDateEntry: storePolicyData.allowBackDateEntry || 'N',
        backDateEntryDays: Number(storePolicyData.backDateEntryDays) || 1,
        negativeStockCheckingModeID: String(storePolicyData.negativeStockCheckingModeID) || "1",
        allowItemLevelDiscount: storePolicyData.allowItemLevelDiscount || 'N',
        maxAllowDiscountPercentage: String(storePolicyData.maxAllowDiscountPercentage) || '2',
        allowBillLevelDiscount: storePolicyData.allowBillLevelDiscount || 'N',
        maxAllowDiscountAmount: String(storePolicyData.maxAllowDiscountAmount) || '2',
        allowToSelectActivePromotionFromList: storePolicyData.allowToSelectActivePromotionFromList || 'N',
        allowToClearAppliedPromotion: storePolicyData.allowToClearAppliedPromotion || 'N',
        salePersonTaggingMandatory: storePolicyData.salePersonTaggingMandatory || 'N',
        salePersonTaggingPolicyID: String(storePolicyData.salePersonTaggingPolicyID) || '1',
        customerTaggingMandatory: storePolicyData.customerTaggingIsMandatory || 'N',
        returnOfItemWithin: Number(storePolicyData.returnOfItemWithin) || 5,
        creditNoteValidityDays: Number(storePolicyData.creditNoteValidityDays) || 3,
        billTaggingMandatoryDuringReturn: storePolicyData.billTaggingMandatoryDuringReturn || 'N',
        noOfCopiesToBePrint: Number(storePolicyData.noOfCopiesToBePrint) || 4,
        excessGoodsReceiptTolerancePercentage:Number( storePolicyData.excessGoodsReceiptTolerancePercentage) || 33,
        shortGoodsReceiptTolerancePercentage: Number(storePolicyData.shortGoodsReceiptTolerancePercentage) || 32,
        allowReceiveDamagedGoods: String(storePolicyData.allowReceiveDamagedGoods) || 'N',
        dueDateMandatoryInPOSOrder: String(storePolicyData.dueDateMandatoryInPOSOrder) || 'N',
        minPercentageOfAdvanceDuringPOSOrder: Number(storePolicyData.minPercentageOfAdvanceDuringPOSOrder) || 20,
        posOrderCancellationIsMandatory: storePolicyData.posOrderCancellationIsMandatory || 'N',
      });
    } else {
      setMode('Create');
    }
  }, [storePolicyData, formMethods]);
  
  
  // Handle form submission
  async function onSubmit(data: z.infer<typeof PostStoreWisePolicySchema>) {
    const formattedData = StoreWisePolicyFormatter(data, 1)
    try {
       await createStoreWisePolicy(formattedData);
      closeModal()
      clearId()
    } catch (err) {
      if(err instanceof Error){
        throw new Error(err.message)
      }
    }
  }

  // Error handling
  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <StoreWiseSetupTab />
        <div className="h-[60px]  bottom-0 right-0 flex gap-2 justify-end items-center">
        <Button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ?"Updating":'Update'}
          </Button>
          <Button  className="btn btn-primary" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default StoreSpecificPolicy
