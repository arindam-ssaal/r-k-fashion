export interface StoreDetail {
    userID: number;
    storeID: number;
    fromDate: string; // ISO format date string
    toDate: string;
    isDiscontinued: string; // Might be 'Y' or 'N'
  }
  
  export interface UserDetail {
    userID: number;
    userName: string;
    loginID: string;
    password: string;
    profileID: number;
    roleID: number;
    defaultStoreID: number;
    employeeID: string;
    email: string;
    mobile: string;
    whatsApp: string;
    remarks: string;
    isActive: 'Y' | 'N'; // Active status should be 'Y' or 'N'
    enteredBy: number;
    usedFor: string;
    objStore: StoreDetail[];
  }
  
  export type FetchedUserDetail = UserDetail;
  
  export type UserResponseType = { returnCode: string; returnMsg: string }[];
  