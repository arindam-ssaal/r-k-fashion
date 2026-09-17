import { z } from 'zod'

export const userMasterSchema = z.object({
  userName: z.string().min(1, { message: 'Name is required' }),
  userCode: z.string().min(1, { message: 'User code is required' }),
  associatedCompany: z.string().min(1, { message: 'Company is required' }),
  associatedBranch: z.string().min(1, { message: 'Branch is required' }),
  dateOfBirth: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Invalid date format',
  }), // Ensures the date is a valid string format like 'YYYY-MM-DD'
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Gender is required' }),
  mobileNo: z.string().regex(/^\d{10}$/, { message: 'Invalid mobile number' }),
  mailId: z.string().email({ message: 'Invalid email address' }),
  sapUserId: z.string().optional(),
  userPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  employeeCodeFromSAP: z.string().optional(),
  active: z.boolean(),
  approvedUser: z.boolean(),
  roles: z.string().refine((role) => ['Accountant', 'Director', 'Sales', 'Audit','Dev',"Loading","Purchase"].includes(role), {
    message: 'Invalid role selected',
  }),
  assignedCompanies: z
    .array(z.string())
    .min(1, { message: 'At least one company must be selected' }), // Validates at least one company is selected
  assignedBranches: z.array(z.string()).min(1, { message: 'At least one branch must be selected' }), // Validates at least one branch is selected
})
