import { useCreateRoleStore } from '../../../store/useCreateRoleStore'

import { Dialog, DialogContent } from '@/components/ui/dialog'

export const ViewRoleModal = () => {
  const isOpen = useCreateRoleStore((state) => state.isOpen)
  const toggleOpen = useCreateRoleStore((state) => state.toggleOpen)

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogContent>
        <h2 className="text-xl font-semibold">View Role</h2>
        <p>This is a blank modal content for viewing role.</p>
      </DialogContent>
    </Dialog>
  )
}
