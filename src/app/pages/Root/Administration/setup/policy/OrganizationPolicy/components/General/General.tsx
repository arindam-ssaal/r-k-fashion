import { Calendar, CreditCard, DollarSign, Settings } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import ImageUploader from '@/components/ImageUploader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function General() {
  const { control, setValue, watch } = useFormContext()

  const maxBillingAmt = watch('maxBillAmountSinglePOSBill', 0)

  // Condition to disable PAN field
  const isPanDisabled = Number(maxBillingAmt) <= 50000

  return (
    <div className="min-h-[650px] bg-white">
      {/* Header Section */}
      <div className="bg-sky-600 text-white px-8 py-5 border-b-4 border-sky-700">
        <div className="flex items-center gap-3">
          <Settings className="w-7 h-7" />
          <div>
            <h2 className="text-xl font-semibold tracking-wide">General Policy Settings</h2>
            <p className="text-sky-100 text-xs mt-0.5">Configure organization-wide policies and regulations</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-5 max-h-[550px] overflow-y-auto custom-scrollbar">
        {/* Settlement & Footfall Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-6">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base font-semibold">
              <Calendar className="w-4 h-4 text-sky-600" />
              Settlement & Footfall Configuration
            </CardTitle>
            <CardDescription className="text-xs mt-1">Manage settlement days and footfall entry requirements</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 px-6 pb-6 space-y-4">
            <FormField
              control={control}
              name={'pendingSettlementDays'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Pending Settlement Days
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      id="pendingSettlementDays"
                      placeholder="Enter settlement days (1-30)"
                      className="w-full mt-1.5 border-gray-300 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                      min={1}
                      minLength={1}
                      maxLength={2}
                      max={30}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="footfallEntryRequiredDaySettlement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">Footfall Entry Required in Day Settlement</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row space-x-6 mt-1.5"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Y" className="border-sky-600 text-sky-600" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700 cursor-pointer">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="N" className="border-sky-600 text-sky-600" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700 cursor-pointer">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Billing & Discount Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-6">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base font-semibold">
              <DollarSign className="w-4 h-4 text-sky-600" />
              Billing & Discount Configuration
            </CardTitle>
            <CardDescription className="text-xs mt-1">Set maximum billing amounts and discount policies</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 px-6 pb-6 space-y-4">
            <FormField
              control={control}
              name="maxAllowDiscountPolicyValidationID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Maximum Allowable Discount Policy Validation
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1.5 border-gray-300 focus:border-sky-600 focus:ring-1 focus:ring-sky-600">
                        <SelectValue placeholder="Select discount policy type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">Percentage</SelectItem>
                          <SelectItem value="2">Fixed Amount</SelectItem>
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
              name="maxBillAmountSinglePOSBill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Maximum Billing Amount in Single POS Billing
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      id="maxBillingAmt"
                      placeholder="Enter maximum billing amount"
                      className="w-full mt-1.5 border-gray-300 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        field.onChange(e)
                        if (value <= 50000) {
                          setValue('pan', '')
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
              name="pan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    PAN No. Mandatory
                    {!isPanDisabled && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter PAN Number (10 digits)"
                      disabled={isPanDisabled}
                      maxLength={10}
                      className="w-full mt-1.5 border-gray-300 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 disabled:bg-gray-100"
                    />
                  </FormControl>
                  {isPanDisabled && (
                    <p className="text-xs text-gray-500 mt-1">PAN is not required when billing amount is ≤ ₹50,000</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        {/* Credit Card & Payment Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-6">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base font-semibold">
              <CreditCard className="w-4 h-4 text-sky-600" />
              Credit Card & Payment Configuration
            </CardTitle>
            <CardDescription className="text-xs mt-1">Manage credit card capture policies and authorization settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 px-6 pb-6 space-y-4">
            <FormField
              control={control}
              name="creditCardDetailsCapturePolicyID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Credit Card Details Capture Policy
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-1.5 border-gray-300 focus:border-sky-600 focus:ring-1 focus:ring-sky-600">
                        <SelectValue placeholder="Select card capture digits" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="4">Last 4 Digits</SelectItem>
                      <SelectItem value="6">Last 6 Digits</SelectItem>
                      <SelectItem value="16">Full 16 Digits</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isCCardAuthNoEntryMandatory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">Is Credit Card Authorization No. Entry Mandatory</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row space-x-6 mt-1.5"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Y" className="border-sky-600 text-sky-600" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700 cursor-pointer">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="N" className="border-sky-600 text-sky-600" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700 cursor-pointer">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Date & Stock Management Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-6">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base font-semibold">
              <Settings className="w-4 h-4 text-sky-600" />
              Date & Stock Management
            </CardTitle>
            <CardDescription className="text-xs mt-1">Configure backdate entry and negative stock policies</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 px-6 pb-6 space-y-4">
            <FormField
              control={control}
              name="allowBackDateEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Allow Backdate Entry
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row space-x-6 mt-1.5"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Y" className="border-sky-600 text-sky-600" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700 cursor-pointer">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="N" className="border-sky-600 text-sky-600" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700 cursor-pointer">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="backDateEntryDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Back Date Entry Days
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      maxLength={2}
                      max={31}
                      minLength={1}
                      id="backDateDays"
                      placeholder="Enter number of days (1-31)"
                      className="w-full mt-1.5 border-gray-300 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="negativestockcheckingmode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Negative Stock Checking Mode
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1.5 border-gray-300 focus:border-sky-600 focus:ring-1 focus:ring-sky-600">
                        <SelectValue placeholder="Select stock checking mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Mode Options</SelectLabel>
                          <SelectItem value="1">Stop - Prevent negative stock</SelectItem>
                          <SelectItem value="2">Ignore - Allow negative stock</SelectItem>
                          <SelectItem value="3">Warn - Show warning</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Picture Upload Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-6">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base font-semibold">
              <Settings className="w-4 h-4 text-sky-600" />
              Organization Picture
            </CardTitle>
            <CardDescription className="text-xs mt-1">Upload organization logo or related images</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="picture" className="text-gray-700 text-sm font-medium">Picture</Label>
              <ImageUploader />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default General
