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

const GoodsReceiptReturn = () => {
  const { control } = useFormContext()

  return (
    <Card className="border-2 border-solid border-black overflow-y-auto h-[650px]">
      <CardHeader>
        <CardTitle>Goods Receipt Return</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="excessGoodsReceiptTolerancePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excess Goods Receipt Tolerance Percentage</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="excessGoodsReceiptTolerancePercentage"
                  placeholder="Excess Goods Receipt Tolerance Percentage"
                  className="w-full mt-3"
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="shortGoodsReceiptTolerancePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Goods Receipt Tolerance Percentage</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="shortGoodsReceiptTolerancePercentage"
                  placeholder="Short Goods Receipt Tolerance Percentage"
                  className="w-full mt-3"
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="allowToReceiveDamagedGoods"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allow to Receive Damage Goods</FormLabel>
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
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default GoodsReceiptReturn
