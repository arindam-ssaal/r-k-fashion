
import { useUserMasterStore } from '../store/useUserMasterStore'

import { formatDate } from '@/lib/utils'

const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export type UserPost = {
  userName: string
  loginID: string
  password: string
  profileID: number
  roleID: number
  defaultStoreID: number
  employeeID: string
  email: string
  mobile: string
  whatsApp: string
  remarks: string
  isActive: boolean
  enteredBy?: number
  objStore: {
    storeID: number
    fromDate: Date
    toDate: Date
    isDiscontinued: boolean
  }[]
}

export function UserMasterFormatter(data: UserPost, id?: number | string | null) {
  const mode = useUserMasterStore.getState().mode as 'Create' | 'Edit' | 'Delete'
  const formattedData = {
    userID: mode === 'Create' ? 0 : id,
    userName: data.userName || '',
    loginID: data.loginID || '',
    password: data.password || '',
    profileID: data.profileID || 0,
    roleID: data.roleID || 0,
    defaultStoreID: data.defaultStoreID || 0,
    employeeID: data.employeeID || '',
    email: data.email || '',
    mobile: data.mobile || '',
    whatsApp: data.whatsApp || '',
    remarks: data.remarks || '',
    isActive: data.isActive ? 'Y' : 'N',
    enteredBy: data.enteredBy || 0,
    usedFor: operation[mode],
    objStore: data.objStore.map(store => ({
      userID: mode === 'Create' ? 0 : id,
      storeID: store.storeID,
      fromDate: formatDate(store.fromDate),
      toDate: formatDate(store.toDate),
      isDiscontinued: store.isDiscontinued ? 'Y' : 'N'
    }))
  }

  return formattedData
}
