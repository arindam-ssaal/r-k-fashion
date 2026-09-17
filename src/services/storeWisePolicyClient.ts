import ApiClient from './ApiClient'

import { StoreWisePolicyPostType } from '@/app/pages/Root/Administration/setup/policy/StoreSpecificPolicy/helper/StoreWisePolicyFormatter'
import { FetchedStoreWisePolicyType, StoreWisePolicyResponseType } from '@/types/storeWisePolicy'


class StoreWisePolicyClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getStoreWisePolicy({
    storeSpecificId = 0,
    storeId = 0,
    signal,
  }: {
    storeSpecificId: number
    storeId: number
    signal?: AbortSignal
  }) {
    const response = await this.get<FetchedStoreWisePolicyType>(
      `storespecificpolicy/Getstorespecificpolicy`,
      {
        StoreSpecificPolicyID: storeSpecificId,
        storeId: storeId,
      },
      {
        signal,
      }
    )
    return response.data
  }

  async createStoreWisePolicy(storeWisePolicyData: StoreWisePolicyPostType) {
    try {
      const response = await this.post<StoreWisePolicyResponseType>(
        `storespecificPolicyRep/PostStoreSpecificPolicy`,
        storeWisePolicyData
      )
      const responseData = response.data as { returnCode: string; returnMsg: string }[]
      if (responseData[0].returnCode !== 'Y') {
        throw new Error(responseData[0].returnMsg)
      }
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }
}
export default new StoreWisePolicyClient()
