import { useState, useEffect } from 'react'

import useSearchItemsStore from './store/useSearchItems'
import { useSalesData } from '../../api/useSalesData'
import useSales from '../../store/useSales'
import useSalesSearchStore from '../SalesSearch/store/useSalesSearch'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function SalesSearchTable() {
  const { searchKey } = useSalesSearchStore()
  const { salesData } = useSalesData()
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6
  const { increaseQuantity } = useSales()

  const { selectedSearchItems, toggleSelectedItem } = useSearchItemsStore()

  const filteredSalesData =
    salesData?.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchKey.toLowerCase()) ||
        item.id.toLowerCase().includes(searchKey.toLowerCase())
    ) || []

  const paginatedSalesData = filteredSalesData.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  )

  const totalPages = Math.ceil(filteredSalesData.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(0)
  }, [searchKey])

  console.log(selectedSearchItems)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="hidden sm:table-cell">UOM</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>MRP</TableHead>
            <TableHead className="hidden sm:table-cell">GST</TableHead>
            <TableHead>Amt</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSalesData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500">
                No matching items found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedSalesData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`cursor-pointer hover:bg-red-100 ${selectedSearchItems.includes(item.id) ? 'bg-red-50' : ''}`} // Highlight selected row
                onClick={() => {
                  if (!selectedSearchItems.includes(item.id)) {
                    // First time click (item not selected yet), so select it
                    toggleSelectedItem(item.id)
                  } else {
                    // Item is already selected, so increase the quantity
                    increaseQuantity(item.id)
                  }
                }} // Use Zustand toggle function
              >
                <TableCell className="font-medium text-[11px] sm:text-sm">
                  {currentPage * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="text-[11px] sm:text-sm">{item.itemName}</TableCell>
                <TableCell className="hidden sm:table-cell text-[11px] sm:text-sm">
                  {item.uom}
                </TableCell>
                <TableCell className="text-[11px] sm:text-sm">1</TableCell>
                <TableCell className="text-[11px] sm:text-sm">₹{item.mrp}</TableCell>
                <TableCell className="hidden sm:table-cell text-[11px] sm:text-sm">
                  {item.gst}%
                </TableCell>
                <TableCell className="text-[11px] sm:text-sm">₹{item.amount}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span className="text-[12px] mt-2">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default SalesSearchTable
