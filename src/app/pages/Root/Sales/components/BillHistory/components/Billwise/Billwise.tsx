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

const billDetails = [
    {
      billingNo: 'POSB/12',
      barCode: '00001',
      itemDetails: 'ABC',
      quantity: '4',
      rate: '900.00',
      taxAmount: '290',
      amount: '100',
    },
  ]
 
 function BillWise () {
  return (
    <div> Bill Details
        <div className="flex items-center space-x-2 m-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Bill No.</TableHead>
                    <TableHead>Barcode</TableHead>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Tax Amount</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billDetails.map((billdetail) => (
                    <TableRow key={billdetail.billingNo}>
                      <TableCell className="font-medium">{billdetail.billingNo}</TableCell>
                      <TableCell className="font-medium">{billdetail.barCode}</TableCell>
                      <TableCell className="font-medium">{billdetail.itemDetails}</TableCell>
                      <TableCell className="font-medium">{billdetail.quantity}</TableCell>
                      <TableCell className="font-medium">{billdetail.rate}</TableCell>
                      <TableCell className="font-medium">{billdetail.taxAmount}</TableCell>
                      <TableCell className="font-medium">{billdetail.amount}</TableCell>
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
export default BillWise