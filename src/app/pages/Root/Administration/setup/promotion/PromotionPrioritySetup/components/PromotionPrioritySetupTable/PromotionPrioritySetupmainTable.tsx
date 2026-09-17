import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import PromotionPrioritySetupTable from './PromotionPrioritySetupTable'
// import PromotionSelectionTable from '../../../PromotionAllocation/components/PromotionSelectionTable'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from '@/components/ui/table'

type Assortment = {
  id: number
  name: string
  type: string
}

// eslint-disable-next-line import/order
import { ChevronDown } from 'lucide-react'
import '../../../../../../../../../style.css';

const ITEMS_PER_PAGE = 5

const PromotionPrioritySetupmainTable = () => {
  const [data, setData] = useState<Assortment[]>([])
  const [searchText, setSearchText] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeDropdownRowId, setActiveDropdownRowId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    type: true,
  })

  const methods = useForm()

  useEffect(() => {
    const fetchData = async () => {
      const response = await new Promise<Assortment[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, name: 'Arindam Test Assortment', type: 'P' },
            { id: 2, name: 'tarikul', type: 'P' },
            { id: 3, name: 'Masum', type: 'P' },
            { id: 4, name: 'Mahibar Test Assortment-24', type: 'P' },
            { id: 5, name: 'Deb22', type: 'P' },
            { id: 6, name: 'Shahidul', type: 'P' },
            { id: 7, name: 'Tanvir', type: 'P' },
          ])
        }, 500)
      })
      setData(response)
    }

    fetchData()
  }, [])

  const toggleColumn = (column: 'name' | 'type') => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  const filteredData = data
    .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      const val = a.name.localeCompare(b.name)
      return sortAsc ? val : -val
    })

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleSelectAll = () => {
    const currentPageIds = paginatedData.map((item) => item.id)
    const allSelected = currentPageIds.every((id) => selectedId.includes(id))

    if (allSelected) {
      setSelectedId((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    } else {
      const updated = Array.from(new Set([...selectedId, ...currentPageIds]))
      setSelectedId(updated)
    }
  }

  const toggleCheckbox = (id: number) => {
    if (selectedId.includes(id)) {
      setSelectedId((prev) => prev.filter((itemId) => itemId !== id))
    } else {
      setSelectedId((prev) => [...prev, id])
    }
  }

  const isAllSelected = paginatedData.every((item) => selectedId.includes(item.id))

  return (
    <div className="p-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/3">
            <Input
              placeholder="PromotionPriority Setup Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
                setCurrentPage(1)
              }}
              className="w-[400px]"
            />
          </div>

          <div className="flex gap-2 items-center">
            <DialogTrigger asChild>
              <Button onClick={() => setIsModalOpen(true)}>Add</Button>
            </DialogTrigger>
            <Button variant="outline">Export</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Column <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleColumn('name')}>
                  {visibleColumns.name ? '✓' : ''} Assortment Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleColumn('type')}>
                  {visibleColumns.type ? '✓' : ''} Assortment Type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
              </TableHead>
              {visibleColumns.name && (
                <TableHead
                  onClick={() => setSortAsc(!sortAsc)}
                  className="cursor-pointer select-none"
                >
                  Assortment Name {sortAsc ? '↑' : '↓'}
                </TableHead>
              )}
              {visibleColumns.type && <TableHead>Assortment Type</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted transition-colors">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedId.includes(item.id)}
                    onChange={() => toggleCheckbox(item.id)}
                  />
                </TableCell>
                {visibleColumns.name && <TableCell className="font-medium">{item.name}</TableCell>}
                {visibleColumns.type && <TableCell>{item.type}</TableCell>}
                <TableCell className="text-right">
                  <DropdownMenu
                    onOpenChange={(isOpen) => {
                      setActiveDropdownRowId(isOpen ? item.id : null)
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={activeDropdownRowId === item.id}
                        className="text-lg font-bold"
                      >
                        ...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item)
                          setIsEditModalOpen(true)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item)
                          setIsViewModalOpen(true)
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Delete', item.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="px-2 mt-1 text-c-black">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>

        <FormProvider {...methods}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Promotion Priority Setup</DialogTitle>
            </DialogHeader>
            {/* <PromotionSelectionTable /> */}
            <PromotionPrioritySetupTable onCancel={() => setIsModalOpen(false)} />
          </DialogContent>
        </FormProvider>
      </Dialog>

      {/* === Edit Modal === */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Promotion Allocation</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {/* <p className="text-lg">Editing: <strong>{selectedItem.name}</strong></p> */}
              {/* <Input defaultValue={selectedItem.name} /> */}
              <div className="flex justify-end">
                <Button onClick={() => setIsEditModalOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* === View Modal === */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>View Promotion Allocation</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {selectedItem.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedItem.name}
              </p>
              <p>
                <strong>Type:</strong> {selectedItem.type}
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PromotionPrioritySetupmainTable
