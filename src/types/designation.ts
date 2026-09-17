export type FetchedDesignationType = {
  designationID: number | string
  designationName: string
  remarks: string
  isActive: string
  enteredBy: number
  usedFor: string | null
}

export type DesginationResponseType = { returnCode: string; returnMsg: string }[]
