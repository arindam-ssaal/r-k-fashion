import usePurchaseOrderType from '../../store/usePurchaseOrderType'
import PurchaseOrderForm from '../PurchaseOrderForm/PurchaseOrderForm'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function PurchaseOrderModal() {
  const isOpen = usePurchaseOrderType((state) => state.isOpen)
  const modalMode = usePurchaseOrderType((state) => state.mode)
  const closeModal = usePurchaseOrderType((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Purchase Order</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {' '}
          <PurchaseOrderForm/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseOrderModal
