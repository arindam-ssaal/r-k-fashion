import { z } from 'zod'

export const logisticsScema = z.object({
  billToAddress: z.string().min(2, {
    message: 'Bill Address is required',
  }),

  //billToAddress: z.string().optional(),
  city: z.string().min(3, {
    message: 'City Field is  Required',
  }),
  postalCode: z.string().min(4, {
    message: 'Required',
  }),
  state: z.string().min(2, {
    message: 'State Required',
  }),
  cityTo: z.string().min(3, {
    message: 'City FIled is  Required',
  }),
  postalCodeTo: z.string().min(4, {
    message: 'Required',
  }),
  stateTo: z.string().min(2, {
    message: 'State Required',
  }),
  contactPerson: z.string().min(2, {
    message: 'Contact Person is required',
  }),
  contactNo: z.string().optional(),
  alcontactNo: z.string().optional(),
  emailId: z.string().min(2, {
    message: 'Email Id is required',
  }),
  shipToAddress: z.string().min(2, {
    message: 'Ship Address is required',
  }),
  sourcingWH: z.array(
    z.object({
      warehouse: z.string().min(1, { message: 'Warehouse is required' }),
      transitDays: z.string().min(1, { message: 'Transit Days are required' }),
    })
  ),

 
})
