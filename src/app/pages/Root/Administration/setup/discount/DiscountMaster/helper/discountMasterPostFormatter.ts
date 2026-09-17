import { z } from 'zod'

import { DiscountMasterSchema } from '../components/DiscountMasterForm/schema'
import useDiscountMasterStore from '../store/useDiscountMasterStore'

export type DiscountPostType = ReturnType<typeof discountMasterPostFormatter>



const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export default function discountMasterPostFormatter(
  id: number | string | null,
  data: z.infer<typeof DiscountMasterSchema>
) {
  const mode = useDiscountMasterStore.getState().mode as 'Create' | 'Edit' | 'Delete'
  const formattedData = {
    discountID: mode === 'Create' ? 0 : id,
    discountName: data.name ?? '',
    discountType: data.discountType ?? '',
    discountBase: data.discountBase ?? '',
    discountValue: data?.percentage,
    appliedOn: data.appliedOn ?? '',
    percentage:data?.percentage,
    employeeDiscount: data.employeeDiscount ?? 0,
    maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : 0,
    minimumBilling: data.minimumBilling ? Number(data.minimumBilling) : 0,
    otpRequired: data.otpRequired ? 'Y' : 'N',
    allowToChange: data.allowToChange ? 'Y' : 'N',
    isActive: data.inactive ? 'Y' : 'N', // Inactive thakle 'N', active thakle 'Y'
    enteredBy: 0,
    usedFor: operation[mode],
    discountAssortments: Array.isArray(data.assortments)
      ? data.assortments.map((item) => ({
          discountID:  mode === 'Create' ? 0 : id, // Always 0
          assortmentID: Number(item.assortmentID) || 0, // Ensure valid number
          assortmentName: item.assortmentName, // Default empty string if name missing
        }))
      : [],
  }
  return formattedData
}
