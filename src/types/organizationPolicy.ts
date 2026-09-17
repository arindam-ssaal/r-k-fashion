export type FetchedOrganizationPolicyType = {
  orgPolicyID: number | null | string
  pendingSettlementDays: number | null | string
  footfallEntryRequiredDaySettlement: string | null
  maxAllowDiscountPolicyValidationID: number | null | string
  maxBillAmountSinglePOSBill: number | null | string
  pan: string | null
  negativestockcheckingmode: string | null
  creditCardDetailsCapturePolicyID: number | null | string
  isCCardAuthNoEntryMandatory: string | null
  allowBackDateEntry: string | null
  backDateEntryDays: number | null | string
  picture: string | null
  numberOfCopiesPrint:string|null
  allowItemLevelDiscount: string | null
  maxAllowDiscountPercentage: number | null | string
  allowBillLevelDiscount: string | null
  maxAllowDiscountAmount: number | null | string
  allowToSelectActivePromotionFromList: string | null
  allowToClearAppliedPromotion: string | null
  salePersonTaggingMandatory: string | null
  salePersonTaggingPolicyID: number | null | string
  customerTaggingIsMandatory: string | null
  returnOfItemWithin: number | null | string
  creditNoteValidityDays: number | null | string
  billTaggingMandatoryDuringReturn: string | null
  noOfCopiesToBePrint: number | null | string
  excessGoodsReceiptTolerancePercentage: number | null | string
  shortGoodsReceiptTolerancePercentage: number | null | string
  allowToReceiveDamagedGoods: string | null
  dueDateIsMandatoryInPOSOrder: string | null
  minPercentageOfAdvanceDuringPOSOrder: number | null | string
  posOrderCancellationIsMandatory: string | null
  enteredBy: number | null | string
  usedFor: string | null
}

export type OrganizationPolicyResponseType = {
  returnCode: string
  returnMsg: string
}[]
