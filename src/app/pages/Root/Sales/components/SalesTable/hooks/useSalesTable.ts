import { useEffect } from 'react'
import { toast } from 'sonner'

import { useSalesData } from '../../../api/useSalesData'
import useSales from '../../../store/useSales'
import useSalesScannerState from '../../SalesScanner/store/useSalesScannerState'
import useSearchItemsStore from '../../SalesSearchTable/store/useSearchItems'

import { ProductModified } from '@/types/sales'

function useSalesTable() {
  const { salesData, error, isLoading } = useSalesData()

  const scanID = useSalesScannerState((state) => state.scanID) // Sales Scanner
  const setScanID = useSalesScannerState((state) => state.setScanID)

  const selectedSalesData = useSales((state) => state.selectedSalesData)
  const updateSelectedSalesData = useSales((state) => state.updateSelectedSalesData)
  const clearProduct = useSales((state) => state.clearProduct)
  const increaseQuantity = useSales((state) => state.increaseQuantity)
  const decreaseQuantity = useSales((state) => state.decreaseQuantity)

  const { selectedSearchItems, toggleSelectedItem } = useSearchItemsStore() // From Sales Search

  // Update selected sales data when a product is scanned
  useEffect(() => {
    if (!scanID || !salesData) return

    const selectedProduct = salesData.find((item) => item.itemCode === scanID)

    if (!selectedProduct) {
      toast.error('There is no product with this No.')
      return
    }

    // Prepare the new product to be added
    const newProduct: ProductModified = {
      ...selectedProduct,
      quantity: 1,
      amount: selectedProduct.mrp + (selectedProduct.mrp * selectedProduct.gst) / 100,
    }

    // Add product to selectedSalesData and toggle the selected item in useSearchItemsStore
    updateSelectedSalesData(newProduct, toggleSelectedItem)

    // Clear scanID after processing
    setScanID('')
  }, [scanID, salesData, setScanID, updateSelectedSalesData, toggleSelectedItem])

  // Sync selectedSearchItems from useSalesSearchStore with useSales store
  // Sync selectedSearchItems with selectedSalesData
  useEffect(() => {
    if (!selectedSearchItems || !salesData) return

    console.log('Syncing selectedSearchItems:', selectedSearchItems)

    // Add newly selected products to useSales
    selectedSearchItems.forEach((id) => {
      const selectedProduct = salesData.find((item) => item.id === id)
      if (selectedProduct) {
        const existingProduct = selectedSalesData.find((p) => p.id === id)
        if (!existingProduct) {
          const newProduct: ProductModified = {
            ...selectedProduct,
            quantity: 1, // Default quantity
            amount: selectedProduct.mrp + (selectedProduct.mrp * selectedProduct.gst) / 100,
          }

          // Only call updateSelectedSalesData if the product doesn't already exist in sales
          updateSelectedSalesData(newProduct, () => {}) // Don't toggle again inside this effect
        }
      }
    })

    // Careful Removal Logic: Only remove if the item is confirmed to be deselected
    selectedSalesData.forEach((product) => {
      if (!selectedSearchItems.includes(product.id)) {
        console.log(`Removing product ${product.id} from selectedSalesData`)
        clearProduct(product.id)
      }
    })
  }, [selectedSearchItems, salesData, selectedSalesData, updateSelectedSalesData, clearProduct])

  return {
    salesData,
    selectedSalesData,
    increaseQuantity,
    decreaseQuantity: (id: string) => decreaseQuantity(id, toggleSelectedItem),
    error,
    isLoading,
  }
}

export { useSalesTable }
