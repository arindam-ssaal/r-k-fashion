import { z } from 'zod'

import { PostStoreWisePolicySchema } from '../schemas/PostStoreWisePolicySchema'
import useStoreWisePolicyHead from '../store/useStoreWisePolicyHead'

import { formatDate } from '@/lib/utils'

export type StoreWisePolicyPostType = z.infer<typeof PostStoreWisePolicySchema>

const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export function StoreWisePolicyFormatter(
  data: z.infer<typeof PostStoreWisePolicySchema>,
  id: number | string | null
) {
  const mode = useStoreWisePolicyHead.getState().mode as 'Create' | 'Edit' | 'Delete'

  // Default structure with all required fields and default values
  const defaultData = {
    storeSpecificPolicyID: mode === 'Edit' ? id : 0,
    storeID: 0,
    fromDate: '',
    toDate: '',
    pendingSettlementDays: 0,
    footfallEntryRequiredInDaySettlement: '',
    maxAllowDiscountPolicyValidationID: 0,
    maxBillAmountSinglePOSBill: 0,
    pan: '',
    creditCardDetailsCapturePolicyID: 0,
    isCCardAuthNoEntryMandatory: '',
    allowBackDateEntry: '',
    backDateEntryDays: 0,
    negativeStockCheckingModeID: 0,
    allowItemLevelDiscount: '',
    maxAllowDiscountPercentage: 0,
    allowBillLevelDiscount: '',
    maxAllowDiscountAmount: 0,
    allowToSelectActivePromotionFromList: '',
    allowToClearAppliedPromotion: '',
    salePersonTaggingMandatory: '',
    salePersonTaggingPolicyID: 0,
    customerTaggingMandatory: '',
    returnOfItemWithin: 0,
    creditNoteValidityDays: 0,
    billTaggingMandatoryDuringReturn: '',
    noOfCopiesToBePrint: 0,
    excessGoodsReceiptTolerancePercentage: 0,
    shortGoodsReceiptTolerancePercentage: 0,
    allowReceiveDamagedGoods: '',
    dueDateMandatoryInPOSOrder: '',
    minPercentageOfAdvanceDuringPOSOrder: 0,
    posOrderCancellationIsMandatory: '',
    enteredBy: 0,
    usedFor: operation[mode],
  }

  // Merge input data with default structure
  return {
    ...defaultData,

    ...data,
    fromDate: formatDate(data.fromDate as string),
    toDate: formatDate(data.toDate as string),
  }
}
