import { create } from 'zustand'

interface StoreWisePolicyState {
  currentStoreWisePolicyId: number | null // ✅ Current ID store karo
  setstoreWisePolicyId: (id: number) => void // ✅ ID setter
  clearStoreWisePolicyId: () => void // ✅ ID reset
}

export const useStoreWisePolicyDataStore = create<StoreWisePolicyState>((set) => ({
  currentStoreWisePolicyId: null, // ✅ Initially null

  setstoreWisePolicyId: (id) => set({ currentStoreWisePolicyId: id }),

  clearStoreWisePolicyId: () => set({ currentStoreWisePolicyId: null }),
}))
