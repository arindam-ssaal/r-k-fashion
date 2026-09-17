import { create } from 'zustand'

type InventoryTransferRequestType = {
  isOpen: boolean
  mode: 'Edit' | 'Create' | 'View'
  toggleOpen: () => void
  close: () => void
  setMode: (newMode: 'Edit' | 'Create' | 'View') => void
}
export const useInventoryTransferRequestType = create<InventoryTransferRequestType>((set) => ({
  isOpen: false,
  mode: 'Create',
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set(() => ({ isOpen: false })),
  setMode: (newMode) => set(() => ({ mode: newMode })),
}))

export default useInventoryTransferRequestType
