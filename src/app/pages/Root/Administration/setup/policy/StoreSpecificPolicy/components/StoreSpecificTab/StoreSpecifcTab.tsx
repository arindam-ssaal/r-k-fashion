import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import CreditNote from '../CreditNote'
import General from '../General'
import GoodsReceiptReturn from '../GoodsReceiptReturn'
import POSBill from '../POSBill'
import PosOrder from '../PosOrder'

import { useStoreMasterData } from '@/app/pages/Root/Administration/Master/StoreMaster/hooks_api/useStoreMasterData'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function StoreSpecificTab() {
  const { control } = useFormContext()
  const { storemasterData, isLoading } = useStoreMasterData()

  const storeMasterOptions = useMemo(() => {
    if (!storemasterData || storemasterData.length === 0) return []
    return storemasterData.map((stores) => ({
      value: stores.storeID || '',
      label: stores.storeName || 'Unknown',
      id: stores.storeID || 0,
    }))
  }, [storemasterData])

  return (
     <div className="p-6 rounded-xl">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className='grid grid-cols-5 gap-2 p-0 rounded-lg  mb-6 border-b-2 pb-12'>
        {/* <TabsList className="grid grid-cols-5 gap-4 p-0 rounded-md "> */}
          <TabsTrigger value="general" className="p-2 mb-8 rounded-md hover:bg-gray-200 ">General</TabsTrigger>
          <TabsTrigger value="posBIll" className="p-2 mb-8 rounded-md hover:bg-gray-200">POS Bill</TabsTrigger>
          <TabsTrigger value="creditNote" className="p-2 mb-8 rounded-md hover:bg-gray-200">Credit Note</TabsTrigger>
          <TabsTrigger value="goodsReceiptReturn" className="p-2 mb-8 rounded-md hover:bg-gray-200">Goods Receipt & Return</TabsTrigger>
          <TabsTrigger value="posOrder" className="p-2 mb-8 rounded-md hover:bg-gray-200">POS Order</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-3 gap-6 mt-6 ">
          {/* Store Name */}
          <FormField
            control={control}
            name="storeID"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Store Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10 px-4 border rounded-lg">
                      <SelectValue placeholder={isLoading ? 'Loading...' : 'Select Store'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading ? (
                      <p className="p-2 text-gray-500">Loading...</p>
                    ) : (
                      storeMasterOptions?.map((pm) => (
                        <SelectItem key={pm.id} value={String(pm.value)}>
                          {pm.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={control}
            name="fromDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Start Date <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="flex items-center justify-between w-full h-10 px-4 border rounded-lg">
                        {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString() || null)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* To Date */}
          <FormField
            control={control}
            name="toDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">To Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="flex items-center justify-between w-full h-10 px-4 border rounded-lg">
                        {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString() || null)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6">
          <TabsContent value="general"><General /></TabsContent>
          <TabsContent value="posBIll"><POSBill /></TabsContent>
          <TabsContent value="creditNote"><CreditNote /></TabsContent>
          <TabsContent value="goodsReceiptReturn"><GoodsReceiptReturn /></TabsContent>
          <TabsContent value="posOrder"><PosOrder /></TabsContent>
        </div>
      </Tabs>
     </div>
  )
}

export default StoreSpecificTab
