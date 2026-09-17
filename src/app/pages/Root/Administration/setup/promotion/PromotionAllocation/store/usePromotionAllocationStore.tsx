import { create } from 'zustand'

type PromotionAlllocationStoreType = {
  isOpen: boolean
  mode: 'Edit' | 'Create' | 'View'
  toggleOpen: () => void
  close: () => void
  setMode: (newMode: 'Edit' | 'Create' | 'View') => void,
  isOpen2: boolean
  mode2: 'Edit' | 'Create' | 'View'
  toggleOpen2: () => void
  close2: () => void
  setMode2: (newMode: 'Edit' | 'Create' | 'View') => void
}

export const usePromotionAllocationStore = create<PromotionAlllocationStoreType>((set) => ({
  isOpen: false,
  mode: 'Create',
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set(() => ({ isOpen: false })),
  setMode: (newMode) => set(() => ({ mode: newMode })),
  isOpen2: false,
  mode2: 'Create',
  toggleOpen2: () => set((state) => ({ isOpen2: !state.isOpen })),
  close2: () => set(() => ({ isOpen2: false })),
  setMode2: (newMode) => set(() => ({ mode2: newMode })),
}))

// export default useSalesPerson
