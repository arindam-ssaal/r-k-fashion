// tableColumns.ts
import { CaretSortIcon,  } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import {  ExtendedSalesPersonType, SalesPersonStatus } from '../../data/tableData'
import TableRowDropDowns from '../SalesPersonTableColumnActions'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'


export const columns: ColumnDef<ExtendedSalesPersonType>[] = [
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
      cell:  ({ row }) => {
        const status = row.getValue('status') as SalesPersonStatus;
        return (
          <div
            className={`capitalize ${
              status === SalesPersonStatus.ACTIVE ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {status}
          </div>
        );
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
    accessorKey: 'mobileNo',
    header: 'Phone Number',
    cell: ({ row }) => <div>{row.getValue('mobileNo')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const salesPerson = row.original

      return <TableRowDropDowns salesPerson={salesPerson} />
    },
  },
]

