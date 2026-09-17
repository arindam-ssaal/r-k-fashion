import { z } from 'zod';

export const storeAllocationSchema = z.object({
  allocations: z.array(
    z
      .object({
        storeName: z.string().min(1, { message: 'Store Name is required.' }),
        storeCode: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        transferred: z.boolean().optional().default(false),
      })
      .refine(
        (data) => {
          if (!data.startDate) return true; // No validation needed if startDate is absent
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize to midnight
          return data.startDate >= today;
        },
        { message: 'Start Date cannot be prior to the current date.', path: ['startDate'] }
      )
      .refine(
        (data) => {
          if (!data.startDate || !data.endDate) return true; // No validation if one is missing
          return data.endDate >= data.startDate;
        },
        { message: 'End Date cannot be prior to the Start Date.', path: ['endDate'] }
      )
  ),
});
