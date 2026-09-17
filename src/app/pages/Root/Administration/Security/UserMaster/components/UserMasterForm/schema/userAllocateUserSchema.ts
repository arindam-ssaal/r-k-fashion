import { z } from "zod";


export const userAllocateUserSchema = z.object({
    storeName: z
        .string()
        .min(1, { message: "Store Name is required" })
        .max(20, { message: "Store Name should not exceed 20 characters" }),
         
        fromDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
            message: 'Invalid date format',
          }), // Ensures the date is a valid string format like 'YYYY-MM-DD'
          toDate:z.string().refine((date) => !isNaN(new Date(date).getTime()), {
            message: 'Invalid date format',
          }), // Ensures the date is a valid string format like 'YYYY-MM-DD'
   
          discontinued: z.string(),
          default: z.boolean()
});