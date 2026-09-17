import { useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const PosOrder = () => {
  const { control } = useFormContext()

  return (
    <Card className="border-2 border-solid border-black overflow-y-auto h-[650px]">
      <CardHeader>
        <CardTitle>Pos Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="dueDateIsMandatoryInPOSOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date is Mandatory in POS Order</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex items-center gap-3 w-full mt-3 mb-5 roles-radio"
                  value={String(field.value)} // Convert boolean to string
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
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="minPercentageOfAdvanceDuringPOSOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Percentage of Advance during POS Order</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="minPercentageOfAdvanceDuringPOSOrder"
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="Minimum Percentage of Advance during POS Order"
                  className="w-full mt-3"
                  min={0}
                  max={100}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="posOrderCancellationIsMandatory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>POS Order Cancellation is Mandatory</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex items-center gap-3 w-full mt-3 mb-5 roles-radio"
                  value={String(field.value)} // Convert boolean to string
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
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default PosOrder
