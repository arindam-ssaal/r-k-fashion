import { create } from 'zustand'

interface OptionsType {
  selectedOption: string
  setSelectedOption: (option: string) => void
}

export const useSalesOptionStore = create<OptionsType>((set) => ({
  selectedOption: 'checkout',
  setSelectedOption: (option) => set(() => ({ selectedOption: option })),
}))
