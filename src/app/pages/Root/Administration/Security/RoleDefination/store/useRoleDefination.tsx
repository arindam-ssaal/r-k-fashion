import { create } from 'zustand'
//type RoleMode = 'view' | 'edit' | 'create'
type RoleDefination = {
  //mode: RoleMode
  currentRoleDefinationId: number | null
  isLoading:boolean
  setIsLoading: (loading: boolean) => void
  isOpen: boolean
  mode: 'Edit' | 'Create' | 'View'
  toggleOpen: () => void
  close: () => void
  setMode: (newMode: 'Edit' | 'Create' | 'View') => void
}

export const useRoleDefination = create<RoleDefination>((set) => ({
  currentRoleDefinationId: null,
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isOpen: false,
  mode: 'Create' as 'Edit' | 'Create' | 'View',
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set(() => ({ isOpen: false })),
  setMode: (newMode) => set(() => ({ mode: newMode})),
}))


