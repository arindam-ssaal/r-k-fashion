import { useCreatePaymode } from '../../hooks_api/useCreatePaymode'
import { usePaymodeMasterData } from '../../hooks_api/usePaymodeMasterData'
import { useFetchPaymodeById } from '../../hooks_api/usePaymodeMasterDataById'
import { usePaymodeMasterDataStore } from '../../store/usePaymentMethodStore'
import { usePaymodeMaster } from '../../store/usePaymodeMaster'
import PaymodeModal from '../PaymodeModal/PaymodeModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { PaymodeFetchedType } from '@/types/paymode'

export type PaymodeTableType = {
  paymentModeID: number | string
  shortCode: string
  isActive: 'Y' | 'N'
  availablePaymentmethod: string
}

const COLUMNS: ColumnDef<PaymodeFetchedType>[] = [
  { field: 'paymentModeID', header: 'ID', width: '80px' },
  { field: 'paymentModeName', header: 'Payment Mode Name', type: 'link' },
  { field: 'shortCode', header: 'Short Code', type: 'code' },
  { field: 'displayOrder', header: 'Display Order', type: 'number', width: '130px' },
  { field: 'availablePaymentmethod', header: 'Available Method' },
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

function PaymodeTable() {
  const { paymodeMasterData, isLoading } = usePaymodeMasterData()
  const openModal = usePaymodeMaster((state) => state.toggleOpen)
  const setMode = usePaymodeMaster((state) => state.setMode)
  const clearID = usePaymodeMasterDataStore((state) => state.clearCurrentPaymodeMasterId)
  const setPaymodeId = usePaymodeMasterDataStore((state) => state.setCurrentPaymodeMasterId)
  const { fetchPaymodeById } = useFetchPaymodeById()
  const { createPaymodeAsync } = useCreatePaymode()

  const data = paymodeMasterData ?? []

  const stats = [
    { label: 'Total', value: data.length, icon: '💳', iconClass: 'blue' as const, filterKey: 'all' },
    { label: 'Active', value: data.filter((p) => p.isActive === 'Y').length, icon: '✅', iconClass: 'green' as const, filterKey: 'active' },
    { label: 'Inactive', value: data.filter((p) => p.isActive === 'N').length, icon: '⏸️', iconClass: 'amber' as const, filterKey: 'inactive' },
  ]

  const filterChips = [
    { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
    { key: 'active', label: 'Active', chipClass: 'lp-chip-green', filterFn: (r: Record<string, unknown>) => (r as PaymodeFetchedType).isActive === 'Y' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber', filterFn: (r: Record<string, unknown>) => (r as PaymodeFetchedType).isActive === 'N' },
  ]

  function handleView(row: PaymodeFetchedType) {
    setMode('View')
    setPaymodeId(Number(row.paymentModeID))
    openModal()
  }

  function handleEdit(row: PaymodeFetchedType) {
    setMode('Edit')
    setPaymodeId(Number(row.paymentModeID))
    openModal()
  }

  async function handleDelete(row: PaymodeFetchedType) {
    setMode('Delete')
    const fetched = await fetchPaymodeById(Number(row.paymentModeID))
    await createPaymodeAsync({ ...fetched, usedFor: 'D' })
  }

  function handleCreate() {
    setMode('Create')
    clearID()
    openModal()
  }

  return (
    <>
      <ListingPage<PaymodeFetchedType>
        title="Pay Mode Master"
        subtitle="Manage payment modes · SAP Business One integrated"
        titleIcon="💳"
        rowData={data}
        columns={COLUMNS}
        rowKey="paymentModeID"
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by name, short code…"
        searchFields={['paymentModeName', 'shortCode', 'availablePaymentmethod']}
        defaultSortCol="displayOrder"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New Pay Mode', onClick: handleCreate }}
      />
      <PaymodeModal />
    </>
  )
}

export default PaymodeTable
