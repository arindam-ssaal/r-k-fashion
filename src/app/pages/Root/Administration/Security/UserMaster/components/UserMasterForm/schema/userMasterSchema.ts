import * as z from "zod";

export const userMasterSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "User Name is required" })
    .max(50, { message: "User Name should not exceed 50 characters" }),
    
    loginId: z
    .string()
    .min(1, { message: "Login Id is required" })
    .max(10, { message: "Login Id should not exceed 10 characters" }),
    password: z
    .string()
    .min(6, { message: "Password should not be less than 6 characters"})
    .max(15, { message: "Password should not exceed 15 characters" }),

    confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password should  be match with Password"})
    .max(15, { message: "Confirm Password should  be match with Password" }),

    employeeId: z
    .string()
    .min(1, { message: "Employee Id is required" })
    .max(10, { message: "Employee Id should not exceed 10 characters" }),

    mobileNo: z
    .string()
    .min(1, { message: "Mobile no should  be at least 10 characters"})
    .max(11, { message: "Mobile no should not exceed 11 characters" }),

    email: z
    .string()
    .min(6, { message: "Email shound be contain alpha numaric"})
    .max(15, { message: "Email should not  be cross 14 char " }),

    whatsappNo: z
    .string()
    .min(8, { message: "Whatsapp no should not be less than 8 characters"})
    .max(10, { message: "Whatsapp no should not exceed 10 characters" }),

    defineProfile: z
    .string(),

    defineRole: z
    .string(),

    remarks: z
    .string(),

    isActive: z
    .boolean()
});
