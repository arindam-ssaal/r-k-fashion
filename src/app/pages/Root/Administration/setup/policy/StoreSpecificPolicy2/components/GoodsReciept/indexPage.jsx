import React from 'react'
import { Package } from 'lucide-react'

const GoodsReciept = (props) => {

  return (
    <div className="p-6 bg-gray-50/50 min-h-full">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header Section with blue left border */}
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <Package className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Goods Receipt Return Settings</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Configure tolerance limits and damage goods policy</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Excess Goods Receipt Tolerance Percentage */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Excess Goods Receipt Tolerance Percentage
              </label>
              <input
                type="number"
                data-field="excessGoodsRecieveTolerancePercentage"
                value={props.data.excessGoodsRecieveTolerancePercentage}
                onChange={(e) => props.onFieldChange('excessGoodsRecieveTolerancePercentage', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.excessGoodsRecieveTolerancePercentage ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.excessGoodsRecieveTolerancePercentage && <p className="text-red-500 text-xs mt-1">{props.errors.excessGoodsRecieveTolerancePercentage}</p>}
            </div>

            {/* Short Goods Receipt Tolerance Percentage */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Short Goods Receipt Tolerance Percentage
              </label>
              <input
                type="number"
                data-field="shortGoodsRecieveTolerancePercentage"
                value={props.data.shortGoodsRecieveTolerancePercentage}
                onChange={(e) => props.onFieldChange('shortGoodsRecieveTolerancePercentage', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.shortGoodsRecieveTolerancePercentage ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.shortGoodsRecieveTolerancePercentage && <p className="text-red-500 text-xs mt-1">{props.errors.shortGoodsRecieveTolerancePercentage}</p>}
            </div>
          </div>

          {/* Allow to Receive Damage Goods */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#6A6D70] mb-2">
              Allow to Receive Damage Goods
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="allowToReceiveDamegedGoods"
                  value="Y"
                  checked={props.data.allowToReceiveDamegedGoods === 'Y'}
                  onChange={(e) => props.onFieldChange('allowToReceiveDamegedGoods', e.target.value)}
                  className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="allowToReceiveDamegedGoods"
                  value="N"
                  checked={props.data.allowToReceiveDamegedGoods === 'N'}
                  onChange={(e) => props.onFieldChange('allowToReceiveDamegedGoods', e.target.value)}
                  className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoodsReciept