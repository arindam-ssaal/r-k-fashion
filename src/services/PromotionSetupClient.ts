import ApiClient from './ApiClient'


import { PromotionPostType } from '@/app/pages/Root/Administration/setup/promotion/PromotionSetup/helpers/promotionDataFormatter';
import { FetchedPromotionType,PromotionResponseType } from '@/types/Promotion';

class PromotionSetupClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getPromotion({ id = 0, signal }: { id: number; signal?: AbortSignal }) {
    const response = await this.get<FetchedPromotionType[]>(
      `Promotion/GetAllPromotion`,
      {
        PromotionID: id,
        promotionType: 'F'
      },
      {
        signal,
      }
    )
    return response.data
  }
  async getPromotionByID({ id = 0, signal }: { id: number; signal?: AbortSignal }) {
    const response = await this.get<FetchedPromotionType>(
      `Promotion/GetPromotion`,
      {
        PromotionID: id,
      },
      {
        signal,
      }
    )
    return response.data
  }


  async createPromotion(Promotiondata:PromotionPostType) {
    try {
      const response = await this.post<PromotionResponseType>(
        `PromotionRep/PostPromotion`,
        Promotiondata
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

export default new PromotionSetupClient()
