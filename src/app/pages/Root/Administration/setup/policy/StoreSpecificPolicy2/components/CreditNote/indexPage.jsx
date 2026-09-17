import React from 'react'
import { Receipt } from 'lucide-react'

const CreditNote = (props) => {

  return (
    <div className="p-6 bg-gray-50/50 min-h-full">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header Section with blue left border */}
        <div className="border-l-4 border-[#0A6ED1] px-6 py-4 border-b border-b-gray-200 bg-[#e6f1fa]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <Receipt className="w-5 h-5 text-[#0A6ED1]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a6ed1]">Credit Note Settings</h2>
              <p className="text-xs text-[#6A6D70] mt-0.5">Configure return windows, validity and print settings</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Return of Item within (Days) */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Return of Item within (Days)
              </label>
              <input
                type="number"
                data-field="returnItemsDays"
                value={props.data.returnItemsDays}
                onChange={(e) => props.onFieldChange('returnItemsDays', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.returnItemsDays ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.returnItemsDays && <p className="text-red-500 text-xs mt-1">{props.errors.returnItemsDays}</p>}
            </div>

            {/* Credit Note Validity Days */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                Credit Note Validity Days
              </label>
              <input
                type="number"
                data-field="creditNoteValidityDays"
                value={props.data.creditNoteValidityDays}
                onChange={(e) => props.onFieldChange('creditNoteValidityDays', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.creditNoteValidityDays ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.creditNoteValidityDays && <p className="text-red-500 text-xs mt-1">{props.errors.creditNoteValidityDays}</p>}
            </div>

            {/* Bill Tagging Mandatory during Return */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-2">
                Bill Tagging Mandatory during Return
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="billTaggingMandatory"
                    value="Y"
                    checked={props.data.billTaggingMandatory === 'Y'}
                    onChange={(e) => props.onFieldChange('billTaggingMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="billTaggingMandatory"
                    value="N"
                    checked={props.data.billTaggingMandatory === 'N'}
                    onChange={(e) => props.onFieldChange('billTaggingMandatory', e.target.value)}
                    className="w-4 h-4 text-[#0A6ED1] border-gray-300 focus:ring-[#0A6ED1] cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* No. of Copies to be Printed */}
            <div>
              <label className="block text-sm font-medium text-[#6A6D70] mb-1.5">
                No. of Copies to be Printed
              </label>
              <input
                type="number"
                data-field="noOfcopiesPrinted"
                value={props.data.noOfcopiesPrinted}
                onChange={(e) => props.onFieldChange('noOfcopiesPrinted', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent transition-all bg-white ${props.errors?.noOfcopiesPrinted ? 'border-red-500' : 'border-gray-300'}`}
              />
              {props.errors?.noOfcopiesPrinted && <p className="text-red-500 text-xs mt-1">{props.errors.noOfcopiesPrinted}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditNote