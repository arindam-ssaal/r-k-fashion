import { create } from "zustand";

interface ImageUploaderState {
  image: string | null; // Base64 string or null
  isLoading: boolean;
  setImage: (img: string | null) => void; // Update the image in the store
  setLoading: (loading: boolean) => void; // Update the loading state
}

const useImageUploaderState = create<ImageUploaderState>((set) => ({
  image: localStorage.getItem("app_icon") || null, // Load image from localStorage initially
  isLoading: false,
  setImage: (img: string | null) => {
    // Update state and sync with localStorage
    if (img) {
      localStorage.setItem("app_icon", img);
    } else {
      localStorage.removeItem("app_icon");
    }
    set({ image: img });
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export default useImageUploaderState;
