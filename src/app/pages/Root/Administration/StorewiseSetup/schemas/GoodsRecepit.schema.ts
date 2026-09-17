import { z } from 'zod'

export const goodsreceiptreturnSchema = z.object({
  storeName: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  excessGoodsReceiptTolerance: z.string().optional(),
  shortGoodsReceiptTolerance: z.string().optional(),
  allowReceiveDamagedGoods: z.boolean().optional(),
})
