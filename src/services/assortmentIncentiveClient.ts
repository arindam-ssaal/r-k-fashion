import ApiClient from './ApiClient'


import { AssortmentIncetivePostType } from '@/app/pages/Root/Administration/setup/salesperson/IntcentiveAssortmentManagement/helper/assortmentDataFormatter'
import { FetchedAssortmentIncentiveType } from '@/types/assortmentIncentive'
import {
  AssortmentPromotionResponseType,
} from '@/types/assortmentPromotion'

class AssortmentIncentiveClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getAssortment({ signal }: { signal: AbortSignal }) {
    const response = await this.get<FetchedAssortmentIncentiveType[]>(
      `assortment/GetAllAssortment?AssortmentID=0&AssortmentType=I`,
      {},
      { signal }
    )
    return response.data
  }

  async getAssortmentById({ id = 0 }: { id: number | null }) {
    const response = await this.get<FetchedAssortmentIncentiveType>(`assortment/Getassortment`, {
      AssortmentID: id,
    })
    return response.data
  }

  async createAssortment(assortmentData: AssortmentIncetivePostType) {
    try {
      const response = await this.post<AssortmentPromotionResponseType>(
        `AssortmentRep/PostAssortment`,
        assortmentData
      )

      // ✅ Status check for non-200 responses
      if (response.data[0].returnCode !== 'Y') {
        throw new Error(response.data[0].returnMsg)
      }

      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred.')
    }
  }
}
export default new AssortmentIncentiveClient
