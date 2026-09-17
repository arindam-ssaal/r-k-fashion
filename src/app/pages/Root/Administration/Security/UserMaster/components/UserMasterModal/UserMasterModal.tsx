import { useUserMasterStore } from '../../store/useUserMasterStore'
import UserMaterForm from '../UserMasterForm/UserMasterForm'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'



function UserMasterModal() {
  const mode = useUserMasterStore((state) => state.mode)
  const isOpen = useUserMasterStore((state) => state.isOpen)
  const close = useUserMasterStore((state) => state.close)
//const clearId=useDesignationMasterDataStore((state)=>state.clearCurrentDesignationMasterId)

function handleClose(){
  close();
 // clearId()
}

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-screen p-0 m-0 gap-0 rounded-none border-0 shadow-none flex flex-col overflow-hidden bg-[#d6eaf8] [&>button]:top-6 [&>button]:right-6 [&>button]:text-white [&>button]:opacity-100 [&>button:hover]:bg-white/20 [&>button:focus]:ring-white">
        <DialogHeader className="px-6 py-4 flex-shrink-0 bg-gradient-to-r from-[#0b2f79] to-[#2f66dc] text-white">
          <DialogTitle className="text-2xl font-semibold">{mode} User Masters</DialogTitle>
          <p className="text-sm text-white/90">Manage users and access setup</p>
        </DialogHeader>
        <div className="flex-1 overflow-hidden px-6 pt-6 pb-4">
          <UserMaterForm/>
        </div>
        <div className="flex-shrink-0 border-t border-slate-300 bg-[#fff] px-6 py-3">
          <div className="flex justify-end gap-3">
            <Button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" form="user-master-form" className="btn btn-primary" disabled={mode === 'View'}>
              Save
            </Button>
          </div>
        </div>
      
      </DialogContent>
    </Dialog>
  )
}

export default UserMasterModal
