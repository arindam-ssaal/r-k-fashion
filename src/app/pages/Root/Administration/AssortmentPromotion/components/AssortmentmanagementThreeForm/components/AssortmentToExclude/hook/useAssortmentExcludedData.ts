import { getAssortmentExcludedData } from '../../../../../__mockData__/api'



import useFetch from '@/hooks/useFetch'
import { delay } from '@/lib/utils'



export function useAssortmentExcludedData() {
  const { data, error, isLoading } = useFetch(
    async () => {
      await delay(2000)
      return getAssortmentExcludedData()
    }, // Pass the service method
    [] // No dependencies for now
  )

  return { assortmentExcludedData: data, error, isLoading }
}
