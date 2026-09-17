import { format } from 'date-fns'
import { CalendarIcon, Trash } from 'lucide-react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

function StoreAllocationTab() {
  // Access form control from the form context
  const { control } = useFormContext()
  // Initialize useFieldArray with the correct path
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'storeAllocation.allocations', // Path should match the combined schema
  })

  const transferredValues =
    useWatch({
      control,
      name: 'storeAllocation.allocations',
    }) || []

  return (
    <div className="border p-4 border-black border-solid h-[580px] overflow-y-auto">
      <div className="items-center space-y-4">
        {fields.map((field, index) => {
          const transferred = transferredValues[index]?.transferred

          return (
            <div className="grid grid-cols-5 items-center gap-3" key={field.id}>
              {/* Store Name */}
              <FormField
                control={control}
                name={`storeAllocation.allocations.${index}.storeName`}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>
                      Store Name <span className="text-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Store" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Add actual store name options here */}
                          <SelectItem value="store1">Store 1</SelectItem>
                          <SelectItem value="store2">Store 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Store Code */}
              <FormField
                control={control}
                name={`storeAllocation.allocations.${index}.storeCode`}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Store Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Store Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={control}
                name={`storeAllocation.allocations.${index}.startDate`}
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel className="mb-1">Start Date <span className="text-primary">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0) // Normalize to midnight
                            return date < today
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* End Date */}
              <FormField
                control={control}
                name={`storeAllocation.allocations.${index}.endDate`}
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel className="mb-1">End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={!transferred}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0) // Normalize to midnight
                            return date <= today
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transferred */}
              <div className="flex items-center gap-3 mt-auto col-span-1">
                <FormField
                  control={control}
                  name={`storeAllocation.allocations.${index}.transferred`}
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="ml-2">Transferred</FormLabel>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash size={14} />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          onClick={() =>
            append({
              storeName: '',
              storeCode: '',
              startDate: new Date(),
              endDate: new Date(),
              transferred: false,
            })
          }
        >
          Add Row
        </Button>
      </div>
    </div>
  )
}

export default StoreAllocationTab
