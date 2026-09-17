export interface ProductFetched {
  id: string
  itemName: string
  rate: string
  quantity: number
  discountAmt: number
  promoAmt: number
  totalAmt: number
  salesPerson: string
  hsnCode: number
  taxRate: number
  taxAmt: number
  perItemDiscount: number
  perItemPromoAmt: number
  unraxAmt: number
  uom: string
  mrp: number
  gst: number
  amount: number
  image: string
  barcode: string
  
}

export interface ProductModified extends ProductFetched {
  quantity: number
}
