import { create } from 'zustand'

interface IncentiveAssortmentManagementDataStoreType {
  currentIncentiveMasterId: number | null // ✅ Current ID store karo
  setCurrentIncentiveMasterId: (id: number) => void // ✅ ID setter
  clearCurrentIncentiveMasterId: () => void // ✅ ID reset
}

export const useIncentiveAssortmentManagementDataStore = create<IncentiveAssortmentManagementDataStoreType>(
  (set) => ({
    currentIncentiveMasterId: null, // ✅ Initially null

    setCurrentIncentiveMasterId: (id) => set({ currentIncentiveMasterId: id }),

    clearCurrentIncentiveMasterId: () => set({ currentIncentiveMasterId: null }),
  })
)
