import { useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { useAssortmentData } from '@/components/AssortmentManagement/hooks_api/useAssortmentData'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

interface Assortment {
  assortmentID: string;
  assortmentName: string;
}

interface PromotionBenefitForm {
  promotionParameters: {
    benefitType: {
      type: 'F' | 'P' | 'B';
      value?: number;
      assortmentID?: string;
      assortmentName?: string;
    };
  };
}


function PromotionBenefit() {
  const { control, setValue, watch } = useFormContext<PromotionBenefitForm>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)



  // Watch the selected benefit type to dynamically show/hide inputs
  const selectedBenefitType = useWatch({
    control,
    name: 'promotionParameters.benefitType',
  })

  const selectedAssortment = watch('promotionParameters.benefitType')

  const handleSelectAssortment = (assortment: Assortment) => {
    setValue('promotionParameters.benefitType.assortmentID', String(assortment.assortmentID))
    setValue('promotionParameters.benefitType.assortmentName', assortment.assortmentName)
    setIsModalOpen(false)
  }
  
  return (
    <div>
      <FormField
        control={control}
        name="promotionParameters.benefitType.type"
        render={({ field }) => (
          <FormItem>
            <RadioGroup
              value={field.value || 'F'}
              onValueChange={(value) => {
                field.onChange(value as 'F' | 'P' | 'B')
                if (value === 'F') {
                  setValue('promotionParameters.benefitType.value', undefined)
                  setValue('promotionParameters.benefitType.assortmentID', undefined)
                  setValue('promotionParameters.benefitType.assortmentName', undefined)
                }
              }}
              className="space-y-3 roles-radio"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="F" />
                <label htmlFor="F" className="text-sm ">Flat Discount</label>
              </div>

              {['P', 'B'].map((type) => (
                <div key={type} className="flex flex-col space-x-2">
                  <div className="flex space-x-2 items-center">
                    <RadioGroupItem value={type} id={type} />
                    <label htmlFor={type} className="text-sm">
                      {type === 'P'
                        ? 'Specific Unit from Paid From Assortment'
                        : 'Specific Unit from Benefit Assortment'}
                    </label>
                  </div>
                  {selectedBenefitType.type === type && (
                    <div className="flex flex-col mt-4 space-y-3">
                      <Controller
                        control={control}
                        name="promotionParameters.benefitType.value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specific Unit</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter Quantity" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" onClick={() => setIsModalOpen(true)}>
                        Select Assortment
                      </Button>
                      {selectedAssortment.assortmentName && (
                        <Table className="mt-2">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Assortment ID</TableHead>
                              <TableHead>Assortment Name</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>{selectedAssortment.assortmentID}</TableCell>
                              <TableCell>{selectedAssortment.assortmentName}</TableCell>
                              <TableCell>
                                <Button onClick={() => handleSelectAssortment({ id: 0, name: '' })}>
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <BenefitAssortmentSelectionModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSelectAssortment={handleSelectAssortment}
      />
    </div>
  )
}

export default PromotionBenefit

function BenefitAssortmentSelectionModal({
  isModalOpen,
  setIsModalOpen,
  handleSelectAssortment,
}: {
  isModalOpen: boolean
  setIsModalOpen: Function
  handleSelectAssortment: Function
}) {

  // add pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const {assortmentData, isLoading, error} = useAssortmentData('P')

  const totalPages = Math.ceil((assortmentData?.length || 0) / itemsPerPage)
  const paginatedData = assortmentData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  if(isLoading){
    return <p>Loading Assortments...</  p>
  }

  if(error){
    return <p>Failed to load Assortments</p>
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogContent>
      <h3 className="text-xl font-semibold mb-3">Select an Assortment</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Select</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.map((assortment, ind) => (
            <TableRow key={assortment.assortmentID}>
              <TableCell>{(currentPage - 1) * itemsPerPage + ind + 1}</TableCell>
              <TableCell>{assortment.assortmentName}</TableCell>
              <TableCell>
                <Button onClick={() => handleSelectAssortment(assortment)}>
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
    </DialogContent>
  </Dialog>
  )
}
