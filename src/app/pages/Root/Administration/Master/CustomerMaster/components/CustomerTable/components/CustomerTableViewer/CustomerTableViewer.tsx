
interface CustomerTableDetail {
    mobileNo: string
    firstName: string
    middleName: string
    lastName: string
    gender: string
    dateOfBirth: Date
    anniversaryDate: Date
    profession: string
    spouseName: string
    isEmployee: boolean
    panNo: string
    gstNo: string
    gstDate: Date
    address?: string | undefined
    area?: string | undefined
    city?: string | undefined
    pin?: string | undefined
    state?: string | undefined
    email?: string | undefined
    whatsappNo?: string | undefined
    alternatePhoneNo?: string | undefined
    receivePushMessage?: boolean | undefined
    preferredCommunication?: string | undefined
    customerCategory?: string | undefined
    membershipCategory?: string | undefined
    membershipNo?: string | undefined
    validTill?: Date | undefined
  }
// Customer Table Data Structure
  export type CustomerTableData = {
    mobileNo: string
    firstName: string
    middleName: string
    lastName: string
    gender: string
    dateOfBirth: Date
    anniversaryDate: Date
    profession: string
    spouseName: string
    isEmployee: boolean
    panNo: string
    gstNo: string
    gstDate: Date
    address?: string | undefined
    area?: string | undefined
    city?: string | undefined
    pin?: string | undefined
    state?: string | undefined
    email?: string | undefined
    whatsappNo?: string | undefined
    alternatePhoneNo?: string | undefined
    receivePushMessage?: boolean | undefined
    preferredCommunication?: string | undefined
    customerCategory?: string | undefined
    membershipCategory?: string | undefined
    membershipNo?: string | undefined
    validTill?: Date | undefined
    objDetails: CustomerTableDetail[]
  }
interface CustomerTableViewerProps {
    data : CustomerTableData
}
function CustomerTableViewer({data}: CustomerTableViewerProps) {
    const details = data?.objDetails || []
    return (
       
           <div className="customer_table_viewer space-y-6 pb-6">
      {/* Customer Basic Details */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-semibold">First Name</h3>
            <h6 className="text-sm">{data.firstName}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Middle Name</h3>
            <h6 className="text-sm">{data.middleName || 'N/A'}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Last Name</h3>
            <h6 className="text-sm">{data.lastName}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Mobile No</h3>
            <h6 className="text-sm">{data.mobileNo}</h6>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-semibold">Email</h3>
            <h6 className="text-sm">{data.email || 'N/A'}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Gender</h3>
            <h6 className="text-sm">{data.gender}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Date of Birth</h3>
            <h6 className="text-sm">
              {data.dateOfBirth
                ? new Date(data.dateOfBirth).toLocaleDateString()
                : 'N/A'}
            </h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Profession</h3>
            <h6 className="text-sm">{data.profession}</h6>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-5">
        <h3 className="font-semibold">Address</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <h3 className="font-semibold">City</h3>
            <h6 className="text-sm">{data.city || 'N/A'}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">State</h3>
            <h6 className="text-sm">{data.state || 'N/A'}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Pin</h3>
            <h6 className="text-sm">{data.pin || 'N/A'}</h6>
          </div>
        </div>
      </div>

      {/* Membership Details */}
      <div className="space-y-5">
        <h3 className="font-semibold">Membership Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <h3 className="font-semibold">Membership No</h3>
            <h6 className="text-sm">{data.membershipNo || 'N/A'}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Membership Category</h3>
            <h6 className="text-sm">{data.membershipCategory || 'N/A'}</h6>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Valid Till</h3>
            <h6 className="text-sm">
              {data.validTill
                ? new Date(data.validTill).toLocaleDateString()
                : 'N/A'}
            </h6>
          </div>
        </div>
      </div>

      {/* Customer Table Details */}
      {data.objDetails && data.objDetails.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold">Customer Details</h3>
          <div className="space-y-4">
            {details.map((detail, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded space-y-2"
              >
                <h3 className="font-semibold">Detail {index + 1}</h3>
                <h6 className="text-sm">Some detail info...</h6>
              </div>
            ))}
          </div>
        </div>
      )}
         </div>
    )
}
export default CustomerTableViewer;