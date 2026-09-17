import { useState, useEffect } from 'react';

import { useDiscountAllocationList, DiscountItem } from './store/useDiscountAllocationList';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function DiscountAllocationList() {
  const selectedItems: DiscountItem[] = useDiscountAllocationList(state => state.selectedItems);
  const addItem = useDiscountAllocationList(state => state.addItem);
  const removeItem = useDiscountAllocationList(state => state.removeItem);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<{ discountID: number; discountName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        //const response = await fetch('http://dts.connectcloud365.com:53952/api/Discount/GetAllDiscount');
        const response = await fetch(`${import.meta.env.VITE_SERVER_DEV}`+'/api/Discount/GetAllDiscount');
        const data = await response.json();
        setItems(data);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelect = async (item: { discountID: number; discountName: string }) => {
    try {
      addItem({ discountID: item.discountID, name: item.discountName });
    } catch (error) {
      console.error('Failed to select item', error);
    }
  };

  const handleUnselect = async (item: { discountID: number; discountName: string }) => {
    try {
      removeItem(item);
    } catch (error) {
      console.error('Failed to unselect item', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isSelected = (discountID: number): boolean => selectedItems.some((item: DiscountItem) => item.discountID === discountID);

  // Filtered Items based on search term
  const filteredItems = items.filter((item) =>
    item.discountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      {/* Loading & Error Handling */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => (
                <TableRow key={item.discountID}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{item.discountName}</TableCell>
                  <TableCell>
                    {isSelected(item.discountID) ? (
                      <Button size="sm" variant="outline" onClick={() => handleUnselect(item)}>
                        Unselect
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleSelect(item)}>
                        Select
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No items found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Pagination Controls */}
      {!loading && !error && (
        <div className="flex justify-between items-center mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default DiscountAllocationList;
