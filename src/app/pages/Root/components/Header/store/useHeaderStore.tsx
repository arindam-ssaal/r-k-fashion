import { create } from 'zustand'

interface HeaderStore {
  isSearchModalOpen: boolean // Holds the modal open state
  openSearchModal: () => void // Opens the modal
  closeSearchModal: () => void // Closes the modal
  toggleSearchModal: () => void // Toggles the modal open/close state
}

const useHeaderStore = create<HeaderStore>((set) => ({
  isSearchModalOpen: false, // Initial state is closed

  // Function to open the modal
  openSearchModal: () => set({ isSearchModalOpen: true }),

  // Function to close the modal
  closeSearchModal: () => set({ isSearchModalOpen: false }),

  // Function to toggle the modal state
  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
}))

export default useHeaderStore
