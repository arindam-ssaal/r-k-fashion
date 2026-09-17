import { z } from 'zod'

import { PostOrganizationPolicySchema } from '../schemas/PostOrganizationPolicySchema'
import useOrganizationPolicyHead from '../store/useOrganizationPolicyHead'

export type OrganizationPolicyFormFormatterType = z.infer<typeof PostOrganizationPolicySchema>

const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export function OrganizationPolicyFormatter(
  data: OrganizationPolicyFormFormatterType,
  id: number | string | null
) {
  const mode = useOrganizationPolicyHead.getState().mode as 'Create' | 'Edit' | 'Delete'

  // Default structure with all required fields and default values
  const defaultData = {
    orgPolicyID: mode === 'Edit' ? Number(id) : 0,
    pendingSettlementDays: 0,
    footfallEntryRequiredDaySettlement: 'string',
    maxAllowDiscountPolicyValidationID: 0,
    maxBillAmountSinglePOSBill: 0,
    pan: 'string',
    creditCardDetailsCapturePolicyID: 0,
    isCCardAuthNoEntryMandatory: 'string',
    allowBackDateEntry: 'string',
    backDateEntryDays: 0,
    picture: 'string',
    allowItemLevelDiscount: 'string',
    maxAllowDiscountPercentage: 0,
    allowBillLevelDiscount: 'string',
    maxAllowDiscountAmount: 0,
    negetiveStockCheckMode:0,
    allowToSelectActivePromotionFromList: 'string',
    allowToClearAppliedPromotion: 'string',
    salePersonTaggingMandatory: 'string',
    salePersonTaggingPolicyID: 0,
    customerTaggingIsMandatory: 'string',
    returnOfItemWithin: 0,
    creditNoteValidityDays: 0,
    billTaggingMandatoryDuringReturn: 'string',
    noOfCopiesToBePrint: 0,
    excessGoodsReceiptTolerancePercentage: 0,
    shortGoodsReceiptTolerancePercentage: 0,
    allowToReceiveDamagedGoods: 'string',
    dueDateIsMandatoryInPOSOrder: 'string',
    minPercentageOfAdvanceDuringPOSOrder: 0,
    posOrderCancellationIsMandatory: 'string',
    enteredBy: 0,
    usedFor: operation[mode],
  }

  // Merge input data with default structure
  return {
    ...defaultData,
    ...data,
    pendingSettlementDays:Number(data.pendingSettlementDays),
    creditCardDetailsCapturePolicyID:Number(data.creditCardDetailsCapturePolicyID),
    negetiveStockCheckMode:(data.negativestockcheckingmode)
  }
}
