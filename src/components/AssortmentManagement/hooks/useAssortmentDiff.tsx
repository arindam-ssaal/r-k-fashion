import { useMemo } from 'react'

import { useGeneratedItemsDataStore } from './useGeneratedItemsDataStore'
import { useAssortmentDataById } from '../hooks_api/useAssortmentDataById'
import { useAssortmentManagementDataStore } from '../store/useAssortmentManagementDataStore'
import { useAssortmentManagementStore } from '../store/useAssortmentManagementStore'

import { useGetGeneratedItems } from '@/hooks_api/useGetItemFilterWise'

export function useAssortmentDiff(type: 'included' | 'excluded') {
  const mode = useAssortmentManagementStore(state => state.mode)
  const assortmentType = useAssortmentManagementStore(state => state.type)
  const selectedId = useAssortmentManagementDataStore(
    state => state.currentAssortmentId
  )

  const { assortmentData } = useAssortmentDataById(selectedId, assortmentType)
  const { generatedItems } = useGetGeneratedItems()
  const selectedGeneratedItems = useGeneratedItemsDataStore(
    state => state.selections
  )

  const items = useMemo(() => {
    if (mode === 'Create') {
      // Create mode: use generatedItems and Zustand selections
      return generatedItems.filter(
        item => selectedGeneratedItems[item.itemCode] === type
      )
    }

    if(mode==='Edit' && selectedId){
      return (
        assortmentData?.assortmentDetail.filter(item => {
          if (type === 'included') return item.tableID === 1
          if (type === 'excluded') return item.tableID === 2
          return false
        }) || []
      )
    }
    
    else {
      // Edit mode: ensure selectedId is available
      if (!selectedId) {
        console.error('selectedId is required in edit mode')
        return []
      }     
    }
  }, [
    mode,
    type,
    generatedItems,
    selectedGeneratedItems,
    selectedId,
    assortmentData,
  ])

  return { items }
}