import { usePromotionSetupStore } from '../../store/usePromotionSetupStore'
import PromotionSetupForm from '../PromotionSetupForm/PromotionSetupForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function PromotionSetupModal() {
  const isOpen = usePromotionSetupStore((state) => state.isOpen)
  const modalMode = usePromotionSetupStore((state) => state.mode)
  const closeModal = usePromotionSetupStore((state) => state.close)
  const prev = usePromotionSetupStore((state) => state.prev)

  function handleCloseModal(){
    closeModal()
prev();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0" style={{ backgroundColor: '#0ea5e9', zIndex: 10 }}>
          <DialogTitle>
            <h3 className="text-xl capitalize" style={{ color: 'white' }}>{modalMode} Promotion Setup Modal</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {' '}
          <PromotionSetupForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PromotionSetupModal
