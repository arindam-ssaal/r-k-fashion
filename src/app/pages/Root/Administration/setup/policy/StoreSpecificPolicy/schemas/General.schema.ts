import { z } from 'zod'

export const generalSchema = z
  .object({
    storeName: z.string().min(2, {
      message: 'Store Name is required',
    }),
    fromDate: z.date(),
    toDate: z.date().optional(),
    pendingSettlement: z.string().optional(),
    footfallEntry: z.boolean().optional(),
    maxAllowable: z.string().optional(),
    maxBillingAmt: z.string().optional(),
    panNo: z.string().min(10, {
      message: 'PAN No. is less than or more than 10 characters',
    }),
    creditCardDetails: z.string().optional(),
    crcardAutho: z.string().optional(),
    backDateEntry: z.boolean().optional(),
    backDateDays: z.boolean().optional(),
    stockCheck: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.fromDate) return true // যদি `fromDate` না থাকে, তাহলে যাচাই দরকার নেই
      const today = new Date()
      today.setHours(0, 0, 0, 0) // আজকের তারিখকে মধ্যরাতে সেট করুন
      return data.fromDate >= today // `fromDate` আজকের পরে হতে হবে
    },
    { message: 'From Date cannot be prior to today.', path: ['fromDate'] }
  )
  .refine(
    (data) => {
      if (!data.fromDate || !data.toDate) return true // যদি যেকোনো একটা তারিখ না থাকে, তাহলে যাচাই দরকার নেই
      return data.toDate >= data.fromDate // `toDate` অবশ্যই `fromDate`-এর পরে বা সমান হতে হবে
    },
    { message: 'To Date cannot be prior to From Date.', path: ['toDate'] }
  )
