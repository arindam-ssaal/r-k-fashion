import { create } from 'zustand'

interface StoreMasterState {
  currentStoreMasterId: number | null // ✅ Current ID store karo
  setStoreMasterId: (id: number) => void // ✅ ID setter
  clearStoreMasterId: () => void // ✅ ID reset
}

export const useStoreMasterDataStore = create<StoreMasterState>((set) => ({
    currentStoreMasterId: null, // ✅ Initially null

  setStoreMasterId: (id) => set({ currentStoreMasterId: id }),

  clearStoreMasterId: () => set({ currentStoreMasterId: null }),
}))
