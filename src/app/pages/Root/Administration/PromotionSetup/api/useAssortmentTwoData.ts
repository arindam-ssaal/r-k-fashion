
import { getAssortmentData } from '../__mockData__/api'

import useFetch from '@/hooks/useFetch'
import { delay } from '@/lib/utils'


export function useAssortmentTwoData() {
  const { data, error, isLoading } = useFetch(
    async () => {
      await delay(2000)
      return getAssortmentData()
    }, // Pass the service method
    [] // No dependencies for now
  )

  return { assortmentData: data, error, isLoading }
}
