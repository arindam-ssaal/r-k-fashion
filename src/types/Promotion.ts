type ConditionType = {
        promotionID: number,
        conditionID: string
        value: number
      
}

type AssortmentType = {
    promotionID: number
    assortmentID: number
    assortmentName: string
    value: number
  }

type BenefitType=  {
    promotionID: number
    benifitID: string
    value: number
    assortmentID:   number
    assortmentName: string
  }

  type DiscountType = {
    promotionID: number
    discountID: string
    value: number
    dropDown1: string
    dropDown2: string
    dropDown3: string
    fromValue: number
    toValue: number
  }

export type FetchedPromotionType = {
  promotionID: number
  promotionName: string
  details: string
  appliedOn: string
  promotionType: string
  isActive: string
  storeID: number
  enteredBy: number
  usedFor: null | string
  objCondition: ConditionType[]
  objAssortment: AssortmentType[],
  objBenifit: BenefitType[],
  objValue:unknown []
  objDiscount:DiscountType[]
}

export type PromotionResponseType = { returnCode: string; returnMsg: string }[]
