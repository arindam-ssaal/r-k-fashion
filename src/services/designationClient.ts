import ApiClient from './ApiClient'

import { DesignationPostType } from '@/app/pages/Root/Administration/Security/Designation/hooks_api/useCreateDesignation';
import { FetchedDesignationType, DesginationResponseType } from '@/types/designation'

class DesignationClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getDesignation({ id = 0, signal }: { id: number; signal?: AbortSignal }) {
    const response = await this.get<FetchedDesignationType[]>(
      `Desig/GetDesignationDetails`,
      {
        DesignationID: id,
      },
      {
        signal,
      }
    )
    return response.data
  }


  async createDesignation(DesignationData:DesignationPostType) {
    try {
      const response = await this.post<DesginationResponseType>(
        `DesigRep/PostDesignation`,
        DesignationData
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

export default new DesignationClient()
