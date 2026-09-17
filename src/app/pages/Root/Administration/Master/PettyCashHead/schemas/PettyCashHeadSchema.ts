import { z } from "zod";

export const  PettyCashHeadSchema = z.object({
  pettyCashCode: z.string().min(1, { message: '	No duplicate code and petty cash head.' }),
  accountCode: z.string().min(1, { message: 'No duplicate code and petty cash head.' }),
  pettyCashName: z.string().min(5,{message: 'No duplicate code and petty cash head.'}),
  modeOfOperation: z.string().optional(),
  limit: z.string().optional(),
  remarks: z.string().optional(),
  isActive: z.boolean().optional(),
  enteredBy: z.string().optional(),
  usedFor: z.string().optional(),
  })