
export interface StoreAllocationDetail {
  salesPersonID: number;
  storeID: number;
  storeCode: string;
  storeName: string;
  startDate: string;  // ISO format ya string, agar Date chahiye toh `Date` kar sakte hain
  endDate: string;
  isTransfered: 'Y' | 'N';  // Sirf 'Y' ya 'N' aayega
}


export type SalesPersonType = {
  salesPersonID: string
  firstName: string | null
  lastName: string | null
  mobileNo: string | null
  whatsAppNo: string | null
  email: string | null
  employeeID: string | null
  allocateRole: string | null
  allocateUser: string | null
  isActive: string | null
  enteredBy: string | null
  usedFor: string | null
  objDetails: StoreAllocationDetail[]
}

export type FetchedSalesPersonType=SalesPersonType


export type SalesPersonResponseType = { returnCode: string; returnMsg: string }[];
