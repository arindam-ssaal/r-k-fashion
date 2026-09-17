import { create } from 'zustand'

type DiscountItem = {
  id: number
  name: string
}

interface DiscountAllocationListState {
  selectedItems: DiscountItem[] // Selected items array
  addItem: (item: DiscountItem) => void // Function to add an item
  removeItem: (item: DiscountItem) => void // Function to remove an item
}

export const useDiscountAllocationList = create<DiscountAllocationListState>((set) => ({
  selectedItems: [],

  addItem: (item) =>
    set((state) => ({
      selectedItems: [...state.selectedItems, item],
    })),

  removeItem: (item) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((selectedItem) => selectedItem.id !== item.id),
    })),
}))
