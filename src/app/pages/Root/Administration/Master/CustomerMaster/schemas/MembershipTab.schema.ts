import { z } from "zod";

export const MembershipTabSchema = z.object({
    customerCategory: z.string().optional(),
    membershipCategory: z.string().optional(),
    membershipNo: z.string().optional(),
    validTill: z.coerce
    .date()
    .min(new Date())
  
  })