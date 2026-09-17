import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const itemDetails = [
  {
    barCode: '00051',
    item: 'ABCDE',
    totalAmt: '400',
    totalQty: '33',
    avgqtyBasket: '44',
    avgrateBasket: '900.00',
    taxAmount: '290',
    amount: '100',
  },
  {
    barCode: '00071',
    item: 'ABCDEF',
    totalAmt: '700',
    totalQty: '55',
    avgqtyBasket: '90',
    avgrateBasket: '700.00',
    taxAmount: '590',
    amount: '600',
  }
]

function ItemWise() {
  return (
    <div>Item Details
       <div className="flex items-center space-x-2 m-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Barcode</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>Avg. Qty per Basket</TableHead>
                    <TableHead>Avg. Rate per Basket</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemDetails.map((itemdetail) => (
                    <TableRow key={itemdetail.barCode}>
                      <TableCell className="font-medium">{itemdetail.barCode}</TableCell>
                      <TableCell className="font-medium">{itemdetail.item}</TableCell>
                      <TableCell className="font-medium">{itemdetail.totalAmt}</TableCell>
                      <TableCell className="font-medium">{itemdetail.totalQty}</TableCell>
                      <TableCell className="font-medium">{itemdetail.avgqtyBasket}</TableCell>
                      <TableCell className="font-medium">{itemdetail.avgrateBasket}</TableCell>
                      <TableCell className="font-medium">{itemdetail.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow></TableRow>
                </TableFooter>
              </Table>
            </div>
    </div>
  )
}

export default ItemWise