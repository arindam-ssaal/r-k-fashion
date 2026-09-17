import { create } from 'zustand'

type GoodsReceiptStoreType = {
  isOpen: boolean
  mode: 'Edit' | 'Create' | 'View'
  activeModal: 'GoodsReceipt' | 'GoodsReceipe' | null
  toggleOpen: () => void
  close: () => void
  setMode: (newMode: 'Edit' | 'Create' | 'View') => void
  setActiveModal: (modal: 'GoodsReceipt' | 'GoodsReceipe' | null) => void
}


export const useGoodsReceiptStoreType = create<GoodsReceiptStoreType>((set) => ({
  isOpen: false,
  mode: 'Create',
  activeModal: null,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set(() => ({ isOpen: false, activeModal: null })),
  setMode: (newMode) => set(() => ({ mode: newMode })),
  setActiveModal: (modal) => set(() => ({ activeModal: modal })),
}))


export default useGoodsReceiptStoreType
