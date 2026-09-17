
import { useDiscountAllocationStore } from '../../store/useDiscountAllocationStore';
import DicsountAllocationList from '../DiscountAllocationList/DicsountAllocationList'

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'


function DiscountAllocationListModal() {
    const isOpen=useDiscountAllocationStore(state=>state.isOpen);
    const close=useDiscountAllocationStore(state=>state.close);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[805px]">
        <DialogHeader>
          <DialogTitle>Discount Selection</DialogTitle>
        </DialogHeader>
        <DicsountAllocationList />
        <DialogFooter>
          <Button onClick={close}>Save</Button>
          <Button type="button" onClick={close}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DiscountAllocationListModal
