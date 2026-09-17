//import { useItemMaster } from '../../store/useItemMaster'
// import Communication from '../CustomerForm/components/Communication'
// import LoyaltyPoints from '../CustomerForm/components/LoyaltyPoints/LoyaltyPoints'
// import Membership from '../CustomerForm/components/MemberShip'
// import Personal from '../CustomerForm/components/Personal'
// import PurchaseHistory from '../CustomerForm/components/PurchaseHistory'

// import ItemDetailsTab from '../ItemMasterForm/components/ItemDetaills/components/ItemDetails'
// import ItemRemarksTab from '../ItemMasterForm/components/ItemRemarks/components/ItemRemarks/ItemRemarksTab'
// import PropertyDetails from '../ItemMasterForm/components/PropertyDetails'

// import { Button } from '@/components/ui/button'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import mapItemMasterFetchedTypeToTableData from '../../helper/ItemMasterDataTbleExtracter'
//import { useItemData } from "../../hooks_api/useItemData";
import { useItemDataById } from '../../hooks_api/useItemDataById'
import { useItemMaster } from '../../store/useItemMaster'
import { useItemMasterDataStore } from '../../store/useItemMasterDataStore'
//import { useItemMasterDataStore } from "../../store/useItemMasterDataStore";
import ItemMasterTableViewer from '../ItemMasterTable/components/ItemMasterTableViewer'
import { ItemTableData } from '../ItemMasterTable/components/ItemMasterTableViewer/ItemMasterTableViewer'

import { Button } from '@/components/ui/button'

function ItemMasterTab() {
  const mode = useItemMaster((state) => state.mode)
  const itemId = useItemMasterDataStore((state) => state.currentItemMasterId)
  const { itemMasterById, isLoading } = useItemDataById(itemId)
  
  //console.log("itemId:", itemId, itemMasterById)
  // const closeModal = useItemData((state) =>     state.close)
  //const { isPending } = useItemMasterDataStore()
  
  const modalToggler = useItemMaster((state) => state.toggleOpen)
  const setModalMode = useItemMaster((state) => state.setMode)

  function closeModal() {
    modalToggler()
    setModalMode('View')
  }

  if (!isLoading && mode === 'View') {
    if (!itemMasterById) return <h3>No data available</h3> // ✅ Handle undefined case

    const formattedCustomerData: ItemTableData = Array.isArray(itemMasterById)
      ? mapItemMasterFetchedTypeToTableData(itemMasterById[0]) // ✅ Extract first element
      : mapItemMasterFetchedTypeToTableData(itemMasterById) // ✅ Direct mapping if object
    return (
      <h3>
        <ItemMasterTableViewer data={formattedCustomerData} />
      </h3>
    )
  }
  return (
    <>
      <div className="h-[60px] bottom-0 right-0 flex gap-3 justify-end items-center border border-red-500">
        <Button type="submit" className="btn btn-primary">
          {/* {isPending ? 'Submitting...' : 'Submit'} */}
        </Button>
        <Button onClick={closeModal}>Cancel</Button>
      </div>
      {/* Handle error message if needed */}
    </>
  )
}
export default ItemMasterTab
