import { create } from 'zustand'

interface OrganizationPolicyState {
  currentOrganizationPolicyId: number | null // ✅ Current ID store karo
  setorganizationPolicyId: (id: number) => void // ✅ ID setter
  clearOrganizationPolicyId: () => void // ✅ ID reset
}

export const useOrganizationPolicyDataStore = create<OrganizationPolicyState>((set) => ({
    currentOrganizationPolicyId: null, // ✅ Initially null

  setorganizationPolicyId: (id) => set({ currentOrganizationPolicyId: id }),

  clearOrganizationPolicyId: () => set({ currentOrganizationPolicyId: null }),
}))
