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
      <TableCell className="font-medium text-[11px] sm:text-sm "><Button>{item.image}Img</Button></TableCell>
      <TableCell className="font-medium text-[11px] sm:text-sm ">{item.barcode}</TableCell>
      <TableCell className="text-[11px] sm:text-sm">{item.itemName}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">{item.mrp}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{item.rate}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.quantity ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.discountAmt ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.promoAmt ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.totalAmt ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.salesPerson ?? 0)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.hsnCode ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.taxRate ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.taxAmt ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.perItemDiscount ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.perItemPromoAmt ?? 0).toFixed(2)}</TableCell>
      <TableCell className=" text-[11px] sm:text-sm">₹{(item.unraxAmt ?? 0).toFixed(2)}</TableCell>
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
