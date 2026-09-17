import { CustomerFetchedType } from "@/types/customer";

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type CustomerType = CustomerFetchedType & {
  status: CustomerStatus; // ✅ Add status property
};

export type CustomerTableRow = {
  customerId: string;
  fullName: string;
  email: string;
  status: CustomerStatus;
  phoneNo: string;
};
