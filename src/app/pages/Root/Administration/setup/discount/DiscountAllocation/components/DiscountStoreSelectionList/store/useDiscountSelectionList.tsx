import { create } from "zustand";

interface Store {
  selectedStores: {
    storeID: number;
    storeName: string;
    //startDate: string;
    //closeDate: string;
    isActive: boolean;
  }[];
  addStore: (store: { storeID: number; storeName: string }) => void;
  updateStore: (
    id: number,
    field: keyof Store["selectedStores"][0],
    value: any
  ) => void;
  removeStore: (id: number) => void;
}

export const useDiscountSelectionListStore = create<Store>((set) => ({
  selectedStores: [],

  addStore: (store) =>
    set((state) => ({
      // Avoid duplicates and add default values for new fields
      selectedStores: state.selectedStores.some((s) => s.storeID === store.storeID)
        ? state.selectedStores
        : [
            ...state.selectedStores,
            { ...store, isActive: true },
          ],
    })),

  updateStore: (storeID, field, value) =>
    set((state) => ({
      selectedStores: state.selectedStores.map((s) =>
        s.storeID === storeID ? { ...s, [field]: value } : s
      ),
    })),

  removeStore: (id) =>
    set((state) => ({
      selectedStores: state.selectedStores.filter((store) => store.storeID !== id),
    })),
}));
