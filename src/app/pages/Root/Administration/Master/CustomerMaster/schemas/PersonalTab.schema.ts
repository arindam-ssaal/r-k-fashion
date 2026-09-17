import { z } from 'zod'

// const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

const personalTabBaseSchema = z.object({
  mobileNo: z
    .string()
    .min(10, { message: 'Mobile No. must be exactly 10 digits.' })
    .max(10, { message: 'Mobile No. must be exactly 10 digits.' })
    .regex(/^\d+$/, { message: 'Only numbers are allowed in Mobile No.' }),
  whatsappNo: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'WhatsApp No must be 10 digits',
    }),

  alternatePhoneNo: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'Alternate Phone No must be 10 digits',
    }),

  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.enum(['male', 'female', 'trans'], { message: 'Gender is required.' }),
  dateOfBirth: z.coerce.date().optional(),

  anniversaryDate: z.coerce.date().optional(),
  profession: z.string().optional(),
  spouseName: z.string().optional(),
  isEmployee: z.boolean().optional(),
  panNo: z
    .string()

    .optional(),
  gstNo: z
    .string()

    .optional(),
  gstDate: z.date().optional(),
})

export const personalTabSchema = personalTabBaseSchema.refine(
  (data) => {
    // If gstNo is provided, then gstDate must also be provided.
    if (data.gstNo && !data.gstDate) {
      return false
    }
    return true
  },
  {
    path: ['gstDate'], // error path
    message: 'GST Date must be provided when GST Number is given.',
  }
)
