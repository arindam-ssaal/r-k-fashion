import ApiClient from "./ApiClient";

import { FetchRoleDefinationType } from "@/types/roleDefination";


class RoleDefination extends ApiClient {
    constructor() {
        super('api/')
      }
       async getRoleDefination({ signal }: { signal: AbortSignal }) {
          const response = await this.get<FetchRoleDefinationType[]>(
            `Role/GetAllRole`,
            {},
            {
              signal,
            }
          )
          return response.data
        }
}
export default new RoleDefination