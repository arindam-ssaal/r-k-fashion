import { create } from 'zustand'


interface DiscountnMasterState {
  currentDiscountnMasterId: number | null // ✅ Current ID store karo
  setCurrentDiscountnMasterId: (id: number) => void // ✅ ID setter
  clearCurrentDiscountnMasterId: () => void // ✅ ID reset
}

export const useDiscountnMasterDataStore = create<DiscountnMasterState>((set) => ({
  currentDiscountnMasterId: null, // ✅ Initially null

  setCurrentDiscountnMasterId: (id) => set({ currentDiscountnMasterId: id }),

  clearCurrentDiscountnMasterId: () => set({ currentDiscountnMasterId: null }),
}))
