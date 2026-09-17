import { usePromotionAllocationStore } from "../../store/usePromotionAllocationStore"
import PromotionSelectionList from "../PromotionSelectionList";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


function PromotionSelectionModal() {
    
    const isOpen=usePromotionAllocationStore(state=>state.isOpen);
    const closeModal=usePromotionAllocationStore(state=>state.close);

    return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Promotion Selection</DialogTitle>
         
        </DialogHeader>
       
     <PromotionSelectionList/>
      </DialogContent>
    </Dialog>
  )
}

export default PromotionSelectionModal