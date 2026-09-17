import { format } from 'date-fns';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCookies } from 'react-cookie';
import { GetAPI } from '../../../../../services/apiCall';

type Store = {
  storeID: string
  storeName: string
}

type User = {
  id: string
  name: string
}

function UserWisePaymodeWiseCollectionPage() {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const getCookieValue = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  //! For dynamic store
  const [storeList, setStoreList] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  /*
  //! For users
  const [userList] = useState<User[]>([
    { id: '1', name: 'User 1' },
    { id: '2', name: 'User 2' },
    { id: '3', name: 'User 3' },
    { id: '4', name: 'User 4' },
  ])
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['1', '2', '3', '4']) // Default: all users selected
  */
  const [userList, setUserList] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [print, setPrint] = useState(false);
  const [reportUrl, setReportUrl] = useState('');

  // Helper functions for multi-select users
  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === userList.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(userList.map(user => user.id))
    }
  }
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchStoreDetails = async () => {
      setLoading(true)
      try {
        const response = await GetAPI('/api/StoreMaster/GetAllStoreMaster', '', {}, cookies)
        const data = response.data
        if (Array.isArray(data)) {
          setStoreList(data)
        } else if (data && typeof data === 'object') {
          setStoreList([data])
        } else {
          setStoreList([])
        }
      } catch {
        // Failed to load store list
        setStoreList([])
      } finally {
        setLoading(false)
      }
    }
    if (cookies.UserId) {
      fetchStoreDetails()
    }

    fetchStoreDetails()
  }, [])
  useEffect(() => {
    const defaultStoreId = getCookieValue("DefaultStoreId");
    if (defaultStoreId && defaultStoreId !== "") {
      setSelectedStore(defaultStoreId);
    }
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedStore) {
        setUserList([])
        setSelectedUsers([])
        return
      }
      setLoadingUsers(true)
      try {
        let PJsonData = {}
        let PType = `?StoreId=${selectedStore}`
        const response = await GetAPI('/api/UserStore/GetAllGetStoreWiseUser', PType, PJsonData, cookies)
        const data = response.data
        if (Array.isArray(data)) {
          // Map API fields to your local User type
          const mappedUsers: User[] = data.map((u: any) => ({
            id: u.userID,
            name: u.userName,
          }))
          setUserList(mappedUsers)
          setSelectedUsers(mappedUsers.map((u) => u.id)) // select all by default
        } else {
          setUserList([])
          setSelectedUsers([])
        }
      } catch (error) {
        console.error("Failed to load users", error)
        setUserList([])
        setSelectedUsers([])
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [selectedStore])
  const handleBillPrint = () => {
    //alert(selectedStore)
    //console.log(selectedUsers);
    if (!fromDate || !toDate || !selectedStore || !selectedUsers.length) {
      let message = "";
      if (!fromDate) message = "Please select From Date";
      else if (!toDate) message = "Please select To Date";
      else if (!selectedStore) message = "Please select a Store";
      else if (!selectedUsers.length) message = "Please select at least one User";

      toast.error(message, {
        style: { backgroundColor: "#f7edeb", color: "#ff6242" },
      });
      return;
    }

    setPrint(false);
    setReportUrl('');

    setTimeout(() => {
      const fromDateFormatted = fromDate.replace(/-/g, '');
      const toDateFormatted = toDate.replace(/-/g, '');
      const UserId = getCookieValue('UserId');
      const report_id = 6;
      const url = `${import.meta.env.VITE_SERVER_DEV_REPORT}/web/WebForm1.aspx?id1=${report_id}&id2=${fromDateFormatted}|${toDateFormatted}&id3=2&uid=${UserId}`;

      setReportUrl(url);
      setPrint(true);
    }, 0);
  }

  return (
    <div className="credit-note-register-page">
      <div className="border border-gray-400 p-4 mb-6 max-w-7xl mx-auto rounded-md" style={{background: 'white'}}>
        <div className="border border-gray-600 p-4 mb-4 relative">
          <h2 className="text-center text-lg font-semibold mb-4 bg-sky-400 rounded-sm px-2 inline-block absolute -top-3 left-1/2 transform -translate-x-1/2">
            User wise Paymode wise Collection
          </h2>

          <div className="flex flex-col gap-4 mb-6 mt-8">
            {/* Single Row with all 4 fields */}
            <div className="flex items-center justify-center gap-8">
              {/* Store Selection */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>Store</Label>
                <select
                  id="store-select"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  disabled={loading}
                  className="w-48 px-3 py-2 text-xs leading-tight border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <option>Loading stores...</option>
                  ) : (
                    <>
                      <option className="" value="">
                        Select Store
                      </option>
                      {storeList.map((store) => (
                        <option className="" key={store.storeID} value={store.storeID}>
                          {store.storeName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* User Multi-Selection */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>User</Label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="w-48 px-3 py-2 text-left text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    style={{color: 'black'}}
                  >
                    <span className="block truncate">
                      {selectedUsers.length === 0
                        ? "Select Users"
                        : selectedUsers.length === userList.length
                        ? "All Users Selected"
                        : selectedUsers.length === 1
                        ? userList.find(u => u.id === selectedUsers[0])?.name
                        : `${selectedUsers.length} Users Selected`}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="m6 9 4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-48 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none" style={{background: 'white', color: 'black'}}>
                      {/* Select All Option */}
                      <div
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9"
                        onClick={handleSelectAllUsers}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={selectedUsers.length === userList.length}
                            onChange={() => {}}
                            style={{color: 'black'}}
                          />
                          <span className="ml-3 block font-medium text-xs" style={{color: 'black'}}>
                            Select All
                          </span>
                        </div>
                      </div>
                      
                      {/* Individual Users */}
                      {userList.map((user) => (
                        <div
                          key={user.id}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9"
                          onClick={() => handleUserSelection(user.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => {}}
                            />
                            <span className="ml-3 block text-xs" style={{color: 'black'}}>
                              {user.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* From Date */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-400 rounded px-2 py-1 text-xs w-44"
                />
              </div>

              {/* To Date */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-400 rounded px-2 py-1 text-xs w-44"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm border border-green-600"
              onClick={handleBillPrint}
            >
              Print
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm border border-red-600"
              onClick={() => {
                setFromDate(format(new Date(), 'yyyy-MM-dd'))
                setToDate(format(new Date(), 'yyyy-MM-dd'))
                setSelectedStore(selectedStore)
                setSelectedUsers(['1', '2', '3', '4']) // Reset to all users selected
                setPrint(false)
                setReportUrl('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Results/Data Display Section */}
      <div className="border border-gray-300 shadow-sm rounded-lg p-6 max-w-full mx-auto mb-8" style={{background: 'white'}}>
        <div className="border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-lg font-medium" style={{color: 'black'}}>Report Results</h3>
          <p className="text-sm" style={{color: 'black', marginTop: '0.25rem'}}>
           Data will appear here after generating the report
          </p>
        </div>

        <div className="h-screen border border-dashed border-gray-300 rounded-lg p-4" style={{background: 'white'}}>
          {print && reportUrl ? (
            <iframe
              src={reportUrl}
              title="User wise Paymode wise Collection Report"
              className="w-full h-full border-0 rounded-lg"
            ></iframe>
          ) : (
            <p style={{color: 'black'}}>No Result...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserWisePaymodeWiseCollectionPage