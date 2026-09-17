import { useCreateCustomer } from '../../hooks_api/useCreateCustomer'
import { useCustomerData, useFetchCustomerMasterById } from '../../hooks_api/useCustomerData'
import { useCustomerMaster } from '../../store/useCustomerMaster'
import { useCustomerMasterDataStore } from '../../store/useCustomerMasterDataStore'
import CustomerModal from '../CustomerModal'

import ListingPage, { ColumnDef } from '@/components/ListingTable/ListingPage'
import { CustomerFetchedType } from '@/types/customer'

const COLUMNS: ColumnDef<CustomerFetchedType>[] = [
  { field: 'customerID', header: 'ID', width: '80px' },
  {
    field: 'customerFirstName',
    header: 'Customer Name',
    type: 'link',
    render: (_value, row) =>
      [row.customerFirstName, row.customerMiddleName, row.customerLastName]
        .filter(Boolean)
        .join(' '),
  },
  { field: 'email', header: 'Email' },
  { field: 'mobile', header: 'Mobile', type: 'code' },
  { field: 'city', header: 'City' },
  { field: 'membershipNo', header: 'Membership No', type: 'code' },
  { field: 'customerCatName', header: 'Category' },
]

export default function CustomerTable() {
  const { customerData, isLoading } = useCustomerData(0)
  const openModal = useCustomerMaster((state) => state.toggleOpen)
  const setMode = useCustomerMaster((state) => state.setMode)
  const clearID = useCustomerMasterDataStore((state) => state.clearCurrentCustomerMasterId)
  const setCustomerId = useCustomerMasterDataStore((state) => state.setCurrentCustomerMasterId)
  const { fetchCustomerById } = useFetchCustomerMasterById()
  const { createCustomerAsync } = useCreateCustomer()

  const data = (customerData as CustomerFetchedType[] | undefined) ?? []

  const stats = [
    { label: 'Total', value: data.length, icon: '👥', iconClass: 'blue' as const, filterKey: 'all' },
  ]

  const filterChips = [
    { key: 'all', label: 'All', chipClass: 'lp-chip-blue' },
  ]

  function handleView(row: CustomerFetchedType) {
    setMode('View')
    setCustomerId(Number(row.customerID))
    openModal()
  }

  function handleEdit(row: CustomerFetchedType) {
    setMode('Edit')
    setCustomerId(Number(row.customerID))
    openModal()
  }

  async function handleDelete(row: CustomerFetchedType) {
    setMode('Delete')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status: _status, ...fetched } = await fetchCustomerById(Number(row.customerID))
    await createCustomerAsync({ ...fetched, usedFor: 'D' })
  }

  function handleCreate() {
    setMode('Create')
    clearID()
    openModal()
  }

  return (
    <>
      <ListingPage<CustomerFetchedType>
        title="Customer Master"
        subtitle="Manage customers · SAP Business One integrated"
        titleIcon="👥"
        rowData={data}
        columns={COLUMNS}
        rowKey="customerID"
        loading={isLoading}
        stats={stats}
        filterChips={filterChips}
        defaultFilter="all"
        searchPlaceholder="Search by name, email, mobile…"
        searchFields={['customerFirstName', 'customerLastName', 'email', 'mobile', 'membershipNo']}
        defaultSortCol="customerID"
        pageSize={8}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryAction={{ label: '+ New Customer', onClick: handleCreate }}
      />
      <CustomerModal />
    </>
  )
}
