import {  useItemMaster } from '../../store/useItemMaster'
import ItemMasterForm from '../ItemMasterForm'


import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'

function ItemMasterModal() {
    const isOpen = useItemMaster((state) => state.isOpen)
      const modalMode = useItemMaster((state) => state.mode)
      const closeModal = useItemMaster((state) => state.close)

    return (
 <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-full  h-screen overflow-y-scroll p-0 flex flex-col gap-0">
        <DialogHeader className="p-5 border-b border-gray-50 sticky top-0 left-0 bg-white z-10">
          <DialogTitle>
            <h3 className="text-xl capitalize">{modalMode} Item Master </h3>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <ItemMasterForm/>
          
        </div>

        <DialogFooter className="bg-white h-5 sticky bottom-0 right-0"></DialogFooter>
      </DialogContent>
    </Dialog>
    )
}
export default ItemMasterModal