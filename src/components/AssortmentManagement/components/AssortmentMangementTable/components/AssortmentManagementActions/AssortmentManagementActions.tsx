import { MoreHorizontal } from 'lucide-react'

import { useFetchAssortmentDataById } from '../../../../hooks_api/useAssortmentDataById'
import { useCreateAssortment } from '../../../../hooks_api/useCreateAssortment'
import { useAssortmentManagementDataStore } from '../../../../store/useAssortmentManagementDataStore'
import { useAssortmentManagementStore } from '../../../../store/useAssortmentManagementStore'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  //DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FetchedAssortmentType } from '@/types/assortment'

function AssortmentManagementTableActions({ assortment,type }: { assortment: FetchedAssortmentType,type:'S'|'P'|'D' }) {
  const { setCurrentAssortmentId } = useAssortmentManagementDataStore()
  const { fetchAssortmentDataById } = useFetchAssortmentDataById(type)
  const { createAssortment } = useCreateAssortment()
  const openModal = useAssortmentManagementStore((state) => state.toggleOpen)
  const setMode = useAssortmentManagementStore((state) => state.setMode)

  function editHandler() {
    openModal()
    setCurrentAssortmentId(assortment.assortmentID)
    setMode('Edit')
  }
  function viewHandler() {
    openModal()
    setCurrentAssortmentId(assortment.assortmentID)
    setMode('View')
  }
  async function deleteHandler() {
    setMode('Delete')
    try {
      const data = await fetchAssortmentDataById(assortment.assortmentID)
      const newData = {
        ...data,
        usedFor: 'D',
      }
      await createAssortment(newData)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={viewHandler}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={editHandler}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={deleteHandler}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default AssortmentManagementTableActions
