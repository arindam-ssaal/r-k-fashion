import { useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const GoodsReceiptReturn = () => {
  const { control } = useFormContext()

  return (
    <Card className="border-2 overflow-y-auto h-[650px]">
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
          name="allowReceiveDamagedGoods"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allow to Receive Damaged Goods</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-y-1 roles-radio"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Y" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="N" />
                    </FormControl>
                    <FormLabel className="font-normal">N</FormLabel>
                  </FormItem>
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
