import React from 'react'
import Select from 'react-select';
import { Settings, Calendar, CircleDollarSign, CreditCard, FileText, ShieldCheck } from 'lucide-react'

const General = (props) => {

    const discountPolicyOptions = [
        { value: 'P', label: 'Percentage' },
        { value: 'A', label: 'Amount' },
    ];

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
      {/* Settlement & Footfall Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <Calendar className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Settlement & Footfall Configuration</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Manage settlement days and footfall entry requirements</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Pending Settlement Days */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Pending Settlement Days
              </label>
              <input
                type="number"
                data-field="pendingSettlenmentDays"
                value={props.data.pendingSettlenmentDays}
                onChange={(e) => props.onFieldChange('pendingSettlenmentDays', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.pendingSettlenmentDays ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.pendingSettlenmentDays && <p className="text-red-500 text-xs mt-1">{props.errors.pendingSettlenmentDays}</p>}
            </div>

            {/* Footfall Entry Required */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Footfall Entry Required in Day Settlement
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="footfallEntry"
                    value="Y"
                    checked={props.data.footfallEntryRequired === 'Y'}
                    onChange={(e) => props.onFieldChange('footfallEntryRequired', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="footfallEntry"
                    value="N"
                    checked={props.data.footfallEntryRequired === 'N'}
                    onChange={(e) => props.onFieldChange('footfallEntryRequired', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing & Discount Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <CircleDollarSign className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Billing & Discount Configuration</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Set maximum billing amounts and discount policies</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Maximum Allowable Discount Policy */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Maximum Allowable Discount Policy Validation
              </label>
              <div data-field="maximumAllowableDiscount">
                <Select
                  value={props.data.maximumAllowableDiscount}
                  onChange={(val) => props.onFieldChange('maximumAllowableDiscount', val)}
                  options={discountPolicyOptions}
                  placeholder="Select discount policy type"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: '38px',
                      fontSize: '0.875rem',
                      borderColor: state.isFocused ? '#0A6ED1' : props.errors?.maximumAllowableDiscount ? '#ef4444' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 2px rgba(10, 110, 209, 0.2)' : 'none',
                      borderRadius: '0.375rem',
                      '&:hover': {
                        borderColor: '#9ca3af'
                      }
                    })
                  }}
                />
              </div>
              {props.errors?.maximumAllowableDiscount && <p className="text-red-500 text-xs mt-1">{props.errors.maximumAllowableDiscount}</p>}
            </div>

            {/* Maximum Billing Amount */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Maximum Billing Amount in Single POS Billing
              </label>
              <input
                type="text"
                data-field="maximumBillingAmount"
                value={props.data.maximumBillingAmount}
                onChange={(e) => props.onFieldChange('maximumBillingAmount', e.target.value)}
                placeholder="Enter maximum billing amount"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.maximumBillingAmount ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.maximumBillingAmount && <p className="text-red-500 text-xs mt-1">{props.errors.maximumBillingAmount}</p>}
            </div>
          </div>

          {/* PAN No. Mandatory */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">
              PAN No. Mandatory
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="panMandatory"
                  value="Y"
                  checked={props.data.panNoMandatory === 'Y'}
                  onChange={(e) => props.onFieldChange('panNoMandatory', e.target.value)}
                  className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="panMandatory"
                  value="N"
                  checked={props.data.panNoMandatory === 'N'}
                  onChange={(e) => props.onFieldChange('panNoMandatory', e.target.value)}
                  className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Direct Print */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">
              Direct Print
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="directPrint"
                  value="Y"
                  checked={props.data.directPrint === 'Y'}
                  onChange={(e) => props.onFieldChange('directPrint', e.target.value)}
                  className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="directPrint"
                  value="N"
                  checked={props.data.directPrint === 'N'}
                  onChange={(e) => props.onFieldChange('directPrint', e.target.value)}
                  className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Card Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <CreditCard className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Credit Card Configuration</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Configure credit card capture and authorization policies</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Credit Card Details Capture Policy */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Credit Card Number Capture Mandatory
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="creditCardDetailsCapturePolicyID"
                    value="Y"
                    checked={props.data.creditCardDetailsCapturePolicyID === 'Y'}
                    onChange={(e) => props.onFieldChange('creditCardDetailsCapturePolicyID', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="creditCardDetailsCapturePolicyID"
                    value="N"
                    checked={props.data.creditCardDetailsCapturePolicyID === 'N'}
                    onChange={(e) => props.onFieldChange('creditCardDetailsCapturePolicyID', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Credit Card Auth No Entry Mandatory - only shown when capture is YES */}
            {props.data.creditCardDetailsCapturePolicyID === 'Y' && (
              <div>
                <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                  Credit Card Authorization No. Entry Mandatory
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isCCardAuthNoEntryMandatory"
                      value="Y"
                      checked={props.data.isCCardAuthNoEntryMandatory === 'Y'}
                      onChange={(e) => props.onFieldChange('isCCardAuthNoEntryMandatory', e.target.value)}
                      className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isCCardAuthNoEntryMandatory"
                      value="N"
                      checked={props.data.isCCardAuthNoEntryMandatory === 'N'}
                      onChange={(e) => props.onFieldChange('isCCardAuthNoEntryMandatory', e.target.value)}
                      className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back Date Entry & Picture Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <FileText className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Back Date Entry & Picture Configuration</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Configure back dated entry rules and picture capture settings</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Allow Back Date Entry */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Allow Back Dated Entry
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="allowBackDateEntry"
                    value="Y"
                    checked={props.data.allowBackDateEntry === 'Y'}
                    onChange={(e) => props.onFieldChange('allowBackDateEntry', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="allowBackDateEntry"
                    value="N"
                    checked={props.data.allowBackDateEntry === 'N'}
                    onChange={(e) => props.onFieldChange('allowBackDateEntry', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Back Date Entry Days - only shown when allowBackDateEntry is YES */}
            {props.data.allowBackDateEntry === 'Y' && (
              <div>
                <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                  Back Date Entry Days
                </label>
                <input
                  type="number"
                  data-field="backDateEntryDays"
                  value={props.data.backDateEntryDays}
                  onChange={(e) => props.onFieldChange('backDateEntryDays', e.target.value.replace(/\..*/, ''))}
                  min="0"
                  step="1"
                  placeholder="Enter number of days"
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.backDateEntryDays ? 'border-red-500' : 'border-gray-300'}`}
                />
                {props.errors?.backDateEntryDays && <p className="text-red-500 text-xs mt-1">{props.errors.backDateEntryDays}</p>}
              </div>
            )}

            {/* Picture Capture */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Allow Picture Capture
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="picture"
                    value="Y"
                    checked={props.data.picture === 'Y'}
                    onChange={(e) => props.onFieldChange('picture', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="picture"
                    value="N"
                    checked={props.data.picture === 'N'}
                    onChange={(e) => props.onFieldChange('picture', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POS Order & Stock Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <ShieldCheck className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">POS Order & Stock Configuration</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Configure POS order policies and stock check modes</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Due Date Mandatory in POS Order */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Due Date Mandatory in POS Order
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="dueDateIsMandatoryInPOSOrder"
                    value="Y"
                    checked={props.data.dueDateIsMandatoryInPOSOrder === 'Y'}
                    onChange={(e) => props.onFieldChange('dueDateIsMandatoryInPOSOrder', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="dueDateIsMandatoryInPOSOrder"
                    value="N"
                    checked={props.data.dueDateIsMandatoryInPOSOrder === 'N'}
                    onChange={(e) => props.onFieldChange('dueDateIsMandatoryInPOSOrder', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Minimum Percentage of Advance During POS Order */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Min. % of Advance During POS Order
              </label>
              <input
                type="number"
                data-field="minPercentageOfAdvanceDuringPOSOrder"
                value={props.data.minPercentageOfAdvanceDuringPOSOrder}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                    props.onFieldChange('minPercentageOfAdvanceDuringPOSOrder', val);
                  }
                }}
                min="0"
                max="100"
                placeholder="Enter percentage (0-100)"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.minPercentageOfAdvanceDuringPOSOrder ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.minPercentageOfAdvanceDuringPOSOrder && <p className="text-red-500 text-xs mt-1">{props.errors.minPercentageOfAdvanceDuringPOSOrder}</p>}
            </div>

            {/* POS Order Cancellation Mandatory */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                POS Order Cancellation Mandatory
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="posOrderCancellationIsMandatory"
                    value="Y"
                    checked={props.data.posOrderCancellationIsMandatory === 'Y'}
                    onChange={(e) => props.onFieldChange('posOrderCancellationIsMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="posOrderCancellationIsMandatory"
                    value="N"
                    checked={props.data.posOrderCancellationIsMandatory === 'N'}
                    onChange={(e) => props.onFieldChange('posOrderCancellationIsMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Negative Stock Check Mode */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Negative Stock Check Mode
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="negetiveStockCheckMode"
                    value="Y"
                    checked={props.data.negetiveStockCheckMode === 'Y'}
                    onChange={(e) => props.onFieldChange('negetiveStockCheckMode', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="negetiveStockCheckMode"
                    value="N"
                    checked={props.data.negetiveStockCheckMode === 'N'}
                    onChange={(e) => props.onFieldChange('negetiveStockCheckMode', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default General