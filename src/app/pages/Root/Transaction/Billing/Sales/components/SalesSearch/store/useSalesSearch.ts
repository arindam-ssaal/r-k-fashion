import { create } from 'zustand'

interface SalesState {
  searchKey: string // Holds the selected sales data with quantity
  setSearchKey: (key: string) => void // To set or update the data
}

const useSalesSearchStore = create<SalesState>((set) => ({
  searchKey: '',
  setSearchKey: (key: string) => set({ searchKey: key }),
}))

export default useSalesSearchStore
