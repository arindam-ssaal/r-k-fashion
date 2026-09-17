import { useQueryClient } from '@tanstack/react-query'

import { useAssortmentManagementStore } from '../../../../store/useAssortmentManagementStore'
import AssortmentSearchFilter from '../AssortmentSearchFilter'
//import  AssortmentSelection from '../AssortmentSelection'


import { useGeneratedItemsDataStore } from '@/components/AssortmentManagement/hooks/useGeneratedItemsDataStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'


function AssortmentSelectionModal() {
  const queryClient = useQueryClient()
  const clearSelection = useGeneratedItemsDataStore((state) => state.clearSelections)
  const isOpen = useAssortmentManagementStore((state) => state.isOpen2)
  const close = useAssortmentManagementStore((state) => state.close2)

  function closeModal() {
    close()
    queryClient.setQueryData(['generatedAssortmentItems'], [])
    queryClient.setQueryData(['itemsGroupsProperties'], null)
    clearSelection()
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-full min-h-screen h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle> Assortments List</DialogTitle>
          <AssortmentSearchFilter setShow={() => {}} />
          {/* <AssortmentSelection /> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AssortmentSelectionModal
