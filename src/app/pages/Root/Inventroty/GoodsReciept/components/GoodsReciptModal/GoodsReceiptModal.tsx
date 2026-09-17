//import GoodsIssueForm from '../GoodsIssueForm/GoodsIssueForm'

import useGoodsReceiptType from '../../store/useGoodsReceiptType'
import GoodsReciptForm from '../GoodsReciptForm'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function GoodsReciptModal() {
  const isOpen = useGoodsReceiptType((state) => state.isOpen)
  const modalMode = useGoodsReceiptType((state) => state.mode)
  const closeModal = useGoodsReceiptType((state) => state.close)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Goods Recipt</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {' '}
          <GoodsReciptForm/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GoodsReciptModal
