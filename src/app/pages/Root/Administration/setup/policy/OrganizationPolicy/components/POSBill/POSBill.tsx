import { useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function POSBill() {
  const { control, watch, setValue } = useFormContext()

  const discountPercentage = watch('maxAllowDiscountPercentage', '0')

  // Condition to disable discount amount
  const isDiscountAmountDisabled = !discountPercentage || Number(discountPercentage) <= 0
  const isPromotionDisabled = !discountPercentage || Number(discountPercentage) <= 0
  return (
    <Card className="border-2 border-solid border-black overflow-y-auto h-[650px]">
      <CardHeader>
        <CardTitle>POS Bill</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="allowItemLevelDiscount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allow Item Level Discount</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4 roles-radio"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="Y" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="N" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="allowBillLevelDiscount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allow Bill Level Discount</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4 roles-radio"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="Y" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="N" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="maxAllowDiscountPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Allowable Discount Percentage</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Maximum Allowable Discount Percentage"
                  className="w-full mt-3"
                  // pattern="[0-9]{3}"
                  minLength={0}
                  maxLength={100}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(e)

                    // If discount percentage is 0, clear the discount amount field
                    if (!value || Number(value) <= 0) {
                      setValue('maxAllowDiscountAmount', '')
                      setValue('allowToSelectActivePromotionFromList', 'N')
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="maxAllowDiscountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Allowable Discount Amount</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  id="maxAllowableDisAmt"
                  placeholder="Maximum Allowable Discount Amount"
                  className="w-full mt-3"
                  disabled={isDiscountAmountDisabled} // Disable if percentage is 0
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="allowToSelectActivePromotionFromList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allow to Select Active Promotion from List</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex items-center gap-3 w-full mt-3 mb-5 roles-radio"
                  value={String(field.value)} // Bind the current value
                  onValueChange={field.onChange} // Update the value on change
                  disabled={isPromotionDisabled}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Y" id="Y" />
                    <label htmlFor="Y">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N" id="N" />
                    <label htmlFor="N">No</label>
                  </div>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="allowToClearAppliedPromotion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allow to Clear Applied Promotion</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex items-center gap-3 w-full mt-3 mb-5 roles-radio"
                  value={String(field.value)} // Bind the current value
                  onValueChange={field.onChange} // Update the value on change
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Y" id="Y" />
                    <label htmlFor="Y">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N" id="N" />
                    <label htmlFor="N">No</label>
                  </div>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="salePersonTaggingMandatory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Person Tagging Mandatory</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex items-center gap-3 w-full mt-3 mb-5 roles-radio"
                  value={String(field.value)} // Bind the current value
                  onValueChange={field.onChange} // Update the value on change
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Y" id="Y" />
                    <label htmlFor="Y">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N" id="N" />
                    <label htmlFor="N">No</label>
                  </div>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="salePersonTaggingPolicyID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Person Tagging Policy</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full mt-3">
                    <SelectValue placeholder="Select Tagging Policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">Item Level</SelectItem>
                      <SelectItem value="2">Bill Level</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="customerTaggingIsMandatory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Tagging is Mandatory</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex items-center gap-3 w-full mt-3 mb-5 roles-radio"
                  value={String(field.value)} // Bind the current value
                  onValueChange={field.onChange} // Update the value on change
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Y" id="Y" />
                    <label htmlFor="Y">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N" id="N" />
                    <label htmlFor="N">No</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default POSBill
