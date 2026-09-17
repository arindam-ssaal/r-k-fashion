import { create } from 'zustand'

// Define the state and actions types
interface SearchItemsState {
  selectedSearchItems: string[] // Array to store selected item IDs
  toggleSelectedItem: (itemId: string) => void // Function to toggle item selection
  clearSelectedItems: () => void // Function to clear all selected items
}

// Define the Zustand store for managing selected items
const useSearchItemsStore = create<SearchItemsState>((set) => ({
  selectedSearchItems: [],

  // Function to toggle item selection (add if not present, remove if present)
  toggleSelectedItem: (itemId: string) =>
    set((state) => {
      const isSelected = state.selectedSearchItems.includes(itemId)

      // If item is already selected, remove it (deselect it)
      if (isSelected) {
        return {
          selectedSearchItems: state.selectedSearchItems.filter((id) => id !== itemId),
        }
      } else {
        // Otherwise, add it (select it)
        return {
          selectedSearchItems: [...state.selectedSearchItems, itemId],
        }
      }
    }),

  // Clear all selected items
  clearSelectedItems: () => set({ selectedSearchItems: [] }),
}))

export default useSearchItemsStore
