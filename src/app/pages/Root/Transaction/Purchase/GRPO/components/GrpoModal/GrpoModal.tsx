import useGrpoType from '../../store/useGrpoType'
import GrpoRequestForm from '../GrpoRequestForm'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function GrpoModal() {
  const isOpen = useGrpoType((state) => state.isOpen)
  const modalMode = useGrpoType((state) => state.mode)
  const closeModal = useGrpoType((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} GRPO</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {' '}
       <GrpoRequestForm/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GrpoModal
