import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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

function MemberShipTab() {
  const { control } = useFormContext()

  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Customer Category */}
      <FormField
        control={control}
        name="membership.customerCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Category</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Customer Category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add options here */}
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Membership Category */}
      <FormField
        control={control}
        name="membership.membershipCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Membership Category</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Membership Category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add options here */}
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Membership No. */}
      <FormField
        control={control}
        name="membership.membershipNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Membership No.</FormLabel>
            <FormControl>
              <Input placeholder="Enter Membership No." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Valid Till */}
      <FormField
        control={control}
        name="membership.validTill"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Membership Valid Till</FormLabel>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    onClick={() => setIsOpen(true)}
                    variant="outline"
                    className={cn(
                      'pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value && !isNaN(new Date(field.value).getTime()) ? (
                      format(new Date(field.value), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                 maxDate={new Date('2050-12-31')}
                 minDate={new Date('2025-01-01')}  
                  mode="single"
                  selected={
                    field.value && !isNaN(new Date(field.value).getTime())
                      ? new Date(field.value)
                      : undefined
                  }
                  onSelect={(d) => {
                    field.onChange(d)
                    setIsOpen(false) // close after selection
                  }}
                  disabled={(date) => date < new Date()} // ❌ Past Dates Disabled
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default MemberShipTab
