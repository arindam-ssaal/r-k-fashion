import { create } from 'zustand'

type DiscountAllocationStore = {
  isOpen: boolean
  isOpen2:boolean,
  toggleOpen: () => void
  toggleOpen2: () => void
  close: () => void
  close2: () => void
}

export const useDiscountAllocationStore = create<DiscountAllocationStore>((set) => ({
  isOpen: false,
  isOpen2: false,
  mode: 'Create',
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleOpen2: () => set((state) => ({ isOpen2: !state.isOpen2 })),
  close: () => set(() => ({ isOpen: false })),
  close2: () => set(() => ({ isOpen2: false })),
}))

// export default useSalesPerson
