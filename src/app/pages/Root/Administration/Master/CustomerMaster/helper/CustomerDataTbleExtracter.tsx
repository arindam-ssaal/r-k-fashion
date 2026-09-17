import { CustomerTableData } from "../components/CustomerTable/components/CustomerTableViewer/CustomerTableViewer";

import { CustomerFetchedType } from "@/types/customer";


export default function mapCustomerFetchedTypeToTableData(customer: CustomerFetchedType): CustomerTableData {
    return {
      mobileNo: customer.mobile,
      firstName: customer.customerFirstName,
      middleName: customer.customerMiddleName,
      lastName: customer.customerLastName,
      gender: customer.gender,
      dateOfBirth: new Date(customer.dateOfBirth),
      anniversaryDate: new Date(customer.anniversary),
      profession: customer.profession,
      spouseName: customer.spouseName,
      isEmployee: customer.isEmployee === 'Y',
      panNo: customer.panNo,
      gstNo: customer.gstRegNo,
      gstDate: new Date(customer.gstRegDate),
      address: customer.address,
      area: customer.area,
      city: customer.city,
      pin: customer.pinCode,
      state: customer.state,
      email: customer.email,
      whatsappNo: customer.whatsAppNo,
      alternatePhoneNo: customer.alternatePhnNo,
      receivePushMessage: customer.isPushMessage === 'Y',
      preferredCommunication: customer.preferredComMode,
      customerCategory: customer.customerCatName,
      membershipCategory: customer.membershipCategoryName,
      membershipNo: customer.membershipNo,
      validTill: new Date(customer.validTill),
      objDetails: [], // ✅ If objDetails is needed, handle it separately
    };
  }
  