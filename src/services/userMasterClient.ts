import ApiClient from "./ApiClient";

import { UserMasterPostType } from "@/app/pages/Root/Administration/Security/UserMaster/hooks_api/useCreateUsermaster";
import { FetchedUserDetail, UserResponseType } from "@/types/userMaster";

class UserMasterClient extends ApiClient{
    constructor(){
        super('api/')
    }
    
    async getUserMaster({ signal }: { signal: AbortSignal }) {
        const response = await this.get<FetchedUserDetail[]>(
        `User/GetAllUser`,
        {},
        {
            signal,
        }
        )
        return response.data
    }

     async createUserMaster(userMasterData: UserMasterPostType) {
        try {
          const response = await this.post<UserResponseType>(
            //`UserRep/PostUser`,
            `StoreMasterRep/PostStoreMaster`,
            userMasterData
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

      async createUserMasterGeneral(userMasterData: UserMasterPostType) {
        try {
          const response = await this.post<UserResponseType>(
            //`StoreMasterRep/PostStoreMaster`,
            `UserRep/PostUser`,
            userMasterData
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
export default new UserMasterClient()