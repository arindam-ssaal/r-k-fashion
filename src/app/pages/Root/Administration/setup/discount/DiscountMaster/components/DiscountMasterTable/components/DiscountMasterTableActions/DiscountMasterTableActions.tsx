import { MoreHorizontal } from 'lucide-react'

import { useCreateDiscountMaster } from '../../../../hooks_api/useCreateDiscountMasterData'
import { useFetchDiscountMasterById } from '../../../../hooks_api/useDiscountMasterDataById'
import useDiscountMasterStore from '../../../../store/useDiscountMasterStore'
import { useDiscountnMasterDataStore } from '../../../../store/useDiscountMasterStoreData'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FetchedDiscountType } from '@/types/discountSetup'

function DiscountMasterTableActions({ assortment }: { assortment: FetchedDiscountType }) {
  const setCurrentDiscountSetuprId = useDiscountnMasterDataStore(
    (state) => state.setCurrentDiscountnMasterId
  )
  const { fetchDiscountMasterById } = useFetchDiscountMasterById()
  const { createDiscountMaster } = useCreateDiscountMaster()
 // const openModal = useDiscountMasterStore((state) => state.toggleOpen)
  const setMode = useDiscountMasterStore((state) => state.setMode)
  const modalToggler = useDiscountMasterStore( (state) => state.toggleOpen)
  function editHandler() {
    //openModal()
    modalToggler()
    setCurrentDiscountSetuprId(assortment.discountID)
    setMode('Edit')
  }
  function viewHandler() {
   // openModal()
   modalToggler()
    setCurrentDiscountSetuprId(assortment.discountID)
    setMode('View')
  }
  async function deleteHandler() {
    setMode('Delete')
    try {
      const data = await fetchDiscountMasterById(assortment.discountID)
      const newData = {
        ...data,
        usedFor: 'D',
        discountAssortments: data.discountAssortments ?? [],
      }
      await createDiscountMaster(newData)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
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
          onClick={() => navigator.clipboard.writeText(String(assortment.discountID))}
        >
          Assortment Id
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={viewHandler}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={editHandler}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={deleteHandler}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DiscountMasterTableActions
