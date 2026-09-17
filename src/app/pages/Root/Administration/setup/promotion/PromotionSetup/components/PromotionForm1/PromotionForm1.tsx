import { Tag, FileText, Zap, Target, Gift, Layers, DollarSign, CheckCircle2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

function PromotionForm1() {
  const formMethods = useFormContext()

  return (
    <div className="overflow-y-auto p-6 rounded-lg">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-sky-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Gift className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: '#0ea5e9'}}>Promotion Information</h2>
        </div>
      </div>

      <div className="rounded-lg p-6 shadow-sm border border-sky-100 space-y-5" style={{ color: '#000'}}>
        {/* Promotion ID */}
        <FormField
          control={formMethods.control}
          name="promotionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2" style={{ color: '#000'}}>
                <Tag className="w-4 h-4 " />
                Promotion ID<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="Auto-generated promotion ID" 
                  {...field} 
                  disabled 
                  className="h-10 border-sky-200 bg-sky-50/50 focus:border-sky-400 focus:ring-sky-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Promotion Name */}
        <FormField
          control={formMethods.control}
          name="promotionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2" style={{ color: '#000'}}>
                <Zap className="w-4 h-4 " />
                Promotion Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="Enter promotion name" 
                  {...field} 
                  className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Details */}
        <FormField
          control={formMethods.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2" style={{ color: '#000'}}>
                <FileText className="w-4 h-4" />
                Details <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter promotion details and description" 
                  {...field} 
                  className="min-h-[80px] border-sky-200 focus:border-sky-400 focus:ring-sky-400 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Applied On */}
        <FormField
          control={formMethods.control}
          name="appliedOn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2" style={{ color: '#000'}}>
                <Target className="w-4 h-4 " />
                Applied On <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400">
                    <SelectValue placeholder="Select application type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 " />
                        Applied on Each Item
                      </div>
                    </SelectItem>
                    <SelectItem value="B">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 " />
                        Applied on Bill Value
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Promotion Type */}
        <FormField
          control={formMethods.control}
          name="promotionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4" />
                Promotion Type <span className="text-red-500">*</span>
              </FormLabel>
              <RadioGroup
                value={field.value} // Bind the current value
                onValueChange={field.onChange} // Update the value on change
                className="mb-5 roles-radio"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="r1" />
                  <label htmlFor="r1">Free Quantity Benefit</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Q" id="r2" />
                  <label htmlFor="r2">Quantity Slab Benefit</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id="r3" />
                  <label htmlFor="r3">Bill Value Slab Benefit</label>
                </div>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Inactive Checkbox */}
        <FormField
          control={formMethods.control}
          name="inactive"
          render={({ field }) => (
            <FormItem className="pt-2">
              <div className="flex items-center space-x-3 rounded-lg border border-sky-100  p-4">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(value)}
                  id="inactiveCheckbox"
                  className="border-sky-400 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                />
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <label
                    htmlFor="inactiveCheckbox"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Inactive
                  </label>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default PromotionForm1
