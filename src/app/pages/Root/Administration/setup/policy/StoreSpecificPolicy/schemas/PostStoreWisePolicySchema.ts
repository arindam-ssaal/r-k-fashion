import { z } from 'zod'

export const PostStoreWisePolicySchema = z.object({
  //"storeSpecificPolicyID": 0,
  storeID: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  pendingSettlementDays: z.number().optional(),
  footfallEntryRequiredInDaySettlement: z.enum(['Y', 'N']).optional(),
  maxAllowDiscountPolicyValidationID: z.string().optional(),
  maxBillAmountSinglePOSBill: z.number().optional(),
  pan: z.string().min(10, { message: 'Pan No. must be at least 10 digits.' }).max(10),
  creditCardDetailsCapturePolicyID: z.string().optional(),
  isCCardAuthNoEntryMandatory: z.enum(['Y', 'N']).optional(),
  allowBackDateEntry: z.enum(['Y', 'N']).optional(),
  backDateEntryDays: z.number().optional(),
  negativeStockCheckingModeID: z.enum(["1", "2", "3"]).optional(),

  //pos Bill
  allowItemLevelDiscount: z.enum(['Y', 'N']).optional(),
  allowBillLevelDiscount: z.enum(['Y', 'N']).optional(),
  maxAllowDiscountPercentage: z
    .string()
    .regex(/^\d+$/, 'Only numbers allowed') // Allow only numbers
    .refine((val) => val === '' || (Number(val) >= 0 && Number(val) <= 100), {
      message: 'Discount percentage must be between 0 and 100',
    })
    .optional(),
  maxAllowDiscountAmount: z.string().optional(),
  allowToSelectActivePromotionFromList: z.enum(['Y', 'N']).optional(),
  allowToClearAppliedPromotion: z.enum(['Y', 'N']).optional(),
  salePersonTaggingMandatory: z.enum(['Y', 'N']).optional(),
  salePersonTaggingPolicyID: z.string().optional(),
  noOfCopiesToBePrint: z
    .number({ invalid_type_error: "Must be a number" })
    .min(1, "At least 1 copy required")
    .max(5, "Maximum 5 copies allowed"),
  customerTaggingMandatory: z.enum(['Y', 'N']).optional(),

  //credit Note
  returnOfItemWithin: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(1, 'Minimum 1 day required')
    .max(365, 'Maximum 365 days allowed'),
  creditNoteValidityDays: z
  .number({ invalid_type_error: "Must be a number" })
  .min(1, "Minimum 1 day required")
  .max(365, "Maximum 365 days allowed"),

  //Goods Receipt Return
  excessGoodsReceiptTolerancePercentage: z
  .number({ invalid_type_error: "Must be a number" })
  .min(0, "Minimum 0% required")
  .max(15, "Maximum 15% allowed"),

shortGoodsReceiptTolerancePercentage: z
  .number({ invalid_type_error: "Must be a number" })
  .min(0, "Minimum 0% required")
  .max(10, "Maximum 10% allowed"),
  allowToReceiveDamagedGoods: z.enum(['Y', 'N']).optional(),

  
  billTaggingMandatoryDuringReturn: z.enum(['Y', 'N']).optional(),
  allowReceiveDamagedGoods: z.enum(['Y', 'N']).optional(),
  dueDateMandatoryInPOSOrder: z.enum(['Y', 'N']).optional(),
  minPercentageOfAdvanceDuringPOSOrder: z
  .number({ invalid_type_error: "Must be a number" })
  .min(0, "Advance percentage cannot be less than 0%")
  .max(100, "Advance percentage cannot exceed 100%"),
  posOrderCancellationIsMandatory: z.enum(['Y', 'N']).optional(),
  
})
