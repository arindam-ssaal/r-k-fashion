
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useEffect } from 'react'


import { useAssortmentManagementStore } from '../../../../store/useAssortmentManagementStore'

import { useGeneratedItemsDataStore } from '@/components/AssortmentManagement/hooks/useGeneratedItemsDataStore'
import { Button } from '@/components/ui/button'
import { useGetGeneratedItems } from '@/hooks_api/useGetItemFilterWise'

function AssortmentSelectionTable() {

    const queryClient = useQueryClient()

    const { generatedItems } = useGetGeneratedItems()
    const selections = useGeneratedItemsDataStore((state) => state.selections)
    const setSelection = useGeneratedItemsDataStore((state) => state.setSelection)
    const clearSelection = useGeneratedItemsDataStore((state) => state.clearSelections)
    const initializeSelections = useGeneratedItemsDataStore((state) => state.initializeSelections)
    const close = useAssortmentManagementStore((state) => state.close2)
  
    useEffect(() => {
      if (generatedItems && generatedItems.length > 0) {
        initializeSelections(generatedItems)
      }
    }, [generatedItems])
    
    const columnsToDisplay = [
      { itemCode: 'Item Code' },
      { itemName: 'Item Name' },
      { barCode: 'Bar Code' },
      { itemGroup: 'Item Group' },
      { hsnsacCode: 'HSN/SAC Code' },
    ]
  
    function closeModal() {
      close()
      queryClient.setQueryData(['generatedAssortmentItems'], [])
      queryClient.setQueryData(['itemsGroupsProperties'], null)
      clearSelection()
    }
  return (
    <div className="mt-8">
    <h3 className="text-md font-semibold mb-2">Generated Items</h3>
    {generatedItems && generatedItems.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              {columnsToDisplay.map((col) => {
                const key = Object.keys(col)[0] // e.g., 'itemCode'
                const headerLabel = col[key as keyof typeof col]  // e.g., 'Item Code'
                return (
                  <th key={key} className="px-4 py-2 border text-center">
                    {headerLabel}
                  </th>
                )
              })}
              <th className="px-4 py-2 border text-center">Selection</th>
            </tr>
          </thead>
          <tbody>
            {generatedItems.map((item) => (
              <tr key={item.itemCode}>
                {columnsToDisplay.map((col) => {
                  const key = Object.keys(col)[0] // e.g., 'itemCode'
                  return (
                    <td key={key} className="px-4 py-2 border text-center">
                      {item[key as keyof typeof col] as React.ReactNode}
                    </td>
                  )
                })}
                {/* Dropdown column */}
                <td className="px-4 py-2 border text-center">
                  <select
                    value={selections[item.itemCode] || 'default'}
                    onChange={(e) =>
                      setSelection(
                        item.itemCode,
                        e.target.value as 'default' | 'included' | 'excluded'
                      )
                    }
                    className="p-1 border rounded"
                  >
                    <option value="default">Default</option>
                    <option value="included">Included</option>
                    <option value="excluded">Excluded</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>No generated items available.</p>
    )}
    <div className="p-4  flex justify-end gap-3">
      <Button type="button" onClick={closeModal}>
        Close
      </Button>
      <Button type="button" onClick={close}>
        Save
      </Button>
    </div>
  </div>
  )
}

export default AssortmentSelectionTable