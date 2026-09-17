import { ItemFilterType } from '@/types/item'

export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type ItemType = ItemFilterType & {
  status: ItemStatus // ✅ Add status property
}

export type ItemTableRow = {
  status: ItemStatus
  itemCode: string
  barCode: string
  itemName: string
  itemGroup: number
  isActive: 'Y' | 'N'
}
