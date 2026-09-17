import { toast } from 'sonner';

import ProductTable from './components/ProductTable';
import { useSalesTable } from './hooks/useSalesTable';

function SalesTable() {
  const { selectedSalesData, increaseQuantity, decreaseQuantity, error, isLoading } =
    useSalesTable();

  const renderContent = () => {
    if (isLoading) return <div>Loading products...</div>;
    if (error) {
      toast.error(`Error fetching products: ${error}`, {
        style: {
          backgroundColor: '#f7edeb',
          color: 'red',
        },
      });
      return <div>{error}</div>;
    }
    if (!selectedSalesData || selectedSalesData.length === 0) {
      return <h6 className="text-sm text-gray-500">No products selected.</h6>;
    }

    return (
      <div className="overflow-x-auto">
        <ProductTable
          data={selectedSalesData}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
        />
      </div>
    );
  };

  return (
    <div className="box min-h-[30rem] overflow-y-auto w-[600px]">
      <h2 className="heading-secondary mb-2">Scanned Products</h2>
      {renderContent()}
    </div>
  );
}

export default SalesTable;
