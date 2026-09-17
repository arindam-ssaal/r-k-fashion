'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { FieldValues, UseFormReturn, Path } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Generalize DateInputProps to work with any form containing a date field
interface DateInputProps<T extends FieldValues> {
  form: UseFormReturn<T> // UseFormReturn is the return type of useForm hook
  name: Path<T> // Path allows us to safely refer to the fields of the form
}

// Forward ref to the button inside DateInput for external focus
export const DateInput = forwardRef<HTMLButtonElement, DateInputProps<any>>(
  ({ form, name }, ref) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col mt-auto gap-1">
            <FormLabel>Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    ref={ref} // Forward the ref here to allow focus from parent
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left text-[12px] font-normal flex gap-3',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? format(field.value as Date, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon size={14} className="ml-auto opacity-50 text-primary" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? (field.value as Date) : undefined} // Use undefined if null
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
)

DateInput.displayName = 'DateInput'
