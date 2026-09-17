import { create } from 'zustand'

type PromotionSetupStore = {
  isLoading:boolean
  setIsLoading: (loading: boolean) => void
  isOpen: boolean
  mode: 'Edit' | 'Create' | 'View'
  step:number
  toggleOpen: () => void
  close: () => void
  setMode: (newMode: 'Edit' | 'Create' | 'View') => void
  next:()=>void,
  prev:()=>void
  viewerID: number | null
setViewerID: (id: number | null) => void
}

export const usePromotionSetupStore = create<PromotionSetupStore>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isOpen: false,
  step:1,
  mode: 'Create',
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set(() => ({ isOpen: false })),
  setMode: (newMode) => set(() => ({ mode: newMode })),
  next:()=>set(()=>({step:2})),
  prev:()=>set(()=>({step:1})),
  viewerID: null,
setViewerID: (id) => set({ viewerID: id }),
}))

// export default useSalesPerson
