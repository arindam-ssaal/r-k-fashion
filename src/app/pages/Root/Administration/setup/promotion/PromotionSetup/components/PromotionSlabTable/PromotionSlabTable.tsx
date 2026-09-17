import { useFieldArray, useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

function PromotionSlabTable() {
  const { control, register, watch } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'promotionParameters.objValue',
  })

  const promotionType = watch('promotionType')

  return (
    <div className=" rounded-md">
      <h4 className="font-semibold mb-3">
        {promotionType === 'B' ? 'Define Bill Amount Base Slab' : 'Define Slab'}
      </h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>From Qty</TableHead>
            <TableHead>To Qty</TableHead>
            {/* <TableHead>Add Item</TableHead> */}
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>1</TableCell>
              <TableCell>
                <Input
                  type="number"
                  {...register(`promotionParameters.objValue.${index}.fromValue`, { valueAsNumber: true })}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  {...register(`promotionParameters.objValue.${index}.toValue`, { valueAsNumber: true })}
                />
              </TableCell>
              {/* <TableCell>℮</TableCell> */}
              <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                ❌
              </Button>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        type="button"
        className="mt-4"
        onClick={() => append({ lineNum: fields.length + 1, fromValue: '', toValue: '' })}
      >
        Add Row
      </Button>
      <Button type="submit" className="ml-4 mt-4">
        Submit
      </Button>
    </div>
  )
}

export default PromotionSlabTable
