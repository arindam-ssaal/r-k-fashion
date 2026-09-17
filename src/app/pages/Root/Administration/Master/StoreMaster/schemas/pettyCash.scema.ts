import { z } from 'zod'

export const Pettychema = z.object({
  pettycahHead: z.string().min(2, {
    message: 'Please select Petty Cash Head.',
  }),
  limit: z.string().optional(),
  typeofTransaction: z.string().min(2, {
    message: 'Please select TypeOf Transaction'
  }),
  ledger: z.string().min(2, {
    message: 'Please select Leadger'
  }),
  subLedger: z.string().optional(),
  discontinue: z.boolean().optional(),
  test: z.array(z.object({
    value: z.string().optional(),
  })).optional(),
  })

  
export const PettyCashschema = z.object({
  pettycashValues: z.array(Pettychema),  // Use array of `PettyCashschema` objects
})

 
