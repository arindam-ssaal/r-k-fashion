import axios from 'axios'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  storeCodeOptions,
  categoryOptions,
  franchiseType,
  operationTypeOptions,
  franchiseOptions,
  stateOptions,
  storeTypeOptions,
  warehouseOptions,
  priceListOptions,
} from './data/selectOptions'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function StoreDetailForm() {
  const { control, setValue, getValues, watch } = useFormContext()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const storeTypeCode = watch('storeTypeCode')
  const storeCattegory = watch('storeCategoryCode')
  //const [storeCodeList, setStoreCodeList] = useState<{ label: string; value: string }[]>([])

  // useEffect(() => {
  //   axios
  //     .get('http://dts.connectcloud365.com:53952/api/StoreMaster/GetAllStoreMaster') // eikhane API URL boshabe
  //     .then((res) => {
  //       const options = res.data.map((store: any) => ({
  //         label: store.storeCode,
  //         value: store.storeCode,
  //       }))
  //       setStoreCodeList(options)
  //     })
  //     .catch((err) => console.error('Error fetching store codes', err))
  // }, [])

  const startDateValue = watch('startDate')

  console.log(storeCattegory)

  return (
    <div className="grid grid-cols-2 border border-solid border-black h-[580px] overflow-y-auto">
      <div className="border p-3 space-y-3">
        {/* Store Code */}
        <FormField
          control={control}
          name="storeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Store Code <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Store Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeCodeOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Store Name */}
        <FormField
          control={control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Store Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Store Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Start Date <span className="text-red-500">*</span>
              </FormLabel>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      onClick={() => setIsOpen(true)}
                      variant="outline"
                      className="w-full text-left"
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
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(d) => {
                      field.onChange(d)
                      setIsOpen(false) // close after selection
                    }}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)

                      const dateToCheck = new Date(date)
                      dateToCheck.setHours(0, 0, 0, 0)

                      return dateToCheck < today
                    }}
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
          name="closeDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Close Date</FormLabel>
              <Popover open={isOpen2} onOpenChange={setIsOpen2}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      onClick={() => setIsOpen2(true)}
                      variant="outline"
                      className="w-full text-left"
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
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    onSelect={(d) => {
                      field.onChange(d)
                      setIsOpen2(false) // close after selection
                    }}
                    selected={field.value ? new Date(field.value) : undefined}
                    disabled={(date) => {
                      // Strip the time portion from the date we want to check
                      const dateToCheck = new Date(date)
                      dateToCheck.setHours(0, 0, 0, 0)

                      // Determine the lower bound: if startDateValue exists, use it;
                      // otherwise, default to today.
                      let minAllowedDate: Date
                      if (startDateValue && !isNaN(new Date(startDateValue).getTime())) {
                        minAllowedDate = new Date(startDateValue)
                      } else {
                        minAllowedDate = new Date()
                      }
                      minAllowedDate.setHours(0, 0, 0, 0)

                      // Disable dates that are less than or equal to the minAllowedDate.
                      // This ensures that the Close Date is strictly after the Start Date.
                      return dateToCheck <= minAllowedDate
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Store Size */}
        <FormField
          control={control}
          name="storeSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Store Size <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Store Size"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="defaultWarehouseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Default Warehouse Code <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value} // Yeh bind karega existing data
                defaultValue={field.value} // Yeh ensure karega ki dropdown me sahi value dikhaye
                onValueChange={(value) => {
                  const selectedOption = warehouseOptions.find((option) => option.code === value)
                  if (selectedOption) {
                    setValue('defaultWarehouseName', selectedOption.name) // Set Name
                  }
                  field.onChange(value)
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Default Warehouse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehouseOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Default Sale Warehouse Code */}
        <FormField
          control={control}
          name="defaultSaleWarehouseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Default Sale Warehouse Code <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value} // Yeh bind karega existing data
                defaultValue={field.value} // Yeh ensure karega ki dropdown me sahi value dikhaye
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sale Warehouse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehouseOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="defaultReturnWarehouseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Default Return Warehouse Code <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value} // Yeh bind karega existing data
                defaultValue={field.value} // Yeh ensure karega ki dropdown me sahi value dikhaye
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sale Warehouse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehouseOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GSTIN */}
        <FormField
          control={control}
          name="GSTIN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                GSTIN No. <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter GSTIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="GSTINDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                GSTIN Date <span className="text-red-500">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full text-left pl-3 py-2">
                      {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent side="bottom">
                  <Calendar
                    mode="single"
                    onSelect={(d) => {
                      field.onChange(d)
                      setIsOpen2(false) // close after selection
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="stateCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                State <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  const selectedOption = stateOptions.find((option) => option.code === value)
                  if (selectedOption) {
                    setValue('stateName', selectedOption.name) // Set State Name
                  }
                  field.onChange(value)
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stateOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="border p-3 space-y-3">
        {/* Price List */}
        <FormField
          control={control}
          name="priceList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price List <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Price List" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priceListOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="factorIfAny"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Factor (if any)</FormLabel>
              <FormControl>
                <Input placeholder="Enter Factor (if any)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Store Type Code and Name */}
        <FormField
          control={control}
          name="storeTypeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Store Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  const selectedOption = storeTypeOptions.find((option) => option.code === value)
                  if (selectedOption) {
                    setValue('storeTypeName', selectedOption.name) // Set Store Type Name
                    setValue('storeCategoryCode', '') // Reset Category on Store Type Change
                    setValue('storeCategoryName', '')
                    field.onChange(value)
                  }
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Store Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {storeTypeOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Store Category Code and Name (Dependent on Store Type) */}
        <FormField
          control={control}
          name="storeCategoryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Store Category <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  const storeTypeCode = getValues('storeTypeCode') as keyof typeof categoryOptions
                  const selectedOption = categoryOptions[storeTypeCode]?.find(
                    (option) => option.code === value
                  )
                  if (selectedOption) {
                    setValue('storeCategoryName', selectedOption.name) // Set Category Name
                  }
                  field.onChange(value)
                }}
                defaultValue={field.value}
                value={field.value}
                disabled={!getValues('storeTypeCode')} // Disable if no Store Type selected
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Store Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(
                    categoryOptions[getValues('storeTypeCode') as keyof typeof categoryOptions] ||
                    []
                  ).map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {storeTypeCode === 'OOWNED' && storeCattegory === 'COFO' && (
          <FormField
            control={control}
            name="franchiseCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Franchise Type</FormLabel>
                <Select
                  value={field.value} // Yeh bind karega existing data
                  defaultValue={field.value} // Yeh ensure karega ki dropdown me sahi value dikhayes
                  onValueChange={(value) => {
                    const selectedOption = franchiseType.find((option) => option.code === value)
                    if (selectedOption) {
                      setValue('franchiseName', selectedOption.name) // Set Code
                    }
                    field.onChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Franchise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {franchiseType.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Franchise Code and Name (Only for Franchise-Owned Stores) */}
        {storeTypeCode === 'FOWNED' && storeCattegory === 'FOFO' && (
          <FormField
            control={control}
            name="franchiseCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Franchise <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selectedOption = franchiseOptions.find((option) => option.code === value)
                    if (selectedOption) {
                      setValue('franchiseName', selectedOption.name) // Set Franchise Name
                    }
                    field.onChange(value)
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Franchise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {franchiseOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Operation Type */}
        <FormField
          control={control}
          name="operationTypeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Operation Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  const selectedOption = operationTypeOptions.find(
                    (option) => option.code === value
                  )
                  if (selectedOption) {
                    setValue('operationTypeName', selectedOption.name) // Set Operation Type Name
                  }
                  field.onChange(value)
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Operation Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {operationTypeOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 ">
              <FormControl>
                <Checkbox
                  checked={field.value === 'Y'}
                  onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')}
                />
              </FormControl>
              <FormLabel>Inactive</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default StoreDetailForm
