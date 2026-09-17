import ProductRow from './ProductRow'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductModified } from '@/types/sales'

interface ProductTableProps {
  data: ProductModified[]
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
}

function ProductTable({ data, onIncrease, onDecrease }: ProductTableProps) {
  return (
    <div className="responsive-table min-h-[18rem]  overflow-y-scroll max-h-[18rem] ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="  hidden sm:table-cell">UOM</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>MRP.</TableHead>
            <TableHead className="hidden sm:table-cell">GST</TableHead>
            <TableHead>Amt</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <ProductRow key={item.id} item={item} onIncrease={onIncrease} onDecrease={onDecrease} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductTable
