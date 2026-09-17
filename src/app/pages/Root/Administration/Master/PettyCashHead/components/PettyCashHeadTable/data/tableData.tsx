
export enum PettyCashStatus {
  ACTIVE = 'Y',
  INACTIVE = 'N',
}

export type PettyCashTableData = {
  isActive: PettyCashStatus
  pettyCashCode: string|null|number
  pettyCashID: string|null|number
  pettyCashName: string|null
}
