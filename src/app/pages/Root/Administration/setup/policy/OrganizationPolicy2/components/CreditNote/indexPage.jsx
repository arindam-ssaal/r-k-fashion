import React from 'react'
import { Settings } from 'lucide-react'

const CreditNote = (props) => {

  return (
    <div className="min-h-full bg-white">
      {/* Page Title */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-start gap-3">
        <div className="mt-0.5">
          <Settings className="w-5 h-5 text-[#0A6ED1]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Credit Note Settings</h1>
          <p className="text-xs text-[#6A6D70] mt-0.5">Configure return windows, validity and print settings</p>
        </div>
      </div>

      {/* Credit Note Settings Section */}
      <div>
        <div className="border-l-4 border-[#0A6ED1] px-6 py-3 bg-[#EBF5FF]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0A6ED1] inline-block"></span>
            <h2 className="text-sm font-bold text-[#0A6ED1]">Credit Note Settings</h2>
          </div>
          <p className="text-xs text-[#6A6D70] mt-0.5 ml-4">Configure return windows, validity and print settings</p>
        </div>

        {/* Form Content */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
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