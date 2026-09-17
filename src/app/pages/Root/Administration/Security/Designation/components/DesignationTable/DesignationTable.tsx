import { useMemo } from 'react'

import { useCreateDesignation } from '../../hooks_api/useCreateDesignation'
import { useDesignationData, useFetchDesignationById } from '../../hooks_api/useDesignationData'
import { useDesignationMasterDataStore } from '../../store/useDesignationDataStore'
import { useDesignationStore } from '../../store/userDesignation'
import DesignationMasterModal from '../DesignationModal/DesignationModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { FetchedDesignationType } from '@/types/designation'

const COLUMNS: ColumnDef<FetchedDesignationType>[] = [
  { field: 'designationID', header: 'ID', width: '80px' },
  { field: 'designationName', header: 'Designation Name', type: 'link' },
  { field: 'remarks', header: 'Remarks' },
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

function DesignationTable() {
  const openModal = useDesignationStore((state) => state.toggleOpen)
  const setMode = useDesignationStore((state) => state.setMode)
  const globalLoading = useDesignationStore((state) => state.isLoading)

  const setDesignationId = useDesignationMasterDataStore((state) => state.setCurrentDesignationMasterId)
  const clearID = useDesignationMasterDataStore((state) => state.clearCurrentDesignationMasterId)

  const { DesignationData, isLoading, error } = useDesignationData(0)
  const { fetchDesignationById } = useFetchDesignationById()
  const { createDesignationAsync } = useCreateDesignation()

  const data = useMemo(() => DesignationData ?? [], [DesignationData])

  const stats = [
    { label: 'Total', value: data.length, icon: '🪪', iconClass: 'blue' as const, filterKey: 'all' },
    { label: 'Active', value: data.filter((d) => d.isActive === 'Y').length, icon: '✅', iconClass: 'green' as const, filterKey: 'active' },
    { label: 'Inactive', value: data.filter((d) => d.isActive === 'N').length, icon: '⏸️', iconClass: 'amber' as const, filterKey: 'inactive' },
  ]

  const filterChips = [
    { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
    { key: 'active', label: 'Active', chipClass: 'lp-chip-green', filterFn: (r: Record<string, unknown>) => (r as FetchedDesignationType).isActive === 'Y' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber', filterFn: (r: Record<string, unknown>) => (r as FetchedDesignationType).isActive === 'N' },
  ]

  function handleView(row: FetchedDesignationType) {
    setDesignationId(Number(row.designationID))
    setMode('View')
    openModal()
  }

  function handleEdit(row: FetchedDesignationType) {
    setDesignationId(Number(row.designationID))
    setMode('Edit')
    openModal()
  }

  async function handleDelete(row: FetchedDesignationType) {
    const data = await fetchDesignationById(Number(row.designationID))
    await createDesignationAsync({ ...data, usedFor: 'D' })
    setMode('Create')
  }

  function handleCreate() {
    setMode('Create')
    clearID()
    openModal()
  }

  if (error) return <div>{error}</div>

  return (
    <>
      <ListingPage<FetchedDesignationType>
        title="Designation Master"
        subtitle="Manage designations · SAP Business One integrated"
        titleIcon="🪪"
        rowData={data}
        columns={COLUMNS}
        rowKey="designationID"
        loading={isLoading || globalLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by designation name, remarks…"
        searchFields={['designationName', 'remarks']}
        defaultSortCol="designationID"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New Designation', onClick: handleCreate }}
      />
      <DesignationMasterModal />
    </>
  )
}

export default DesignationTable