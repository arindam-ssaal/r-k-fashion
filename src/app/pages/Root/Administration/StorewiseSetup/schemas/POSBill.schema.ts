import { z } from 'zod'
export const posBSillchema = z.object({
  storeName: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  allowItemLevelDiscount: z.boolean().optional(),
  allowBillLevelDiscount: z.boolean().optional(),
  maxAllowableDisPer: z.string().optional(),
  maxAllowableDisAmt: z.string().optional(),
  selectActivePromotion: z.boolean().optional(),
  clearAppliedPromotion: z.boolean().optional(),
  salePersonTagging: z.boolean().optional(),
  salePersonTaggingPolicy: z.string().optional(),
  customerTagging: z.boolean().optional(),
})