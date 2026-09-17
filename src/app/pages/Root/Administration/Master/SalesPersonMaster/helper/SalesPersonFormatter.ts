import { z } from 'zod'

import { SalesPersonFormSchema } from '../schemas/SalesPersonForm.schema'
import useSalesPerson from '../store/useSalesPerson'

import { formatDate } from '@/lib/utils'

export type SalesPersonFormFormatterType = z.infer<typeof SalesPersonFormSchema>

const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export function salesPersonFormatter(
  data: SalesPersonFormFormatterType,
  id: number | string | null
) {
  const mode = useSalesPerson.getState().mode as 'Create' | 'Edit' | 'Delete'
  const formattedData = {
    salesPersonID: mode === 'Create' ? 0 : id, // Default value, change if needed
    firstName: data.salesPerson.firstName ?? '',
    lastName: data.salesPerson.lastName ?? '',
    mobileNo: data.salesPerson.mobileNo ?? '',
    whatsAppNo: data.salesPerson.whatsappNo ?? '',
    email: data.salesPerson.email ?? '',
    employeeID: data.salesPerson.employeeId ?? '',
    allocatedRole: Number(data.salesPerson.allocateRole) || 1,
    allocatedUser: Number(data.salesPerson.allocateUser) || 2,
    isActive: data.salesPerson.inactive ? 'Y' : 'N',
    enteredBy: '0', // Default value, change if needed
    usedFor: operation[mode], // Adjust this as required
    objDetails: data.storeAllocation.allocations.map((item, ind) => ({
      salesPersonID: mode === 'Create' ? 0 : id, // Assuming default, replace if available
      storeID: ind, // Assuming default, replace if available
      storeCode: item.storeCode ?? '',
      storeName: item.storeName ?? '',
      startDate: item.startDate ? formatDate(item.startDate) : '',
      endDate: item.endDate ? formatDate(item.endDate) : '',
      isTransfered: item.transferred ? 'Y' : 'N',
    })),
  }
  return formattedData
}
