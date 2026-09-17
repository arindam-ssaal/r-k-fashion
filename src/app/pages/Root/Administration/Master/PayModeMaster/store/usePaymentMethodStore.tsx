import { create } from 'zustand'

interface PaymodeMasterState {
  currentPaymodeMasterId: number | null // ✅ Current ID store karo
  setCurrentPaymodeMasterId: (id: number) => void // ✅ ID setter
  clearCurrentPaymodeMasterId: () => void // ✅ ID reset
}

export const usePaymodeMasterDataStore = create<PaymodeMasterState>((set) => ({
  currentPaymodeMasterId: null, // ✅ Initially null

  setCurrentPaymodeMasterId: (id) => set({ currentPaymodeMasterId: id }),

  clearCurrentPaymodeMasterId: () => set({ currentPaymodeMasterId: null }),
}))
