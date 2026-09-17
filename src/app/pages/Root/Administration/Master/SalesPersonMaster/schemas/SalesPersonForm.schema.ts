import { z } from "zod";

import { salesPersonSchema } from "./SalesPerson.schema";
import { storeAllocationSchema } from "./StoreAllocation.schema";

export const SalesPersonFormSchema = z.object({
    salesPerson: salesPersonSchema, // Store details form schema
    storeAllocation: storeAllocationSchema,          // Logistics form schema
  });
  