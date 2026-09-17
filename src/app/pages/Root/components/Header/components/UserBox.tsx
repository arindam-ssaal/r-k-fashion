import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import SalesSearchModal from '../../../Sales/components/SalesSearchModal'
import useHeaderStore from '../store/useHeaderStore'

import FullscreenBtn from '@/components/FullscreenBtn'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DialogTrigger, Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useFocusOnKeyPress from '@/hooks/useFocusOnKeyPress'
import {useAuth} from '@/store/useAuth'

import { useLogout } from '@/app/hooks/useLogout';

function UserBox() {
  // Access Zustand store for modal state and actions
  const { isSearchModalOpen, openSearchModal, closeSearchModal } = useHeaderStore()
  //const logout = useAuth((state) => state.logout)
  const logout = useLogout();
 // const changePassword = useAuth((state) => state.changePassword)
  const user = useAuth((state) => state.user)

  // Use the hook to trigger opening the dialog on F5
  useFocusOnKeyPress<HTMLDivElement>(
    'F5',
    openSearchModal // Action to open the dialog from Zustand store
  )

  return (
    <div className="user-box flex items-center gap-2 ">
      <FullscreenBtn />
      <Button size={'icon'} variant={'ghost'} className=" mr-2 cursor-pointer">
        <Bell size={14} strokeWidth={2} absoluteStrokeWidth />
      </Button>
      <Dialog
        open={isSearchModalOpen}
        onOpenChange={(open) => (open ? openSearchModal() : closeSearchModal())}
      >
        <DialogTrigger asChild>
          <Button
            size={'icon'}
            variant={'ghost'}
            className="mr-4 cursor-pointer"
            onClick={openSearchModal}
          >
            <Search size={14} strokeWidth={2} absoluteStrokeWidth />
          </Button>
        </DialogTrigger>
        <SalesSearchModal />
      </Dialog>
      <div>
        <Avatar>
          <div className="h-10 w-10 rounded-full bg-sky-600 hover:bg-sky-700 flex items-center justify-center text-white text-lg">
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
          {/* <AvatarFallback>CN</AvatarFallback> */}
        </Avatar>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-start flex-col">
            <h5 className="text-lg mb-0">{user?.username}</h5>
            <h6 className="text-sm">{user?.role}</h6>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="right-6 relative">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to = "">Profile</Link>
              </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/administration/security/change-password">Change Password</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem 
              onClick={() => {
                changePassword()
              }}
            >
              Change Password
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
                logout()
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default UserBox
