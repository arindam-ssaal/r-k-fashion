export type FetchedStoreWisePolicyType = {
  storeSpecificPolicyID: number
  storeID: number
  fromDate: string
  
  toDate: string
  pendingSettlementDays: number | null | string
  footfallEntryRequiredInDaySettlement: string | null
  maxAllowDiscountPolicyValidationID: number | null | string
  maxBillAmountSinglePOSBill: number | null | string
  pan: string | null
  negativeStockCheckingModeID:number|null
  stockCheck: string | null
  creditCardDetailsCapturePolicyID: number | null | string
  isCCardAuthNoEntryMandatory: string | null
  allowBackDateEntry: string | null
  backDateEntryDays: number | null | string
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
  allowReceiveDamagedGoods: string | null
  dueDateMandatoryInPOSOrder: string | null
  minPercentageOfAdvanceDuringPOSOrder: number | null | string
  posOrderCancellationIsMandatory: string | null
  enteredBy: number | null | string
  usedFor: string | null
}

export type StoreWisePolicyResponseType = {
  returnCode: string
  returnMsg: string
}[]
