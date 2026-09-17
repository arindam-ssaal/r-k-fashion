import React, { useEffect, useState, useRef } from 'react'
import { Ellipsis } from 'lucide-react'
import {
  Blinds,
  ChartSpline,
  DiamondPercent,
  ShoppingBag,
  Stamp,
  TextSearch,
  TicketX,
  UserRound,
  X,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TootlTipWrapper from '@/components/TootlTipWrapper'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie'
import { GetAPI, PostAPI } from '../../../../../../services/apiCall'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { set } from 'date-fns'

const UserMaster = () => {
  const today = new Date().toISOString().split('T')[0]
  const [cookies] = useCookies(['UserId', 'DefaultStoreId'])
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }
  //console.log(cookies, cookies.DefaultStoreId)
  //console.log("Cookies from document.cookie:", document.cookie);
  const [currentPage, setCurrentPage] = useState(1)
  const [ModalOpen, setModalOpen] = useState(false)
  const [actionText, setActionText] = useState('Add')
  const [customerErrors, setCustomerErrors] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [userMasterData, setUserMasterData] = useState([])
  const [userNameFilter, setUserNameFilter] = useState('')
  const [userListCall, setUserListCall] = useState(true)
  const [designationMasterListData, setDesignationMasterListData] = useState([]);
  const [roleMasterListData, setRoleMasterListData] = useState([]);
  const [storeMasterListData, setStoreMasterListData] = useState([]);
  const [customerSaveData, setCustomerSaveData] = useState({
    name: '',
    loginID: '',
    password: '',
    confirmPassword: '',
    defineProfile: '',
    defineRole: '',
    employeeID: '',
    email: '',
    mobileNO: '',
    whatsappNO: '',
    remarks: '',
    isActive: false,
    AllocateStore: [
      {
        storeID: '',
        storeName: '',
        formDate: today,
        toDate: today,
        discontinue: false,
        default: 0,
      },
    ],
  })
  const [visibleColumns, setVisibleColumns] = useState({
    userName: true,
    createdOn: true,
    role: true,
  })
  // const [storeList] = useState([
  //   { storeID: 1, storeName: 'store1', displayName: 'Store 1' },
  //   { storeID: 2, storeName: 'store2', displayName: 'Store 2' },
  // ])

  //! if individual state management is needed, uncomment below code
  // const [name , setName] = useState('')
  // const [loginID, setLoginID] = useState('')
  // const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  // const [defineProfile, setDefineProfile] = useState('')
  // const [defineRole, setDefineRole] = useState('')
  // const [employeeID, setEmployeeID] = useState('')
  // const [email, setEmail] = useState('')
  // const [mobileNO, setMobileNO] = useState('')
  // const [whatsappNO, setWhatsappNO] = useState('')
  // const [remarks, setRemarks] = useState('')
  // const [isActive, setIsActive] = useState(false)
  // const [AllocateStore, setAllocateStore] = useState({
  //   storeName: '',
  //   formDate: today,
  //   toDate: today,
  //   discontinue: false,
  //   default: false,
  // })

  // const handleAllStateClear = () => {
  //   setName('')
  //   setLoginID('')
  //   setPassword('')
  //   setConfirmPassword('')
  //   setDefineProfile('')
  //   setDefineRole('')
  //   setEmployeeID('')
  //   setEmail('')
  //   setMobileNO('')
  //   setWhatsappNO('')
  //   setRemarks('')
  //   setIsActive(false)
  //   setAllocateStore({
  //     storeName: '',
  //     formDate: today,
  //     toDate: today,
  //     discontinue: false,
  //     default: false,
  //   })
  // }

  //! Clear all state for new customer modal
  const handleAllStateClear2 = () => {
    setCustomerSaveData({
      name: '',
      loginID: '',
      password: '',
      confirmPassword: '',
      defineProfile: '',
      defineRole: '',
      employeeID: '',
      email: '',
      mobileNO: '',
      whatsappNO: '',
      remarks: '',
      isActive: false,
      AllocateStore: [
        {
          storeID: '',
          storeName: '',
          formDate: today,
          toDate: today,
          discontinue: false,
          default: false,
        },
      ],
    })
  }

  //! Onchange functionality
  const handleInputChange = (e, idx = null) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === 'checkbox' ? checked : value

    if (name.startsWith('AllocateStore.') && idx !== null) {
      const field = name.split('.')[1]
      setCustomerSaveData((prev) => ({
        ...prev,
        AllocateStore: prev.AllocateStore.map((row, i) =>
          i === idx ? { ...row, [field]: inputValue } : row
        ),
      }))
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setCustomerSaveData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: inputValue,
        },
      }))
    } else {
      setCustomerSaveData((prev) => ({
        ...prev,
        [name]: inputValue,
      }))
    }
  }

  const OpenHandler = () => {
    setModalOpen(true)
  }

  //! handle modal
  const handleAddEditModal = async (action, open, code = null) => {
    handleAllStateClear2()
    setActionText(action)
    if ((action === 'Edit' || action === 'View') && code) {
      try {
        let PJsonData = {}
        let PType = ''
        let responseJson = await GetAPI(
          `/api/User/GetUser?UserId=${code}`,
          PType,
          PJsonData,
          cookies
        )
        console.log('handleAddEditModal=>', responseJson.data)
        // setUserMasterData(responseJson.data || [])

        setCustomerSaveData({
          userID: responseJson.data.userID || 0,
          name: responseJson.data.userName || '',
          loginID: responseJson.data.loginID || '',
          password: responseJson.data.password || '',
          confirmPassword: responseJson.data.password || '',
          defineProfile: responseJson.data.profileID || '',
            // responseJson.data.profileID !== 0 && responseJson.data.profileID === 1
            //   ? 'profile1'
            //   : 'profile2' || '',
          defineRole: responseJson.data.roleID || '',
            // responseJson.data.roleID !== 0 && responseJson.data.roleID === 1
            //   ? 'admin'
            //   : 'user' || '',
          employeeID: responseJson.data.employeeID || '',
          email: responseJson.data.email || '',
          mobileNO: responseJson.data.mobile || '',
          whatsappNO: responseJson.data.whatsApp || '',
          remarks: responseJson.data.remarks || '',
          isActive: responseJson.data.isActive === 'Y' ? true : false,
          //! AllocateStore
          AllocateStore:
            responseJson.data.objStore && Array.isArray(responseJson.data.objStore)
              ? responseJson.data.objStore.map((store) => ({
                  storeID: store.storeID || '', //storeList.find((s) => s.storeID === store.storeID)?.storeName || '',
                  formDate: store.fromDate ? store.fromDate.split('-').reverse().join('-') : today,
                  toDate: store.toDate ? store.toDate.split('-').reverse().join('-') : today,
                  discontinue: store.isDiscontinued === 'Y',
                  default: responseJson.data.defaultStoreID || 0,
                }))
              : [
                  {
                    storeID: '',
                    storeName: '',
                    formDate: today,
                    toDate: today,
                    discontinue: false,
                    default: 0,
                  },
                ],
        })        
      } catch (error) {
        setUserMasterData([])
      }
    }
    setModalOpen(open)
  }

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target
    setCustomerSaveData({ ...customerSaveData, [name]: value })
  }

  const toggleNewCustomerModalCancel = () => {
    setModalOpen(false)
    handleAllStateClear2() // Clear all state when modal is closed
  }

  const handleSaveCustomer = async () => {}

  //* API Call for all user
  useEffect(() => {
    const fetchUserMasterListData = async () => {
      try {
        let PJsonData = {}
        let PType = ''
        let responseJson = await GetAPI('/api/User/GetAllUser', PType, PJsonData, cookies)
        //console.log('fetchUserMasterListData=>', responseJson)
        setUserMasterData(responseJson.data || [])
      } catch (error) {
        setUserMasterData([])
      }
    }

    //if (cookies.AuthToken) {
    fetchUserMasterListData()
    //}
  }, [])

  //* API Call for all Designation, Role, Store Data 
  useEffect(() => {
  	const fetchAllDesignationMasterListData = async () => {
      try {
        let PJsonData = {}
        let PType = ''
        let responseJson = await GetAPI('/api/Desig/GetDesignationDetails?DesignationID=0', PType, PJsonData, cookies)
        //console.log('fetchAllDesignationMasterListData=>', responseJson)
        setDesignationMasterListData(responseJson.data || [])
      } catch (error) {
        setDesignationMasterListData([])
      }
    }
    const fetchAllRoleMasterListData = async () => {
      try {
        let PJsonData = {}
        let PType = ''
        let responseJson = await GetAPI('/api/Role/GetAllRole?IsActive=Y', PType, PJsonData, cookies)
        //console.log('fetchAllRoleListData=>', responseJson)
        setRoleMasterListData(responseJson.data || [])
      } catch (error) {
        setRoleMasterListData([])
      }
    }
    const fetchAllStoreMasterListData = async () => {
      try {
        let PJsonData = {}
        let PType = ''
        let responseJson = await GetAPI('/api/StoreMaster/GetAllStoreMaster?IsActive=Y', PType, PJsonData, cookies)
        //console.log('fetchAllStoreMasterListData=>', responseJson)
        setStoreMasterListData(responseJson.data || [])
      } catch (error) {
        setStoreMasterListData([])
      }
    }

    //if (cookies.AuthToken) {
      fetchAllDesignationMasterListData();
      fetchAllRoleMasterListData();
      fetchAllStoreMasterListData();
    //}
  }, [])

  //! searching logic
  const filteredUserMasterData = userMasterData.filter((item) =>
    item.userName.toLowerCase().includes(userNameFilter.toLowerCase())
  )

  //! Logic for column visibility
  const handleToggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  //! Logic for selecting rows
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredUserMasterData.map((item) => item.userID))
    } else {
      setSelectedRows([])
    }
  }
  const handleSelectRow = (userID) => {
    setSelectedRows((prev) =>
      prev.includes(userID) ? prev.filter((rowId) => rowId !== userID) : [...prev, userID]
    )
  }

  //!Pegination logic
  const rowsPerPage = 5
  const totalPages = Math.ceil(filteredUserMasterData.length / rowsPerPage)
  const paginatedData = filteredUserMasterData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }
  useEffect(() => {
    setCurrentPage(1)
  }, [userNameFilter, filteredUserMasterData.length])

  //! Logic for adding and removing rows in Allocate Store section
  const handleAddRow = () => {
    setCustomerSaveData((prev) => ({
      ...prev,
      AllocateStore: [
        ...prev.AllocateStore,
        {
          storeID: '',
          storeName: '',
          formDate: today,
          toDate: today,
          discontinue: false,
          default: false,
        },
      ],
    }))
  }

  const handleRemoveRow = () => {
    setCustomerSaveData((prev) => ({
      ...prev,
      AllocateStore:
        prev.AllocateStore.length > 1 ? prev.AllocateStore.slice(0, -1) : prev.AllocateStore,
    }))
  }

  //! helper function for store name
  const getStoreIDFromName = (storeID) => {
    const store = storeMasterListData.find((s) => s.storeID === storeID)
    return store ? store.storeID : 0
  }

  //! Helper function for profileID
  const getProfileIDFromName = (profileName) => {
    // Map your profile names to IDs as per your backend
    if (profileName === 'profile1') return 1
    if (profileName === 'profile2') return 2
    return 0
  }

  //! Helper function for roleID
  const getRoleIDFromName = (roleName) => {
    // Map your role names to IDs as per your backend
    if (roleName === 'admin') return 1
    if (roleName === 'user') return 2
    return 0
  }

  //! date format function
  const reverseDateString = (dateString) => {
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  //! Helper function for employeeID
  const getEmployeeIDFromName = (empName) => {
    // Map your employee names to IDs as per your backend
    if (empName === 'emp1') return 1
    if (empName === 'emp2') return 2
    return 0
  }

  //! Error and Validation check
  const validateCustomerForm = () => {
    let newErrors = {}

    // Name
    if (!customerSaveData.name.trim()) newErrors.name = 'Name is required.'

    // Login ID
    if (!customerSaveData.loginID.trim()) newErrors.loginID = 'Login ID is required.'

    // Password
    if (!customerSaveData.password.trim()) newErrors.password = 'Password is required.'

    // Confirm Password
    if (!customerSaveData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required.'
    } else if (customerSaveData.password !== customerSaveData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    // Employee ID
    if (!customerSaveData.employeeID.trim()) {
      newErrors.employeeID = 'Employee ID is required.'
    }

    setCustomerErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  //! handlesave
  const handleSave = async (e) => {
    e.preventDefault()
    if (!validateCustomerForm()) {
      return
    }

    // if (actionText === 'Add') {
    //   const hasDefault = customerSaveData.AllocateStore.some(store => store.default === true && store.storeID > 0)
    //   if (!hasDefault) {
    //     toast.error("Please select at least one Default store, along with Store Name.", {
    //         style: { backgroundColor: '#f7edeb', color: '#ff6242' },
    //     })
    //     return
    //   } 
    // }   
    //console.log('handleSave customerSaveData =>', customerSaveData)

    const formData = {
      userID: customerSaveData.userID || 0,
      userName: customerSaveData.name || '',
      loginID: customerSaveData.loginID || '',
      password: customerSaveData.password || '',
      profileID: customerSaveData.defineProfile || 0,   //getProfileIDFromName(customerSaveData.defineProfile) || 0,
      roleID: customerSaveData.defineRole || 0,      //getRoleIDFromName(customerSaveData.defineRole) || 0,
      //defaultStoreID: customerSaveData.AllocateStore[0].default || 0,
      //defaultStoreID: (actionText === 'Add') ? customerSaveData.AllocateStore.find(store => store.default === true)?.storeID || 0 : customerSaveData.defaultStoreID,
      defaultStoreID: customerSaveData.AllocateStore.find(store => store.default === true)?.storeID || 0, 
      employeeID: customerSaveData.employeeID || '',
      email: customerSaveData.email || '',
      mobile: customerSaveData.mobileNO || '',
      whatsApp: customerSaveData.whatsappNO || '',
      remarks: customerSaveData.remarks || '',
      isActive: customerSaveData.isActive === true || customerSaveData.isActive === 'Y' ? 'Y' : 'N',
      enteredBy: Number(getCookieValue('UserId')),
      usedFor: actionText === 'Add' ? 'I' : 'U',
      objStore: customerSaveData.AllocateStore.filter(store => store.storeID).map((store) => ({
          userID: customerSaveData.userID || 0,
          storeID: store.storeID || 0, //getStoreIDFromName(store.storeID) || 0,
          fromDate: reverseDateString(store.formDate),
          toDate: reverseDateString(store.toDate),
          isDiscontinued: store.discontinue === 'Y' || store.discontinue === true ? 'Y' : 'N',
      })),
    }
    console.log('handleSaveUser=>', formData)
    try {
      //let cookies = '';
      const response = await PostAPI('/api/UserRep/PostUser', '', formData, cookies)
      if (response.data[0].returnCode === 'Y') {
        toast.success(`New customer has been saved successfully!`, {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        }) //response.data[0].returnMsg

        let PJsonData = {}
        let PType = ''
        let responseJson = await GetAPI('/api/User/GetAllUser', PType, PJsonData, cookies)
        console.log('fetchUserMasterListData=>', responseJson)
        setUserMasterData(responseJson.data || [])
      } else if (response.data[0].returnCode === 'F') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else if (response.data[0].returnCode === 'N') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else {
        toast.error('Failed to Save Customer. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }

      // setSelectedCustomerID(null);
      // setSelectedCustomerData(null);
      // setStoredCustomer(null);

      // toggleNewCustomerSavedModal();

      //! toggleNewCustomerModalCancel()
    } catch (error) {
      //console.error("Error saving customer:", error);
      // setSelectedCustomerID(null);
      // setSelectedCustomerData(null);
      // setStoredCustomer(null);
      toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
    }
  }

  //! Shared light-theme field styles for this modal (avoids global dark-theme
  //! overrides applied to bg-white / bg-gray-* / text-gray-* utilities)
  const fieldCls =
    'w-full rounded-lg border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] placeholder:text-[#9aa4b2] shadow-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:bg-[#f8fafc] disabled:text-[#64748b]'
  const labelCls = 'mb-1.5 block text-[13px] font-medium text-[#475569]'
  const errCls = 'mt-1 text-xs text-[#dc2626]'

  return (
    <div className="w-full">
      {/* <div className="box overflow-y-auto w-full">
        <h2 className="text-xl font-semibold mb-2">User Master</h2>
        <div className="overflow-x-auto border rounded-md w-full min-h-[200px] max-h-[300px] overflow-y-auto"> */}
      <div className="flex flex-col md:flex-row items-center py-4 gap-4">
        <Input
          placeholder="Filter user name..."
          value={userNameFilter}
          onChange={(event) => setUserNameFilter(event.target.value)}
          className="w-full md:max-w-sm"
        />
        <div className="mt-4 md:mt-0 md:ms-auto w-full md:w-auto">
          <ul className="flex flex-wrap items-center gap-4 justify-between md:justify-end">
            <li>
              {/* <Button onClick={openHandler} className="w-full md:w-auto"> */}
              <Button onClick={() => handleAddEditModal('Add', true)} className="w-full md:w-auto">
                Add
              </Button>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.userName}
                    onCheckedChange={() => handleToggleColumn('userName')}
                  >
                    User Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.createdOn}
                    onCheckedChange={() => handleToggleColumn('createdOn')}
                  >
                    Created On
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.role}
                    onCheckedChange={() => handleToggleColumn('role')}
                  >
                    Role
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-white h-8">
            <TableHead className="h-8">
              <input
                type="checkbox"
                checked={
                  filteredUserMasterData.length > 0 &&
                  selectedRows.length === filteredUserMasterData.length
                }
                onChange={handleSelectAll}
                aria-label="Select all"
                className="h-4 w-4 text-red-600 border-red-600 rounded focus:ring-red-500 focus:ring-offset-gray-100"
              />
            </TableHead>
            {visibleColumns.userName && <TableHead className="h-8">User Name</TableHead>}
            {visibleColumns.createdOn && <TableHead className="h-8">Created On</TableHead>}
            {visibleColumns.role && <TableHead className="h-8">Role</TableHead>}
            <TableHead className="h-8">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.length ? (
            paginatedData.map((item, index) => (
              <TableRow key={item.userID}>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.userID)}
                    onChange={() => handleSelectRow(item.userID)}
                    aria-label={`Select row ${index + 1}`}
                    className="h-4 w-4 text-red-600 border-red-600 rounded focus:ring-red-500 focus:ring-offset-gray-100"
                  />
                </td>
                {visibleColumns.userName && <td className="p-2">{item.userName}</td>}
                {visibleColumns.createdOn && <td className="p-2">{item.createdOn}</td>}
                {visibleColumns.role && <td className="p-2">{item.roleID}</td>}
                <li className="list-none">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <td className="p-2 cursor-pointer">
                        <Ellipsis />
                      </td>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem
                        onClick={() => handleAddEditModal('View', true, item.userID)}
                      >
                        View
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        onClick={() => handleAddEditModal('Edit', true, item.userID)}
                      >
                        Edit
                      </DropdownMenuCheckboxItem>
                      {/* <DropdownMenuCheckboxItem>Delete</DropdownMenuCheckboxItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <td colSpan={19} className="text-center py-8 text-gray-500">
                No User yet
              </td>
            </TableRow>
          )}
        </TableBody>
      </table>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 py-4">
        <div className="flex-1 text-sm text-muted-foreground text-center md:text-left">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>

      {ModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1220]/60 p-3 backdrop-blur-sm md:p-6"
          onClick={toggleNewCustomerModalCancel}
        >
          <div
            className="um-modal relative flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl shadow-2xl ring-1 ring-[#e5e7eb]"
            style={{ maxHeight: '92vh', backgroundColor: '#ffffff', color: '#0f172a' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scoped light-theme styles: neutralises the global dark-theme
                input/select/textarea overrides for this modal only */}
            <style>{`
              .um-modal input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not(.login-card *),
              .um-modal select,
              .um-modal textarea {
                background-color: #ffffff !important;
                color: #0f172a !important;
                border-color: #e5e7eb !important;
              }
              .um-modal input:focus,
              .um-modal select:focus,
              .um-modal textarea:focus { border-color: #2563eb !important; }
              .um-modal input:disabled,
              .um-modal select:disabled,
              .um-modal textarea:disabled {
                background-color: #f8fafc !important;
                color: #64748b !important;
              }
              .um-modal input::placeholder,
              .um-modal textarea::placeholder { color: #9aa4b2 !important; }
              .um-modal input[type="date"]::-webkit-calendar-picker-indicator { filter: none !important; }
            `}</style>

            {/* Header */}
            <div
              className="flex items-start justify-between gap-4 border-b border-[#eef1f5] px-6 py-5"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2563eb]">
                  <UserRound className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#0f172a]">
                    {actionText} User Master
                  </h2>
                  <p className="text-[13px] text-[#64748b]">
                    Manage login credentials, role and store allocation
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={toggleNewCustomerModalCancel}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] text-[#64748b] shadow-sm transition hover:border-[#fecaca] hover:bg-[#fef2f2] hover:text-[#dc2626]"
                style={{ backgroundColor: '#ffffff' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* {console.log("=>", customerSaveData)} */}
            <form className="flex min-h-0 flex-1 flex-col" style={{ backgroundColor: '#ffffff' }}>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
                  {/* Name */}
                  <div>
                    <label className={labelCls}>
                      Name <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      value={customerSaveData.name}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.name && <p className={errCls}>{customerErrors.name}</p>}
                  </div>
                  {/* Login ID */}
                  <div>
                    <label className={labelCls}>
                      Login Id <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="text"
                      name="loginID"
                      placeholder="Enter login ID"
                      value={customerSaveData.loginID}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.loginID && <p className={errCls}>{customerErrors.loginID}</p>}
                  </div>
                  {/* Password */}
                  <div>
                    <label className={labelCls}>
                      Password <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={customerSaveData.password}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.password && <p className={errCls}>{customerErrors.password}</p>}
                  </div>
                  {/* Confirm Password */}
                  <div>
                    <label className={labelCls}>
                      Confirm Password <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={customerSaveData.confirmPassword}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.confirmPassword && (
                      <p className={errCls}>{customerErrors.confirmPassword}</p>
                    )}
                  </div>
                  {/* Define Profile */}
                  <div>
                    <label className={labelCls}>
                      Define Profile <span className="text-[#dc2626]">*</span>
                    </label>
                    <select
                      name="defineProfile"
                      value={customerSaveData.defineProfile}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    >
                      <option value="">Choose a profile...</option>
                      {designationMasterListData.map((desg) => (
                        <option key={desg.designationID} value={desg.designationID}>
                          {desg.designationName}
                        </option>
                      ))}
                    </select>
                    {customerErrors.defineProfile && (
                      <p className={errCls}>{customerErrors.defineProfile}</p>
                    )}
                  </div>
                  {/* Define Role */}
                  <div>
                    <label className={labelCls}>
                      Define Role <span className="text-[#dc2626]">*</span>
                    </label>
                    <select
                      name="defineRole"
                      value={customerSaveData.defineRole}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    >
                      <option value="">Choose a Role...</option>
                      {roleMasterListData.map((role) => (
                        <option key={role.roleID} value={role.roleID}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                    {customerErrors.defineRole && (
                      <p className={errCls}>{customerErrors.defineRole}</p>
                    )}
                  </div>
                  {/* Employee ID */}
                  <div>
                    <label className={labelCls}>Employee Id</label>
                    <input
                      type="text"
                      name="employeeID"
                      placeholder="Enter employee ID"
                      value={customerSaveData.employeeID}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.employeeID && (
                      <p className={errCls}>{customerErrors.employeeID}</p>
                    )}
                  </div>
                  {/* Email */}
                  <div>
                    <label className={labelCls}>
                      Email <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={customerSaveData.email}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.email && <p className={errCls}>{customerErrors.email}</p>}
                  </div>
                  {/* Mobile No */}
                  <div>
                    <label className={labelCls}>Mobile No</label>
                    <input
                      type="text"
                      name="mobileNO"
                      placeholder="Enter mobile number"
                      value={customerSaveData.mobileNO}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.mobileNO && <p className={errCls}>{customerErrors.mobileNO}</p>}
                  </div>
                  {/* WhatsApp No */}
                  <div>
                    <label className={labelCls}>WhatsApp No</label>
                    <input
                      type="text"
                      name="whatsappNO"
                      placeholder="Enter WhatsApp number"
                      value={customerSaveData.whatsappNO}
                      onChange={handleInputChange}
                      className={`${fieldCls} h-10`}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.whatsappNO && (
                      <p className={errCls}>{customerErrors.whatsappNO}</p>
                    )}
                  </div>
                  {/* Remarks */}
                  <div className="md:col-span-2">
                    <label className={labelCls}>Remarks</label>
                    <textarea
                      name="remarks"
                      placeholder="Type your remarks here..."
                      value={customerSaveData.remarks}
                      onChange={handleInputChange}
                      className={`${fieldCls} resize-none`}
                      rows={2}
                      disabled={actionText === 'View'}
                    />
                    {customerErrors.remarks && <p className={errCls}>{customerErrors.remarks}</p>}
                  </div>
                  {/* Isactive */}
                  <div className="flex items-end justify-end pb-1">
                    <label
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm font-medium text-[#475569] shadow-sm"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={customerSaveData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-[#cbd5e1] accent-[#2563eb]"
                        disabled={actionText === 'View'}
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                {/* Allocate Site / Store */}
                <div className="mt-6 rounded-xl border border-[#e9edf3] bg-[#f8fafc] p-4">
                  <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-[#0f172a]">
                    <span className="h-4 w-1 rounded-full bg-[#2563eb]" />
                    Allocate Site / Store
                  </h3>

                  {customerSaveData.AllocateStore.map((row, idx) => (
                    <div
                      key={idx}
                      className="mb-3 grid grid-cols-1 gap-4 rounded-xl border border-[#e5e7eb] p-3 shadow-sm md:grid-cols-5"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      {/* Store Name */}
                      <div>
                        <label className={labelCls}>Store Name</label>
                        <select
                          name="AllocateStore.storeID"
                          value={row.storeID}
                          onChange={(e) => handleInputChange(e, idx)}
                          className={`${fieldCls} h-10`}
                          disabled={actionText === 'View'}
                        >
                          <option value="">Choose a store...</option>
                          {storeMasterListData.map((store) => (
                            <option key={store.storeID} value={store.storeID}>
                              {store.storeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* From Date */}
                      <div>
                        <label className={labelCls}>From Date</label>
                        <input
                          type="date"
                          name="AllocateStore.formDate"
                          value={row.formDate}
                          onChange={(e) => handleInputChange(e, idx)}
                          className={`${fieldCls} h-10`}
                          disabled={actionText === 'View'}
                        />
                      </div>
                      {/* To Date */}
                      <div>
                        <label className={labelCls}>To Date</label>
                        <input
                          type="date"
                          name="AllocateStore.toDate"
                          value={row.toDate}
                          onChange={(e) => handleInputChange(e, idx)}
                          className={`${fieldCls} h-10`}
                          disabled={actionText === 'View'}
                        />
                      </div>
                      {/* Discontinued */}
                      <div>
                        <label className={labelCls}>Discontinued</label>
                        <select
                          name="AllocateStore.discontinue"
                          disabled={actionText === 'View'}
                          value={row.discontinue ? 'Y' : 'N'}
                          onChange={(e) =>
                            handleInputChange(
                              {
                                target: {
                                  name: 'AllocateStore.discontinue',
                                  value: e.target.value === 'Y',
                                },
                              },
                              idx
                            )
                          }
                          className={`${fieldCls} h-10`}
                        >
                          <option value="">Choose...</option>
                          <option value="Y">Yes</option>
                          <option value="N">No</option>
                        </select>
                      </div>
                      {/* Default */}
                      <div className="flex flex-col">
                        <label className={labelCls}>Default</label>
                        <div className="flex h-10 items-center">
                          <input
                            type="radio"
                            disabled={actionText === 'View'}
                            name="AllocateStore.default"
                            checked={row.default}
                            onChange={() => {
                              setCustomerSaveData((prev) => ({
                                ...prev,
                                AllocateStore: prev.AllocateStore.map((r, i) => ({
                                  ...r,
                                  default: i === idx,
                                })),
                              }))
                            }}
                            className="h-4 w-4 border-[#cbd5e1] accent-[#2563eb]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {actionText !== 'View' && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        type="button"
                        className="h-9 rounded-lg border border-[#e5e7eb] bg-[#ffffff] px-4 text-sm font-medium text-[#475569] shadow-sm hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        onClick={handleRemoveRow}
                      >
                        Remove
                      </Button>
                      <Button
                        type="button"
                        className="h-9 rounded-lg bg-[#2563eb] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1d4ed8]"
                        onClick={handleAddRow}
                      >
                        Add Row 1
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex justify-end gap-3 border-t border-[#eef1f5] px-6 py-4"
                style={{ backgroundColor: '#ffffff' }}
              >
                <Button
                  type="button"
                  className="h-10 rounded-lg border border-[#e5e7eb] bg-[#ffffff] px-6 text-sm font-medium text-[#475569] shadow-sm hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                  onClick={toggleNewCustomerModalCancel}
                >
                  Cancel
                </Button>
                {actionText !== 'View' && (
                  <Button
                    type="submit"
                    className="h-10 rounded-lg bg-[#2563eb] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
                    onClick={(e) => handleSave(e)}
                  >
                    Submit 1
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMaster