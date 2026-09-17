import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { PaymodeTableType } from '../../PaymodeTable'
import PaymodeTableActions from '../PaymodeTableActions/PaymodeTableActions'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'


export const columns: ColumnDef<PaymodeTableType>[] = [
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
    accessorKey: 'paymentModeID',
    header: () => <div className="">PaymentMode ID</div>,
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('paymentModeID')}</div>
    },
  },

  {
    accessorKey: 'paymentModeName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          PaymentMode Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{row.getValue('paymentModeName')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: 'Is Active',
    cell: ({ row }) => <div className="capitalize">{row.getValue('isActive')}</div>,
  },
  {
    accessorKey: 'shortCode',
    header: 'Short Code',
    cell: ({ row }) => <div className="capitalize">{row.getValue('shortCode')}</div>,
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const paymode = row.original

      return <PaymodeTableActions paymode={paymode} />
    },
  },
]
