import { create } from 'zustand'


interface UserMasterState {
  currentUserMasterId: number | null // ✅ Current ID store karo
  setCurrentUserMasterId: (id: number) => void // ✅ ID setter
  clearCurrentUserMasterId: () => void // ✅ ID reset
}

export const useUserMasterDataStore = create<UserMasterState>((set) => ({
    currentUserMasterId: null, // ✅ Initially null

    setCurrentUserMasterId: (id) => set({ currentUserMasterId: id }),

    clearCurrentUserMasterId: () => set({ currentUserMasterId: null }),
}))
