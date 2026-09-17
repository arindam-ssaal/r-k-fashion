import { useDiscountAllocationList } from './components/DiscountAllocationList/store/useDiscountAllocationList'
import DiscountAllocationListModal from './components/DiscountAllocationListModal'
import DiscountAllocationTable from './components/DiscountAllocationTable'
import { useDiscountSelectionListStore } from './components/DiscountStoreSelectionList/store/useDiscountSelectionList'
import DiscountStoreSelectionModal from './components/DiscountStoreSelectionListModal'
import DiscountStoreSelectionTable from './components/DsicountStoreSelectionTable'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { GetAPI,PostAPI } from '../../../../../../../services/apiCall';




function DiscountAllocation() {
    const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
    const getCookieValue = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };

    const handleSave = async () => {
      const selectedStores = useDiscountSelectionListStore.getState().selectedStores;
      const selectedDiscounts =  useDiscountAllocationList.getState().selectedItems;    
      //console.log("Selected Store,Discount Names =>", selectedStores, selectedDiscounts);

      const transformedData = selectedDiscounts.length > 0 ? {
        discountID: selectedDiscounts[0].discountID,
        discountName: selectedDiscounts[0].name,
        storeName: "",
        enteredBy: getCookieValue("UserId"),
        usedFor: "I",
        discountAllocationDetails: selectedStores.map((store) => ({
          discountID: selectedDiscounts[0].discountID,
          storeID: store.storeID,
          storeName: store.storeName,
          fromDate: new Date(store.startDate).toISOString().split('T')[0].split('-').reverse().join('-'), //store.startDate,
          toDate: new Date(store.closeDate).toISOString().split('T')[0].split('-').reverse().join('-'), //store.closeDate,
          isDeallocated: "N",
        })),
      } : {};      
      console.log("Transformed Data =>", transformedData);
      try {
        //let cookies = '';
        const response = await PostAPI('/api/DiscountAllocationsRep/PostDiscountAllocations', '', transformedData, cookies);
        if (response.data[0].returnCode === "Y") {
          toast.success(`Discount allocation saved successfully!`, { style: { backgroundColor: '#e3ffea', color: '#3ed665' } });//response.data[0].returnMsg
        } else if (response.data[0].returnCode === "F") {
          toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
        } else if (response.data[0].returnCode === "N") {
          toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
        } else {
          toast.error('Failed to Save Discount allocation. Please try again.', { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
        }
      } catch (error) {
        //console.error("Error saving customer:", error);      
        toast.error(error.message, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      }
    }

  return (
    <div className="discount_allocation relative z-20">
      <h1>Discount Allocation</h1>
      <div className="grid grid-cols-2 gap-3 ">
        
        <div className="item p-3 border">
          <h1>Discount 1</h1>
          <DiscountAllocationTable />
        </div>
        <div className="item p-3 border">
        <h1>Discount 2</h1>
          <DiscountStoreSelectionTable />
        </div>
      </div>
      <div className='flex justify-end mt-3 gap-3'> 
        <Button onClick={handleSave}>Save</Button>
        {/* <Button variant={'outline'}>Reset</Button> */}
      </div>
      <DiscountAllocationListModal />
      <DiscountStoreSelectionModal />
    </div>
  )
}

export default DiscountAllocation
