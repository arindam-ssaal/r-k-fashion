// tableColumns.ts   PettyCashHead
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { useCreatePettyCash } from '../../../../hooks_api/useCreatePettyCash'
import { useFetchPettyCashById } from '../../../../hooks_api/usePettyCashById'
import { usePettyCashDataStore } from '../../../../store/usePettyCashDataStore'
import usePettyCashHead from '../../../../store/usePettyCashHead'
import {  PettyCashTableData, PettyCashStatus } from '../../data/tableData'

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


export const columns: ColumnDef<PettyCashTableData>[] = [
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
    accessorKey: 'pettyCashID',
    header: ({ column }) => (
      <Button className='ps-0' variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        PettyCash ID
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('pettyCashID')}</div>,
  },
  
  {
    accessorKey: 'pettyCashName',
    header: ({ column }) => (
      <Button className='ps-0' variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        PettyCash Name
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="">{row.getValue('pettyCashName')}</div>,
  },
  {
    accessorKey: 'pettyCashCode',
    header: 'Petty Cash Code',
    cell: ({ row }) => <div>{row.getValue('pettyCashCode')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('isActive') as PettyCashStatus
      return (
        <div
          className={`capitalize ${
            status === PettyCashStatus.ACTIVE ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {status}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const PettyCashHead = row.original

      return <TableRowDropDowns PettyCashHead={PettyCashHead} />
    },
  },
]

function TableRowDropDowns({ PettyCashHead }: { PettyCashHead: PettyCashTableData }) {
  const modalToggler = usePettyCashHead((state) => state.toggleOpen)
  const setModalMode = usePettyCashHead((state) => state.setMode)
  const setCurrentPettyCashId = usePettyCashDataStore((state) => state.setCurrentPettyCashId)
  const { fetchPettyCashById } = useFetchPettyCashById()
  const { createPettyCash } = useCreatePettyCash()

  function EditModalHandler() {
    modalToggler()
    setCurrentPettyCashId(Number(PettyCashHead.pettyCashID))
    setModalMode('Edit')
  }

  function ViewModalHandler() {
    modalToggler()
    setCurrentPettyCashId(Number(PettyCashHead.pettyCashID))
    setModalMode('View')
  }

  async function DeleteHandler() {
    // console.log('DeleteHandler')
    try {
      const data = await fetchPettyCashById(Number(PettyCashHead.pettyCashID))

      const deletePayload = {
        ...data,
        pettyCashID: Number(data.pettyCashID),
        usedFor: 'D', // 🗑️ Delete flag set karo
      }

      await createPettyCash(deletePayload)

      setModalMode('Delete')
      console.log('✅ Successfully deleted the Petty Cash')
    } catch (error) {
      console.error('❌ Error fetching or deleting data:', error)
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
          onClick={() => navigator.clipboard.writeText(String(PettyCashHead.pettyCashID))}
        >
          Copy Petty Cash ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={EditModalHandler}>Edit Petty Cash</DropdownMenuItem>
        <DropdownMenuItem onClick={ViewModalHandler}>View Petty Cash</DropdownMenuItem>
        <DropdownMenuItem onClick={DeleteHandler}>Delete Petty Cash</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
