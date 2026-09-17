import { create } from 'zustand'


interface PromotionSetupState {
  currentPromotionSetupId: number | null // ✅ Current ID store karo
  setCurrentPromotionSetupId: (id: number) => void // ✅ ID setter
  clearCurrentPromotionSetupId: () => void // ✅ ID reset
}

export const usePromotionSetupDataStore = create<PromotionSetupState>((set) => ({
  currentPromotionSetupId: null, // ✅ Initially null

  setCurrentPromotionSetupId: (id) => set({ currentPromotionSetupId: id }),

  clearCurrentPromotionSetupId: () => set({ currentPromotionSetupId: null }),
}))
