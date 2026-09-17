import { useCustomerMaster } from '../store/useCustomerMaster'

import { formatDate } from '@/lib/utils'

const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export type CustomerPost = {
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

export function customerDataFormatter(data: CustomerPost, id?: number | string | null) {
  const mode = useCustomerMaster.getState().mode as 'Create' | 'Edit' | 'Delete'
  const formattedData = {
    customerID: mode === 'Create' ? 0 : id, // Assuming new customer, can be dynamic
    customerFirstName: data.firstName || '',
    customerMiddleName: data.middleName || '',
    customerLastName: data.lastName || '',
    gender: data.gender === 'male' ? 'M' : 'F',
    mobile: data.mobileNo || '',
    dateOfBirth: data.dateOfBirth ? formatDate(data.dateOfBirth) : '',
    anniversary: data.anniversaryDate ? formatDate(data.anniversaryDate) : '',
    profession: data.profession || '',
    spouseName: data.spouseName || '',
    panNo: data.panNo || '',
    gstRegNo: data.gstNo || '',
    gstRegDate: data.gstDate ? formatDate(data.gstDate) : '',
    isEmployee: data.isEmployee ? 'Y' : 'N', // 'Y' or 'N' format
    employeeID: '', // Assuming no employee ID for now
    address: data.address || '',
    area: data.area || '',
    city: data.city || '',
    pinCode: data.pin || '',
    state: data.state || '',
    email: data.email || '',
    whatsAppNo: data.whatsappNo || '',
    alternatePhnNo: data.alternatePhoneNo || '',
    preferredComMode: data.preferredCommunication || 'sms',
    isPushMessage: data.receivePushMessage ? 'Y' : 'N',
    customerCatCode: '', // Assuming dynamic or fetched later
    customerCatName: data.customerCategory || '',
    membershipCategoryCode: '', // Assuming dynamic or fetched later
    membershipCategoryName: data.membershipCategory || '',
    membershipNo: data.membershipNo || '',
    validTill: data.validTill ? formatDate(data.validTill) : '',
    enteredBy: '0', // Assuming it will be filled by backend or logged-in user
    usedFor: operation[mode], // Optional or dynamic
  }

  return formattedData
}
