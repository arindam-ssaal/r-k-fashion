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
  // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const invoices = [
  {
    invoice: 'INV001',
    assortmentName: 'Formal Shirt',
    storeName: 'MG Road',
    fromDate: '21-11-2024',
    toDate: '26-11-2024',
  },
  {
    invoice: 'INV002',
    assortmentName: 'Formal Shirt',
    storeName: 'MG Road',
    fromDate: '21-11-2024',
    toDate: '26-11-2024',
  },
  {
    invoice: 'INV003',
    assortmentName: 'Salwar Suits',
    storeName: 'MG Road',
    fromDate: '22-11-2024',
    toDate: '26-11-2024',
  },
  {
    invoice: 'INV004',
    assortmentName: 'Salwar Suits',
    storeName: 'Lake Market',
    fromDate: '21-11-2024',
    toDate: '26-11-2024',
  },
  {
    invoice: 'INV005',
    assortmentName: 'Salwar Suits',
    storeName: 'MG Road',
    fromDate: '21-11-2024',
    toDate: '26-11-2024',
  },
  {
    invoice: 'INV006',
    assortmentName: 'Salwar Suits',
    storeName: 'Lake Market',
    fromDate: '21-11-2024',
    toDate: '26-11-2024',
  },
  {
    invoice: 'INV007',
    assortmentName: 'Salwar Suits',
    storeName: 'MG Road',
    fromDate: '21-11-2024',
    toDate: '26-11-2024',
  },
  {
    invoice: 'INV008',
    assortmentName: 'Salwar Suits',
    storeName: 'Shibpur',
    fromDate: '21-11-2024',
    toDate: '26-11-2024',
  },
]

const AssortmentAllocationStoreTable = () => {
  return (
    <div>
      <div className="flex text-center gap-6">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Search Assortment" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Assortment</SelectLabel>
              <SelectItem value="apple">Assortment 1</SelectItem>
              <SelectItem value="banana">Assortment 2</SelectItem>
              <SelectItem value="blueberry">Assortment 3</SelectItem>
              <SelectItem value="grapes">Assortment 4</SelectItem>
              <SelectItem value="pineapple">Assortment 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="">
            <SelectValue placeholder="Search Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Store</SelectLabel>
              <SelectItem value="apple">Store 1</SelectItem>
              <SelectItem value="banana">Store 2</SelectItem>
              <SelectItem value="blueberry">Store 3</SelectItem>
              <SelectItem value="grapes">Store 4</SelectItem>
              <SelectItem value="pineapple">Store 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3 mt-3 overflow-auto sticky">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Select</TableHead>
              <TableHead>Assortment Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">
                  <Checkbox id="terms" />
                </TableCell>
                <TableCell>{invoice.assortmentName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {/* <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell> */}
            </TableRow>
          </TableFooter>
        </Table>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Store Name</TableHead>
              <TableHead>From Date</TableHead>
              <TableHead>To Date</TableHead>
              <TableHead>Activate</TableHead>
              <TableHead>Terminate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell>
                  <Checkbox id="terms" />
                </TableCell>
                <TableCell>{invoice.storeName}</TableCell>
                <TableCell>{invoice.fromDate}</TableCell>
                <TableCell>{invoice.toDate}</TableCell>
                <TableCell>
                  <Checkbox id="terms" />
                </TableCell>
                <TableCell>
                  <Checkbox id="terms" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {/* <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell> */}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
export default AssortmentAllocationStoreTable
