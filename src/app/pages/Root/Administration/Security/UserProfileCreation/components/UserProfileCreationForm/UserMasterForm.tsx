import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { userMasterSchema } from './schema'
import { useUserProfileCreationStore } from '../../store/useUserProfileCreationStore'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const UserMasterForm = () => {
  const closeModal = useUserProfileCreationStore((state) => state.close)

  const form = useForm({
    resolver: zodResolver(userMasterSchema),
    defaultValues: {
      userName: 'John Doe',
      userCode: 'JD123',
      associatedCompany: 'TEST',
      associatedBranch: 'UNIT - 4',
      dateOfBirth: '1990-01-01',
      gender: 'Male' as 'Male' | 'Female' | 'Other',
      mobileNo: '1234567890',
      mailId: 'john.doe@example.com',
      sapUserId: 'SAP123',
      userPassword: 'password123',
      employeeCodeFromSAP: 'EMP001',
      active: true,
      approvedUser: false,
      roles: 'Accountant',
      assignedCompanies: ['TEST', 'BARASAT'],
      assignedBranches: ['UNIT - 4', 'UNIT - 5'],
    },
  })

  const onSubmit: (data: z.infer<typeof userMasterSchema>) => void = (data) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="px-3 py-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Name */}
            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Code */}
            <FormField
              name="userCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Code</FormLabel>
                  <FormControl>
                    <Input placeholder="User code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Associated Company */}
            <FormField
              name="associatedCompany"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Associated Branch */}
            <FormField
              name="associatedBranch"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Branch</FormLabel>
                  <FormControl>
                    <Input placeholder="Branch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date of Birth */}
            <FormField
              name="dateOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString().split('T')[0] : '')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile No */}
            <FormField
              name="mobileNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile No</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SAP User ID */}
            <FormField
              name="sapUserId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SAP User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="SAP User ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Password */}
            <FormField
              name="userPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employee Code */}
            <FormField
              name="employeeCodeFromSAP"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Code (SAP)</FormLabel>
                  <FormControl>
                    <Input placeholder="Code from SAP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active */}
            <FormField
              name="active"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-2 mt-1">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Checkbox
                      id="active"
                      className="h-8 w-8"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Approved User */}
            <FormField
              name="approvedUser"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-2 mt-1">
                  <FormLabel>Approved User</FormLabel>
                  <FormControl>
                    <Checkbox
                      className="h-8 w-8"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="px-3 py-4 space-y-8">
          <div>
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="font-semibold text-md">
                    Assigned Role (Select One)
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                    >
                      {['Accountant', 'Director', 'Sales', 'Audit', 'Dev', 'Loading', 'Purchase'].map((role) => (
                        <FormItem key={role} className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value={role} id={role} />
                          </FormControl>
                          <FormLabel htmlFor={role}>{role}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              name="assignedCompanies"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="font-semibold text-md">
                    Assigned Companies (Select One or More)
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {['TEST', 'BARASAT', 'HOWRAH', 'Job Work'].map((company) => (
                        <FormItem key={company} className="flex items-center">
                          <Checkbox
                            checked={field.value.includes(company)}
                            onCheckedChange={(checked) => {
                              const value = field.value
                              if (checked) {
                                field.onChange([...value, company])
                              } else {
                                field.onChange(value.filter((v: string) => v !== company))
                              }
                            }}
                            id={company}
                          />
                          <FormLabel htmlFor={company} className="ml-2">
                            {company}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              name="assignedBranches"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="font-semibold text-md">
                    Assigned Branches (Select One or More)
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {[
                        'UNIT - 4',
                        'UNIT - 5',
                        'UNIT - 6',
                        'UNIT - 7',
                        'UNIT - 8',
                        'UNIT - 9',
                        'UNIT - 10',
                        'UNIT02',
                        'UNIT01',
                      ].map((branch) => (
                        <FormItem key={branch} className="flex items-center">
                          <Checkbox
                            checked={field.value.includes(branch)}
                            onCheckedChange={(checked) => {
                              const value = field.value
                              if (checked) {
                                field.onChange([...value, branch])
                              } else {
                                field.onChange(value.filter((v: string) => v !== branch))
                              }
                            }}
                            id={branch}
                          />
                          <FormLabel htmlFor={branch} className="ml-2">
                            {branch}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button type="submit" className="w-full sm:w-auto">
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UserMasterForm