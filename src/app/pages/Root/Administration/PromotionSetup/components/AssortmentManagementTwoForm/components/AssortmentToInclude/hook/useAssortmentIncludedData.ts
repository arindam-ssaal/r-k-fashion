
import { getAssortmentIncludedData } from '../../../../../__mockData__/api'

import useFetch from '@/hooks/useFetch'
import { delay } from '@/lib/utils'



  

export function useAssortmentIncludedData() {
  const { data, error, isLoading } = useFetch(
    async () => {
      await delay(2000)
      return getAssortmentIncludedData()
    }, // Pass the service method
    [] // No dependencies for now
  )

  return { assortmentIncludedData: data, error, isLoading }
}
