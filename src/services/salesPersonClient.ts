import ApiClient from './ApiClient'

import { SalesPersonPostType } from '@/app/pages/Root/Administration/Master/SalesPersonMaster/hooks_api/useCreateSalesPerson'
import { FetchedSalesPersonType, SalesPersonResponseType } from '@/types/salesPerson'

class SalesPersonClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getSalesPerson({ signal }: { signal: AbortSignal }) {
    const response = await this.get<FetchedSalesPersonType[]>(
      `SalePerson/GetAllSalesPerson`,
      {},
      { signal }
    )
    return response.data
  }

  async getSalesPersonById({ id = 0 }: { id: number | null }) {
    const response = await this.get<FetchedSalesPersonType>(`SalePerson/GetSalesPerson`, {
      SalesPersonID: id,
    })
    return response.data
  }

  async createSalesPerson(salesPersonData: SalesPersonPostType) {
    try {
      const response = await this.post<SalesPersonResponseType>(
        `SalePersonRep/PostSalePerson`,
        salesPersonData
      )

      // ✅ Status check for non-200 responses
      if (response.data[0].returnCode !== 'Y') {
        throw new Error(response.data[0].returnMsg)
      }

      return response.data
    } catch (error: unknown) {
      if(error instanceof Error){

        throw new Error(error.message)
      }
      throw new Error("An Error Occured")
    }
  }
}

export default new SalesPersonClient()
