import { create } from 'zustand'

import { ProductModified } from '@/types/sales'

interface SalesState {
  selectedSalesData: ProductModified[] // Holds the selected sales data with quantity
  setSelectedSalesData: (products: ProductModified[]) => void // To set or update the data
  updateSelectedSalesData: (
    product: ProductModified,
    toggleSelectedItem: (id: string) => void
  ) => void
  // To update a specific product's quantity
  increaseQuantity: (id: string) => void // To increase the quantity of a product
  decreaseQuantity: (id: string, removeFromSearchItems: (id: string) => void) => void

  clearSelectedSalesData: () => void // To clear the selected sales data
  clearProduct: (id: string) => void
}

const useSales = create<SalesState>((set) => ({
  selectedSalesData: [],

  // Set or replace the entire selected sales data
  setSelectedSalesData: (products: ProductModified[]) => set({ selectedSalesData: products }),

  // Update a specific product's quantity or add it if not present
  updateSelectedSalesData: (
    newProduct: ProductModified,
    toggleSelectedItem: (id: string) => void
  ) =>
    set((state) => {
      const existingProduct = state.selectedSalesData.find((item) => item.id === newProduct.id)

      if (existingProduct) {
        // If the product exists, update the quantity and amount
        const updatedProducts = state.selectedSalesData.map((item) =>
          item.id === newProduct.id
            ? {
                ...item,
                quantity: item.quantity + newProduct.quantity,
                amount:
                  (item.quantity + newProduct.quantity) * (item.mrp + (item.mrp * 1) / 100),
              }
            : item
        )

        return {
          selectedSalesData: updatedProducts,
        }
      } else {
        // Add the product and also toggle selection in selectedSearchItems
        toggleSelectedItem(newProduct.id) // Ensures that the product is added to selectedSearchItems

        return {
          selectedSalesData: [...state.selectedSalesData, newProduct], // Add the new product
        }
      }
    }),

  // Increase the quantity of a specific product
  increaseQuantity: (id: string) =>
    set((state) => {
      const product = state.selectedSalesData.find((item) => item.id === id)
      if (product) {
        return {
          selectedSalesData: state.selectedSalesData.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  amount: (item.quantity + 1) * (item.mrp + (item.mrp * 1) / 100),
                }
              : item
          ),
        }
      }
      return state // No change if product not found
    }),

  // Decrease the quantity of a specific product and remove from useSalesSearchStore if quantity is 1
  decreaseQuantity: (id: string, removeFromSearchItems: (id: string) => void) =>
    set((state) => {
      const product = state.selectedSalesData.find((item) => item.id === id)
      if (product && product.quantity > 1) {
        return {
          selectedSalesData: state.selectedSalesData.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                  amount: (item.quantity - 1) * (item.mrp + (item.mrp * 1) / 100),
                }
              : item
          ),
        }
      } else if (product && product.quantity === 1) {
        // Remove the product from selectedSalesData and call removeFromSearchItems
        removeFromSearchItems(id)
        return {
          selectedSalesData: state.selectedSalesData.filter((item) => item.id !== id),
        }
      }

      // Always return the current state as a fallback, even if no update is made
      return state
    }),

  // Clear the selected sales data
  clearSelectedSalesData: () => set({ selectedSalesData: [] }),
  clearProduct: (id: string) =>
    set((state) => ({
      selectedSalesData: state.selectedSalesData.filter((item) => item.id !== id),
    })),
}))

export default useSales
