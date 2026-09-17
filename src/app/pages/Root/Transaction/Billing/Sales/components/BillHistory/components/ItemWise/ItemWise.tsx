import {
  Table,
  TableBody,
  //TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
    amount: '$288.66',
    billno: '199',
    rate: '3%',
    billdate: '12/05/2024',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
    amount: '$288.66',
    billno: '199',
    rate: '3%',
    billdate: '12/05/2024',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
    amount: '$288.66',
    billno: '199',
    rate: '3%',
    billdate: '12/05/2024',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
    amount: '$288.66',
    billno: '199',
    rate: '3%',
    billdate: '12/05/2024',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
    amount: '$288.66',
    billno: '199',
    rate: '3%',
    billdate: '12/05/2024',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
    amount: '$288.66',
    billno: '199',
    rate: '3%',
    billdate: '12/05/2024',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
    amount: '$288.66',
    billno: '199',
    rate: '3%',
    billdate: '12/05/2024',
  },
]

function ItemWise() {
  return (
    <div>
      {/* ItemWise */}
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Bar Code</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Bill No</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Bill Dt.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">{invoice.totalAmount}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>{invoice.billno}</TableCell>
              <TableCell>{invoice.rate}</TableCell>
              <TableCell>{invoice.billdate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default ItemWise
