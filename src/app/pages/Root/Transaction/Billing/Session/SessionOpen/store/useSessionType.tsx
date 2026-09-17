import { create } from 'zustand'

type SessionIssueType = {
  isOpen: boolean
  mode: 'Edit' | 'Create' | 'View'
  floatingAmount: number
  expenses: number
  toggleOpen: () => void
  close: () => void
  setMode: (newMode: 'Edit' | 'Create' | 'View') => void
  setFloatingAmount: (amount: number) => void
  setExpenses: (amount: number) => void
}
export const useSessionType = create<SessionIssueType>((set) => ({
  isOpen: false,
  mode: 'Create',
  floatingAmount: 0,
  expenses: 0,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set(() => ({ isOpen: false })),
  setMode: (newMode) => set(() => ({ mode: newMode })),
  setFloatingAmount: (amount) => set(() => ({ floatingAmount: amount })),
  setExpenses: (amount) => set(() => ({ expenses: amount })),
}))

export default useSessionType
