import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import useGoodsReceiptStoreType from '../../store/useGoodsReceiptStoreType'
import GoodsReceiptStoreModal from '../GoodsReceiptStoreModal'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
//import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    date: '2021-10-10',
    transferNo: 123,
    replenishmentSource: 'success',
    noofPackets: 22,
    totalQty: 100,
    totalAmount: 1000,
    // status: 'success',
    currentStatus: 'Received',
  },

  {
    id: 'm5ggr84i9',
    date: '2022-10-10',
    transferNo: 44,
    replenishmentSource: 'success',
    noofPackets: 12,
    totalQty: 55,
    totalAmount: 10030,
    // status: 'failed',
    currentStatus: 'Not Received',
  },
  {
    id: 'dsw84i9',
    date: '2025-03-16',
    transferNo: 40,
    replenishmentSource: 'success',
    noofPackets: 22,
    totalQty: 85,
    totalAmount: 8000,
    // status: 'failed',
    currentStatus: 'Not Received',

  },
  {
    id: 'm22ggr84i9',
    date: '2022-12-12',
    transferNo: 66,
    replenishmentSource: 'success',
    noofPackets: 125,
    totalQty: 545,
    totalAmount: 1021130,
    // status: 'failed',
    currentStatus: 'Received',
  },
  {
    id: '343@123',
    date: '2012-12-10',
    transferNo: 89,
    replenishmentSource: 'success',
    noofPackets: 99,
    totalQty: 32,
    totalAmount: 10211130,
    // status: 'failed',
    currentStatus: 'Received',
  },
]

export type Payment = {
  id: string
  date: string
  transferNo: number
  // status: 'pending' | 'processing' | 'success' | 'failed'
  replenishmentSource: string
  noofPackets: number
  totalQty: number
  totalAmount: number
  currentStatus: 'Received' | 'Not Received' | 'Partial Received' | 'Pending'
}

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <div className="capitalize">{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'transferNo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Transfer No
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('transferNo')}</div>,
  },
  {
    accessorKey: 'replenishmentSource',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Replenishment Source
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('replenishmentSource')}</div>,
  },
  {
    accessorKey: 'noofPackets',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          No of Packets
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('noofPackets')}</div>,
  },
  {
    accessorKey: 'totalQty',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Quantity
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('totalQty')}</div>,
  },

  {
    accessorKey: 'currentStatus',
    header: 'Current Status',
    cell: ({ row }) => {
      const modalToggler = useGoodsReceiptStoreType((state) => state.toggleOpen)
      const setModalMode = useGoodsReceiptStoreType((state) => state.setMode)

      function createModalHandler() {
        setModalMode('Create')
        modalToggler()
        // alert('Generate Receipt')
      }
      return (
        <div>
          {row.getValue('currentStatus')}
          {row.getValue('currentStatus') === 'Not Received' && (
          <Button onClick={createModalHandler} className="ml-2">Generate Receipt</Button>
        )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function GoodsReceiptStoreTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [filteredData, setFilteredData] = React.useState(data) // State for filtered data


  const table = useReactTable({
    data: filteredData, // Use filtered data instead of static data
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function filterData(status: string) {
    if (status === 'All') {
      setFilteredData(data)
    }
    else {
      setFilteredData(data.filter((item) => item.currentStatus === status))
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <h2 className="text-xl capitalize">Goods Receipt at Store</h2>
          {/* <Input
            placeholder="Filter Transfer No..."
            value={(table.getColumn('noofPackets')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('noofPackets')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          /> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => filterData('All')} className=" m-2">
            All
          </Button>
          <Button onClick={() => filterData('Received')} className="m-2">
            Received
          </Button>
          <Button onClick={() => filterData('Not Received')} className="m-2">
            Not Received
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <GoodsReceiptStoreModal />
    </>
  )
}
