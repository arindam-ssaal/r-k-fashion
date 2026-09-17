import usePurchaseRequestType from '../../store/usePurchaseRequestType'
import PurchaseRequestForm from '../PurchaseRequestForm'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function PurchaseRequestModal() {
  const isOpen = usePurchaseRequestType((state) => state.isOpen)
  const modalMode = usePurchaseRequestType((state) => state.mode)
  const closeModal = usePurchaseRequestType((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Purchase Request</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {' '}
        <PurchaseRequestForm/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseRequestModal
