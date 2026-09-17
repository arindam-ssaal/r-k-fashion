// tableColumns.ts
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { useCreatePromotion } from '../../hooks_api/useCreatePromotion'
import { useFetchPromotionMasterById } from '../../hooks_api/usePromotionData'
import { usePromotionSetupStore } from '../../store/usePromotionSetupStore'
import { usePromotionSetupDataStore } from '../../store/usePromotionSetupStoreData'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { FetchedPromotionType } from '@/types/Promotion'

export const columns: ColumnDef<FetchedPromotionType>[] = [
  {
    id: 'select',
    accessorKey: 'promotionName',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'promotionID',
    header: 'PromotionId',
    cell: ({ row }) => <div className="capitalize">{row.getValue('promotionID')}</div>,
  },
  {
    accessorKey: 'promotionName',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Promotion Name
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('promotionName')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => <div className="capitalize">{row.getValue('isActive')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const promotion = row.original
      return <TableRowDropDowns promotion={promotion} />
    },
  },
]

function TableRowDropDowns({ promotion }: { promotion: FetchedPromotionType }) {
  const modalToggler = usePromotionSetupStore((state) => state.toggleOpen)
  const setModalMode = usePromotionSetupStore((state) => state.setMode)
  const setPromotionID = usePromotionSetupDataStore((state) => state.setCurrentPromotionSetupId)
  const setViewerID = usePromotionSetupStore((s) => s.setViewerID)
  const { fetchPromotionById } = useFetchPromotionMasterById()
  const { createPromotionAsync } = useCreatePromotion()

  async function EditModalHandler() {
    try {
      const data = await fetchPromotionById(Number(promotion.promotionID))
      if (!data) {
        console.error('Promotion data not found')
        return
      }
      setPromotionID(Number(promotion.promotionID))
      modalToggler()
      setModalMode('Edit')
    } catch (err) {
      console.log(err)
    }
  }

  async function ViewModalHandler() {
    try {
      const data = await fetchPromotionById(Number(promotion.promotionID))
      if (!data) {
        console.error('Promotion data not found')
        return
      }
      setViewerID(Number(promotion.promotionID)) // ✅ triggers full-page viewer
    } catch (error) {
      console.error('Error viewing promotion:', error)
    }
  }

  async function DeleteModalHandler() {
    try {
      const data = await fetchPromotionById(Number(promotion.promotionID))
      if (!data) {
        console.error('Promotion data not found')
        return
      }

      const updatedData = { ...data, usedFor: 'D' }
      await createPromotionAsync(updatedData)
      console.log('Promotion successfully deleted:', updatedData)
      setModalMode('Create')
    } catch (error) {
      console.error('Error deleting promotion:', error)
    }
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(promotion.promotionID))}>
          Copy Promotion ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={EditModalHandler}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={ViewModalHandler}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={DeleteModalHandler}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
