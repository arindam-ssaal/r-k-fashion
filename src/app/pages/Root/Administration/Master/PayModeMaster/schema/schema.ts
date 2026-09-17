import { z } from 'zod'

export const formSchema = z.object({
  paymentModeName: z.string().nonempty({ message: 'Payment Mode Name is required.' }),
  shortCode: z.string().nonempty({ message: 'Short Code is required.' }),
  paymentMethod: z.string().nonempty({ message: 'Payment method is required.' }),
  objCondition: z.array(
    z.object({
      conditionId: z.number().default(0),
      paymentModeID: z.number().default(0),
      conditionDesc: z.string(),
      isEnabled: z.string().default('Y'),
    })
  ),
  objCurrency: z.array(
    z.object({
      currencyID: z.number().default(0),
      paymentModeID: z.number().default(0),
      currencyCode: z.string().nonempty({ message: 'Currency Code is required.' }),
      currencyName: z.string().nonempty({ message: 'Currency Name is required.' }),
    })
  ),

  // availablePaymentmethod: z.string().nonempty({ message: "Available Payment Method is required." }),
  // isActive: z.string().default("true"),
  // enteredBy: z.number().default(0),
  // usedFor: z.string().optional(),
  // objCondition: z.array(
  //   z.object({
  //     conditionID: z.number().default(0),
  //     paymentModeID: z.number().default(0),
  //     conditionDesc: z.string(),
  //     isEnabled: z.string().default("false"),
  //   })
  // ),
})
