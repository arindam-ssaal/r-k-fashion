import { PropertiesType } from '../components/AssortmentMangementForm/components/AssortmentSearchFilter/AssortmentSearchFilter'

type AssortmentPostType = {
  itemGrpID: number
  itemProperty: Array<{
    propertyID: string
    propertyName: string
    propertyValues: Array<{
      value: string
    }>
  }>
}
export type ItemGenerationType = ReturnType<typeof createAssortmentPayload>

export function createAssortmentPayload(
  itemGrpID: number,
  itemProperty: PropertiesType[]
): AssortmentPostType {
  return {
    itemGrpID,
    itemProperty: itemProperty, // Abhi empty array
  }
}
