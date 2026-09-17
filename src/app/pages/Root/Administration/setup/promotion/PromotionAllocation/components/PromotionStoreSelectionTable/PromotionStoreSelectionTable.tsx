import { Hash, Store, Layers, Calendar, CalendarCheck, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'

import { usePromotionAllocationStore } from '../../store/usePromotionAllocationStore'
import { usePromotionStoreSelectionListStore } from '../PromotionStoreSelectionList/store/usePromotionStoreSelectionListStore'

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
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import '../../../../../../../../../style.css';

type PromotionStoreSelectionTableProps = {
  readOnly?: boolean
}

function PromotionStoreSelectionTable({ readOnly = false }: PromotionStoreSelectionTableProps) {
  const { control, register } = useFormContext()
  const openModal = usePromotionAllocationStore((state) => state.toggleOpen2)
  const openSelector = usePromotionStoreSelectionListStore((state) => state.openSelector)

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'selectedPromotionStores',
  })

  const addRow = () => {
    append({
      storeID: '',
      storeName: '',
      startDate: '',
      closeDate: '',
      allocationType: 'N',
      deallocate: false,
    })
  }

  const handleModal = (index: number) => {
    openSelector(index)
    openModal()
  }

  return (
    <div className="p-6 bg-gradient-to-br back-white  rounded-lg">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-sky-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Store className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold text-c-black">Store Allocation</h2>
        </div>
      </div>

      <div className="back-white rounded-lg shadow-sm border border-sky-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="back-white ">
              <TableHead className="font-semibold text-c-black">No.</TableHead>
              <TableHead className="font-semibold text-c-black">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-c-sky-600" />
                  Id
                </div>
              </TableHead>
              <TableHead className="font-semibold text-c-black">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-c-sky-600" />
                  Select Store
                </div>
              </TableHead>
              <TableHead className="font-semibold text-c-black">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-c-sky-600" />
                  Allocation Type
                </div>
              </TableHead>
              <TableHead className="font-semibold text-c-black">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-c-sky-600" />
                  From Date
                </div>
              </TableHead>
              <TableHead className="font-semibold text-c-black">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-c-sky-600" />
                  To Date
                </div>
              </TableHead>
              <TableHead className="font-semibold text-c-black">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-c-sky-600" />
                  Deallocate
                </div>
              </TableHead>
              <TableHead className="font-semibold text-c-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field: any, index) => (
              <TableRow key={field.id || index} className="hover:bg-sky-50/50 transition-colors">
                <TableCell className="font-medium text-c-black">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                    {index + 1}
                  </div>
                </TableCell>

                <TableCell>
                  <input
                    {...register(`selectedPromotionStores.${index}.storeID`)}
                    className="border border-sky-200 rounded-md p-2 w-[60px] text-center bg-sky-50/50 text-gray-600 font-medium"
                    readOnly
                  />
                </TableCell>

                <TableCell>
                  {field.storeName ? (
                    <input
                      {...register(`selectedPromotionStores.${index}.storeName`)}
                      className="border border-sky-200 rounded-md p-2 w-[150px] bg-sky-50/50 text-c-black font-medium"
                      readOnly
                    />
                  ) : (
                    <Button 
                      type='button' 
                      size="sm"
                      onClick={() => handleModal(index)}
                      disabled={readOnly}
                      className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm h-9"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Select Store
                    </Button>
                  )}
                </TableCell>

                <TableCell>
                  <Controller
                    control={control}
                    name={`selectedPromotionStores.${index}.allocationType`}
                    render={({ field: selectField }) => (
                      <Select
                        onValueChange={selectField.onChange}
                        defaultValue={selectField.value}
                        disabled={readOnly}
                      >
                        <SelectTrigger className="w-[180px] h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Allocation Types</SelectLabel>
                            <SelectItem value="N">Normal</SelectItem>
                            {/* <SelectItem value="H">Happy Hour</SelectItem> */}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </TableCell>

                <TableCell>
                  <input
                    type="date"
                    {...register(`selectedPromotionStores.${index}.startDate`)}
                    disabled={readOnly}
                    className="border border-sky-200 rounded-md px-3 py-2 h-10 focus:border-sky-400 focus:ring-sky-400 focus:outline-none"
                  />
                </TableCell>

                <TableCell>
                  <input
                    type="date"
                    {...register(`selectedPromotionStores.${index}.closeDate`)}
                    disabled={readOnly}
                    className="border border-sky-200 rounded-md px-3 py-2 h-10 focus:border-sky-400 focus:ring-sky-400 focus:outline-none"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <Checkbox
                      {...register(`selectedPromotionStores.${index}.deallocate`)}
                      disabled={readOnly}
                      className="border-sky-400 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <Button
                    type="button"
                    // variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={readOnly}
                    className="back-red-600 text-c-white hover:text-c-white hover-back-red-100:hover  h-9"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className="">
              <TableCell colSpan={8} className="text-left py-4">
                <Button
                  type="button"
                  onClick={addRow}
                  disabled={readOnly}
                  className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}

export default PromotionStoreSelectionTable
