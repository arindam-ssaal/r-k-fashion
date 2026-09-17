import { z } from 'zod'

// Define the schema for each item in the `mopValues` array
const mopItemSchema = z.object({
  payMode: z.string().min(2, {
    message: 'Please select Pay Mode.',
  }),
  ledgers: z.string().min(2, {
    message: 'Please select Ledgers.',
  }),
  paymentCode: z.string().optional(),
  subLedger: z.string().optional(),
  crossStore: z.boolean().optional(),
  discontinue: z.boolean().optional(),
  test: z.array(z.object({
    value: z.string().optional(),
  })).optional(),
})

// Define the schema for the form, with `mopValues` as an array of `mopItemSchema`
export const Mopschema = z.object({
  mopValues: z.array(mopItemSchema),  // Use array of `mopItemSchema` objects
})
