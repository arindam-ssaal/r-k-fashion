import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import OrganizationTab from './components/OrganizationTab'
import { OrganizationPolicyFormatter } from './helper/OrganizationPolicyFormatter'
import { useCreateOrganizationPolicy } from './hooks_api/useCreateOrganizationPolicy'
import { useOrganizationPolicyData } from './hooks_api/useOrganizationPolicyData'
import { PostOrganizationPolicySchema } from './schemas/PostOrganizationPolicySchema'
import { useOrganizationPolicyDataStore } from './store/useOrganizationPolicyDataStore'
import useOrganizationPolicyHead from './store/useOrganizationPolicyHead'

import GlobalViewerLoader from '@/components/GlobalViewerLoader'
import { Button } from '@/components/ui/button'

function OrganizationPage() {
  const { createOrganizationPolicy, isPending } = useCreateOrganizationPolicy()
  const { organizationPolicyData, isLoading } = useOrganizationPolicyData()
  const clearId = useOrganizationPolicyDataStore((state) => state.clearOrganizationPolicyId)
  const setMode = useOrganizationPolicyHead((state) => state.setMode)
  const closeModal = useOrganizationPolicyHead( (state) => state.close)
  const formMethods = useForm({
    resolver: zodResolver(PostOrganizationPolicySchema),
    defaultValues: {
      pendingSettlementDays: 0,
      footfallEntryRequiredDaySettlement: '',
      maxAllowDiscountPolicyValidationID: '',
      maxBillAmountSinglePOSBill: '',
      pan: '',
      creditCardDetailsCapturePolicyID: '',
      isCCardAuthNoEntryMandatory: '',
      allowBackDateEntry: '',
      backDateEntryDays: 0,
      negativestockcheckingmode: '',
      picture: '',
      noOfCopiesToBePrint: 0,
      allowItemLevelDiscount: '',
      allowBillLevelDiscount: '',
      maxAllowDiscountPercentage: '',
      maxAllowDiscountAmount: '',
      allowToSelectActivePromotionFromList: '',
      allowToClearAppliedPromotion: '',
      salePersonTaggingMandatory: '',
      salePersonTaggingPolicyID: '',
      customerTaggingIsMandatory: '',
      returnOfItemWithin: 0,
      creditNoteValidityDays: 0,
      billTaggingMandatoryDuringReturn: '',
      numberOfCopiesPrint: '',
      excessGoodsReceiptTolerancePercentage: 0,
      shortGoodsReceiptTolerancePercentage: 0,
      allowToReceiveDamagedGoods: '',
      dueDateIsMandatoryInPOSOrder: '',
      minPercentageOfAdvanceDuringPOSOrder: 0,
      posOrderCancellationIsMandatory: '',
    },
  })

  useEffect(() => {
    if (organizationPolicyData?.length > 0) {
      setMode('Edit')
      const lastPolicy = organizationPolicyData?.[0]
      formMethods.reset({
        pendingSettlementDays: Number(lastPolicy?.pendingSettlementDays) || 30,
        footfallEntryRequiredDaySettlement: lastPolicy?.footfallEntryRequiredDaySettlement || 'N',
        maxAllowDiscountPolicyValidationID:
          String(lastPolicy?.maxAllowDiscountPolicyValidationID) || 'PERCENT',
        maxBillAmountSinglePOSBill: String(lastPolicy?.maxBillAmountSinglePOSBill) || '22',
        pan: String(lastPolicy?.pan) || '',
        creditCardDetailsCapturePolicyID:
          String(lastPolicy?.creditCardDetailsCapturePolicyID) || '4',
        isCCardAuthNoEntryMandatory: String(lastPolicy?.isCCardAuthNoEntryMandatory) || 'N',
        allowBackDateEntry: String(lastPolicy?.allowBackDateEntry) || 'N',
        backDateEntryDays: Number(lastPolicy?.backDateEntryDays) || 5,
        negativestockcheckingmode: String(lastPolicy?.negetiveStockCheckMode) || '1',
        picture: String(lastPolicy?.picture) || '',
        allowItemLevelDiscount: String(lastPolicy?.allowItemLevelDiscount) || 'N',
        allowBillLevelDiscount: String(lastPolicy?.allowBillLevelDiscount) || 'N',
        maxAllowDiscountPercentage: String(lastPolicy?.maxAllowDiscountPercentage) || '0',
        maxAllowDiscountAmount: String(lastPolicy?.maxAllowDiscountAmount) || '0',
        allowToSelectActivePromotionFromList:
          String(lastPolicy?.allowToSelectActivePromotionFromList) || 'N',
        allowToClearAppliedPromotion: String(lastPolicy?.allowToClearAppliedPromotion) || 'N',
        salePersonTaggingMandatory: String(lastPolicy?.salePersonTaggingMandatory) || 'N',
        salePersonTaggingPolicyID: String(lastPolicy?.salePersonTaggingPolicyID) || '1',
        customerTaggingIsMandatory: String(lastPolicy?.customerTaggingIsMandatory) || 'N',
        returnOfItemWithin: Number(lastPolicy?.returnOfItemWithin) || 0,
        creditNoteValidityDays: Number(lastPolicy?.creditNoteValidityDays) || 0,
        billTaggingMandatoryDuringReturn:
          String(lastPolicy?.billTaggingMandatoryDuringReturn) || 'N',
        noOfCopiesToBePrint: Number(lastPolicy?.noOfCopiesToBePrint) || 0,
        excessGoodsReceiptTolerancePercentage:
          Number(lastPolicy?.excessGoodsReceiptTolerancePercentage) || 0,
        shortGoodsReceiptTolerancePercentage:
          Number(lastPolicy?.shortGoodsReceiptTolerancePercentage) || 0,
        allowToReceiveDamagedGoods: String(lastPolicy?.allowToReceiveDamagedGoods) || 'N',
        dueDateIsMandatoryInPOSOrder: String(lastPolicy?.dueDateIsMandatoryInPOSOrder) || 'N',
        minPercentageOfAdvanceDuringPOSOrder:
          Number(lastPolicy?.minPercentageOfAdvanceDuringPOSOrder) || 0,
        posOrderCancellationIsMandatory: String(lastPolicy?.posOrderCancellationIsMandatory) || 'N',
      })
    } else {
      setMode('Create')
    }
  }, [organizationPolicyData])

  async function onSubmit(data: z.infer<typeof PostOrganizationPolicySchema>) {
    try {
      const formattedData = OrganizationPolicyFormatter(
        data,
        String(organizationPolicyData?.[0]?.orgPolicyID)
      )
      await createOrganizationPolicy(formattedData)
      console.log(formattedData);
      
      closeModal()
      clearId()
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }
    }
  }

  if (isLoading) {
    return <GlobalViewerLoader />
  }


  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <OrganizationTab />
        <div className="h-[60px]  bottom-0 right-0 gap-3 flex justify-end items-center">
          <Button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? 'Submiting' : 'Submit'}
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default OrganizationPage
