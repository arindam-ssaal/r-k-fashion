interface DiscountAssortment {
    discountID: number;
    assortmentID: number;
    assortmentName: string;
  }
  
  export type FetchedDiscountType = {
    discountID: number;
    discountName: string;
    discountType: string;
    discountBase: string;
    discountValue: number;
    appliedOn: string;
    percentage:number,
    employeeDiscount: string;
    maximumDiscount: number;
    minimumBilling: number;
    otpRequired: string;
    allowToChange: string;
    isActive: string;
    enteredBy: number;
    usedFor: string| null; // If "S" is constant, we can enforce it
    discountAssortments: DiscountAssortment[];
  }

  
  export type DiscountResponseType = { returnCode: string; returnMsg: string }[]
