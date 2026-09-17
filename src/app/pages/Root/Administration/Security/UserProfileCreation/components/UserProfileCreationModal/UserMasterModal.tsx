import { useUserProfileCreationStore } from '../../store/useUserProfileCreationStore'
import UserMasterForm from '../UserProfileCreationForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'


function UserMasterModal() {
  const mode = useUserProfileCreationStore((state) => state.mode)
  const isOpen = useUserProfileCreationStore((state) => state.isOpen)
  const close = useUserProfileCreationStore((state) => state.close)
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-full h-screen block rounded-none overflow-y-scroll">
        <DialogHeader className='mb-8'>
          <DialogTitle>{mode} User Profile Creation</DialogTitle>
        </DialogHeader>
        <UserMasterForm />
      </DialogContent>
    </Dialog>
  )
}

export default UserMasterModal
