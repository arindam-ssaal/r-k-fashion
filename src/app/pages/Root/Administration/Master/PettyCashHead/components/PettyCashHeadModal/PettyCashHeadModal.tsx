import { usePettyCashDataStore } from '../../store/usePettyCashDataStore'
import usePettyCashHead from '../../store/usePettyCashHead'
import PettyCashHeadForm from '../PettyCashHeadForm/PettyCashHeadFrom'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function PettyCashHeadModal() {
  const isOpen = usePettyCashHead((state) => state.isOpen)
  const modalMode = usePettyCashHead((state) => state.mode)
  const closeModal = usePettyCashHead((state) => state.close)
const clearId = usePettyCashDataStore((state) => state.clearCurrentPettyCashId)

  function handleClose() {
    closeModal()
    clearId()
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className=" max-w-full h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5  sticky top-0 left-0">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} PettyCash Head Master </h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <PettyCashHeadForm />
        </div>
        <DialogFooter className=" h-5 sticky bottom-0 right-0"></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default PettyCashHeadModal
