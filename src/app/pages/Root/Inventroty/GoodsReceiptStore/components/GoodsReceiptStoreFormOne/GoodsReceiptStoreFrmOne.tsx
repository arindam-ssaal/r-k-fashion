


//import GrpoRequestForm from '../../../GRPO/components/GrpoRequestForm'
import useGoodsReceiptStoreType from '../../store/useGoodsReceiptStoreType'
//import GoodsReceiptStoreForm from '../GoodsReceiptStoreForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function GoodsReceiptStoreFrmOne() {
  const isOpen = useGoodsReceiptStoreType((state) => state.isOpen)
  //const modalMode = useGoodsReceiptStoreType((state) => state.mode)
  const closeModal = useGoodsReceiptStoreType((state) => state.close)
//console.log(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white">
          <DialogTitle>
            {/* <h3 className="text-xl capitalize">{modalMode} Goods Receipt</h3> */}
            <h3 className="text-xl capitalize"> Goods Receipt</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {/* <GoodsReceiptStoreForm/> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GoodsReceiptStoreFrmOne
 