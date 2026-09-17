import { create } from 'zustand'

interface RefetchStore {
  triggers: Record<string, number>
  triggerRefetch: (key: string) => void
}

export const useRefetchStore = create<RefetchStore>((set) => ({
  triggers: {},

  triggerRefetch: (key: string) =>
    set((state) => {
      console.log(`🔄 Triggering refetch for key: ${key}`);
      if (!key || key.trim() === '') {
        console.warn('⚠️ TriggerRefetch skipped due to invalid key');
        return state;
      }
      const newTrigger = (state.triggers[key] || 0) + 1;
      console.log(`New trigger value for ${key}: ${newTrigger}`);
      return {
        triggers: {
          ...state.triggers,
          [key]: newTrigger,
        },
      }
    }),
}))
