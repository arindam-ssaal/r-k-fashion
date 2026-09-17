
import { data } from '../components/SalesTable/data/data'

export function useSalesData() {
  return { salesData: data, error: '', isLoading: false }
}
