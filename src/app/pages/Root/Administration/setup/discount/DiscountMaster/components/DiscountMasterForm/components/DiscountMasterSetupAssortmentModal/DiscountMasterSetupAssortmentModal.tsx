import DiscountMasterAssortmentList from '../DiscountMasterAssortmentList'
import useDiscountListStore from '../DiscountMasterAssortmentListTable/store/useDiscountListStore'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function DiscountMasterSetupAssortmentModal() {
  const isOpen = useDiscountListStore((state) => state.isOpen)
  const close = useDiscountListStore((state) => state.closeModal)
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Discount Assormment List</DialogTitle>
        </DialogHeader>
        <DiscountMasterAssortmentList />
      
      </DialogContent>
    </Dialog>
  )
}

export default DiscountMasterSetupAssortmentModal
