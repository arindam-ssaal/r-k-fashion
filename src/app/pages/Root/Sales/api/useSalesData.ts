import useFetch from '@/hooks/useFetch'
import { getSalesData } from '@/services/Sales'

export function useSalesData() {
  const { data, error, isLoading } = useFetch({
    key: 'sales',
    fn: getSalesData, // This should return a Promise
    stale: 0, // Set stale time to 0 to consider data stale immediately
    cache: false, // Disable caching
  })

  return { salesData: data, error, isLoading }
}
