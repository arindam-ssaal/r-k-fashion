import { getAssortmentData } from '../__mockData__/api'

import useFetch from '@/hooks/useFetch'



export function useAssortmentThreeData() {
  const { data, error, isLoading } = useFetch({
    key: 'assortment',
    fn: getAssortmentData, // This should return a Promise
    stale: 60000, // Set stale time to 0 to consider data stale immediately
    cache: true, // Disable caching
  })

  return { assortmentData: data, error, isLoading }
}
