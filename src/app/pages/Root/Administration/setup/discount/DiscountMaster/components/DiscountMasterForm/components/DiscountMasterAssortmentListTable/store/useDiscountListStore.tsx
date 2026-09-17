import { create } from "zustand";

import { FetchedAssortmentType } from "@/types/assortment";

type Assortment = FetchedAssortmentType;

type DiscountListType = {
  isOpen: boolean;
  currentRow: number | null;
  selectedAssortments: Assortment[];
  openModal: (rowIndex: number) => void;
  closeModal: () => void;
  addSelectedAssortment: (assortment: Assortment) => void;
  updateSelectedAssortment: (assortmentId: number, updatedData: Partial<Assortment>) => void;
  deleteSelectedAssortment: (assortmentId: number) => void;
  setSelectedAssortments: (assortments: Assortment[]) => void;
  clearAllAssortments: () => void; // Clear all selections
};

export const useDiscountListStore = create<DiscountListType>((set) => ({
  isOpen: false,
  currentRow: null,
  selectedAssortments: [],

  openModal: (rowIndex) =>
    set(() => ({
      isOpen: true,
      currentRow: rowIndex,
    })),

  closeModal: () =>
    set((state) => ({
      isOpen: false,
      currentRow: null,
      selectedAssortments: [...state.selectedAssortments], // Maintain existing selections
    })),

  // ✅ **Create (Add) Assortment (No Duplicates Allowed)**
  addSelectedAssortment: (assortment) =>
    set((state) => {
      const alreadyExists = state.selectedAssortments.some(
        (item) => item.assortmentID === assortment.assortmentID
      );

      if (alreadyExists) return state; // Prevent duplicates

      return { selectedAssortments: [...state.selectedAssortments, assortment] };
    }),

  // ✅ **Read (Get All Assortments)**
  setSelectedAssortments: (assortments) =>
    set(() => ({
      selectedAssortments: assortments, // Overwrite the entire array
    })),

  // ✅ **Update (Modify an Existing Assortment)**
  updateSelectedAssortment: (assortmentId, updatedData) =>
    set((state) => ({
      selectedAssortments: state.selectedAssortments.map((item) =>
        item.assortmentID === assortmentId ? { ...item, ...updatedData } : item
      ),
    })),

  // ✅ **Delete (Remove an Assortment by ID)**
  deleteSelectedAssortment: (assortmentID) =>
    set((state) => ({
      selectedAssortments: state.selectedAssortments.filter(
        (item) => item.assortmentID !== assortmentID
      ),
    })),

  // ✅ **Clear (Remove All Assortments)**
  clearAllAssortments: () =>
    set(() => ({
      selectedAssortments: [],
    })),
}));

export default useDiscountListStore;
