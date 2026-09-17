import ApiClient from './ApiClient'

import { AssortmentPostType } from '@/components/AssortmentManagement/helper/assortmentPostFormatter';
import { FetchedAssortmentType, AssortmentResponseType } from '@/types/assortment'

class DiscountAssortmentClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getAssortment({ signal, type = 'D' }: { signal: AbortSignal; type: 'D' | 'P' | 'S' }) {
    const response = await this.get<FetchedAssortmentType[]>(
      `assortment/GetAllAssortment`,
      { AssortmentType: type, AssortmentID: 0 },
      { signal }
    )
    return response.data
  }

  async getAssortmentById({ id = 0 }: { id: number | null }) {
    const response = await this.get<FetchedAssortmentType>(`assortment/Getassortment`, {
      AssortmentID: id,
    })
    return response.data
  }

  async createAssortment(assortmentData: AssortmentPostType) {
    try {
      const response = await this.post<AssortmentResponseType>(
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

export default new DiscountAssortmentClient()
