import { useState, useEffect } from "react";

import { useDiscountSelectionListStore } from "./store/useDiscountSelectionList";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DiscountStoreSelectionList() {
  const selectedStores = useDiscountSelectionListStore((state) => state.selectedStores);
  const addStore = useDiscountSelectionListStore((state) => state.addStore);
  const removeStore = useDiscountSelectionListStore((state) => state.removeStore);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stores, setStores] = useState<{ storeID: string; storeName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        //const response = await fetch(" http://dts.connectcloud365.com:53952/api/StoreMaster/GetAllStoreMaster"); // Replace with actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_SERVER_DEV}`+"/api/StoreMaster/GetAllStoreMaster");
        const data = await response.json();
        //console.log(data)
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStores = filteredStores.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search stores..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4"
      />
      {loading ? (
        <p>Loading stores...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStores.map((store, index) => (
                <TableRow key={store.storeID}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{store.storeName}</TableCell>
                  <TableCell>
                    <Button
                      variant={selectedStores.some((s) => s.storeID === store.storeID) ? "destructive" : "outline"}
                      onClick={() =>
                        selectedStores.some((s) => s.storeID === store.storeID) ? removeStore(store.storeID) : addStore(store)
                      }
                    >
                      {selectedStores.some((s) => s.storeID === store.storeID) ? "Unselect" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default DiscountStoreSelectionList;