import ApiClient from './ApiClient'

import { StoreMasterPostType } from '@/app/pages/Root/Administration/Master/StoreMaster/hooks_api/useCreateStoreMaster'
import { FetchedStoreMasterType, StoreMasterResponseType } from '@/types/storeMaster'

class StoreMasterCLient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getStoreMaster({ signal }: { signal: AbortSignal }) {
    const response = await this.get<FetchedStoreMasterType[]>(
      `StoreMaster/GetAllStoreMaster`,
      {},
      {
        signal,
      }
    )
    return response.data
  }

  async getStoreMasterById({ id = 0 }: { id: number | null }) {
    const response = await this.get<FetchedStoreMasterType>(`StoreMaster/GetStoreMaster`, {
      StoreID: id,
    })
    return response.data
  }

  async createStoreMaster(storeMasterData: StoreMasterPostType) {
    try {
      const response = await this.post<StoreMasterResponseType>(
        `StoreMasterRep/PostStoreMaster`,
        storeMasterData
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
      throw new Error('An Error Occured')
    }
  }
}
export default new StoreMasterCLient()
