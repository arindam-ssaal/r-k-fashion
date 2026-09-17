import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
  } from '@tanstack/react-table'
  import { ChevronDown } from 'lucide-react'
  import React from 'react'
  
  import columns from './components/AssortmentManagementTwoTableColumn'
import { useAssortmentTwoData } from '../../api/useAssortmentTwoData'
import { useAssortmentTwoStore } from '../../store/useAssortmentTwoStore'
import AssortmentmanagementTwoModal from '../AssortmentmanagementTwoModal'

  import SkeletonLoaderTable from '@/components/SkeletonLoaderTable'
  import { Button } from '@/components/ui/button'
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import { Input } from '@/components/ui/input'
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  
  function AssortmentmanagementTable() {
    const { assortmentData, isLoading } = useAssortmentTwoData()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState({
      pageIndex: 0, // Default to first page
      pageSize: 5, // Default number of rows per page
    })
  
    const modalHandler = useAssortmentTwoStore((state) => state.toggleOpen)
  
    const table = useReactTable({
      data: assortmentData || [],
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
        pagination,
      },
      onPaginationChange: setPagination,
    })
  
    if (isLoading) {
      // Render skeleton loader during loading state
      return (
        <div className="mt-5">
          {' '}
          <SkeletonLoaderTable rows={5} columns={5} />
        </div>
      )
    }
  
    if (!isLoading && !assortmentData) return <h3>No data available.</h3>
  
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Assortment Search"
            value={(table.getColumn('assortmentName')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('assortmentName')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
  
          <ul className="ml-auto flex mr-3 gap-4">
            <li>
              <Button onClick={modalHandler}>Add</Button>
            </li>
            <li>
              <Button variant={'outline'}>Export</Button>
            </li>
          </ul>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
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
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0), // Prevent going below 0
                }))
              }
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.min(prev.pageIndex + 1, table.getPageCount() - 1), // Prevent exceeding max pages
                }))
              }
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
        <AssortmentmanagementTwoModal/>
      </div>
    )
  }
  
  export default AssortmentmanagementTable
  