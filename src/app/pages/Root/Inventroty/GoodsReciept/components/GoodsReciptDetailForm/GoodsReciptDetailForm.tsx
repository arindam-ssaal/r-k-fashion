import { useFormContext } from 'react-hook-form'

import useGoodsReceiptType from '../../store/useGoodsReceiptType'
import GoodsReciptFormTable from '../GoodsReciptFormTable/GoodsReciptFormTable'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function GoodsReciptDetailForm() {
  const { control } = useFormContext()
  const modalMode = useGoodsReceiptType((state) => state.mode)

  return (
    <div className="overflow-y-auto">
      <div className=" border border-solid border-black overflow-y-auto p-3 grid gap-4 grid-cols-3 items-center">
        {/* Company Field */}
        <FormField
          control={control}
          name="storeDetail.storeCode"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Posting Date  Field */}
        <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Posting Date <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" placeholder="Posting Date " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Series Field */}
        <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Series <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>State</SelectLabel>
                      <SelectItem value="wb">West Bengal</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Document No Field */}
        <FormField
          control={control}
          name="storeDetail.storeName"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Document No <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Document No" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Document Date */}
        <FormField
          control={control}
          name="storeDetail.closeDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Date</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Document Date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Unit Field */}
        {/* <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Unit<span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder=" Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>State</SelectLabel>
                      <SelectItem value="wb">West Bengal</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Document Status Field */}
        <FormField
          control={control}
          name="storeDetail.default"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Document Status<span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Document Status" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Received Warehouse Field */}
        <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Received Warehouse<span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Received Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>State</SelectLabel>
                      <SelectItem value="wb">West Bengal</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-4  border border-solid border-black">
        <GoodsReciptFormTable />
      </div>
    </div>
  )
}

export default GoodsReciptDetailForm
