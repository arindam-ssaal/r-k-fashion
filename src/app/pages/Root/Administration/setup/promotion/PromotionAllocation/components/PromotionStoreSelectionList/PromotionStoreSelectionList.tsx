import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  PromotionStoreType,
  usePromotionStoreSelectionListStore,
} from "./store/usePromotionStoreSelectionListStore";
import { usePromotionAllocationStore } from "../../store/usePromotionAllocationStore";

import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 5;

function PromotionStoreSelectionList() {
  const { getValues, setValue } = useFormContext();
  const selectedRowIndex = usePromotionStoreSelectionListStore(
    (state) => state.selectedRowIndex
  );
  const closeSelector = usePromotionStoreSelectionListStore(
    (state) => state.closeSelector
  );
  const close = usePromotionAllocationStore((state) => state.close2);

  const [promotions, setPromotions] = useState<PromotionStoreType[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionStoreType | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPromotions() {
      try {
        //const response = await fetch("http://dts.connectcloud365.com:53952/api/StoreMaster/GetAllStoreMaster");
        const response = await fetch(`${import.meta.env.VITE_SERVER_DEV}`+"/api/StoreMaster/GetAllStoreMaster");
        const data = await response.json();
        setPromotions(data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    }
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (selectedPromotion && selectedRowIndex !== null) {
      const currentStores = getValues("selectedPromotionStores") || [];

      currentStores[selectedRowIndex] = {
        ...currentStores[selectedRowIndex],
        storeID: selectedPromotion.storeID,
        storeName: selectedPromotion.storeName,
      };

      setValue("selectedPromotionStores", currentStores, { shouldValidate: true });
      closeModal();
    }
  }, [selectedPromotion]);

  function handleSelect(promotion: PromotionStoreType) {
    setSelectedPromotion(promotion);
  }

  function closeModal() {
    closeSelector();
    close();
  }

  // Pagination logic
  const totalPages = Math.ceil(promotions.length / ITEMS_PER_PAGE);
  const paginatedPromotions = promotions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="border p-4 mt-4">
      <ul className="space-y-3">
        {paginatedPromotions.map((promo) => (
          <li key={promo.storeID} className="flex justify-between items-center">
            <span>{promo.storeName}</span>
            <Button className="text-white" onClick={() => handleSelect(promo)}>
              Select
            </Button>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4 items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="back-red-600 text-c-white"
        >
          Previous
        </Button>
        <span className="text-sm text-c-black">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="back-red-600 text-c-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default PromotionStoreSelectionList;
