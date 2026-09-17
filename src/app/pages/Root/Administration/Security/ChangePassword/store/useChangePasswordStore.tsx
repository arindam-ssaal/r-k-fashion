import { create } from "zustand"

type UserChangePasswordStore = {
    isOpen: boolean
    mode: 'Edit' | 'Create' | 'View'
    toggleOpen: () => void
    close: () => void
    setMode: (newMode: 'Edit' | 'Create' | 'View') => void
  }
  export const useChangePasswordStore = create<UserChangePasswordStore>((set) => ({
    isOpen: false,
    mode: 'Create',
    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    close: () => set(() => ({ isOpen: false })),
    setMode: (newMode) => set(() => ({ mode: newMode })),
  }))