import { z } from "zod";

export const DiscountMasterSchema = z.object({
  name: z.string().nonempty("Name is required"),
  discountType: z.enum(["G", "A"]),
  discountBase: z.enum(["P", "A"]),
  percentage: z
    .preprocess((value) => (value === "" ? undefined : Number(value)), z.number().min(0, "Value must be non-negative").optional()),
  appliedOn: z.enum(["L", "I", "B"]),
  employeeDiscount: z.enum(["Y", "N"]),
  maximumDiscount: z
    .preprocess((value) => (value === "" ? undefined : Number(value)), z.number().min(0, "Value must be non-negative").optional()),
  minimumBilling: z
    .preprocess((value) => (value === "" ? undefined : Number(value)), z.number().min(0, "Value must be non-negative").optional()),
  otpRequired: z.boolean(),
  allowToChange: z.boolean(),
  inactive: z.boolean(),
  assortments: z
  .array(
    z.object({
      assortmentID: z.preprocess(
        (val) => {
          if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) {
            return Number(val); // Convert to number if it's a valid numeric string
          }
          return val; // Keep the original value (or let validation fail)
        },
        z.number().positive("Invalid Assortment ID").or(z.literal("")),
      ),
      assortmentName: z.string().nonempty("Assortment name is required"),
    })
  )
  .optional(),
});
