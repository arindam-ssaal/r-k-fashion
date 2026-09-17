import { toast } from 'sonner'

import ProductTable from './components/ProductTable'
import { useSalesTable } from './hooks/useSalesTable'

function SalesTable() {
  const { selectedSalesData, increaseQuantity, decreaseQuantity, error, isLoading } =
    useSalesTable()

  const renderContent = () => {
    if (isLoading) return <div>Loading products...</div>
    if (error) {
      toast.error(`Error fetching products: ${error}`, {
        style: {
          backgroundColor: '#f7edeb',
          color: 'red',
        },
      })
      return <div>{error}</div>
    }
    if (!selectedSalesData || selectedSalesData.length === 0) {
      return <h6 className="text-sm text-gray-500">No products selected.</h6>
    }

    return (
      <ProductTable
        data={selectedSalesData} // Ensure this is typed correctly
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
      />
    )
  }

  return (
    <div className="box min-h-[30rem] ">
      <h2 className="heading-secondary mb-2">Scanned Products</h2>
      {renderContent()}
    </div>
  )
}

export default SalesTable
