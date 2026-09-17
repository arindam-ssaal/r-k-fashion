import { create } from 'zustand'


interface DesignationMasterState {
  currentDesignationMasterId: number | null // ✅ Current ID store karo
  setCurrentDesignationMasterId: (id: number) => void // ✅ ID setter
  clearCurrentDesignationMasterId: () => void // ✅ ID reset
}

export const useDesignationMasterDataStore = create<DesignationMasterState>((set) => ({
  currentDesignationMasterId: null, // ✅ Initially null

  setCurrentDesignationMasterId: (id) => set({ currentDesignationMasterId: id }),

  clearCurrentDesignationMasterId: () => set({ currentDesignationMasterId: null }),
}))
