import {  useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'



function SalesPersonTab() {
  
  const { control } = useFormContext()
  return (
    <div className="border p-4 border-black border-solid h-[580px] overflow-y-auto">
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name="salesPerson.firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              First Name <span className="text-primary">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="First Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Last Name <span className="text-primary">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Last Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.mobileNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Mobile No.<span className="text-primary">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Mobile No." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.whatsappNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp No.<span className="text-primary">*</span></FormLabel>
            <FormControl>
              <Input placeholder="WhatsApp No." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employee ID</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange}  value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee ID" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add actual options here */}
                  <SelectItem value="emp1">EMP1</SelectItem>
                  <SelectItem value="emp2">EMP2</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.allocateRole"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allocate Role</FormLabel>
            <FormControl>
              <Input placeholder="Allocate Role" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.allocateUser"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allocate User</FormLabel>
            <FormControl>
              <Input placeholder="Allocate User" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salesPerson.inactive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel>Inactive</FormLabel>
          </FormItem>
        )}
      />      
    </div>
    </div>
  )
}

export default SalesPersonTab
