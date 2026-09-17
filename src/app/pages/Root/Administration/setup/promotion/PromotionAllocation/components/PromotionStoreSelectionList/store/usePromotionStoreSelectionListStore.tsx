import { create } from "zustand";

export interface PromotionStoreType {
  storeID: number;
  storeName: string;
  startDate: string;
  closeDate: string;
  allocationType: "N" | "H"; //"normal" | "happy-hour";
  deallocate: boolean;
}

interface PromotionStoreSelectionListStoreType {
  promotions: PromotionStoreType[];
  selectedPromotions: PromotionStoreType[];
  isSelecting: boolean;
  selectedRowIndex: number | null;
  openSelector: (index: number) => void;
  closeSelector: () => void;
  setPromotions: (promotions: PromotionStoreType[]) => void;
  addSelectedPromotion: (index: number, promotion: PromotionStoreType) => void;
  updateSelectedPromotion: (index: number, field: keyof PromotionStoreType, value: any) => void;
  removeSelectedPromotion: (index: number) => void;
  resetSelections: () => void;
}

export const usePromotionStoreSelectionListStore = create<PromotionStoreSelectionListStoreType>((set) => ({
  promotions: [],
  selectedPromotions: [],
  isSelecting: false,
  selectedRowIndex: null,

  setPromotions: (promotions) => set({ promotions }),

  openSelector: (index) => set({ isSelecting: true, selectedRowIndex: index }),
  closeSelector: () => set({ isSelecting: false, selectedRowIndex: null }),

  addSelectedPromotion: (index, promotion) =>
    set((state) => {
      if (!promotion || index < 0) return state;

      const updated = [...state.selectedPromotions];

      while (updated.length <= index) {
        updated.push({
          storeID: 0,
          storeName: "",
          startDate: "",
          toDate: "",
          allocationType: "N", //"normal"
          deallocate: false,
        });
      }

      updated[index] = promotion;

      return { selectedPromotions: updated };
    }),

  updateSelectedPromotion: (index, field, value) =>
    set((state) => {
      if (index < 0 || index >= state.selectedPromotions.length) return state;

      const updated = [...state.selectedPromotions];
      updated[index] = { ...updated[index], [field]: value };

      return { selectedPromotions: updated };
    }),

  removeSelectedPromotion: (index) =>
    set((state) => {
      if (index < 0 || index >= state.selectedPromotions.length) return state;

      const updated = [...state.selectedPromotions];
      updated.splice(index, 1);

      return { selectedPromotions: updated };
    }),

  resetSelections: () => set({ selectedPromotions: [] }),
}));
