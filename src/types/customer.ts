import { CustomerStatus } from "@/app/pages/Root/Administration/Master/CustomerMaster/components/CustomerTable/data/data"

export interface CustomerFetchedType {
    address: string
    alternatePhnNo: string
    anniversary: string
    area: string
    city: string
    customerCatCode: string
    customerCatName: string
    customerFirstName: string
    status:CustomerStatus
    customerID: number
    customerLastName: string
    customerMiddleName: string
    dateOfBirth: string
    email: string
    employeeID: string
    enteredBy: string
    gender: string
    gstRegDate: string
    gstRegNo: string
    isEmployee: string
    isPushMessage: string
    membershipCategoryCode: string
    membershipCategoryName: string
    membershipNo: string
    mobile: string
    panNo: string
    pinCode: string
    preferredComMode: string
    profession: string
    spouseName: string
    state: string
    usedFor:string| null
    validTill: string
    whatsAppNo: string
  }
  
  
  
  export interface CustomerTypeModified extends CustomerFetchedType {
    quantity: number
  }
  

  export type CustomerMasterResponseType = { returnCode: string; returnMsg: string }[];