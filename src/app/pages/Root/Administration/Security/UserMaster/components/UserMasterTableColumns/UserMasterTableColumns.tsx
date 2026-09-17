import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { useCreateUsermasterGeneral } from '../../hooks_api/useCreateUsermasterGeneral'
import { useFetchUserMasterById } from '../../hooks_api/useUserMasterData'
import { useUserMasterDataStore } from '../../store/useUserMasterDataStore'
import { useUserMasterStore } from '../../store/useUserMasterStore'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserDetail } from "@/types/userMaster"

export type Payment = {
    id: string
    useName: string
    createdOn: string
    role: string
    active: string
    status: 'pending' | 'processing' | 'success' | 'failed'
  }
  
  // export const columns: ColumnDef<UserDetail>[] = [
  //   {
  //     id: 'select',
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  //   {
  //     accessorKey: 'useName',
  //     header: 'User Name',
  //     cell: ({ row }) => <div className="capitalize">{row.getValue('useName')}</div>,
  //   },
  //   {
  //     accessorKey: 'createdOn',
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         >
  //           Created On
  //           <ArrowUpDown className="ms-1" size={18} />
  //         </Button>
  //       )
  //     },
  //     cell: ({ row }) => <div className="lowercase">{row.getValue('createdOn')}</div>,
  //   },
  //   {
  //     accessorKey: 'role',
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         >
  //           Role
  //           <ArrowUpDown className="ms-1" size={18} />
  //         </Button>
  //       )
  //     },
  //     cell: ({ row }) => <div className="lowercase">{row.getValue('role')}</div>,
  //   },
  //   {
  //     accessorKey: 'active',
  //     header: 'Active',
  //     cell: ({ row }) => <div className="capitalize">{row.getValue('active')}</div>,
  //   },
  //   {
  //     id: 'actions',
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const user = row.original
  
  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.userID.toString())}>
  //               Copy User Master ID
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>View User Master</DropdownMenuItem>
  //             <DropdownMenuItem>Delete User Master details</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       )
  //     },
  //   },
  // ]

  export const columns: ColumnDef<UserDetail>[] = [
  {
    id: 'select',
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
    accessorKey: 'userName',
    header: 'User Name',
    cell: ({ row }) => <div className="capitalize">{row.getValue('userName')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'mobile',
    header: 'Mobile',
    cell: ({ row }) => <div>{row.getValue('mobile')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ row }) => <div className="capitalize">{row.getValue('isActive')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      const setUserId = useUserMasterDataStore((state) => state.setCurrentUserMasterId)
      const openModal = useUserMasterStore((state) => state.toggleOpen)
      const setMode = useUserMasterStore((state) => state.setMode)
      const { fetchUserMasterById } = useFetchUserMasterById()
      const { createUsermasterGeneral } = useCreateUsermasterGeneral()

      function EditUser() {
        setUserId(Number(user.userID))
        openModal()
        setMode('Edit')
      }

      function ViewUser() {
        setUserId(Number(user.userID))
        openModal()
        setMode('View')
      }

  //     function ViewHandler() {
  //   modalToggler()
  //   setMode('View')
  //   setStoreMasterId(storeData?.storeID)
  // }

      async function DeleteUser() {
        const data = await fetchUserMasterById(Number(user.userID))
        const newData = {
          ...data,
          usedFor: 'D',
        }
        await createUsermasterGeneral(newData)
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.userID.toString())}>
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={ViewUser}>View User</DropdownMenuItem>
            <DropdownMenuItem onClick={EditUser}>Edit User</DropdownMenuItem>
            <DropdownMenuItem onClick={DeleteUser}>Delete User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]