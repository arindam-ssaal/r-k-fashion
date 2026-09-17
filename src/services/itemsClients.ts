import ApiClient from './ApiClient'

import { FetchedItemMaster } from '@/types/item' 

class ItemClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getAllItems({ signal }: { signal?: AbortSignal }) {
    const response = await this.get<FetchedItemMaster[]>(`Item/GetAllItem`, {}, { signal })
    return response.data
  }

  async getItemsById({ groupId }: { groupId: string }) {
    const response = await this.get<FetchedItemMaster>(`Item/GetItem?itemCode=${groupId}`)
    return response.data
  }
}

export default new ItemClient()
