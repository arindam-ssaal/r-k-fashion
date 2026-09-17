import { create } from 'zustand'

interface PettyCashState {
  currentPettyCashId: number | null // ✅ Current ID store karo
  setCurrentPettyCashId: (id: number) => void // ✅ ID setter
  clearCurrentPettyCashId: () => void // ✅ ID reset
}

export const usePettyCashDataStore = create<PettyCashState>((set) => ({
  currentPettyCashId: null, // ✅ Initially null

  setCurrentPettyCashId: (id) => set({ currentPettyCashId: id }),

  clearCurrentPettyCashId: () => set({ currentPettyCashId: null }),
}))
