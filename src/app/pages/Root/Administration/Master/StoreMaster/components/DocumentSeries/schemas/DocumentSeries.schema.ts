import { z } from 'zod'

export const DocuemntSeriesSchema = z.object({
  transactionType: z.string().min(2, {
    message: 'Transaction Type must be at least 2 characters.',
  }),
  seriesname: z.string().min(2, {
    message: 'Seriesname must be at least 2 characters.',
  }),
  prefix: z.string().optional(),
  noOfDigits: z.string().min(2, {
    message: 'noofdigits must be at least 2 characters.',
  }),
  suffix: z.string().optional(),
  checkbox: z.boolean().optional(),
})

export const DocuemntSeriesschema = z.object({
  documentValues: z.array(DocuemntSeriesSchema),  // Use array of `DocuemntSeriesschema` objects
})