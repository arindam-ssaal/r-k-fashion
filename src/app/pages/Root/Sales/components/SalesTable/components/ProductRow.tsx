import { Minus, Plus } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { ProductModified } from '@/types/sales'

interface ProductRowProps {
  item: ProductModified
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
}

function ProductRow({ item, onIncrease, onDecrease }: ProductRowProps) {
  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium text-[11px] sm:text-sm ">{item.id}</TableCell>
      <TableCell className="text-[11px] sm:text-sm">{item.itemName}</TableCell>
      <TableCell className="hidden sm:table-cell text-[11px] sm:text-sm">{item.uom}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">{item.quantity}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{item.mrp.toFixed(2)}</TableCell>
      <TableCell className=" hidden sm:table-cell">{item.gst}%</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{item.amount.toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">
        <div className="flex gap-1  sm:gap-2">
          <Button
            size={'icon'}
            className="h-5 w-5 sm:h-6 sm:w-6 md:w-7 md:h-7"
            onClick={() => onDecrease(item.id)}
          >
            <Minus />
          </Button>
          <Button
            size={'icon'}
            className="h-5 w-5 sm:h-6 sm:w-6 md:w-7 md:h-7"
            onClick={() => onIncrease(item.id)}
          >
            <Plus />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default ProductRow
