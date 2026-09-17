import { create } from 'zustand'


interface ItemrMasterState {
  currentItemMasterId: string | null // ✅ Current ID store karo
  setCurrentItemMasterId: (id: string) => void // ✅ ID setter
  clearCurrentItemMasterId: () => void // ✅ ID reset
}

export const useItemMasterDataStore = create<ItemrMasterState>((set) => ({
    currentItemMasterId: null, // ✅ Initially null

    setCurrentItemMasterId: (id) => set({ currentItemMasterId: id }),

    clearCurrentItemMasterId: () => set({ currentItemMasterId: null }),
}))
