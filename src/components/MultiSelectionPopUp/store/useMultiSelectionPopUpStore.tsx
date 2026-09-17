import { create } from "zustand";

interface MultiSelectionPopUpState {
  open: boolean;
  mode: 'add' | 'modify';
  toggle: (params: { mode: 'add' | 'modify'; open: boolean }) => void;
}

export const useMultiSelectionPopUpStore = create<MultiSelectionPopUpState>((set) => ({
  open: false,
  mode: 'add',
  toggle: ({ mode, open }) => set({ open, mode }),
}));
