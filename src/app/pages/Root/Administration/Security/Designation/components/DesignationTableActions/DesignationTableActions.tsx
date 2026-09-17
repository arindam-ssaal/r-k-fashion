import { MoreHorizontal } from 'lucide-react'

import { useCreateDesignation } from '../../hooks_api/useCreateDesignation'
import { useFetchDesignationById } from '../../hooks_api/useDesignationData'
import { useDesignationMasterDataStore } from '../../store/useDesignationDataStore'
import { useDesignationStore } from '../../store/userDesignation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FetchedDesignationType } from '@/types/designation'

function DesignationTableActions({ designation }: { designation: FetchedDesignationType }) {
  const setDesignationId = useDesignationMasterDataStore(
    (state) => state.setCurrentDesignationMasterId
  )
  const openModal = useDesignationStore((state) => state.toggleOpen)
  const setMode = useDesignationStore((state) => state.setMode)

  const { fetchDesignationById } = useFetchDesignationById()
  const { createDesignationAsync } = useCreateDesignation()
  function EditDesignation() {
    setDesignationId(Number(designation.designationID))
    openModal()
    setMode('Edit')
  }

  function ViewDesignation() {
    setDesignationId(Number(designation.designationID))
    openModal()
    setMode('View')
  }

  async function DeleteDesignation() {
    const data = await fetchDesignationById(Number(designation.designationID))
    const newData = {
      ...data,
      usedFor: 'D',
    }
    await createDesignationAsync(newData)
    console.log(data)
    setMode('Create')

  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(designation.designationID))}
        >
          Copy designation ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={ViewDesignation}>View designation</DropdownMenuItem>
        <DropdownMenuItem onClick={EditDesignation}>Edit designation</DropdownMenuItem>
        <DropdownMenuItem onClick={DeleteDesignation}>Delete designation</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DesignationTableActions
