import ApiClient from './ApiClient'

import { PettyCashPostType } from '@/app/pages/Root/Administration/Master/PettyCashHead/hooks_api/useCreatePettyCash'
import { FetchedPettyCashType, PettyCashResponseType } from '@/types/pettyCash'

class PettyCashClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getPettyCash({ signal }: { signal: AbortSignal }) {
    const response = await this.get<FetchedPettyCashType[]>(
      `PettyCash/GetAllPettyCash`,
      {},
      {
        signal,
      }
    )
    return response.data
  }

   async getPettyCashById({ id = 0 }: { id: number | null }) {
      const response = await this.get<FetchedPettyCashType>(`PettyCash/GetPettyCash`, {
        PettycashID: id,
      })
      return response.data
    }

  async createPettyCash(pettyCashData: PettyCashPostType) {
      try {
        const response = await this.post<PettyCashResponseType>(
          `PettyCashRep/PostPettyCash`,
          pettyCashData
        )
  
        // ✅ Status check for non-200 responses
        if (response.data[0].returnCode !== 'Y') {
          throw new Error(response.data[0].returnMsg)
        }
  
        return response.data
      } catch (error:unknown) {
        if(error instanceof Error){
          throw new Error(error.message);
        }
        throw new Error("An unknown error occurred.")
      }
    }
}

export default new PettyCashClient()
