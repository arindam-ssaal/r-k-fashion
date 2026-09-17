import { formatDate } from '@/lib/utils'

// Store Allocation Details
interface StoreDetail {
  salesPersonID: number
  storeID: number
  storeCode: string
  storeName: string
  startDate: string
  endDate: string
  isTransfered: 'Y' | 'N'
}

// Sales Person Data Structure
export interface SalesPersonDataType {
  salesPersonID: number
  firstName: string
  lastName: string
  mobileNo: string
  whatsAppNo: string
  email: string
  employeeID: string
  allocatedRole: string | number
  allocatedUser: string | number
  isActive: 'Y' | 'N'
  objDetails: StoreDetail[]
}

interface SalesPersonViewerProps {
  data: SalesPersonDataType
}

function SalesPersonViewer({ data }: SalesPersonViewerProps) {
  const details = data?.objDetails || []

  return (
    <div className="sales_person_viewer space-y-6 pb-6">
      {/* Personal Details */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-semibold">Full Name</h3>
            <h6 className="text-sm">
              {data?.firstName} {data?.lastName}
            </h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Mobile No.</h3>
            <h6 className="text-sm">{data?.mobileNo}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">WhatsApp No.</h3>
            <h6 className="text-sm">{data?.whatsAppNo}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Email</h3>
            <h6 className="text-sm">{data?.email}</h6>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-semibold">Employee ID</h3>
            <h6 className="text-sm">{data?.employeeID}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Allocated Role</h3>
            <h6 className="text-sm">{data?.allocatedRole}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Allocated User</h3>
            <h6 className="text-sm">{data?.allocatedUser}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Status</h3>
            <h6 className="text-sm">{data?.isActive === 'Y' ? 'Active' : 'Inactive'}</h6>
          </div>
        </div>
      </div>

      {/* Store Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Store Details</h3>
        <div className="grid grid-cols-2 gap-6">
          {details.map((item, index) => (
            <div key={index} className="border p-4 grid grid-cols-2 gap-3 rounded-md shadow-sm space-y-2 bg-gray-50">
              <div className='space-y-1'>
                <h4 className="font-semibold">Store Name</h4>
                <p className="text-sm">{item?.storeName}</p>
              </div>
              <div className='space-y-1'>
                <h4 className="font-semibold">Store Code</h4>
                <p className="text-sm">{item?.storeCode}</p>
              </div>
              <div className='space-y-1'>
                <h4 className="font-semibold">Start Date</h4>
                <p className="text-sm">{formatDate(item?.startDate).split('-').join(' ')}</p>
              </div>
              <div className='space-y-1'>
                <h4 className="font-semibold">End Date</h4>
                <p className="text-sm">{formatDate(item?.endDate).split('-').join(' ')}</p>
              </div>
              <div className='space-y-1'>
                <h4 className="font-semibold">Transferred</h4>
                <p className="text-sm">{item?.isTransfered === 'Y' ? 'Yes' : 'No'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SalesPersonViewer
