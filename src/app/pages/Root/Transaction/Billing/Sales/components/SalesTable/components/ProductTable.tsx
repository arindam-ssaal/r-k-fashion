import ProductRow from './ProductRow'

//import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductModified } from '@/types/sales'

interface ProductTableProps {
  data: ProductModified[]
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
}

function ProductTable({ data, onIncrease, onDecrease }: ProductTableProps) {
  return (
    <div className="responsive-table min-h-[10rem]  overflow-x-scroll max-h-[10rem] ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>MRP</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Discount Amt</TableHead>
            <TableHead>Promo Amt</TableHead>
            <TableHead>Total Amt</TableHead>
            <TableHead>Sales Person</TableHead>
            <TableHead>HSN  Code</TableHead>
            <TableHead>Tax Rate</TableHead>
            <TableHead>Tax Amount</TableHead>
            <TableHead>Per Item Discount</TableHead>
            <TableHead>Per Item Promo  Amt</TableHead>
            <TableHead>Unrax  Amt</TableHead>

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
