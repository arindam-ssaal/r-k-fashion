'use client'

import { ChevronDown, Gift, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import PromotionAllocationPage from '../../page'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { GetAPI } from '../../../../../../../../../services/apiCall';
import '../../../../../../../../../style.css';


type Assortment = {
  id: number
  name: string
  type: string
  storeName: string
}

const ITEMS_PER_PAGE = 5

const PromotionAllocationMainTable = () => {
  const [data, setData] = useState<Assortment[]>([])
  const [searchText, setSearchText] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeDropdownRowId, setActiveDropdownRowId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number[]>([])
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    type: true,
    storeName: true,
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Assortment | null>(null)

  const toggleColumn = (column: 'name' | 'type' | 'storeName') => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  const methods = useForm({
    defaultValues: {
      selectedPromotionStores: [],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      /*
      const response = await new Promise<Assortment[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, name: 'Arindam Test Assortment', type: 'P' },
            { id: 2, name: 'Tarikul', type: 'P' },
            { id: 3, name: 'Masum', type: 'P' },
            { id: 4, name: 'Mahibar Test Assortment-24', type: 'P' },
            { id: 5, name: 'Deb22', type: 'P' },
            { id: 6, name: 'Shahidul', type: 'P' },
            { id: 7, name: 'Tanvir', type: 'P' },
          ])
        }, 500)
      })
      setData(response)
      */
      try {
        let PJsonData = {};
        let PType = '';
        let cookies = '';
        let responseJson = await GetAPI('/api/Promotion/GetAllStoreWisePromotion', PType, PJsonData, cookies);
        //console.log('fetchData=>', responseJson.data); 
        const responseJsonData = responseJson.data || [];

        let response = [];
        if (responseJsonData.length > 0) {
          response = responseJsonData.map((item: any) => ({
            id: item.promotionID,
            name: item.promotionName,
            type: 'P',
            storeName: item.storeName,
          }));
        }

        setData(response || []);
      } catch (error) {
        setData([]);
      }
    }

    fetchData()
  }, [])

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
    setSelectedId((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const isAllSelected = paginatedData.every((item) => selectedId.includes(item.id))
  return (
    <div className="p-4">
      {/* Main Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Promotion Allocation Search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setCurrentPage(1)
            }}
            className="w-[400px]"
          />

          <div className="flex gap-2">
            <Button onClick={() => setIsAddModalOpen(true)}>Add</Button>
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
                <DropdownMenuItem onClick={() => toggleColumn('storeName')}>
                  {visibleColumns.storeName ? '✓' : ''} Store Name
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
                  className="cursor-pointer select-none"
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  Assortment Name {sortAsc ? '↑' : '↓'}
                </TableHead>
              )}
              {visibleColumns.type && <TableHead>Assortment Type</TableHead>}
              {visibleColumns.storeName && <TableHead>Store Name</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedId.includes(item.id)}
                    onChange={() => toggleCheckbox(item.id)}
                  />
                </TableCell>
                {visibleColumns.name && <TableCell>{item.name}</TableCell>}
                {visibleColumns.type && <TableCell>{item.type}</TableCell>}
                {visibleColumns.storeName && <TableCell>{item.storeName}</TableCell>}
                <TableCell className="text-right">
                  <DropdownMenu
                    onOpenChange={(open) => setActiveDropdownRowId(open ? item.id : null)}
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
          <span className="mt-1 text-c-black">
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

        <DialogContent className="w-screen h-screen max-w-none rounded-none left-0 top-0 translate-x-0 translate-y-0 p-6 bg-gradient-to-br overflow-y-auto">
          <DialogHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Gift className="w-5 h-5 text-sky-600" />
              </div>
              <DialogTitle className="text-lg font-semibold" style={{color:'black'}}>
                Add Promotion Allocation Setup
              </DialogTitle>
            </div>
          </DialogHeader>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit((data) => console.log('Submitted Data:', data))}
              className="space-y-6 mt-4"
            >
              <div className="grid min-h-[70vh] grid-cols-1 rounded-lg p-4 shadow-sm border border-sky-100" style={{backgroundColor:'#fff'}}>
                <PromotionAllocationPage />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="back-red-600 text-c-white hover:text-c-white hover-back-red-100:hover h-10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* === Edit Modal === */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-screen h-screen max-w-none rounded-none left-0 top-0 translate-x-0 translate-y-0 p-6 bg-gradient-to-br overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Promotion Allocation</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid min-h-[70vh] grid-cols-1 rounded-lg p-4 shadow-sm border border-sky-100" style={{backgroundColor:'#fff'}}>
                <PromotionAllocationPage promotionID={selectedItem.id} mode="edit" />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsEditModalOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* === View Modal === */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-screen h-screen max-w-none rounded-none left-0 top-0 translate-x-0 translate-y-0 p-6 bg-gradient-to-br overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Promotion Allocation</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid min-h-[70vh] grid-cols-1 rounded-lg p-4 shadow-sm border border-sky-100" style={{backgroundColor:'#fff'}}>
                <PromotionAllocationPage promotionID={selectedItem.id} mode="view" />
              </div>
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

export default PromotionAllocationMainTable
