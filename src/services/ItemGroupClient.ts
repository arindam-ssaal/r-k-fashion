import ApiClient from './ApiClient'

import { ItemGenerationType } from '@/components/AssortmentManagement/helper/assortmentFilterFormatter'
import {
  FetchedItemGroupsType,
  ItemsResponseType,
  FetchedItemPropertiesType,
} from '@/types/item' // Ye types aapke project ke hisaab se adjust karo

class ItemGroupClient extends ApiClient {
  constructor() {
    super('api/')
  }

  /**
   * Sabhi item groups ko fetch karta hai.
   * @param signal AbortSignal for request cancellation
   */
  async getAllItemsGroups({ signal }: { signal: AbortSignal }) {
    const response = await this.get<FetchedItemGroupsType[]>(
      `ItemGroup/GetAllItemGroup?ItemGrpID=0`,
      {},
      { signal }
    )
    return response.data
  }

  /**
   * Ek particular item group ke properties fetch karta hai.
   * @param groupId Item group id
   */
  async getAllItemsPropertiesByGroupId({ groupId }: { groupId: number }) {
    const response = await this.get<FetchedItemPropertiesType[]>(
      `ItemGroup/GetItemGroupWiseProperty?ItemGrpID=${groupId}`
    )
    return response.data
  }

  async getAllItemsAfterFiltering(filterData: ItemGenerationType){
    // Agar backend POST chah raha hai:
    const response = await this.post<ItemsResponseType>(`Item/GetItemFilterWise`, filterData)
    //console.log(response);
    
    return response.data
  }
}

export default new ItemGroupClient()