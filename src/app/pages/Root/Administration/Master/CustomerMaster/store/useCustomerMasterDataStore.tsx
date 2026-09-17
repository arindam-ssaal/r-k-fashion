import { create } from 'zustand'


interface CustomerMasterState {
  currentCustomerMasterId: number | null // ✅ Current ID store karo
  setCurrentCustomerMasterId: (id: number) => void // ✅ ID setter
  clearCurrentCustomerMasterId: () => void // ✅ ID reset
}

export const useCustomerMasterDataStore = create<CustomerMasterState>((set) => ({
  currentCustomerMasterId: null, // ✅ Initially null

  setCurrentCustomerMasterId: (id) => set({ currentCustomerMasterId: id }),

  clearCurrentCustomerMasterId: () => set({ currentCustomerMasterId: null }),
}))
