import { z } from 'zod';

// Define the form schema with all required fields
export const storeDetailFormSchema = z.object({
  storeName: z.string().min(2, {
    message: 'Store Name must be at least 2 characters.',
  }),
  storeCode: z.string().min(2, {
    message: 'Store Code is required',
  }),
  startDate: z
    .string()
    .min(1, { message: 'Start Date is required' })
    .refine(
      (date) => {
        const today = new Date();
        const start = new Date(date);
        return start >= today;
      },
      { message: 'Start Date cannot be earlier than today' }
    ),
  closeDate: z
    .string()
    .optional()
    .refine(
      (date, ctx) => {
        if (!date || !ctx?.parent?.startDate) return true;
        const close = new Date(date);
        const start = new Date(ctx.parent.startDate);
        return close >= start;
      },
      { message: 'Close Date cannot be earlier than Start Date' }
    ),
  storeSize: z.string().optional(),
  default: z.string().min(2, {
    message: 'Default w/h is empty',
  }),
  defaultSale: z.string().min(2, {
    message: 'Default sale w/h is empty',
  }),
  defaultReturn: z.string().min(2, {
    message: 'Default Return w/h is empty',
  }),
  GSTIN: z.string().min(2, {
    message: 'GSTIN is empty',
  }),
  date: z.string().optional(),
  state: z.string().min(2, {
    message: 'State is empty',
  }),
  factor: z.string().optional(),
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
});

