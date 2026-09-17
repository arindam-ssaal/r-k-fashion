import { z } from 'zod'

export const posOrderSchema = z.object({
  storeName: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  dueDateMandatory: z.boolean().optional(),
  minAdvancePercentage: z.string().optional(),
  posOrderCancellationMandatory: z.boolean().optional(),
})
