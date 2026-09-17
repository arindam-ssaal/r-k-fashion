import { useItemData } from "../../hooks_api/useItemData"
import { useItemMaster } from "../../store/useItemMaster"
import { useItemMasterDataStore } from "../../store/useItemMasterDataStore"
import ItemMasterModal from "../ItemMasterModal"

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { FetchedItemMaster } from '@/types/item'

const COLUMNS: ColumnDef<FetchedItemMaster>[] = [
  { field: 'itemCode', header: 'Item Code', type: 'code', width: '130px' },
  { field: 'itemName', header: 'Item Name', type: 'link' },
  { field: 'barCode', header: 'Bar Code', type: 'code' },
  { field: 'hsnsacCode', header: 'HSN/SAC Code', type: 'code' },
  { field: 'mrp', header: 'MRP', type: 'currency', width: '110px' },
  { field: 'retailPrice', header: 'Retail Price', type: 'currency', width: '120px' },
  {
    field: 'isActive',
    header: 'Status',
    type: 'badge',
    width: '100px',
    badgeMap: {
      Y: { variant: 'success', label: 'Active', dot: true },
      N: { variant: 'warning', label: 'Inactive', dot: true },
    },
  },
]

export function ItemMasterTable() {
  const { itemmasterData, isLoading } = useItemData()
  const openModal = useItemMaster((state) => state.toggleOpen)
  const setMode = useItemMaster((state) => state.setMode)
  const clearId = useItemMasterDataStore((state) => state.clearCurrentItemMasterId)
  const setItemId = useItemMasterDataStore((state) => state.setCurrentItemMasterId)

  const data = itemmasterData ?? []

  const stats = [
    { label: 'Total', value: data.length, icon: '📦', iconClass: 'blue' as const, filterKey: 'all' },
    { label: 'Active', value: data.filter((p) => p.isActive === 'Y').length, icon: '✅', iconClass: 'green' as const, filterKey: 'active' },
    { label: 'Inactive', value: data.filter((p) => p.isActive === 'N').length, icon: '⏸️', iconClass: 'amber' as const, filterKey: 'inactive' },
  ]

  const filterChips = [
    { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
    { key: 'active', label: 'Active', chipClass: 'lp-chip-green', filterFn: (r: Record<string, unknown>) => (r as FetchedItemMaster).isActive === 'Y' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber', filterFn: (r: Record<string, unknown>) => (r as FetchedItemMaster).isActive === 'N' },
  ]

  function handleView(row: FetchedItemMaster) {
    setMode('View')
    setItemId(row.itemCode)
    openModal()
  }

  function handleEdit(row: FetchedItemMaster) {
    setMode('Edit')
    setItemId(row.itemCode)
    openModal()
  }

  function handleCreate() {
    setMode('Create')
    clearId()
    openModal()
  }

  return (
    <>
      <ListingPage<FetchedItemMaster>
        title="Item Master"
        subtitle="Manage items · SAP Business One integrated"
        titleIcon="📦"
        rowData={data}
        columns={COLUMNS}
        rowKey="itemCode"
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by name, code, barcode…"
        searchFields={['itemName', 'itemCode', 'barCode', 'hsnsacCode']}
        defaultSortCol="itemCode"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        // primaryAction={{ label: '+ New Item', onClick: handleCreate }}
      />
      {/* <ItemMasterModal /> */}
    </>
  )
}
