import { z } from 'zod'

export const creditNoteSchema = z.object({
  storeName: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  returnItem: z.string().optional(),
  creditNoteValidityDays: z.string().optional(),
  billTaggingMandatory: z.boolean().optional(),
  numberOfCopiesPrint: z.string().optional(),
})
