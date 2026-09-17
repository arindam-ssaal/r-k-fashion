import { Hash, Gift, MousePointerClick, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { usePromotionAllocationStore } from '../../store/usePromotionAllocationStore'
import { usePromotionSelectionListStore } from '../PromotionSelectionList/store/usePromotionSelctionListStore'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import '../../../../../../../../../style.css'

type PromotionSelectionTableProps = {
  readOnly?: boolean
}

function PromotionSelectionTable({ readOnly = false }: PromotionSelectionTableProps) {
  const { control, register } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'selectedPromotions',
  })

  const openModal = usePromotionAllocationStore((state) => state.toggleOpen)
  const openSelector = usePromotionSelectionListStore((state) => state.openSelector)
  const addRow = () => {
    append({ promotionID: '', promotionName: '' })
  }

  const removeRow = (index:number) => {
    remove(index);
    usePromotionSelectionListStore.setState((state) => {
      const updated = [...state.selectedPromotions]
      updated.splice(index, 1)
      return { selectedPromotions: updated }
    })
  };



  return (
    <div className="p-6 bg-gradient-to-br rounded-lg" style={{backgroundColor:'#fff'}}>
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-sky-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Gift className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold" style={{color: 'black'}}>Selected Promotions</h2>
        </div>
      </div>

      <div className=" rounded-lg shadow-sm border border-sky-100 overflow-hidden" style={{backgroundColor:'#fff'}}>
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-50 hover:bg-sky-50">
              <TableHead className="font-semibold " style={{color: 'black'}} >No</TableHead>
              <TableHead className="font-semibold  flex items-center gap-2" style={{color: 'black'}}>
                <Hash className="w-4 h-4 text-c-sky-600" />
                Id
              </TableHead>
              <TableHead className="font-semibold " style={{color: 'black'}}>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-c-sky-600" />
                  Promotion
                </div>
              </TableHead>
              <TableHead className="font-semibold " style={{color: 'black'}}>
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-c-red-600" />
                  Actions
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field: any, index) => (
              <TableRow key={field.id || index} className="hover:bg-sky-50/50 transition-colors">
                <TableCell className="font-medium text-gray-700">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell>
                  <input
                    {...register(`selectedPromotions.${index}.promotionID`)}
                    placeholder="ID"
                    disabled
                    className="border border-sky-200 rounded-md p-2 w-[120px] text-center bg-sky-50/50 text-gray-600 font-medium"
                    readOnly
                  />
                </TableCell>
                <TableCell>
                  {field?.promotionName  ? (
                    <input
                      {...register(`selectedPromotions.${index}.promotionName`)}
                      className="border border-sky-200 rounded-md p-2 w-[320px] bg-sky-50/50 text-gray-700 font-medium"
                      disabled
                      readOnly
                    />
                  ) : (
                    <Button
                      type='button'
                      onClick={() => {
                        openSelector(index)
                        openModal()
                      }}
                      disabled={readOnly}
                      className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm h-9"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Select Promotion
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    // variant="ghost"
                    size="sm"
                    onClick={() => removeRow(index)}
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
        </Table>
      </div>

      <div className="mt-6">
        <Button 
          type='button' 
          onClick={addRow} 
          disabled={fields.length === 1 || readOnly}
          className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm h-10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Promotions
        </Button>
      </div>
    </div>
  )
}

export default PromotionSelectionTable
