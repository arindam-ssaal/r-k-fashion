import { create } from 'zustand'

interface SidebarState {
  open: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

const useSidebar = create<SidebarState>((set) => ({
  open: false,
  openSidebar: () => set({ open: true }),
  closeSidebar: () => set({ open: false }),
  toggleSidebar: () => set((state) => ({ open: !state.open })),
}))

export default useSidebar
