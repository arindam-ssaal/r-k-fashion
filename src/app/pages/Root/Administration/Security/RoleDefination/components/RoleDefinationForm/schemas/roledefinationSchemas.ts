import * as z from "zod";


export const roledefinationSchemas = z.object({
  roleID: z.string().optional(),
  roleName: z.string(),
  defineProfile: z.string().min(1, { message: "Designation Name is required" }).max(50, { message: "Designation Name should not exceed 50 characters" }),
  details: z.string(),
  remarks: z.string().optional(),
  enteredBy: z.number().optional(),
  usedFor: z.string().optional(),
  objRoleWiseMenu: z.array(
    z.object({
      roleID: z.number().optional(),
      menuID: z.number().optional(),
      objMenuWiseAction: z.array(
        z.object({
          roleID: z.number().optional(),
          menuID: z.number().optional(),
          actionID: z.number().optional(),
          checked: z.string().optional(),
        })
      ),
    })
  ),
});

