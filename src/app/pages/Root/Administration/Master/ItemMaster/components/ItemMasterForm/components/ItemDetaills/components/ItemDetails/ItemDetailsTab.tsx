'use client'
// import {
//   Select,
//   SelectContent,
//   //SelectGroup,
//   SelectItem,
// //  SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from '@radix-ui/react-select'
import { FormProvider, useForm } from 'react-hook-form'

import {
  FormControl,
  //FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


function ItemDetailsTab() {
  const form = useForm()
  return (
    <FormProvider {...form}>
      {' '}
      {/* FormProvider দিয়ে ফর্ম context wrap করলাম */}
      <div className="grid grid-cols-2 border border-solid border-black h-[580px] overflow-y-auto">
        <div className="border p-3 space-y-3">
          {/* Item Code */}
          <FormField
            control={form.control} // এখন এটা কাজ করবে কারণ আমরা FormProvider ইউজ করলাম
            name="itemCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Item Code</FormLabel>
                <FormControl>
                  <Input placeholder="Item Code" {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Bar Code */}
          <FormField
            control={form.control}
            name="barCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Bar Code</FormLabel>
                <FormControl>
                  <Input placeholder="Bar Code" {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Item Name */}
          <FormField
            control={form.control}
            name="itemName"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="Item Name" {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Item Group */}
          <FormField
            control={form.control}
            name="itemGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Item Group</FormLabel>
                <FormControl>
                  <Input placeholder="Item Group" {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* HSN / SAC Code */}
          <FormField
            control={form.control}
            name="hsnsacCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel> HSN / SAC Code</FormLabel>
                <FormControl>
                  <Input placeholder="HSN / SAC Code" {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Wholesale Price List} */}
          <FormField
            control={form.control}
            name="wholesalePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Wholesale Price List</FormLabel>
                <FormControl>
                  <Input placeholder="Wholesale Price List" {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="wholesalePrice"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Wholesale Price List</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Wholesale Price List" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Wholesale</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* {Retail Price List} */}
          <FormField
            control={form.control}
            name="retailPrice"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Retail Price List</FormLabel>
                <FormControl>
                  <Input placeholder="Retail Price List" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {MRP Price List} */}
          <FormField
            control={form.control}
            name="mrpPrice"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>MRP Price List</FormLabel>
                <FormControl>
                <Input placeholder="MRP Price List" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Item Management } */}
          <FormField
            control={form.control}
            name="itemManagement"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Item Management </FormLabel>
                <FormControl>
                  <Input placeholder="Item Management " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Lead Time } */}
          <FormField
            control={form.control}
            name="leadTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Lead Time </FormLabel>
                <FormControl>
                  <Input placeholder="Lead Time " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Tolerance Days } */}
          <FormField
            control={form.control}
            name="toleranceDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Tolerance Days </FormLabel>
                <FormControl>
                  <Input placeholder="Tolerance Days " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {No. per Scan } */}
          <FormField
            control={form.control}
            name="noofDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel> No. per Scan </FormLabel>
                <FormControl>
                  <Input placeholder="No. per Scan " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="border p-3 space-y-3">
          {/* {Purchase UOM } */}
          <FormField
            control={form.control}
            name="purchaseUom"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Purchase UOM </FormLabel>
                <FormControl>
                  <Input placeholder="Purchase UOM " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Sale UOM } */}
          <FormField
            control={form.control}
            name="saleUom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale UOM </FormLabel>
                <FormControl>
                  <Input placeholder="Sale UOM " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Wholesale Price } */}
          <FormField
            control={form.control}
            name="wholesalePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wholesale Price</FormLabel>
                <FormControl>
                  <Input placeholder="Wholesale Price " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Retail Price } */}
          <FormField
            control={form.control}
            name="retailPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retail Price</FormLabel>
                <FormControl>
                  <Input placeholder="Retail Price " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {MRP } */}
          <FormField
            control={form.control}
            name="mrp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MRP</FormLabel>
                <FormControl>
                  <Input placeholder="MRP " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Manufacturer} */}
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Manufacturer " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Mfr. Catalog No. } */}
          <FormField
            control={form.control}
            name="mfrcatalogNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mfr. Catalog No.</FormLabel>
                <FormControl>
                  <Input placeholder="Mfr. Catalog No. " {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {Inactive } */}
          <div className="flex items-center space-x-2">
            <RadioGroup defaultValue="terms" className='roles-radio'>
              <RadioGroupItem id="terms" value="terms" />
            </RadioGroup>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Inactive
            </label>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
export default ItemDetailsTab
