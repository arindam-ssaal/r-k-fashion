import React from 'react'
import { Receipt, Percent, Tag, Users } from 'lucide-react'

const POSBill = (props) => {

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
      {/* Discount Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <Percent className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Discount Settings</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Control item and bill level discount permissions</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Allow Item Level Discount */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">Allow Item Level Discount</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="itemLevelDiscount"
                    value="Y"
                    checked={props.data.allowItemLevelDiscount === 'Y'}
                    onChange={(e) => props.onFieldChange('allowItemLevelDiscount', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="itemLevelDiscount"
                    value="N"
                    checked={props.data.allowItemLevelDiscount === 'N'}
                    onChange={(e) => props.onFieldChange('allowItemLevelDiscount', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Allow Bill Level Discount */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">Allow Bill Level Discount</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="billLevelDiscount"
                    value="Y"
                    checked={props.data.allowBillLevelDiscount === 'Y'}
                    onChange={(e) => props.onFieldChange('allowBillLevelDiscount', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="billLevelDiscount"
                    value="N"
                    checked={props.data.allowBillLevelDiscount === 'N'}
                    onChange={(e) => props.onFieldChange('allowBillLevelDiscount', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Maximum Allowable Discount Percentage */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Maximum Allowable Discount Percentage</label>
              <input
                type="text"
                data-field="maximumAllowableDiscountPercentage"
                placeholder="Enter percentage"
                value={props.data.maximumAllowableDiscountPercentage || ''}
                onChange={(e) => props.onFieldChange('maximumAllowableDiscountPercentage', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.maximumAllowableDiscountPercentage ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.maximumAllowableDiscountPercentage && <p className="text-red-500 text-xs mt-1">{props.errors.maximumAllowableDiscountPercentage}</p>}
            </div>

            {/* Maximum Allowable Discount Amount */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Maximum Allowable Discount Amount</label>
              <input
                type="text"
                data-field="maximumAllowableDiscountAmount"
                placeholder="Enter amount"
                value={props.data.maximumAllowableDiscountAmount}
                onChange={(e) => props.onFieldChange('maximumAllowableDiscountAmount', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.maximumAllowableDiscountAmount ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.maximumAllowableDiscountAmount && <p className="text-red-500 text-xs mt-1">{props.errors.maximumAllowableDiscountAmount}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <Tag className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Promotion Settings</h2>
              {/* <p className="text-xs text-[#6A6D70] mt-0.5">Manage promotion selection and clearing options</p> */}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Allow to Select Active Promotion from List */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">Allow to Select Active Promotion from List</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="activePromotion"
                    value="Y"
                    checked={props.data.allowActivePromotion === 'Y'}
                    onChange={(e) => props.onFieldChange('allowActivePromotion', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="activePromotion"
                    value="N"
                    checked={props.data.allowActivePromotion === 'N'}
                    onChange={(e) => props.onFieldChange('allowActivePromotion', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Allow to Clear Applied Promotion */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">Allow to Clear Applied Promotion</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="clearPromotion"
                    value="Y"
                    checked={props.data.allowToClearApplyPromotion === 'Y'}
                    onChange={(e) => props.onFieldChange('allowToClearApplyPromotion', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="clearPromotion"
                    value="N"
                    checked={props.data.allowToClearApplyPromotion === 'N'}
                    onChange={(e) => props.onFieldChange('allowToClearApplyPromotion', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagging Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <Users className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Tagging Settings</h2>
              {/* <p className="text-xs text-[#6A6D70] mt-0.5">Configure sales person and customer tagging policies</p> */}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Sale Person Tagging Mandatory */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">Sale Person Tagging Mandatory</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="salesPersonTagging"
                    value="Y"
                    checked={props.data.salesPersonTaggingMandatory === 'Y'}
                    onChange={(e) => props.onFieldChange('salesPersonTaggingMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="salesPersonTagging"
                    value="N"
                    checked={props.data.salesPersonTaggingMandatory === 'N'}
                    onChange={(e) => props.onFieldChange('salesPersonTaggingMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Sale Person Tagging Policy */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">Sale Person Tagging Policy</label>
              <select
                value={props.data.salesPersonTaggingPolicy}
                onChange={(e) => props.onFieldChange('salesPersonTaggingPolicy', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white transition-all"
              >
                <option value="">Select Tagging Policy</option>
                <option value="S">Single</option>
                <option value="M">Multiple</option>
              </select>
            </div>

            {/* Customer Tagging is Mandatory */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">Customer Tagging is Mandatory</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="customerTagging"
                    value="Y"
                    checked={props.data.customerTaggingMandatory === 'Y'}
                    onChange={(e) => props.onFieldChange('customerTaggingMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="customerTagging"
                    value="N"
                    checked={props.data.customerTaggingMandatory === 'N'}
                    onChange={(e) => props.onFieldChange('customerTaggingMandatory', e.target.value)}
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

export default POSBill