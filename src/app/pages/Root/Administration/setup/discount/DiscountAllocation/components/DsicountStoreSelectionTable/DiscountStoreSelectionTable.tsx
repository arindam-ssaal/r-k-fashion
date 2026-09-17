
import { useDiscountAllocationStore } from "../../store/useDiscountAllocationStore";
import { useDiscountSelectionListStore } from "../DiscountStoreSelectionList/store/useDiscountSelectionList";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


function DiscountStoreSelectionTable() {

  const openModal=useDiscountAllocationStore(state=>state.toggleOpen2);
  const selectedStores = useDiscountSelectionListStore(
    (state) => state.selectedStores
  );

  const updateStore = useDiscountSelectionListStore((state) => state.updateStore);
  //console.log("First check" + updateStore)
  const removeStore = useDiscountSelectionListStore((state) => state.removeStore);

  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Store</TableHead>
          <TableHead>From Date</TableHead>
          <TableHead>To Date</TableHead>
          <TableHead>Deallocate</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedStores.map((store, index) => (
          <TableRow key={store.storeID}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{store.storeName}</TableCell>
            <TableCell>
              <input
                type="date"
                value={
                  store.startDate
                    ? new Date(store.startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  updateStore(store.storeID, "startDate", e.target.value)
                }
              />
            </TableCell>
            <TableCell>
              <input
                type="date"
                value={
                  store.closeDate
                    ? new Date(store.closeDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  updateStore(store.storeID, "closeDate", e.target.value)
                }
              />
            </TableCell>
            <TableCell>
              <input
                type="checkbox"
                checked={!store.isActive}
                onChange={() =>
                  updateStore(store.storeID, "isActive", !store.isActive)
                }
              />
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeStore(store.storeID)}
              >
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>
            <Button onClick={openModal}>Add Store</Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );

}


export default DiscountStoreSelectionTable;
