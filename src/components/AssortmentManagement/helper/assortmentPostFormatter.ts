import { z } from 'zod'

import { FormSchema } from '../components/AssortmentMangementForm/AssortmentManagementForm'

const operations = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
  View: 'V',
}

type assortmentDetail = {
  assortmentID: string | number
  itemCode: string
  itemName: string
  tableID: number
  lineNum: number
  barcode: string
  group: string
}[]
export type AssortmentPostType = ReturnType<typeof assortmentFormatter>

export function assortmentFormatter(
  data: z.infer<typeof FormSchema>,
  mode: keyof typeof operations,
  id: number | string,
  assortmentDetail: assortmentDetail[],
  type: 'P' | 'D' | 'S'
) {
 
  const sendedData = {
    assortmentID: mode === 'Create' ? 0 : id,
    assortmentName: data.assortmentName,
    description: data.description,
    // typeOfAssortment: type === 'P' ? data.assortmentType : '',
    typeOfAssortment: data.typeOfAssortment,
    assortmentType: type,
    enteredBy: 0,
    usedFor: operations[mode],
    isActive:data.isActive?"Y":"N",
    store: 0,
    //assortmentDetail: [],
   // assortmentDetail: data.assortmentDetail ? data.assortmentDetail : [],
   assortmentDetail: assortmentDetail?.length ? assortmentDetail : [],

  }

  return sendedData
}
