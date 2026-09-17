import { z } from 'zod'

import { formSchema } from '../schema/schema'

export type PaymodePostType = {
  paymentModeID: number | string | null
  paymentModeName: string
  displayOrder: number
  shortCode: string
  availablePaymentmethod: string
  isActive: string
  enteredBy: number
  usedFor: string
  objCondition: {
    conditionId: string | number
    paymentModeID: number | string
    conditionDesc: string
    isEnabled: string
  }[]
  objCurrency: {
    currencyID: string | number // Accept both string and number
    paymentModeID: number | string
    currencyCode: string
    currencyName: string
  }[]
}
const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
  View: 'V',
}

export function transformFormData(
  data: z.infer<typeof formSchema>,
  mode: 'Create' | 'Edit' | 'Delete' | 'View',
  selectedId: number | null | string
): PaymodePostType {

  console.log(mode);
  
  return {
    paymentModeID: mode === 'Create' ? 0 : (selectedId ?? 0),
    paymentModeName: data.paymentModeName,
    displayOrder: 0,
    shortCode: data.shortCode,
    availablePaymentmethod: data.paymentMethod,
    isActive: 'Y',
    enteredBy: 0,
    usedFor: operation[mode],
    objCondition: data.objCondition
      .filter((condition) => condition.isEnabled === 'Y') // Keep only enabled conditions
      .map((condition) => ({
        ...condition,
        conditionId: String(condition.conditionId), // Convert conditionId to string
        paymentModeID: mode === 'Create' ? 0 : (selectedId ?? 0),
        isEnabled: 'Y', // Normalize isEnabled to boolean
      })),
    objCurrency: data.objCurrency.map((currency) => ({
      ...currency,
      paymentModeID: mode === 'Create' ? 0 : (selectedId ?? 0),
      currencyID: String(currency.currencyID), // Convert currencyID to string
    })),
  }
}
