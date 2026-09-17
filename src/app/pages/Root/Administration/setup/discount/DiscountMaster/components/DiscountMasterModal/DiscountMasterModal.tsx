import { useDiscountMasterStore} from '../../store/useDiscountMasterStore'
import DiscountMasterForm from '../DiscountMasterForm'

import {
  Dialog,
  DialogContent,
 // DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function DiscountMasterModal() {
  const isOpen = useDiscountMasterStore((state) => state.isOpen)
  const modalMode = useDiscountMasterStore((state) => state.mode)
  const closeModal = useDiscountMasterStore((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
    <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
      <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
        <DialogTitle>
          <h3 className="text-xl capitalize">{modalMode} Discount Master</h3>
        </DialogTitle>
        
        
      </DialogHeader>
      
      
      <div className="px-6">
      <DiscountMasterForm />
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default DiscountMasterModal
