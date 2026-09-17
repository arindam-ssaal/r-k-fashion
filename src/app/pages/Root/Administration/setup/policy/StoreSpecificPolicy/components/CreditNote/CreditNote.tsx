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

//import { cn } from '@/lib/utils' // Verify this path matches your project structure

const CreditNote = () => {
  const { control } = useFormContext()

  return (
    <Card className="border-2  overflow-y-auto h-[650px]">
      <CardHeader>
        <CardTitle>Credit Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="returnOfItemWithin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return of Item within</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="returnItem"
                  placeholder="Return of Item within"
                  className="w-full mt-3"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="creditNoteValidityDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit Note Validity Days</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="cnvd"
                  placeholder="Credit Note Validity Days"
                  className="w-full mt-3"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="billTaggingMandatoryDuringReturn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Tagging Mandatory during Return</FormLabel>
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

        <FormField
          control={control}
          name="noOfCopiesToBePrint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. of Copies to be Print</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="ncp"
                  placeholder="No. of Copies to be Print"
                  className="w-full mt-3"
                />
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

export default CreditNote
