import { create } from 'zustand'

// Define the interface for the state
interface SalesMultiStepState {
  step: number // Current step number
  nextStep: () => void // Function to go to the next step
  prevStep: () => void // Function to go to the previous step
  setStep: (step: number) => void // Set a specific step
}

// Create the Zustand store with initial state and actions
const useSalesMultiStep = create<SalesMultiStepState>((set) => ({
  step: 1, // Initialize with step 1
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setStep: (step) => set(() => ({ step })),
}))

export default useSalesMultiStep
