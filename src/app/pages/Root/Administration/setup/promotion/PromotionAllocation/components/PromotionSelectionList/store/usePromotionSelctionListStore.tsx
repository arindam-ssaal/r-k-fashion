import { create } from "zustand";

export interface Promotion {
  promotionID: number;
  promotionName: string;
}

interface PromotionSelectionListStore {
  promotions: Promotion[];
  selectedPromotions: Promotion[];
  isSelecting: boolean;
  selectedRowIndex: number | null;
  openSelector: (index: number) => void;
  closeSelector: () => void;
  setPromotions: (promotions: Promotion[]) => void;
  addSelectedPromotion: (index: number, promotion: Promotion) => void;
}

export const usePromotionSelectionListStore = create<PromotionSelectionListStore>((set) => ({
  promotions: [],
  selectedPromotions: [],
  isSelecting: false,
  selectedRowIndex: null,

  setPromotions: (promotions) => set({ promotions }),
  openSelector: (index) => set({ isSelecting: true, selectedRowIndex: index }),
  closeSelector: () => set({ isSelecting: false, selectedRowIndex: null }),
  
  addSelectedPromotion: (index: number, promotion: Promotion) =>
    set((state) => {
      if (!promotion) return state;

      const updated = [...state.selectedPromotions];
      updated[index] = promotion;

      return {
        selectedPromotions: updated,
      };
    }),
}));
