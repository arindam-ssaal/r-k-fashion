'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import useMemberStore from '../CustomerBox/components/MemberForm/store/useMemberFormStore'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  middleName: z.string().optional(), // Middle name is optional
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  mobileNo: z.string().min(10, {
    message: 'Mobile number must be at least 10 digits.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  city: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  state: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  pin: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  dob: z.string().nonempty({ message: 'Date of Birth is required.' }),
  doa: z.string().optional(), // Date of Anniversary is optional
  spouseName: z.string().optional(), // Spouse Name is optional
  createdOn: z.string().nonempty({ message: 'Creation date is required.' }),
})

function CustomerCreate() {
  const phoneNo = useMemberStore((state) => state.phoneNo)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      mobileNo: phoneNo || '',
      address: '',
      dob: '',
      doa: '',
      spouseName: '',
      city: '',
      state: '',
      pin: '',
      createdOn: '', // This will be set to the current date in the useEffect
    },
  })

  useEffect(() => {
    form.setValue('createdOn', new Date().toISOString().split('T')[0]) // Sets to today's date in YYYY-MM-DD format
  }, [form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <div className="customer-create">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" grid grid-cols-2 gap-3">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Middle Name */}
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter middle name (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile Number */}
          <FormField
            control={form.control}
            name="mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your CIty" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Pin */}
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Pin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Enter date of birth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Anniversary */}
          <FormField
            control={form.control}
            name="doa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Anniversary (optional)</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Enter date of anniversary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Spouse Name */}
          <FormField
            control={form.control}
            name="spouseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spouse Name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter spouse name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Created On */}
          <FormField
            control={form.control}
            name="createdOn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Created On</FormLabel>
                <FormControl>
                  <Input type="date" disabled {...field} />
                </FormControl>
                <FormDescription>This field is auto-filled with today's date.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-full text-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CustomerCreate
