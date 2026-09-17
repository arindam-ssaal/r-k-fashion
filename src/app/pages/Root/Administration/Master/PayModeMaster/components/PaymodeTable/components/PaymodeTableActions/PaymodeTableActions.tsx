import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

import { useCreatePaymode } from '../../../../hooks_api/useCreatePaymode'
import { useFetchPaymodeById } from '../../../../hooks_api/usePaymodeMasterDataById'
import { usePaymodeMasterDataStore } from '../../../../store/usePaymentMethodStore'
import { usePaymodeMaster } from '../../../../store/usePaymodeMaster'
import { PaymodeTableType } from '../../PaymodeTable'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


function PaymodeTableActions({ paymode }: { paymode: PaymodeTableType }) {
  const setMode = usePaymodeMaster((state) => state.setMode)
  const setPaymodeId = usePaymodeMasterDataStore((state) => state.setCurrentPaymodeMasterId)
  const { createPaymodeAsync } = useCreatePaymode()
  const { fetchPaymodeById } = useFetchPaymodeById()
  const openModal = usePaymodeMaster((state) => state.toggleOpen)
  async function handleDelete() {
    setMode('Delete')
    const data = await fetchPaymodeById(Number(paymode.paymentModeID))
    const newData = {
      ...data,
      usedFor: 'D',
    }
    await createPaymodeAsync(newData)
    console.log(data)
  }
  function handleView() {
    setMode('View')
    setPaymodeId(Number(paymode.paymentModeID))
    openModal()
  }
  function handleUpdate() {
    setMode('Edit')
    setPaymodeId(Number(paymode.paymentModeID))
    openModal()
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

        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-1 px-2 cursor-pointer" onClick={handleUpdate}>
          Edit Paymode
        </DropdownMenuItem>
        <DropdownMenuItem className="py-1 px-2 cursor-pointer" onClick={handleView}>
          View Paymode
        </DropdownMenuItem>
        <DropdownMenuItem className="py-1 px-2 cursor-pointer" onClick={handleDelete}>
          Delete Paymode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PaymodeTableActions
