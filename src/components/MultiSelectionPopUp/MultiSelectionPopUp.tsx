import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { useMultiSelectionPopUpStore } from './store/useMultiSelectionPopUpStore'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// type MultiSelectionPopUpProps = {
// }

function MultiSelectionPopUp() {
  const isOpen = useMultiSelectionPopUpStore((state) => state.open)
  console.log(isOpen)

  return (
    <Popover>
      <PopoverTrigger>
        <MagnifyingGlassIcon color="red" />
      </PopoverTrigger>
      <PopoverContent>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  )
}

export default MultiSelectionPopUp
