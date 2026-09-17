import { z } from 'zod'

export const PostOrganizationPolicySchema = z.object({
  pendingSettlementDays: z.number().optional(),
  footfallEntryRequiredDaySettlement: z.enum(['Y', 'N']).optional(),
  maxAllowDiscountPolicyValidationID: z.string().optional(),
  maxBillAmountSinglePOSBill: z.string().optional(),
  pan: z.string().optional(),
  creditCardDetailsCapturePolicyID: z.string().optional(),
  isCCardAuthNoEntryMandatory: z.enum(['Y', 'N']).optional(),
  allowBackDateEntry: z.enum(['Y', 'N']).optional(),
  backDateEntryDays: z.number().optional(),
  negativestockcheckingmode: z.string().optional(),
  picture: z.string().optional(),
  noOfCopiesToBePrint: z
    .number({ invalid_type_error: "Must be a number" })
    .min(1, "At least 1 copy required")
    .max(5, "Maximum 5 copies allowed"),
  //POS BILL
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
  customerTaggingIsMandatory: z.enum(['Y', 'N']).optional(),
  //Credit Note
  returnOfItemWithin: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(1, 'Minimum 1 day required')
    .max(365, 'Maximum 365 days allowed'),
  creditNoteValidityDays: z
  .number({ invalid_type_error: "Must be a number" })
  .min(1, "Minimum 1 day required")
  .max(365, "Maximum 365 days allowed"),
  billTaggingMandatoryDuringReturn: z.enum(['Y', 'N']).optional(),
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
  //POS ORDER
  dueDateIsMandatoryInPOSOrder: z.enum(['Y', 'N']).optional(),
  minPercentageOfAdvanceDuringPOSOrder: z
  .number({ invalid_type_error: "Must be a number" })
  .min(0, "Advance percentage cannot be less than 0%")
  .max(100, "Advance percentage cannot exceed 100%"),
  posOrderCancellationIsMandatory: z.enum(['Y', 'N']).optional(),
})
