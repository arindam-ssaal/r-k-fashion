import { useCreateUsermasterGeneral } from '../../hooks_api/useCreateUsermasterGeneral'
import { useFetchUserMasterById, useUserMasterData } from '../../hooks_api/useUserMasterData'
import { useUserMasterDataStore } from '../../store/useUserMasterDataStore'
import { useUserMasterStore } from '../../store/useUserMasterStore'
import UserMasterModal from '../UserMasterModal/UserMasterModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { FetchedUserDetail } from '@/types/userMaster'

const COLUMNS: ColumnDef<FetchedUserDetail>[] = [
  { field: 'userID', header: 'ID', width: '80px' },
  { field: 'userName', header: 'User Name', type: 'link' },
  { field: 'email', header: 'Email' },
  { field: 'mobile', header: 'Mobile', width: '130px' },
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

function UserMasterTable() {
  const openModal = useUserMasterStore((state) => state.toggleOpen)
  const setMode = useUserMasterStore((state) => state.setMode)
  const globalLoading = useUserMasterStore((state) => state.isLoading)
  const setUserId = useUserMasterDataStore((state) => state.setCurrentUserMasterId)
  const clearID = useUserMasterDataStore((state) => state.clearCurrentUserMasterId)

  const { userMasterData, isLoading, error } = useUserMasterData(0)
  const { fetchUserMasterById } = useFetchUserMasterById()
  const { createUsermasterGeneral } = useCreateUsermasterGeneral()

  const data = userMasterData ?? []

  const stats = [
    { label: 'Total', value: data.length, icon: '👤', iconClass: 'blue' as const, filterKey: 'all' },
    { label: 'Active', value: data.filter((u) => u.isActive === 'Y').length, icon: '✅', iconClass: 'green' as const, filterKey: 'active' },
    { label: 'Inactive', value: data.filter((u) => u.isActive === 'N').length, icon: '⏸️', iconClass: 'amber' as const, filterKey: 'inactive' },
  ]

  const filterChips = [
    { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
    { key: 'active', label: 'Active', chipClass: 'lp-chip-green', filterFn: (r: Record<string, unknown>) => (r as unknown as FetchedUserDetail).isActive === 'Y' },
    { key: 'inactive', label: 'Inactive', chipClass: 'lp-chip-amber', filterFn: (r: Record<string, unknown>) => (r as unknown as FetchedUserDetail).isActive === 'N' },
  ]

  function handleView(row: FetchedUserDetail) {
    setUserId(Number(row.userID))
    setMode('View')
    openModal()
  }

  function handleEdit(row: FetchedUserDetail) {
    setUserId(Number(row.userID))
    setMode('Edit')
    openModal()
  }

  async function handleDelete(row: FetchedUserDetail) {
    setMode('Delete')
    const fetched = await fetchUserMasterById(Number(row.userID))
    await createUsermasterGeneral({ ...fetched, usedFor: 'D' })
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
      <ListingPage<FetchedUserDetail>
        title="User Master"
        subtitle="Manage users and access setup"
        titleIcon="👤"
        rowData={data}
        columns={COLUMNS}
        rowKey="userID"
        loading={isLoading || globalLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by user name, email, mobile..."
        searchFields={['userName', 'email', 'mobile']}
        defaultSortCol="userName"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New User', onClick: handleCreate }}
      />
      <UserMasterModal />
    </>
  )
}

export default UserMasterTable