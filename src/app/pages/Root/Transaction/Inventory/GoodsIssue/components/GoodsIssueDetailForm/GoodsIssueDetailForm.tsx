import { useFormContext } from 'react-hook-form'

import useGoodsIssueType from '../../store/useGoodsIssueType'
import GoodsIssueFormTable from '../GoodsIssueFormTable/GoodsIssueFormTable'

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


function GoodsIssueDetailForm() {
  const { control } = useFormContext()
  const modalMode = useGoodsIssueType((state) => state.mode)

  return (
    <div className="overflow-y-auto">
      <div className=" border border-solid border-black  overflow-y-auto p-3  grid grid-cols-3 gap-4">
        {/* Company Field */}
        <FormField
          control={control}
          name="storeDetail.storeCode"
          disabled={modalMode === 'Edit' || modalMode === 'Create'} // Field is disabled in edit mode
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
         {/* Store Field */}
         <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit' } // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Store <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>store</SelectLabel>
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
         {/* Branch Field */}
         <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Branch <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Branch</SelectLabel>
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
         {/* Mode Field */}
         <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Mode <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Mode</SelectLabel>
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
         {/* Warehouse Field */}
         <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Warehouse <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Warehouse</SelectLabel>
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
        {/* From Unit */}
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
                    <SelectValue placeholder="From Unit" />
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
        
        <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                 Document Status<span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="From Unit" />
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
        <FormField
          control={control}
          name="storeDetail.startDate"
          disabled={modalMode === 'Edit'} // Field is disabled in edit mode
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                 Issue Warehouse<span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="From Unit" />
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
      <div className='mt-4  border border-solid border-black'>
        <GoodsIssueFormTable />
      </div>
    </div>
  )
}

export default GoodsIssueDetailForm
