import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

function PersonalTab() {
  const { control } = useFormContext()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)

  const { watch, setValue } = useFormContext()
  const mobileNo = watch('personal.mobileNo')
  const [sameAsMobile, setSameAsMobile] = useState(false)

  useEffect(() => {
    if (sameAsMobile) {
      setValue('personal.whatsappNo', mobileNo)
    }
  }, [mobileNo, sameAsMobile])
  return (
    <div className=" space-y-8">
      <div className="space-y-2 ">
        <div className="flex gap-5 justify-between ">
          {/* <div className=''>
            
          </div> */}
          {/* {Mobile No} */}
          <FormField
            control={control}
            name="personal.mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mobile No. <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" maxLength={10} placeholder="Enter Mobile No." {...field} />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          {/* Same as Mobile No checkbox */}
          <div className="flex items-center mt-6 space-x-2">
            <input
              type="checkbox"
              id="sameAsMobile"
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('personal.whatsappNo', mobileNo)
                }
                else{
                  setValue('personal.whatsappNo','')
                }
              }}
            />
            <label htmlFor="sameAsMobile" className="text-sm">
              Same as Mobile No.
            </label>
          </div>

          {/* WhatsApp No. */}
          <FormField
            control={control}
            name="personal.whatsappNo"
            disabled={sameAsMobile}
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp No.</FormLabel>
                <FormControl>
                  <Input type="number" maxLength={10} placeholder="Enter WhatsApp No." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alternate Phone No. */}
          <FormField
            control={control}
            name="personal.alternatePhoneNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternate Phone No.</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    maxLength={10}
                    placeholder="Enter alternate phone no."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={control}
            name="personal.firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="personal.middleName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Middle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="personal.lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 items-center  ">
          <FormField
            control={control}
            name="personal.gender"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex  space-x-4 roles-radio"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <FormLabel htmlFor="male">Male</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <FormLabel htmlFor="female">Female</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trans" id="trans" />
                    <FormLabel htmlFor="trans">Transgender</FormLabel>
                  </div>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-4 ">
          <FormField
            control={control}
            name="personal.dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        onClick={() => setIsOpen(true)}
                        variant="outline"
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
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
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(d) => {
                        field.onChange(d)
                        setIsOpen(false) // close after selection
                      }}
                      disabled={(date) => date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personal.anniversaryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Anniversary Date</FormLabel>
                <Popover open={isOpen2} onOpenChange={setIsOpen2}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        onClick={() => setIsOpen2(true)}
                        variant="outline"
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
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
                      mode="single"
                      selected={
                        field.value && !isNaN(new Date(field.value).getTime())
                          ? new Date(field.value)
                          : undefined
                      }
                      onSelect={(d) => {
                        field.onChange(d)
                        setIsOpen2(false) // close after selection
                      }}
                      disabled={(date) => date < new Date('1900-01-01')} // Allow future anniversary dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 ">
          <FormField
            control={control}
            name="personal.profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Profession" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personal.spouseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spouse Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Spouse Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="space-y-3 ">
        <h3 className="text-lg font-semibold">Statutory Information</h3>

        <div className="flex gap-3 items-center">
          <FormField
            control={control}
            name="personal.panNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {/* <span className="text-primary">*</span> */}
                  PAN No.
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter PAN No." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="personal.gstNo"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>GST No.</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter GST No."
                    {...field}
                    maxLength={15} // Max 15 characters
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personal.gstDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>GST Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
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
                      mode="single"
                      selected={
                        field.value && !isNaN(new Date(field.value).getTime())
                          ? new Date(field.value)
                          : undefined
                      }
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date('1900-01-01')} // Allow future anniversary dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default PersonalTab
