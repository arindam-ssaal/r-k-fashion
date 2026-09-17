import { useState } from "react";

import { useDiscountListStore } from "../DiscountMasterAssortmentListTable/store/useDiscountListStore";

import { useAssortmentData } from "@/components/AssortmentManagement/hooks_api/useAssortmentData";
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
import { FetchedAssortmentType } from "@/types/assortment";



function DiscountMasterAssortmentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const addSelectedAssortment = useDiscountListStore((state) => state.addSelectedAssortment);
  const closeModal = useDiscountListStore((state) => state.closeModal);
  const selectedAssortments = useDiscountListStore((state) => state.selectedAssortments);
  const { assortmentData, isLoading } = useAssortmentData("D");

  // ✅ Proper filtering with safety check
  const filteredAssortments = assortmentData?.filter((item) =>
    item.assortmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Properly structured `handleAdd`
  const handleAdd = (assortment: FetchedAssortmentType) => {
    const alreadyExists = selectedAssortments.some((item) => item.assortmentID === assortment.assortmentID);

    if (alreadyExists) return; // Prevent duplicate addition

    addSelectedAssortment({
      ...assortment,
      assortmentID: Number(assortment.assortmentID), // Ensure it's a number
      assortmentName:assortment.assortmentName
    });
    closeModal();
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search Assortments"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Assortment Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAssortments?.length > 0 ? (
              filteredAssortments?.map((item) => (
                <TableRow key={item.assortmentID}>
                  <TableCell>{item.assortmentID}</TableCell>
                  <TableCell>{item.assortmentName}</TableCell>
                  <TableCell>
                    <Button type="button" onClick={() => handleAdd(item)} variant="outline">
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No assortments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


export default DiscountMasterAssortmentList;
