import * as z from "zod";

export const designationSchema = z.object({
  designationCode: z
    .string(),
    
  designationName: z
    .string()
    .min(1, { message: "Designation Name is required" })
    .max(50, { message: "Designation Name should not exceed 50 characters" }),
});
