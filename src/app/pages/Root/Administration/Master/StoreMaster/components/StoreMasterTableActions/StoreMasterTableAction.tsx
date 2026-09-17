import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { useCreateStoreMaster } from '../../hooks_api/useCreateStoreMaster'
import { useFetchStoreMasterById } from '../../hooks_api/useFetchStoreMasterById'
import { useStoreMasterDataStore } from '../../store/useStoreMasterDataStore'
import useStoreMasterStore from '../../store/useStoreMasterStore'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FetchedStoreMasterType } from '@/types/storeMaster'

function StoreMasterTableAction({ storeData }: { storeData: FetchedStoreMasterType }) {
  const modalToggler = useStoreMasterStore((state) => state.toggleOpen)
  const setMode = useStoreMasterStore((state) => state.setMode)
  const setStoreMasterId = useStoreMasterDataStore((state) => state.setStoreMasterId)
  const { createStoremaster } = useCreateStoreMaster()
  const { fetchStoreMasterById } = useFetchStoreMasterById()

  function EditHandler() {
    modalToggler()
    setMode('Edit')
    setStoreMasterId(storeData?.storeID)
  }
  async function DeleteHandler() {
    const data = await fetchStoreMasterById(storeData?.storeID)
    console.log(data)
    const newData={
      ...data,
      usedFor:"D",
      // priceListID:0
    }
    await createStoremaster(newData)
    setMode('Delete')
  }
  function ViewHandler() {
    modalToggler()
    setMode('View')
    setStoreMasterId(storeData?.storeID)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(storeData.storeID))}>
          Copy StoreMaster ID
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={EditHandler}>Edit StoreMaster</DropdownMenuItem>
        <DropdownMenuItem onClick={ViewHandler}>View StoreMaster</DropdownMenuItem>
        <DropdownMenuItem onClick={DeleteHandler}>Delete StoreMaster</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StoreMasterTableAction
