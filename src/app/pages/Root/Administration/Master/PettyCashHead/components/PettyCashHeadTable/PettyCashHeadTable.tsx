import { useCreatePettyCash, PettyCashPostType } from '../../hooks_api/useCreatePettyCash'
import { useFetchPettyCashById } from '../../hooks_api/usePettyCashById'
import { usePettyCashData } from '../../hooks_api/usePettyCashData'
import { usePettyCashDataStore } from '../../store/usePettyCashDataStore'
import usePettyCashHead from '../../store/usePettyCashHead'
import PettyCashHeadModal from '../PettyCashHeadModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { FetchedPettyCashType } from '@/types/pettyCash'

const COLUMNS: ColumnDef<FetchedPettyCashType>[] = [
  { field: 'pettyCashID', header: 'ID', width: '80px' },
  { field: 'pettyCashName', header: 'Petty Cash Name', type: 'link' },
  { field: 'pettyCashCode', header: 'Code', type: 'code' },
  { field: 'modeOfOperation', header: 'Mode of Operation' },
  { field: 'limit', header: 'Limit', type: 'number', width: '120px' },
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

export default function PettyCashHeadTable() {
  const { pettyCashData, isLoading } = usePettyCashData()
  const openModal = usePettyCashHead((state) => state.toggleOpen)
  const setMode = usePettyCashHead((state) => state.setMode)
  const clearId = usePettyCashDataStore((state) => state.clearCurrentPettyCashId)
  const setPettyCashId = usePettyCashDataStore((state) => state.setCurrentPettyCashId)
  const { fetchPettyCashById } = useFetchPettyCashById()
  const { createPettyCash } = useCreatePettyCash()

  const data = pettyCashData ?? []

  const stats = [
    { label: 'Total', value: data.length, icon: '💵', iconClass: 'blue' as const, filterKey: 'all' },
    { label: 'Active', value: data.filter((p) => p.isActive === 'Y').length, icon: '✅', iconClass: 'green' as const, filterKey: 'active' },
    { label: 'Inactive', value: data.filter((p) => p.isActive === 'N').length, icon: '⏸️', iconClass: 'amber' as const, filterKey: 'inactive' },
  ]

  const filterChips = [
    { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
    { key: 'active', label: 'Active', chipClass: 'lp-chip-green', filterFn: (r: Record<string, unknown>) => (r as FetchedPettyCashType).isActive === 'Y' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber', filterFn: (r: Record<string, unknown>) => (r as FetchedPettyCashType).isActive === 'N' },
  ]

  function handleView(row: FetchedPettyCashType) {
    setMode('View')
    setPettyCashId(Number(row.pettyCashID))
    openModal()
  }

  function handleEdit(row: FetchedPettyCashType) {
    setMode('Edit')
    setPettyCashId(Number(row.pettyCashID))
    openModal()
  }

  async function handleDelete(row: FetchedPettyCashType) {
    setMode('Delete')
    const fetched = await fetchPettyCashById(Number(row.pettyCashID))
    await createPettyCash({ ...fetched, usedFor: 'D' } as unknown as PettyCashPostType)
  }

  function handleCreate() {
    setMode('Create')
    clearId()
    openModal()
  }

  return (
    <>
      <ListingPage<FetchedPettyCashType>
        title="Petty Cash Head"
        subtitle="Manage petty cash heads · SAP Business One integrated"
        titleIcon="💵"
        rowData={data}
        columns={COLUMNS}
        rowKey="pettyCashID"
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by name, code…"
        searchFields={['pettyCashName', 'pettyCashCode', 'modeOfOperation']}
        defaultSortCol="pettyCashID"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New Petty Cash Head', onClick: handleCreate }}
      />
      <PettyCashHeadModal />
    </>
  )
}
