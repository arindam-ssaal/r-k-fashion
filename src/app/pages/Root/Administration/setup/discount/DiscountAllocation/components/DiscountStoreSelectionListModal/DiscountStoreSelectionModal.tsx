import { useDiscountAllocationStore } from "../../store/useDiscountAllocationStore";
import DiscountStoreSelectionList from "../DiscountStoreSelectionList/DiscountStoreSelectionList"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function DiscountStoreSelectionModal() {
  const isOpen=useDiscountAllocationStore(state=>state.isOpen2);
  const close=useDiscountAllocationStore(state=>state.close2);
  return (
    <Dialog open={isOpen} onOpenChange={close}>
    <DialogTrigger asChild>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[825px]">
      <DialogHeader>
        <DialogTitle>Store List</DialogTitle>
      </DialogHeader>
      <DiscountStoreSelectionList/>
      <DialogFooter>
        <Button type="button" onClick={close}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default DiscountStoreSelectionModal