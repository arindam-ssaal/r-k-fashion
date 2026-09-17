import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import UserBox from './components/UserBox'
import { GetAPI } from '../../../../../services/apiCall'

import { Hamburger } from '@/assets/icons'
import useSidebar from '@/store/useSidebar'

type Store = {
  storeID: number
  storeName: string
}

type HeaderProps = {
  selectedStore?: string
  onChange?: (storeId: string) => void
}

function Header({ selectedStore, onChange }: HeaderProps) {
  const [userStore, setUserStore] = useState<Store | null>(null)
  const [cookies] = useCookies(['UserId', 'DefaultStoreId'])
  const [loading, setLoading] = useState<boolean>(false)
  const toggleSidebar = useSidebar((state) => state.toggleSidebar)

  useEffect(() => {
    const fetchStoreDetails = async () => {
      setLoading(true)
      try {
        const response = await GetAPI('/api/StoreMaster/GetAllStoreMaster', '', {}, cookies)
        // const response = {data: []}; // Dummy response for illustration

        const data = response.data

        let stores: Store[] = []
        if (Array.isArray(data)) {
          stores = data
        } else if (data && typeof data === 'object') {
          stores = [data]
        }

        // Find the store matching the logged-in user's DefaultStoreId
        const matchingStore = stores.find(store => store.storeID === Number(cookies.DefaultStoreId))
        
        if (matchingStore) {
          setUserStore(matchingStore)
          // Automatically set the store in parent component
          if (onChange) {
            onChange(String(matchingStore.storeID))
          }
        }
      } catch (err) {
        console.error('Failed to load store list:', err)
        setUserStore(null)
      } finally {
        setLoading(false)
      }
    }
    if (cookies.UserId) {
      fetchStoreDetails()
    }
  }, [cookies.UserId, cookies.DefaultStoreId])

  return (
    <header className="border-b border-[rgba(0,180,216,0.1)] shadow-sm h-[85px]" style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(10px)' }}>
      <div className="py-3 px-4">
        <div className="flex justify-between items-center">
          {/* Left section: Hamburger and Title */}
          <div className="flex items-center gap-4 flex-1">
            <span onClick={toggleSidebar} className="cursor-pointer text-[#B8D9F0]">
              <Hamburger />
            </span>
            <h2 tabIndex={1} className="text-lg font-semibold text-[#E8F4FD]">
              Point OF Sale
            </h2>
          </div>

          {/* Center section: Store Name */}
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-2 text-sm font-medium text-[#E8F4FD] border rounded-md" style={{ background: 'rgba(45,91,163,0.2)', borderColor: 'rgba(0,180,216,0.2)' }}>
              {loading ? (
                <span className="text-[#B8D9F0] opacity-60">Loading store...</span>
              ) : userStore ? (
                <span>{userStore.storeName}</span>
              ) : (
                <span className="text-[#B8D9F0] opacity-60">No store assigned</span>
              )}
            </div>
          </div>

          {/* Right section: UserBox */}
          <div className="flex-1 flex justify-end text-[#E8F4FD]">
            <UserBox />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
