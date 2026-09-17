import { Bell, ImageOff, LogOut, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { roleBasedMenu, RoleBasedMenu, SidebarItem, SubItem } from './data/roleBasedMenu'
import { useSidebarComp } from './hooks/useSidebarComp'
import useHeaderStore from '../Header/store/useHeaderStore'

import SalesSearchModal from '../../Sales/components/SalesSearchModal'
import useImageUploaderState from '@/components/ImageUploader/store/useImageUploader'
import FullscreenBtn from '@/components/FullscreenBtn'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import useFocusOnKeyPress from '@/hooks/useFocusOnKeyPress'
import {useAuth} from '@/store/useAuth'
import { useLogout } from '@/app/hooks/useLogout'
import useSidebar from '@/store/useSidebar'


function SidebarQuickActions({ globalOpen }: { globalOpen: boolean }) {
  const { isSearchModalOpen, openSearchModal, closeSearchModal } = useHeaderStore()

  useFocusOnKeyPress<HTMLDivElement>('F5', openSearchModal)

  return (
    <div className={`px-3 py-2 border-b border-[rgba(0,180,216,0.1)] flex items-center ${
      globalOpen ? 'gap-2 justify-start' : 'flex-col gap-2 items-center'
    }`}>
      <FullscreenBtn />
      <Button
        size={'icon'}
        variant={'ghost'}
        className="cursor-pointer rounded-full hover:bg-[rgba(0,180,216,0.15)] text-[#B8D9F0]"
        title="Notifications"
      >
        <Bell size={18} strokeWidth={2} absoluteStrokeWidth />
      </Button>
      <Dialog
        open={isSearchModalOpen}
        onOpenChange={(open) => (open ? openSearchModal() : closeSearchModal())}
      >
        <DialogTrigger asChild>
          <Button
            size={'icon'}
            variant={'ghost'}
            className="cursor-pointer rounded-full hover:bg-[rgba(0,180,216,0.15)] text-[#B8D9F0]"
            onClick={openSearchModal}
            title="Search (F5)"
          >
            <Search size={18} strokeWidth={2} absoluteStrokeWidth />
          </Button>
        </DialogTrigger>
        <SalesSearchModal />
      </Dialog>
    </div>
  )
}

function SidebarItemComponent({
  item,
  globalOpen,
}: {
  item: SidebarItem | SubItem
  globalOpen: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const closeSidebar = useSidebar((state) => state.closeSidebar)

  useEffect(() => {
    if (item.subItems) {
      const isPathActive = item.subItems.some((subItem) => pathname.startsWith(subItem.path))
      setIsOpen(isPathActive)
    }
  }, [pathname, item.subItems])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const isActive = item.path && pathname.startsWith(item.path)

  return (
    <li>
      {item.subItems ? (
        <button
          className={`group flex items-center text-base font-semibold px-3 py-2 sm:py-3 rounded-lg w-full text-left transition-all
            ${
              isOpen || isActive
                ? 'sidebar-item-active'
                : 'sidebar-item-default'
            }`}
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          {'icon' in item && <span className="sidebar-icon">{item.icon}</span>}
          <span
            className={`ml-3 transition-opacity leading-[20px] duration-1000 ${
              globalOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {globalOpen && item.name}
          </span>
          {globalOpen && item.subItems && (
            <span className={`ml-auto text-[10px] opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
              ▶
            </span>
          )}
        </button>
      ) : (
        <NavLink
          className={({ isActive }) =>
            `group flex items-center text-[14px] sm:text-base font-semibold px-3 py-3 sm:py-3 rounded-lg transition-all
            ${
              isActive
                ? 'sidebar-item-active'
                : 'sidebar-item-default'
            }`
          }
          to={item.path}
          end
          onClick={closeSidebar}
        >
          {'icon' in item && <span className="sidebar-icon">{item.icon}</span>}
          <span
            className={`ml-3 transition-opacity leading-[20px] duration-1000 ${
              globalOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {globalOpen && item.name}
          </span>
        </NavLink>
      )}

      {item.subItems && isOpen && (
        <ul className="ml-4 pl-3 space-y-2 mt-1 border-l border-solid border-[rgba(0,180,216,0.15)]">
          {item.subItems.map((subItem, index) => (
            <SidebarItemComponent key={index} item={subItem} globalOpen={globalOpen} />
          ))}
        </ul>
      )}
    </li>
  )
}

function SidebarUserSection({ globalOpen }: { globalOpen: boolean }) {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <div className="mt-auto border-t border-[rgba(0,180,216,0.1)] px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 min-w-[36px] rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-bold">
          {user?.username?.charAt(0)?.toUpperCase()}
        </div>
        {globalOpen && (
          <div className="flex items-center justify-between flex-1 min-w-0">
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
              <p className="text-xs text-[#B8D9F0] opacity-60">{user?.role}</p>
            </div>
            <button onClick={() => logout()} className="ml-2 p-1.5 rounded-md text-[#B8D9F0] hover:text-red-400 hover:bg-[rgba(255,0,0,0.1)] transition-colors cursor-pointer" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Sidebar() {
  const { open: globalOpen, sidebarRef } = useSidebarComp()
  const { user } = useAuth()
  const image = useImageUploaderState(state=>state.image);
  const toggleSidebar = useSidebar((state) => state.toggleSidebar)


  const sidebarItems: SidebarItem[] =
    roleBasedMenu[user?.role?.toLowerCase() as keyof RoleBasedMenu] || []

    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "F12") {
          event.preventDefault();
          setIsHidden((prev) => !prev);
        }
      };
  
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (isHidden) return null;


  return (
    
    <aside
    className={`sidebar relative z-50 overflow-y-scroll flex flex-col ${globalOpen ? 'expand' : ''}`}
    ref={sidebarRef}
  >
    {/* Right gradient accent stripe */}
    <div className="sidebar-stripe" />

    <div className="logo mb-4 border-b border-[rgba(0,180,216,0.1)] pt-5 px-3.5 pb-6">
      <div className="font-extrabold text-2xl text-nowrap flex items-center gap-3 text-white">
        <div onClick={toggleSidebar} className="cursor-pointer">
          {image ? (
            <img
              src={image}
              alt="Uploaded Preview"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "2px solid rgba(0,180,216,0.3)",
              }}
            />
          ) : (
            <div className="sidebar-logo-icon">
              <ImageOff size={24} />
            </div>
          )}
        </div>
        <NavLink to="/dashboard" className="flex items-center gap-2 group">
          <span
            className={`transition-opacity duration-1000 ${globalOpen ? 'opacity-100' : 'opacity-0'}`}
          >
            {globalOpen && (
              <span className="flex flex-col">
                <span className="sidebar-brand-text">sapphire POS</span>
                <em className="text-[9px] text-[#B8D9F0] opacity-50 font-mono font-normal">v3.0 · SAP B1 Integrated</em>
              </span>
            )}
          </span>
        </NavLink>
      </div>
    </div>
    <SidebarQuickActions globalOpen={globalOpen} />
    <ul className="px-3 space-y-2 flex-1">
      {sidebarItems.map((item, index) => (
        <SidebarItemComponent key={index} item={item} globalOpen={globalOpen} />
      ))}
    </ul>
    <SidebarUserSection globalOpen={globalOpen} />
  </aside>
  )
}

export default Sidebar