import { usePaymodeMasterDataStore } from '../../store/usePaymentMethodStore'
import { usePaymodeMaster } from '../../store/usePaymodeMaster'
import PaymodeMasterForm from '../PaymodeMasterForm/PaymodeMasterForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function PaymodeModal() {
  const isOpen = usePaymodeMaster((state) => state.isOpen)
  const closeModal = usePaymodeMaster((state) => state.close)
  const modalMode = usePaymodeMaster((state) => state.mode)
  const clearID = usePaymodeMasterDataStore((state) => state.clearCurrentPaymodeMasterId)

  const handleModal = () => {
    closeModal()
    clearID()
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleModal} >
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Paymode Master</h3>
          </DialogTitle>
          
          
        </DialogHeader>
        
        
        <div className="px-6">
          {' '}
          <PaymodeMasterForm />
        </div>
      </DialogContent>
    </Dialog>
    
  )
}

export default PaymodeModal
