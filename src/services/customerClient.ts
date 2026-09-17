import ApiClient from './ApiClient'

import { CustomerPostType } from '@/app/pages/Root/Administration/Master/CustomerMaster/hooks_api/useCreateCustomer'
import { CustomerFetchedType, CustomerMasterResponseType } from '@/types/customer'

class CustomerClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getCustomers({ id = 0, signal }: { id: number; signal?: AbortSignal }) {
    const response = await this.get<CustomerFetchedType[]>(
      `Customer/GetCustomerDetails`,
      {
        CustomerID: id,
      },
      {
        signal,
      }
    )
    return response.data
  }

  async createCustomer(customerData: CustomerPostType) {
    try {
      const response = await this.post<CustomerMasterResponseType>(
        `CustomerRep/PostCustomer`,
        customerData
      )

      // ✅ Status check for non-200 responses
      if (response.data[0].returnCode !== 'Y') {
        throw new Error(response.data[0].returnMsg)
      }

      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred.");
    }
  }
}

export default new CustomerClient()
