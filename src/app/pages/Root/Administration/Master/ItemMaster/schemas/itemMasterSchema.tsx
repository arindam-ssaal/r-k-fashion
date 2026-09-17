import { z } from "zod";


export const  itemMasterSchema = z.object({
    itemCode: z.string().optional(),
    barCode: z.string().optional(),
    itemName: z.string().optional(),
    itemGroup: z.number().optional(),
    retailPrice: z.number().optional(),
    mrp: z.number().optional(),
})