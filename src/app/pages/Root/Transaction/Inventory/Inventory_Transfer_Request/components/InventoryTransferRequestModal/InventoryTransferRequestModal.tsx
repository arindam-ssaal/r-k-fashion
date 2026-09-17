import useInventoryTransferRequestType from '../../store/useInventoryTransferRequestType'
import InventoryTransferRequestForm from '../InventoryTransferRequestForm/InventoryTransferRequestForm'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function InventoryTransferRequestModal() {
  const isOpen = useInventoryTransferRequestType((state) => state.isOpen)
  const modalMode = useInventoryTransferRequestType((state) => state.mode)
  const closeModal = useInventoryTransferRequestType((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full overflow-y-auto max-h-screen p-0  gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Inventory Transfer Request</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {' '}
          <InventoryTransferRequestForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InventoryTransferRequestModal
