import { Eye, Plus, Trash } from 'lucide-react' // Corrected icons
import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { useAssortmentData } from '@/components/AssortmentManagement/hooks_api/useAssortmentData'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FetchedAssortmentType } from '@/types/assortment'

function PromotionFormAssortmentTable() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const { control, setValue, register } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'promotionParameters.buyAssortments',
  })

  // Watch values for reactivity
  const paidForCondition = useWatch({
    control,
    name: 'promotionParameters.paidForCondition',
  })

  const watchedAssortments =
    useWatch({
      control,
      name: 'promotionParameters.buyAssortments',
    }) || []

  // Open Modal for Assortment Selection
  const handleModalOpen = (index: number) => {
    setSelectedRowIndex(index)
    setModalOpen(true)
  }

  // Close Modal
  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedRowIndex(null)
  }

  // When user selects an Assortment
  const handleAssortmentSelect = (selectedAssortment: FetchedAssortmentType) => {
    console.log(selectedAssortment.assortmentID);
    
    if (selectedRowIndex !== null) {
      setValue(`promotionParameters.buyAssortments.${selectedRowIndex}`, {
        assortmentID: String(selectedAssortment.assortmentID), // ✅ Store ID
        assortmentName: selectedAssortment.assortmentName,
        unit: paidForCondition.condition === "R" ? null : undefined, // ✅ Ensure unit resets correctly
      });
      setModalOpen(false);
    }
  };
  

  return (
    <div className="">
      <h4 className="font-semibold mb-4">Buy Assortment</h4>
      <div className="overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No.</TableHead>
              <TableHead>Assortment Name</TableHead>
              {paidForCondition.condition === 'R' && (
                <TableHead className="w-[70px] text-center">Unit</TableHead>
              )}
              <TableHead className="w-[50px] text-center">Show</TableHead>
              <TableHead className="w-[50px] text-center">Delete</TableHead>
              <TableHead className="w-[50px] text-center">Add</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="text-center">{index + 1}</TableCell>

                {/* Assortment Name (Clickable) */}
                <TableCell
                  className=""
                  style={{color: 'black'}}
                >
                  {watchedAssortments[index]?.assortmentName || 'Select Assortment'}
                </TableCell>

                {/* Conditionally Render Unit Column */}
                {/* Conditionally Render Unit Column */}
                {paidForCondition.condition === 'R' && (
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      placeholder="Unit"
                      {...register(`promotionParameters.buyAssortments.${index}.unit`, {
                        valueAsNumber: true,
                      })}
                      disabled={paidForCondition.condition !== 'R'} // ✅ Fix: Disable when not needed
                    />
                  </TableCell>
                )}

                {/* Show Column - Only Show if Assortment is Selected */}
                <TableCell className="text-center">
                  <Eye className="h-5 w-5 text-gray-500 cursor-pointer" />
                </TableCell>

                {/* Delete */}
                <TableCell className="text-center">
                  <Trash
                    className="h-5 w-5 text-red-500 cursor-pointer"
                    onClick={() => remove(index)}
                  />
                  {/* Plus */}
                </TableCell>
                <TableCell className="text-center">
                  <Plus
                    className="h-5 w-5 text-red-500 cursor-pointer"
                    onClick={() => handleModalOpen(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Row Button */}
      <div className="mt-4 ">
        <Button
          type="button"
          className=" flex items-center gap-2"
          onClick={() =>
            append({
              assortmentName: '',
              ...(paidForCondition.condition === 'buySpecificRatio' && { unit: null }),
            })
          }
        >
          Add Assortment
        </Button>
      </div>

      {/* Assortment Modal */}
      <AssortmentModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSelect={handleAssortmentSelect}
      />
    </div>
  )
}

const AssortmentModal = ({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (assortment: FetchedAssortmentType) => void
}) => {
  const { assortmentData, isLoading } = useAssortmentData('P') // Fetch API data

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil((assortmentData?.length || 0) / itemsPerPage)
  const paginatedData = assortmentData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <h3 className="text-xl font-semibold mb-3">Select an Assortment</h3>
      </DialogHeader>

      {isLoading ? (
        <p>Loading Assortments...</p>
      ) : (
        <>
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Assortment Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData?.map((assortment, ind) => (
                <TableRow key={assortment.assortmentID}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + ind + 1}</TableCell>
                  <TableCell>{assortment.assortmentName}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        onSelect(assortment)
                        onClose()
                      }}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
  )
}


export default PromotionFormAssortmentTable
