import { create } from 'zustand'

type StoreMasterStoreType = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isOpen: boolean
  mode: 'Edit' | 'Create' | 'View' | 'Delete'
  toggleOpen: () => void
  close: () => void
  setMode: (newMode: 'Edit' | 'Create' | 'View' | 'Delete') => void
}
export const useStoreMasterStore = create<StoreMasterStoreType>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isOpen: false,
  mode: 'Create',
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set(() => ({ isOpen: false })),
  setMode: (newMode) => set(() => ({ mode: newMode })),
}))

export default useStoreMasterStore
