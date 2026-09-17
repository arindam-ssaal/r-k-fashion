import { useDesignationMasterDataStore } from '../../store/useDesignationDataStore'
import { useDesignationStore } from '../../store/userDesignation'
import DesignationForm from '../DesignationForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function DesignationModal() {
  const mode = useDesignationStore((state) => state.mode)
  const isOpen = useDesignationStore((state) => state.isOpen)
  const close = useDesignationStore((state) => state.close)
  const clearId = useDesignationMasterDataStore((state) => state.clearCurrentDesignationMasterId)

  function handleClose() {
    close()
    clearId()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95%] max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg lg:text-xl text-center sm:text-left">
            {mode} Designation Master
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <DesignationForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DesignationModal