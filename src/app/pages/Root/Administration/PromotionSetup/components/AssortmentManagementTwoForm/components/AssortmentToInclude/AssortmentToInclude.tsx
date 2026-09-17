import { useState } from 'react'

import { useAssortmentIncludedData } from './hook/useAssortmentIncludedData'

import SkeletonLoaderTable from '@/components/SkeletonLoaderTable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'

const AssortmentToInclude = () => {
  const { assortmentIncludedData, isLoading } = useAssortmentIncludedData()

  // State to track selected items
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [attributeColumns, setAttributeColumns] = useState<string[]>([]) // Dynamically track attribute columns

  // Handle checkbox selection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleSelection = (item: any) => {
    
    const isSelected = selectedItems[item.barcode]

    setSelectedItems((prev) => ({
      ...prev,
      [item.barcode]: !isSelected, // Toggle selection
    }))

    if (!isSelected) {
      // Add dynamically generated attributes to columns
      const newAttributes = Object.keys(item.attributes || {})
      setAttributeColumns(
        (prevColumns) => Array.from(new Set([...prevColumns, ...newAttributes])) // Merge unique attribute keys
      )
    } else {
      // Remove attributes of deselected item from columns
      const remainingSelectedItems = Object.entries(selectedItems)
        .filter(([barcode, selected]) => selected && barcode !== item.barcode)
        .map(([barcode]) => assortmentIncludedData?.find((data) => data.barcode === barcode))

      const remainingAttributes = remainingSelectedItems.flatMap((item) =>
        Object.keys(item?.attributes || {})
      )

      setAttributeColumns(Array.from(new Set(remainingAttributes))) // Update columns dynamically
    }
  }

  if (isLoading) {
    return (
      <div className="mt-5">
        <SkeletonLoaderTable rows={5} columns={5} />
      </div>
    )
  }

  if (!isLoading && !assortmentIncludedData) {
    return <h3>No data</h3>
  }

  return (
    <div className="mt-5">
      <div className="flex gap-6 w-full m-3">
      <div className="w-[300px]">
      <Select>
    <SelectTrigger className="">
      <SelectValue placeholder="Select a Name" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Names</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
      </div>
      <div className="ml-auto flex space-x-2 float-end mr-3 gap-4">
        <Button>Show Items</Button>
        <Button>Copy Assortment</Button>
      </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Group</TableHead>
            {attributeColumns.map((_, index) => (
              <TableHead key={index} className="text-right">
                Attribute {index + 1}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {assortmentIncludedData?.map((item) => (
            <TableRow key={item.barcode}>
              <TableCell>
                <Checkbox
                  checked={!!selectedItems[item.barcode]}
                  onCheckedChange={() => toggleSelection(item)}
                />
              </TableCell>
              <TableCell>{item.barcode}</TableCell>
              <TableCell>{item.itemName}</TableCell>
              <TableCell>{item.group}</TableCell>
              {attributeColumns.map((attr) => (
                <TableCell key={`${item.barcode}-${attr}`} className="text-right">
                     {/* //  @ts-nocheck  */}
                     {selectedItems[item.barcode] ? (item.attributes as Record<string, string | undefined>)[attr] || '--' : '--'}

                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AssortmentToInclude
