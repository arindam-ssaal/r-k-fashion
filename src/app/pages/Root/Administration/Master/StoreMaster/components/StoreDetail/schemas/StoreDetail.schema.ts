import { z } from 'zod'

// Define the form schema with all required fields
export const storeDetailFormSchema = z.object({
  storeName: z.string().min(2, {
    message: 'Store Name must be at least 2 characters.',
  }),
  storeCode: z.string().min(2, {
    message: 'Store Code  is required',
  }),
  startDate: z.string().min(2, {
    message: 'Start Date is empty',
  }),
  closeDate: z.string().optional(),
  storeSize: z.string().optional(),
  default: z.string().min(2, {
    message: 'Default w/h is empty',
  }),
  defaultSale: z.string().min(2, {
    message: 'Default sale w/h is empty',
  }),
  defaultReturn: z.string().min(2, {
    message: 'Default Return  w/h is empty',
  }),
  GSTIN: z.string().min(2, {
    message: 'GSTIN is empty',
  }),
  date: z.string().optional(),
  state: z.string().min(2, {
    message: 'Date is empty',
  }),
  factor: z.string().optional(),
  //category: z.string().optional(),
  priceList: z.string().min(2, {
    message: 'Price List is empty',
  }),
  factorIfAny: z.string().optional(),
  storeType: z.string().min(2, {
    message: 'Store Type is empty',
  }),
  category: z.string().optional(),
  franchise: z.string().optional(),
  operationType: z.string().min(2, {
    message: 'Operation Type is empty',
  }),
  inActive: z.boolean().optional(),
})
