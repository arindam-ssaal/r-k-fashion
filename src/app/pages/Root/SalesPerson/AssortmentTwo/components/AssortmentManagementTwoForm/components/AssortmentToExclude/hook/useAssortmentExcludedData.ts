import { getAssortmentExcludedData } from '../../../../../__mockData__/api'

import useFetch from '@/hooks/useFetch'



export function useAssortmentExcludedData() {
  const { data, error, isLoading } = useFetch({
    key: 'assortmentExcluded',
    fn: getAssortmentExcludedData, // This should return a Promise
    stale: 10000, // Set stale time to 0 to consider data stale immediately
    cache: true, // Disable caching
  })

  return { assortmentExcludedData: data, error, isLoading }
}
