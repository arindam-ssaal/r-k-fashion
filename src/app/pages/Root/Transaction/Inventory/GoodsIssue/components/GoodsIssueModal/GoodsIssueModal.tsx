import useGoodsIssueType from '../../store/useGoodsIssueType'
import GoodsIssueForm from '../GoodsIssueForm/GoodsIssueForm'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function GoodsIssueModal() {
  const isOpen = useGoodsIssueType((state) => state.isOpen)
  const modalMode = useGoodsIssueType((state) => state.mode)
  const closeModal = useGoodsIssueType((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Goods Issue</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {' '}
          <GoodsIssueForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GoodsIssueModal
