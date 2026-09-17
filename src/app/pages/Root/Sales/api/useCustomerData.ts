import useFetch from '@/hooks/useFetch'
import { getCustomersData } from '@/services/customerClient'

export function useCustomerData() {
  const { data, error, isLoading } = useFetch({
    key: 'customers',
    fn: getCustomersData, // This should return a Promise
    stale: 0, // Set stale time to 0 to consider data stale immediately
    cache: false, // Disable caching
  })

  return { customerData: data, error, isLoading }
}
