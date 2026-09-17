import { create } from 'zustand'

interface SalesPersonState {
  currentSalesPersonId: number | null // ✅ Current ID store karo
  setCurrentSalesPersonId: (id: number) => void // ✅ ID setter
  clearCurrentSalesPersonId: () => void // ✅ ID reset
}

export const useSalesPersonDataStore = create<SalesPersonState>((set) => ({
  currentSalesPersonId: null, // ✅ Initially null

  setCurrentSalesPersonId: (id) => set({ currentSalesPersonId: id }),

  clearCurrentSalesPersonId: () => set({ currentSalesPersonId: null }),
}))
