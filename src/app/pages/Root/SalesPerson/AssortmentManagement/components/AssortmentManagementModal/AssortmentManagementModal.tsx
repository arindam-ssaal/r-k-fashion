import { useAssortmentManagementStore } from '../../store/useAssortmentManagement'
import AssortmentManagementForm from '../AssortmentManagementForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'


function AssortmentManagementModal() {
  const isOpen = useAssortmentManagementStore((state) => state.isOpen)
  const closeModal = useAssortmentManagementStore((state) => state.close)
  const mode = useAssortmentManagementStore((state) => state.mode)
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-full min-h-screen h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{mode} Assortment</DialogTitle>
          <AssortmentManagementForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AssortmentManagementModal
