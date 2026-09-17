import { useFormContext } from 'react-hook-form'


import DiscountMasterAssortmentListTable from '../DiscountMasterAssortmentListTable'

import { Checkbox } from '@/components/ui/checkbox'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

function DiscountMasterFormSetup() {
  const { control } = useFormContext()
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-3">
        {/* Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="discountType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Discount Type</FormLabel>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  className="flex gap-3 items-center roles-radio "
                >
                  <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="G" id="general" />
                    <FormLabel htmlFor="general">General</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-1 opacity-0" hidden={true}>
                    <RadioGroupItem value="A" id="assortment" />
                    <FormLabel htmlFor="assortment">Assortment</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Base */}
        <FormField
          control={control}
          name="discountBase"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Discount Base</FormLabel>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  className="flex gap-3 items-center roles-radio"
                >
                  <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="P" id="percentage" />
                    <FormLabel htmlFor="percentage">Percentage</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="A" id="amount" />
                    <FormLabel htmlFor="amount">Amount</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Percentage / Amount */}
        <FormField
          control={control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentage / Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Applied On */}
        <FormField
          control={control}
          name="appliedOn"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="">Applied On</FormLabel>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  className="flex items-center gap-3 roles-radio"
                >
                  <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="L" id="bill-level" />
                    <FormLabel htmlFor="bill-level">Bill Level</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="I" id="item-level" />
                    <FormLabel htmlFor="item-level">Item Level</FormLabel>
                  </FormItem>
                  {/* <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="B" id="both" />
                    <FormLabel htmlFor="both">Both</FormLabel>
                  </FormItem> */}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Employee Discount */}
        <FormField
          control={control}
          name="employeeDiscount"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Employee Discount</FormLabel>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  className="flex items-center gap-3 roles-radio"
                >
                  <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="Y" id="yes" />
                    <FormLabel htmlFor="yes">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-1">
                    <RadioGroupItem value="N" id="no" />
                    <FormLabel htmlFor="no">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Maximum Discount */}
        <FormField
          control={control}
          name="maximumDiscount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Discount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Minimum Billing */}
        <FormField
          control={control}
          name="minimumBilling"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Billing</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OTP Required */}
        <FormField
          control={control}
          name="otpRequired"
          render={({ field }) => (
            <FormItem className="space-x-1">
              <FormControl>
                <Checkbox id="otpRequired" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel htmlFor="otpRequired">OTP Required</FormLabel>
            </FormItem>
          )}
        />

        {/* Allow To Change */}
        <FormField
          control={control}
          name="allowToChange"
          render={({ field }) => (
            <FormItem className="space-x-1">
              <FormControl>
                <Checkbox
                  id="allowToChange"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="allowToChange">Allow To Change</FormLabel>
            </FormItem>
          )}
        />

        {/* Inactive */}
        <FormField
          control={control}
          name="inactive"
          render={({ field }) => (
            <FormItem className="space-x-1">
              <FormControl>
                <Checkbox id="inactive" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel htmlFor="inactive">Inactive</FormLabel>
            </FormItem>
          )}
        />
      </div>
      <div>
        <DiscountMasterAssortmentListTable />
      </div>
    </div>
  )
}

export default DiscountMasterFormSetup
