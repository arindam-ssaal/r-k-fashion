import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { userAllocateUserSchema } from './schema/userAllocateUserSchema'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

function AllocateStore({ value, onChange }: { value: Record<string, unknown>[]; onChange: (rows: Record<string, unknown>[]) => void }) {
  const form = useForm({
    resolver: zodResolver(userAllocateUserSchema),
    defaultValues: {
      rows: [
        {
          storeName: '',
          fromDate: '1990-01-01',
          toDate: '2000-03-09',
          discontinued: '',
          default: false,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rows',
  })

  const onSubmit = (data: z.infer<typeof userAllocateUserSchema>) => {
    console.log(data)
  }

  const addRow = () => {
    append({
      storeName: '',
      fromDate: '',
      toDate: '',
      discontinued: '',
      default: false,
    })
  }

  useEffect(() => {
    onChange(form.getValues('rows'))
  }, [form.watch('rows')])

  return (
    <Form {...form}>
      <h1 className="m-2">Allocate Site / Store</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-4 gap-4">
            {/* Store Name */}
            <FormField
              name={`rows.${index}.storeName`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a store..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store1">Store 1</SelectItem>
                        <SelectItem value="store2">Store 2</SelectItem>
                        <SelectItem value="store3">Store 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* From Date */}
            <FormField
              name={`rows.${index}.fromDate`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Date</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="From Date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* To Date */}
            <FormField
              name={`rows.${index}.toDate`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Date</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="To Date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discontinued */}
            <FormField
              name={`rows.${index}.discontinued`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discontinued</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a discontinue..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discontinued1">Discontinued 1</SelectItem>
                        <SelectItem value="discontinued2">Discontinued 2</SelectItem>
                        <SelectItem value="discontinued3">Discontinued 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Default (Radio Buttons) */}
            <FormField
              name={`rows.${index}.default`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`default-yes-${index}`}
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="h-4 w-4"
                      />
                      {/* <label htmlFor={`default-yes-${index}`}>Set as Default</label> */}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions (Add/Remove Buttons) */}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => remove(index)}>
                Remove
              </Button>
              {index === fields.length - 1 && (
                <Button type="button" onClick={addRow}>
                  Add Row
                </Button>
              )}
            </div>
          </div>
        ))}
       
      </form>
    </Form>
  )
}

export default AllocateStore
