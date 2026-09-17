import { useAssortmentThreeStore } from '../../store/useAssortmentThreeStore'
import AssortmentmanagementThreeForm from '../AssortmentmanagementThreeForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'


function AssortmentmanagementThreeModal() {
  const isOpen = useAssortmentThreeStore((state) => state.isOpen)
  const closeModal = useAssortmentThreeStore((state) => state.close)
  const mode = useAssortmentThreeStore((state) => state.mode)
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-full min-h-screen h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{mode} Assortment</DialogTitle>
          <AssortmentmanagementThreeForm/>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AssortmentmanagementThreeModal
