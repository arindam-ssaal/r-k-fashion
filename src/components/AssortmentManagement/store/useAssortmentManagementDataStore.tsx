import { create } from 'zustand'

interface AssortmentManagementDataStoreType {
  currentAssortmentId: number | null
  setCurrentAssortmentId: (id: number) => void
  clearCurrentAssortmentId: () => void

  // ✅ Add these
  generatedItems: any[]
  setGeneratedItems: (items: any[]) => void
  clearGeneratedItems: () => void
}

export const useAssortmentManagementDataStore = create<AssortmentManagementDataStoreType>(
  (set) => ({
    currentAssortmentId: null,

    setCurrentAssortmentId: (id) => set({ currentAssortmentId: id }),
    clearCurrentAssortmentId: () => set({ currentAssortmentId: null }),

    // ✅ New state for generated items
    generatedItems: [],
    setGeneratedItems: (items) => set({ generatedItems: items }),
    clearGeneratedItems: () => set({ generatedItems: [] }),
  })
)
