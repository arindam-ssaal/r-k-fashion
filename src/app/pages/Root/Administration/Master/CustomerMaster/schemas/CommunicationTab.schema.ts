import { z } from 'zod'

export const CommunicationTabSchema = z.object({
  address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  pin: z.string().optional(),
  state: z.string().optional(),
  email: z.string().optional(),
  receivePushMessage: z.boolean().optional(),
  preferredCommunication: z.enum(['sms', 'email', 'whatsapp'], {
    // required_error: 'Preferred communication mode is required.',
  }),
})
