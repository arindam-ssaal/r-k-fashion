import { useAssortmentData } from '../../hooks_api/useAssortmentData'
import { useFetchAssortmentDataById } from '../../hooks_api/useAssortmentDataById'
import { useCreateAssortment } from '../../hooks_api/useCreateAssortment'
import { useAssortmentManagementDataStore } from '../../store/useAssortmentManagementDataStore'
import { useAssortmentManagementStore } from '../../store/useAssortmentManagementStore'
import AssortmentManagementModal from '../AssortmentManagmentModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { FetchedAssortmentType } from '@/types/assortment'

const COLUMNS: ColumnDef<FetchedAssortmentType>[] = [
  { field: 'assortmentID', header: 'ID', width: '80px', type: 'number' },
  { field: 'assortmentName', header: 'Assortment Name', type: 'link' },
  { field: 'assortmentType', header: 'Assortment Type', type: 'code', width: '150px' },
  { field: 'itemCode', header: 'Item Code', type: 'code' },
]

const ASSORTMENT_LABEL: Record<'D' | 'P' | 'S', string> = {
  D: 'Discount',
  P: 'Promotion',
  S: 'Sales Person',
}

function AssortmentManagementTable() {
  const type = useAssortmentManagementStore((state) => state.type)
  const setMode = useAssortmentManagementStore((state) => state.setMode)
  const { assortmentData, isLoading } = useAssortmentData(type)
  const { fetchAssortmentDataById } = useFetchAssortmentDataById(type)
  const { createAssortment } = useCreateAssortment()
  const modalHandler = useAssortmentManagementStore((state) => state.toggleOpen)
  const setCurrentAssortmentId = useAssortmentManagementDataStore((state) => state.setCurrentAssortmentId)
  const clearCurrentAssortmentId = useAssortmentManagementDataStore((state) => state.clearCurrentAssortmentId)
  const isDeleting = useAssortmentManagementStore((state) => state.isLoading)

  const data = assortmentData ?? []

  const stats = [
    { label: 'Total', value: data.length, icon: '📦', iconClass: 'blue' as const, filterKey: 'all' },
  ]

  const filterChips = [{ key: 'all', label: 'All', chipClass: 'lp-chip-blue' }]

  function handleView(row: FetchedAssortmentType) {
    setMode('View')
    setCurrentAssortmentId(row.assortmentID)
    modalHandler()
  }

  function handleEdit(row: FetchedAssortmentType) {
    setMode('Edit')
    setCurrentAssortmentId(row.assortmentID)
    modalHandler()
  }

  async function handleDelete(row: FetchedAssortmentType) {
    setMode('Delete')
    const fetched = await fetchAssortmentDataById(row.assortmentID)
    const payload = {
      ...fetched,
      assortmentType: type,
      typeOfAssortment: (fetched as FetchedAssortmentType & { typeOfAssortment?: 'P' | 'B' | 'C' }).typeOfAssortment,
      isActive: (fetched as FetchedAssortmentType & { isActive?: string }).isActive ?? 'Y',
      usedFor: 'D',
    } as unknown as Parameters<typeof createAssortment>[0]
    await createAssortment(payload)
  }

  function handleCreate() {
    setMode('Create')
    clearCurrentAssortmentId()
    modalHandler()
  }

  return (
    <div className="w-full">
      <ListingPage<FetchedAssortmentType>
        title={`${ASSORTMENT_LABEL[type]} Assortment`}
        subtitle="Manage assortments · SAP Business One integrated"
        titleIcon="📦"
        rowData={data}
        columns={COLUMNS}
        rowKey="assortmentID"
        loading={isLoading || isDeleting}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by assortment name, type, item code..."
        searchFields={['assortmentName', 'assortmentType', 'itemCode']}
        defaultSortCol="assortmentID"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New Assortment', onClick: handleCreate }}
      />
      <AssortmentManagementModal type={type} />
    </div>
  )
}

export default AssortmentManagementTable
