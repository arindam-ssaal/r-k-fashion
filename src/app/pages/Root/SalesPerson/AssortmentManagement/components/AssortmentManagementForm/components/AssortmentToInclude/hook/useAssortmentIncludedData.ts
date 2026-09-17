
import { getAssortmentIncludedData } from '../../../../../__mockData__/api'

import useFetch from '@/hooks/useFetch'

export function useAssortmentIncludedData() {
    const { data, error, isLoading } = useFetch({
      key: 'assortmentIncluded',
      fn: getAssortmentIncludedData, // This should return a Promise
      stale: 180000, // Set stale time to 0 to consider data stale immediately
      cache: true, // Disable caching
    })
  
    return { assortmentIncludedData: data, error, isLoading }
  }