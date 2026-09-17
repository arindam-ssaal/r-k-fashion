type AssotmentOptions={
  "assortmentID":number,
  "itemCode":string,
  "itemName":string|null,
  "tableID":number,
  "lineNum":1,
  "barcode":string,
  "group":string
}


export type FetchedAssortmentType = {
  assortmentID: number
  assortmentName: string
  description: string
  barcode: string
  itemCode: string
  assortmentType: 'D'
  enteredBy: number
  usedFor: null
  store: number
  assortmentDetail:AssotmentOptions[]
}

export type AssortmentResponseType = { returnCode: string; returnMsg: string }[]



