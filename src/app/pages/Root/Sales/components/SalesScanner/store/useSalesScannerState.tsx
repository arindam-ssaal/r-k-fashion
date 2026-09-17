import { create } from 'zustand'

interface SidebarState {
  scanID: string // Store for scan ID
  setScanID: (id: string) => void // Function to update the scan ID
}

// Create Zustand store
const useSalesScannerState = create<SidebarState>((set) => ({
  scanID: '', // Initial state for scan ID
  setScanID: (id: string) => set({ scanID: id }), // Function to update scan ID
}))

export default useSalesScannerState
