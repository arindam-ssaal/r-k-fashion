import { useCreateDiscountMaster } from '../../hooks_api/useCreateDiscountMasterData'
import { useDiscountMasterData } from '../../hooks_api/useDiscountMasterData'
import { useFetchDiscountMasterById } from '../../hooks_api/useDiscountMasterDataById'
import { useDiscountMasterStore } from '../../store/useDiscountMasterStore'
import { useDiscountnMasterDataStore } from '../../store/useDiscountMasterStoreData'
import DiscountMasterModal from '../DiscountMasterModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { FetchedDiscountType } from '@/types/discountSetup'

const COLUMNS: ColumnDef<FetchedDiscountType>[] = [
  { field: 'discountID', header: 'ID', width: '80px', type: 'number' },
  { field: 'discountName', header: 'Discount Name', type: 'link' },
  { field: 'discountBase', header: 'Discount Base', type: 'code' },
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

function DiscountMasterTable() {
  const { DiscountMasterData, isLoading, error } = useDiscountMasterData()
  const { createDiscountMaster } = useCreateDiscountMaster()
  const { fetchDiscountMasterById } = useFetchDiscountMasterById()
  const isDeleting = useDiscountMasterStore((state) => state.isLoading)
  const modalToggler = useDiscountMasterStore((state) => state.toggleOpen)
  const setModalMode = useDiscountMasterStore((state) => state.setMode)
  const setCurrentDiscountId = useDiscountnMasterDataStore((state) => state.setCurrentDiscountnMasterId)
  const clearCurrentDiscountId = useDiscountnMasterDataStore((state) => state.clearCurrentDiscountnMasterId)

  const data = (Array.isArray(DiscountMasterData)
    ? DiscountMasterData
    : DiscountMasterData
      ? [DiscountMasterData]
      : []) as FetchedDiscountType[]

  const stats = [
    { label: 'Total', value: data.length, icon: '🏷️', iconClass: 'blue' as const, filterKey: 'all' },
    {
      label: 'Active',
      value: data.filter((d) => d.isActive === 'Y').length,
      icon: '✅',
      iconClass: 'green' as const,
      filterKey: 'active',
    },
    {
      label: 'Inactive',
      value: data.filter((d) => d.isActive === 'N').length,
      icon: '⏸️',
      iconClass: 'amber' as const,
      filterKey: 'inactive',
    },
  ]

  const filterChips = [
    { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
    {
      key: 'active',
      label: 'Active',
      chipClass: 'lp-chip-green',
      filterFn: (r: Record<string, unknown>) => (r as FetchedDiscountType).isActive === 'Y',
    },
    {
      key: 'inactive',
      label: 'Inactive',
      chipClass: 'lp-chip-amber',
      filterFn: (r: Record<string, unknown>) => (r as FetchedDiscountType).isActive === 'N',
    },
  ]

  function handleCreate() {
    modalToggler()
    setModalMode('Create')
    clearCurrentDiscountId()
  }

  function handleView(row: FetchedDiscountType) {
    setCurrentDiscountId(row.discountID)
    setModalMode('View')
    modalToggler()
  }

  function handleEdit(row: FetchedDiscountType) {
    setCurrentDiscountId(row.discountID)
    setModalMode('Edit')
    modalToggler()
  }

  async function handleDelete(row: FetchedDiscountType) {
    setModalMode('Delete')
    const fetched = await fetchDiscountMasterById(row.discountID)
    const payload = {
      ...fetched,
      usedFor: 'D',
      discountAssortments: fetched.discountAssortments ?? [],
    } as unknown as Parameters<typeof createDiscountMaster>[0]
    await createDiscountMaster(payload)
  }

  if (error) {
    return <h3 className="text-center">{error}</h3>
  }

  return (
    <>
      <div className="w-full">
        <ListingPage<FetchedDiscountType>
          title="Discount Master"
          subtitle="Manage discount setup · SAP Business One integrated"
          titleIcon="🏷️"
          rowData={data}
          columns={COLUMNS}
          rowKey="discountID"
          loading={isLoading || isDeleting}
          stats={stats}
          filterChips={filterChips}
          defaultFilter="all"
          searchPlaceholder="Search by discount name, base..."
          searchFields={['discountName', 'discountBase']}
          defaultSortCol="discountID"
          pageSize={8}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          primaryAction={{ label: '+ New Discount', onClick: handleCreate }}
        />
      </div>
      <DiscountMasterModal />
    </>
  )
}

export default DiscountMasterTable
