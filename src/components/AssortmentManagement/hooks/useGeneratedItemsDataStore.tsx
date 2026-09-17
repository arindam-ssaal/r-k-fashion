import { create } from 'zustand'

export type SelectionStatus = 'default' | 'included' | 'excluded'

interface GeneratedItemsStore {
  selections: Record<string, SelectionStatus>
  setSelection: (itemCode: string, status: SelectionStatus) => void
  removeSelection: (itemCode: string) => void
  clearSelections: () => void
  initializeSelections: (items: { itemCode: string }[]) => void
}

export const useGeneratedItemsDataStore = create<GeneratedItemsStore>((set) => ({
  selections: {},

  setSelection: (itemCode, status) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [itemCode]: status,
      },
    })),

  removeSelection: (itemCode) =>
    set((state) => {
      const newSelections = { ...state.selections }
      delete newSelections[itemCode]
      return { selections: newSelections }
    }),

  clearSelections: () =>
    set(() => ({
      selections: {},
    })),

  initializeSelections: (items) =>
    set(() => {
      const initialSelections: Record<string, SelectionStatus> = {}
      items.forEach((item) => {
        initialSelections[item.itemCode] = 'included'
      })
      return { selections: initialSelections }
    }),
}))