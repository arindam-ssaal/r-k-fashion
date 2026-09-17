import { SalesPersonType } from "@/types/salesPerson";

export enum SalesPersonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}




export type ExtendedSalesPersonType = SalesPersonType & {
  status:SalesPersonStatus
  fullName:string|null;
}



// export const data: ExtendedSalesPersonType[] = [
//   {
//     salesPersonID: "23",
//     firstName: 'tushar',
//     lastName: null,
//     mobileNo: "3435644353",
//     whatsAppNo: "9383929239",
//     email: "td03044@getMaxListeners.com",
//     employeeID: null,
//     allocatedRole: null,
//     allocatedUser: null,
//     isActive: null,
//     enteredBy: null,
//     usedFor: null,
//     objDetails: [],
//   },
//   {
//     salesPersonID: "1",
//     firstName: 'Deblaya',
//     lastName: null,
//     mobileNo: "343424353322",
//     whatsAppNo: "9383929239",
//     email: "td)335433@gmail.com",
//     employeeID: "td)335433@gmail.com",
//     allocatedRole: null,
//     allocatedUser: null,
//     isActive: null,
//     enteredBy: null,
//     usedFor: null,
//     objDetails: [],
//   },
// ]


