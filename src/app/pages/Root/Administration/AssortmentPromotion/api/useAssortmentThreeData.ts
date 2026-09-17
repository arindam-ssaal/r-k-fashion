import { getAssortmentData } from '../__mockData__/api'


import useFetch from '@/hooks/useFetch'
import { delay } from '@/lib/utils'

// export function useAssortmentThreeData() {
//   const { data, error, isLoading } = useFetch({
//     key: 'assortment',
//     fn: getAssortmentData, // This should return a Promise
//     stale: 60000, // Set stale time to 0 to consider data stale immediately
//     cache: true, // Disable caching
//   })

//   return { assortmentData: data, error, isLoading }
// }




export function useAssortmentThreeData() {
  const { data, error, isLoading } = useFetch(
    async () => {
      await delay(2000)
      return getAssortmentData()
    }, // Pass the service method
    [] // No dependencies for now
  )

  return { assortmentData: data, error, isLoading }
}
