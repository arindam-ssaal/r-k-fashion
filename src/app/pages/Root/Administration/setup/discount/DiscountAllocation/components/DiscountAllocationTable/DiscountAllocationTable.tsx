import { useState, useEffect } from 'react'

import { useDiscountAllocationStore } from '../../store/useDiscountAllocationStore'
import { useDiscountAllocationList } from '../DiscountAllocationList/store/useDiscountAllocationList'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function DiscountAllocationTable() {
  const openModal = useDiscountAllocationStore((state) => state.toggleOpen)
  const selectedItems = useDiscountAllocationList((state) => state.selectedItems)
  const removeItem = useDiscountAllocationList((state) => state.removeItem)

  // Sync rows when selectedItems change
  useEffect(() => {
    syncRowsWithSelectedItems()
  }, [selectedItems])

  const [rows, setRows] = useState([{ id: 1 }]) // Initial row setup

  // Sync rows with selected items
  const syncRowsWithSelectedItems = () => {
    // Ensure rows length matches selectedItems length
    setRows((prev) => {
      if (selectedItems.length > prev.length) {
        const additionalRows = selectedItems.length - prev.length
        return [
          ...prev,
          ...Array.from({ length: additionalRows }, (_, index) => ({
            id: prev.length + index + 1,
          })),
        ]
      } else if (selectedItems.length < prev.length) {
        return prev.slice(0, selectedItems.length) // Trim rows if items are removed
      }
      return prev // No change needed
    })
  }

  // Add row only if all rows are filled
  const handleAddRow = () => {
    if (rows.length <= selectedItems.length) {
      setRows((prev) => [...prev, { id: prev.length + 1 }])
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">No</TableHead>
          <TableHead>Select Discount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              {selectedItems[index] ? (
                <span>{selectedItems[index].name}</span> // Show selected item name
              ) : (
                <Button onClick={openModal}>Select</Button> // Open modal for selection
              )}
            </TableCell>
            <TableCell>
              {selectedItems[index] && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeItem(selectedItems[index])} // Remove item from store
                >
                  Remove Item
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>
            <Button
              disabled={rows.length === 1} // Disable if all rows are filled
              onClick={handleAddRow}
            >
              Add Row
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default DiscountAllocationTable
