import { useAssortmentTwoStore } from '../../store/useAssortmentTwoStore'
import AssortmentManagementTwoForm from '../AssortmentManagementTwoForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'


function AssortmentmanagementTwoModal() {
  const isOpen = useAssortmentTwoStore((state) => state.isOpen)
  const closeModal = useAssortmentTwoStore((state) => state.close)
  const mode = useAssortmentTwoStore((state) => state.mode)
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-full min-h-screen h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{mode} Assortment</DialogTitle>
          <AssortmentManagementTwoForm/>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AssortmentmanagementTwoModal
