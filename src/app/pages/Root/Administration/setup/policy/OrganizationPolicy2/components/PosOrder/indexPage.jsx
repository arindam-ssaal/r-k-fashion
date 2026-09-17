import React from 'react'
import { Settings } from 'lucide-react'

const PosOrder = (props) => {

  return (
    <div className="min-h-full bg-white">
      {/* Page Title */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-start gap-3">
        <div className="mt-0.5">
          <Settings className="w-5 h-5 text-[#0A6ED1]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">POS Order Settings</h1>
          <p className="text-xs text-[#6A6D70] mt-0.5">Configure order-level policy and processing rules</p>
        </div>
      </div>

      {/* POS Order Settings Section */}
      <div>
        <div className="border-l-4 border-[#0A6ED1] px-6 py-3 bg-[#EBF5FF]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0A6ED1] inline-block"></span>
            <h2 className="text-sm font-bold text-[#0A6ED1]">POS Order Settings</h2>
          </div>
          <p className="text-xs text-[#6A6D70] mt-0.5 ml-4">Configure order-level policy and processing rules</p>
        </div>

        {/* Form Content */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            {/* Allow Order Modification */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Allow Order Modification
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="allowOrderModification"
                    value="Y"
                    checked={props.data.allowOrderModification === 'Y'}
                    onChange={(e) => props.onFieldChange('allowOrderModification', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="allowOrderModification"
                    value="N"
                    checked={props.data.allowOrderModification === 'N'}
                    onChange={(e) => props.onFieldChange('allowOrderModification', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Order Validity Days */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Order Validity Days
              </label>
              <input
                type="number"
                data-field="orderValidityDays"
                value={props.data.orderValidityDays}
                onChange={(e) => props.onFieldChange('orderValidityDays', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.orderValidityDays ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.orderValidityDays && <p className="text-red-500 text-xs mt-1">{props.errors.orderValidityDays}</p>}
            </div>

            {/* Allow Partial Delivery */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Allow Partial Delivery
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="allowPartialDelivery"
                    value="Y"
                    checked={props.data.allowPartialDelivery === 'Y'}
                    onChange={(e) => props.onFieldChange('allowPartialDelivery', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="allowPartialDelivery"
                    value="N"
                    checked={props.data.allowPartialDelivery === 'N'}
                    onChange={(e) => props.onFieldChange('allowPartialDelivery', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Advance Payment Mandatory */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Advance Payment Mandatory
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="advancePaymentMandatory"
                    value="Y"
                    checked={props.data.advancePaymentMandatory === 'Y'}
                    onChange={(e) => props.onFieldChange('advancePaymentMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="advancePaymentMandatory"
                    value="N"
                    checked={props.data.advancePaymentMandatory === 'N'}
                    onChange={(e) => props.onFieldChange('advancePaymentMandatory', e.target.value)}
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

export default PosOrder