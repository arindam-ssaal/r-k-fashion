// tableColumns.ts
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { useCreateCustomer } from '../../../../hooks_api/useCreateCustomer'
import {  useFetchCustomerMasterById } from '../../../../hooks_api/useCustomerData'
import { useCustomerMaster } from '../../../../store/useCustomerMaster'
import { useCustomerMasterDataStore } from '../../../../store/useCustomerMasterDataStore'
import { CustomerStatus, CustomerTableRow } from '../../data/data'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


export const columns: ColumnDef<CustomerTableRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => <div className="">{row.index + 1}</div>, // Row index for numbering
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Full Name
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as CustomerStatus
      return (
        <div
          className={`capitalize ${
            status === CustomerStatus.ACTIVE ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Email
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phoneNo',
    header: 'Phone Number',
    cell: ({ row }) => <div>{row.getValue('phoneNo')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

      return <TableRowDropDowns customer={customer} />
    },
  },
]



function TableRowDropDowns({ customer }: { customer: CustomerTableRow }) {
  const { fetchCustomerById } = useFetchCustomerMasterById()
  const {createCustomerAsync}=useCreateCustomer();
  const modalToggler = useCustomerMaster((state) => state.toggleOpen)
  const setModalMode = useCustomerMaster((state) => state.setMode)
  const mode = useCustomerMaster((state) => state.mode)
  const setCurrentSalesPersonId = useCustomerMasterDataStore(
    (state) => state.setCurrentCustomerMasterId
  )
  function EditModalHandler() {
    modalToggler()
    setCurrentSalesPersonId(Number(customer.customerId))
    setModalMode('Edit')
  }

  function ViewHandler() {
    modalToggler()
    setCurrentSalesPersonId(Number(customer.customerId))
    setModalMode('View')
  }

  async function deleteHandler() {
    try {
      setModalMode('Delete')
      const data = await fetchCustomerById(Number(customer?.customerId))
      await createCustomerAsync({...data,usedFor:"D"});
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(customer.customerId))}
        >
          Copy Customer ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={EditModalHandler}>Edit Customer</DropdownMenuItem>
        <DropdownMenuItem onClick={ViewHandler}>View Customer</DropdownMenuItem>
        <DropdownMenuItem onClick={deleteHandler}>Delete Customer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
