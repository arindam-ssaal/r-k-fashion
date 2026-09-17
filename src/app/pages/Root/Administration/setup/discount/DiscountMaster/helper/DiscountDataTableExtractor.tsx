import { DiscountSetupDataType } from "../components/DiscountMasterTable/components/DiscountMasterTableViewer/DiscountMasterTableViewer";

import { FetchedDiscountType } from "@/types/discountSetup";

export default function mapdiscountSetupFetchedTypeToTableData(discount: FetchedDiscountType): DiscountSetupDataType {
    return {
        discountID: discount.discountID,
        discountName: discount.discountName,
        discountType: discount.discountType,
        discountBase: discount.discountBase,
        discountValue: discount.discountValue,
        appliedOn: discount.appliedOn,
        employeeDiscount: discount.employeeDiscount,
        maximumDiscount: discount.maximumDiscount,
        minimumBilling: discount.minimumBilling,
        otpRequired: discount.otpRequired,
        allowToChange: discount.allowToChange,
        isActive: discount.isActive,
        enteredBy: discount.enteredBy,
        usedFor: discount.usedFor, // If "S" is constant, we can enforce it
        objDetails: [],
    };
  }
  