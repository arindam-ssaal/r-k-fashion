export type FetchedAssortmentPromotionType = {
  assortmentID: number
  assortmentName: string
  description: string
  assortmentType: 'P'
  enteredBy: number
  usedFor: null
  store: number
}

export type AssortmentPromotionResponseType = { returnCode: string; returnMsg: string }[]
