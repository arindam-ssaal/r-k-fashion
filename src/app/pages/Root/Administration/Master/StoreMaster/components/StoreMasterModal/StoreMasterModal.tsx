import useStoreMasterStore from '../../store/useStoreMasterStore'
import StoreMasterForm from '../StoreMasterForm'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog'

function StoreMasterModal() {
  const isOpen = useStoreMasterStore((state) => state.isOpen)
 const modalMode = useStoreMasterStore((state) => state.mode)
  const closeModal = useStoreMasterStore((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Store Detail</h3>
          </DialogTitle>
          
          
        </DialogHeader>
        
        
        <div className="px-6">
          {' '}
          <StoreMasterForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StoreMasterModal
