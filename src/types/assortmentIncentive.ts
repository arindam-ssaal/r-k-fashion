export type FetchedAssortmentIncentiveType = {
  assortmentID: number
  assortmentName: string
  description: string
  assortmentType: 'I'
  enteredBy: number
  usedFor: null
  store: number
}

export type AssortmentPromotionResponseType = { returnCode: string; returnMsg: string }[]
