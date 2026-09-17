import { useAssortmentManagementStore } from '../../store/useAssortmentManagementStore'
import AssortmentManagementForm from '../AssortmentMangementForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const assortments = {
  P: 'Promotion',
  S: 'SalesPerson',
  D: 'Discount',
}
  
function AssortmentManagementModal({ type }: { type: 'P' | 'S' | 'D' }) {
  const isOpen = useAssortmentManagementStore((state) => state.isOpen)
  const closeModal = useAssortmentManagementStore((state) => state.close)
  const mode = useAssortmentManagementStore((state) => state.mode)
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-full min-h-screen h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {mode} {assortments[type]} Assortment
          </DialogTitle>
          <AssortmentManagementForm type={type} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AssortmentManagementModal
