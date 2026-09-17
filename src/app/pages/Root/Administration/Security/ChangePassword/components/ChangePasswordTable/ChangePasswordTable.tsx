import { data } from '../../data/data'
import { useChangePasswordStore } from '../../store/useChangePasswordStore'
import ChangePasswordModal from '../ChangePasswordModal/ChangePasswordModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'

const COLUMNS: ColumnDef[] = [
  { field: 'userId', header: 'User ID', width: '110px', type: 'code' },
  { field: 'userName', header: 'User Name', type: 'link' },
  { field: 'modifiedOn', header: 'Modified On', width: '180px' },
]

function ChangePasswordTable() {
  const openModal = useChangePasswordStore((state) => state.toggleOpen)
  const setMode = useChangePasswordStore((state) => state.setMode)

  const stats = [
    { label: 'Total Users', value: data.length, icon: '👤', iconClass: 'blue' as const, filterKey: 'all' },
  ]

  const filterChips = [{ key: 'all', label: 'All', chipClass: 'lp-chip-blue' }]

  function handleCreate() {
    setMode('Create')
    openModal()
  }

  function handleView() {
    setMode('View')
    openModal()
  }

  function handleEdit() {
    setMode('Edit')
    openModal()
  }

  return (
    <>
      <ListingPage
        title="Change Password"
        subtitle="Manage user password updates"
        titleIcon="🔐"
        rowData={data}
        columns={COLUMNS}
        rowKey="userId"
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by user ID or name..."
        searchFields={['userId', 'userName']}
        defaultSortCol="userName"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        primaryAction={{ label: '+ Change Password', onClick: handleCreate }}
      />
      <ChangePasswordModal />
    </>
  )
}

export default ChangePasswordTable