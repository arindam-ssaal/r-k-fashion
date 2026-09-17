import ApiClient from "./ApiClient";

import { FetchedOrganizationPolicyType, OrganizationPolicyResponseType } from "@/types/organizationPolicy";


class OrganizationPolicyClient extends ApiClient {
  constructor() {
    super('api/')
  }

  async getOrganizationPolicies({ signal }: { signal: AbortSignal }) {
    const response = await this.get<FetchedOrganizationPolicyType[]>(
      `OrgPolicy/GetOrganizationPolicy?OrgPolicyID=0`,
      {},
      {
        signal,
      }
    );
    return response.data;
  }
  async getOrganizationPolicyById({ id = 0 }: { id: number | null }) {
    const response = await this.get<FetchedOrganizationPolicyType>(`OrgPolicy/GetOrganizationPolicy?OrgPolicyID=0`, {
      OrgPolicyID: id,
    });
    return response.data;
  }
  
  async createOrganizationPolicy(organizationPolicyData: FetchedOrganizationPolicyType): Promise<OrganizationPolicyResponseType> {
    try {
      const response = await this.post(
        `OrgPolicyRep/PostOrganizationPolicy`,
        organizationPolicyData
      );

      // ✅ Status check for non-200 responses
      const responseData = response.data as { returnCode: string; returnMsg: string }[];
      if (responseData[0].returnCode !== 'Y') {
        throw new Error(responseData[0].returnMsg);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
export default new OrganizationPolicyClient()