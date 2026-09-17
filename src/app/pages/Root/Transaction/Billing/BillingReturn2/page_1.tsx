import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Zap,
  Keyboard,
  Search,
  ShoppingCart,
  User,
  PauseCircle,
  RefreshCcw,
  Printer,
  PercentCircle,
  Tag,
  X,
  Phone,
  Gift,
  Archive,
  CircleArrowOutUpLeft,
  Receipt,
  Percent,
  Users,
  CheckCircle,
  RotateCcw,
  ShoppingBag,
  FileText,
  Calendar,
  Package,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie'
import { GetAPI, PostAPI } from '../../../../../../services/apiCall'
import { Link, useNavigate } from 'react-router-dom'
import '../../../../../../style.css'
import logoImg from '@/assets/img/logo.png';
import { __getCookieValue } from '@/common/authCookies';


// Type definition for CustomerInfo
interface CustomerInfo {
  firstName: string
  middleName: string
  lastName: string
  mobile: string
}

//! Item Search helpers (Billing @ Return) - 16-09-2026
const normalizeItemSearchText = (value: any) => String(value ?? '').trim().toLowerCase()
const getItemSearchLineCode = (row: any) =>
  normalizeItemSearchText(row?.barcode) || normalizeItemSearchText(row?.itemCode)
const ITEM_SEARCH_ERROR_STYLE = { backgroundColor: '#f7edeb', color: '#ff6242' }
const ITEM_SEARCH_SUCCESS_STYLE = { backgroundColor: '#e3ffea', color: '#3ed665' }
const ITEM_SEARCH_WARNING_STYLE = { backgroundColor: '#fff3cd', color: '#856404' }

const BillingReturn2 = () => {
  const navigate = useNavigate()

  const [showCheckout2, setShowCheckout2] = useState(false);

  //const today = new Date().toISOString().split('T')[0];
  const [today, setToday] = useState('')
  //! FUTURE: enable "open session before billing" prompt when server date is missing
  //! const [showNoSessionPopup, setShowNoSessionPopup] = useState(false)
  const [cookies] = useCookies(['UserId', 'DefaultStoreId', 'UserRole'])
  const getCookieValue = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  // const __getCookieValue = (name: string, redirectOnMissing = true) => {
  //   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  //   const value = match ? match[2] : null

  //   if (!value && redirectOnMissing) {
  //     window.location.href = '/login'
  //     return null
  //   }

  //   return value
  // }

  const [maxFromToDate, setMaxFromToDate] = useState('')
  const [minFromToDate, setMinFromToDate] = useState('')
  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  /*
  const todayDate = new Date(); // today
  const sevenDaysAgo = new Date();  // 7 days ago
  sevenDaysAgo.setDate(todayDate.getDate() - 21);
  const maxFromToDate = formatDate(todayDate); // formatted values
  const minFromToDate = formatDate(sevenDaysAgo);
  */
  //Note: Notis Used
  const getTodayDate = () => {
    const serverDate = new Date(today)

    const year = serverDate.getFullYear()
    const month = String(serverDate.getMonth() + 1).padStart(2, '0')
    const day = String(serverDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`

    /*
    //const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    */
  }

  const [loading, setLoading] = useState(false)
  const [isBtnSaving, setIsBtnSaving] = useState(false)

  const [barCodeInput, setBarCodeInput] = useState('')
  const [scannedItemListData, setScannedItemListData] = useState([])
  const [prevScannedItemListData, setPrevScannedItemListData] = useState([])
  const [deleteItemIndex, setDeleteItemIndex] = useState(null)
  const [imageModal, setImageModal] = useState(false)
  const [paymentListData, setPaymentListData] = useState([])

  const [showCheckout, setShowCheckout] = useState(false)
  const [showSearchBillModal, setShowSearchBillModal] = useState(false)
  const [showSelectBillModal, setShowSelectBillModal] = useState(false)
  const [showBillDetailsModal, setShowBillDetailsModal] = useState(false)
  const [showApplyIssueCreditNoteModal, setShowApplyIssueCreditNoteModal] = useState(false)

  const [isCheckoutSaveRefundModalOpen, setIsCheckoutSaveRefundModalOpen] = useState(false)
  const [checkoutSaveRefundBillDocNum, setCheckoutSaveRefundBillDocNum] = useState(null)
  const [checkoutSaveRefundBillDocEntry, setCheckoutSaveRefundBillDocEntry] = useState(null)

  const [searchBillFromDate, setSearchBillFromDate] = useState('')
  const [searchBillToDate, setSearchBillToDate] = useState('')
  const [searchBillPhoneNumber, setSearchBillPhoneNumber] = useState('')
  const [searchBillCustomerName, setSearchBillCustomerName] = useState('')

  const [selectBillSearchText, setSelectBillSearchText] = useState('')
  const [selectBillListData, setSelectBillListData] = useState([])
  const [filteredSelectBillData, setFilteredSelectBillData] = useState([])
  const [selectBillCurrentPage, setSelectBillCurrentPage] = useState(1)
  const selectBillPerPage = 5
  const [selectedBillID, setSelectedBillID] = useState(null)
  const [selectedBillData, setSelectedBillData] = useState(null)
  const [storedSelectedBill, setStoredSelectedBill] = useState(null)

  const [selectBillDetailsSearchText, setSelectBillDetailsSearchText] = useState('')
  const [selectBillDetailsListData, setSelectBillDetailsListData] = useState([])
  const [filteredSelectBillDetailsData, setFilteredSelectBillDetailsData] = useState([])
  const [selectBillDetailsCurrentPage, setSelectBillDetailsCurrentPage] = useState(1)
  const selectBillDetailsPerPage = 5
  const [selectedBillDetailsID, setSelectedBillDetailsID] = useState(null)
  const [selectedBillDetailsData, setSelectedBillDetailsData] = useState(null)
  const [storedSelectedBillDetails, setStoredSelectedBillDetails] = useState(null)

  const totalPaidAmount = paymentListData
    .filter(
      (payment) =>
        payment.amount &&
        payment.amount > 0 &&
        (payment.availablePaymentmethod.toLowerCase() === 'cash' ||
          payment.availablePaymentmethod.toLowerCase() === 'creditnoteissued')
    )
    .reduce((sum, payment) => sum + Number(payment.amount), 0)

  const [searchBillReturnFromDate, setSearchBillReturnFromDate] = useState('')
  const [searchBillReturnToDate, setSearchBillReturnToDate] = useState('')
  const [searchBillReturnPhoneNumber, setSearchBillReturnPhoneNumber] = useState('')
  const [searchBillReturnCustomerName, setSearchBillReturnCustomerName] = useState('')

  const [showSearchBillReturnModal, setShowSearchBillReturnModal] = useState(false)
  const [showSelectBillReturnModal, setShowSelectBillReturnModal] = useState(false)

  const [selectBillReturnSearchText, setSelectBillReturnSearchText] = useState('')
  const [selectBillReturnListData, setSelectBillReturnListData] = useState([])
  const [filteredSelectBillReturnData, setFilteredSelectBillReturnData] = useState([])
  const [selectBillReturnCurrentPage, setSelectBillReturnCurrentPage] = useState(1)
  const [totalSelectBillReturnPages, setTotalSelectBillReturnPages] = useState(1)
  const [loadingReturn, setLoadingReturn] = useState(false)

  useEffect(() => {
    const fetchServerDate = async () => {
      try {
        setLoading(true)
        let PJsonData = {}
        let PType = ''
        //let cookies = '';
        let responseJson = await GetAPI('/api/Bill/GetServerDate', PType, PJsonData, cookies)
        console.log('fetchServerDate=>', responseJson.data)
        setToday(responseJson.data || '')

        //! FUTURE: if server date is not coming, prompt the user to open the session first
        //! if (!responseJson.data) {
        //!   setShowNoSessionPopup(true)
        //! }

        setLoading(false)
      } catch (error) {
        //! FUTURE: show "open session before billing" popup on error as well
        //! setShowNoSessionPopup(true)
        setLoading(false)
      }
    }

    //if (cookies.AuthToken) {
    fetchServerDate()
    //}
  }, [])

  useEffect(() => {
    if (!today) return

    const [day, month, year] = today.split('-') // API: "DD-MM-YYYY"
    const todayDate = new Date(`${year}-${month}-${day}`) // valid date

    const twentyOneDaysAgo = new Date(todayDate)
    twentyOneDaysAgo.setDate(todayDate.getDate() - 21)

    setMaxFromToDate(formatDate(todayDate))
    setMinFromToDate(formatDate(twentyOneDaysAgo))

    setSearchBillFromDate(formatDate(todayDate))
    setSearchBillToDate(formatDate(todayDate))

    // Keep fetchBillToDate as today's actual date, don't override with server date
    // setFetchBillToDate(formatDate(todayDate)); // Removed this line
  }, [today])

  ///////////////////////////////////////////////////////////////////////////////////////////

  const handleAllStateClear = () => {
    // Clear barcode and scanned items
    setBarCodeInput('')
    setScannedItemListData([])
    setPrevScannedItemListData([])
    setDeleteItemIndex(null)
    setImageModal(false)

    // Clear payment data
    setPaymentListData((prevData) => prevData.map((item) => ({ ...item, amount: '' })))

    // Clear checkout states
    setShowCheckout(false)
    setCheckoutSaveRefundBillDocNum(null)
    setCheckoutSaveRefundBillDocEntry(null)

    // Clear search bill states
    setSearchBillFromDate(formatDate(new Date()))
    setSearchBillToDate(formatDate(new Date()))
    setSearchBillPhoneNumber('')
    setSearchBillCustomerName('')
    setShowSearchBillModal(false)

    // Clear select bill states
    setSelectBillSearchText('')
    setSelectBillListData([])
    setFilteredSelectBillData([])
    setSelectBillCurrentPage(1)
    setSelectedBillID(null)
    setSelectedBillData(null)
    setStoredSelectedBill(null)
    setShowSelectBillModal(false)

    // Clear bill details states
    setSelectBillDetailsSearchText('')
    setSelectBillDetailsListData([])
    setFilteredSelectBillDetailsData([])
    setSelectBillDetailsCurrentPage(1)
    setSelectedBillDetailsID(null)
    setSelectedBillDetailsData(null)
    setStoredSelectedBillDetails(null)
    setShowBillDetailsModal(false)

    // Clear bill return states
    setSearchBillReturnFromDate('')
    setSearchBillReturnToDate('')
    setSearchBillReturnPhoneNumber('')
    setSearchBillReturnCustomerName('')
    setShowSearchBillReturnModal(false)
    setShowSelectBillReturnModal(false)
    setSelectBillReturnSearchText('')
    setSelectBillReturnListData([])
    setFilteredSelectBillReturnData([])
    setSelectBillReturnCurrentPage(1)

    // Clear credit note modal
    setShowApplyIssueCreditNoteModal(false)

    // Clear customer information
    setCustomerInfo({
      firstName: '',
      middleName: '',
      lastName: '',
      mobile: '',
    })
    setCustomerSaveData({
      customerFirstName: '',
      customerMiddleName: '',
      customerLastName: '',
      mobile: '',
      whatsAppNo: '',
    })
    setCustomerExists(false)
    setShowNewCustomerForm(false)
    setIsFetchingCustomer(false)
    setFetchedCustomerData(null)
    setSelectedCustomerData(null)
    setStoredCustomer(null)
    setSelectedCustomerID(null)

    // Clear keyboard navigation states
    setSelectedItemRowIndex(0)
    setSelectedInvoiceRowIndex(0)
    setIsFocusedOnItemTable(false)
    setSelectedItemsSet(new Set())

    //! Clear Item Search (Billing @ Return)
    resetItemSearchState()

    // Focus back to barcode input
    if (inputBarCodeRef.current) {
      inputBarCodeRef.current.focus()
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchStoreWisePaymentListData = async () => {
      try {
        setLoading(true)
        let PJsonData = {}
        let PType = '?StoreID=' + __getCookieValue('DefaultStoreId') //'?StoreID=' + cookies.DefaultStoreId;
        //let cookies = '';
        let responseJson = await GetAPI(
          '/api/StoreMaster/GetStoreWisePayment',
          PType,
          PJsonData,
          cookies
        )
        //console.log('fetchStoreWisePaymentListData=>', responseJson);

        /*
        const serverDateHeader = responseJson.headers.date; 
        const serverDate = new Date(serverDateHeader); 
        //console.log("Server Date =>", serverDateHeader, serverDate);
        setToday(serverDate); 
        */

        const modifiedData = (responseJson.data || []).map((item) => ({
          ...item,
          amount: '',
        }))
        setPaymentListData(modifiedData || [])
        //setPaymentListData(responseJson.data || []);
        setLoading(false)
      } catch (error) {
        setPaymentListData([])
        setLoading(false)
      }
    }

    //if (cookies.AuthToken) {
    fetchStoreWisePaymentListData()
    //}
  }, [])

  //! My code Focus checkout modal when it opens and tap focus
  useEffect(() => {
    if (showCheckout && checkoutModalRef.current) {
      // Focus the modal
      checkoutModalRef.current.focus()

      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault()
          e.stopPropagation()

          // Get all focusable elements within the modal
          const focusableElements = checkoutModalRef.current?.querySelectorAll(
            'button, input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
          )

          if (!focusableElements || focusableElements.length === 0) return

          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey) {
            // Shift + Tab: move backwards
            if (document.activeElement === firstElement) {
              lastElement.focus()
            } else {
              const currentIndex = Array.from(focusableElements).indexOf(
                document.activeElement as HTMLElement
              )
              if (currentIndex > 0) {
                ;(focusableElements[currentIndex - 1] as HTMLElement).focus()
              }
            }
          } else {
            // Tab: move forwards
            if (document.activeElement === lastElement) {
              firstElement.focus()
            } else {
              const currentIndex = Array.from(focusableElements).indexOf(
                document.activeElement as HTMLElement
              )
              if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
                ;(focusableElements[currentIndex + 1] as HTMLElement).focus()
              } else {
                firstElement.focus()
              }
            }
          }
        }
      }

      // Add event listener
      document.addEventListener('keydown', handleKeyDown, true)

      // Cleanup
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true)
      }
    }
  }, [showCheckout])

  //Note:
  const fetchSelectedBillDeatilsList = async (selectedBillID) => {
    setLoading(true)
    try {
      let PJsonData = {}
      let PType = `?BillID=${selectedBillID}`
      let responseJson = await GetAPI(`/api/Bill/GetSaleBill`, PType, PJsonData, cookies)
      //const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : []; //Note: As the format was not amn Array
      const responseJsonData = responseJson.data ? [responseJson.data] : []

      // Initialize selectItem property for each item in objDetails
      const dataWithSelectItem = responseJsonData.map((bill: any) => ({
        ...bill,
        objDetails: (bill.objDetails || []).map((item: any) => ({
          ...item,
          selectItem: false, // Initialize selectItem property
        })),
      }))

      setSelectBillDetailsListData(dataWithSelectItem || [])
      setFilteredSelectBillDetailsData(dataWithSelectItem || [])
      setLoading(false)
    } catch (error) {
      setSelectBillDetailsListData([])
      setFilteredSelectBillDetailsData([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBillDetailsSearch = (searchText) => {
    setSelectBillDetailsSearchText(searchText)
    setSelectBillDetailsCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredSelectBillDetailsData(selectBillDetailsListData)
    } else {
      //const selectBillDetailsListData_2 = Array.isArray(selectBillDetailsListData) ? selectBillDetailsListData : [];
      const filteredData = selectBillDetailsListData.filter(
        (item) =>
          item.barcode.toLowerCase().includes(searchText.toLowerCase()) ||
          item.itemCode.toLowerCase().includes(searchText.toLowerCase()) ||
          item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.quantity.toLowerCase().includes(searchText.toLowerCase()) ||
          item.netAmt.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredSelectBillDetailsData(filteredData)
    }
  }
  const totalSelectBillDetailsPages = Math.ceil(
    filteredSelectBillDetailsData.length / selectBillDetailsPerPage
  )
  const startSelectBillDetailsIndex = (selectBillDetailsCurrentPage - 1) * selectBillDetailsPerPage
  const currentSelectBillDetails = filteredSelectBillDetailsData.slice(
    startSelectBillDetailsIndex,
    startSelectBillDetailsIndex + selectBillDetailsPerPage
  )

  // Calculate total bill amount from selected items with return quantities
  const totalBillAmount = useMemo(() => {
    const currentBill = (currentSelectBillDetails as any)?.[0]
    if (!currentBill || !Array.isArray(currentBill.objDetails)) return 0
    
    return currentBill.objDetails
      .filter((item: any) => item.selectItem)
      .reduce((total: number, item: any) => {
        const returnQty = item.returnQuantity !== undefined ? item.returnQuantity : item.quantity
        const proportionalAmt = (item.netAmt / item.quantity) * returnQty
        return total + proportionalAmt
      }, 0)
  }, [currentSelectBillDetails])

  //console.log("currentSelectBillDetails=>",currentSelectBillDetails)
  useEffect(() => {
    if (currentSelectBillDetails.length === 0) {
      setStoredSelectedBillDetails(null)
      setSelectedBillDetailsID(null)
      setSelectedBillDetailsData(null)
    } /*else {
      const updatedBillDetails = currentSelectBillDetails.map(bill => {
        const updatedDetails = bill.objDetails.map(item => ({
          ...item,
          returnQty: item.quantity,
          returnAmount: item.netAmt
        }));

        return {
          ...bill,
          objDetails: updatedDetails
        };
      });

      setStoredSelectedBillDetails(updatedBillDetails);
    }*/
  }, [currentSelectBillDetails])

  //Note:
  const fetchSearchBillList = async () => {
    setLoading(true)
    try {
      let PJsonData = {}
      //! Arindam da code
      // let formattedFromDate = searchBillFromDate ? new Date(searchBillFromDate).toLocaleDateString('en-GB').replace(/\//g, '-'): '';
      // let formattedToDate = searchBillToDate ? new Date(searchBillToDate).toLocaleDateString('en-GB').replace(/\//g, '-'): '';
      // let PType = `?FromDate=${formattedFromDate}&ToDate=${formattedToDate}&Mobile=${searchBillPhoneNumber}&CustomerName=${searchBillCustomerName}`;

      //! My Code
      let formattedFromDate = fetchBillFromDate
        ? new Date(fetchBillFromDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        : ''
      let formattedToDate = fetchBillToDate
        ? new Date(fetchBillToDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        : ''
      let PType = `?FromDate=${formattedFromDate}&ToDate=${formattedToDate}&Mobile=${customerSaveData.mobile}&CustomerName=${searchBillCustomerName}`
      /*
      let PType = "";
      if (searchBillFromDate) {
        PType += `FromDate=${searchBillFromDate}&`;
      }      
      if (searchBillToDate) {
        PType += `ToDate=${searchBillToDate}&`;
      }      
      if (searchBillPhoneNumber) {
        PType += `Mobile=${searchBillPhoneNumber}&`;
      }      
      if (searchBillCustomerName) {
        PType += `CustomerName=${searchBillCustomerName}&`;
      }      
      PType = PType.endsWith("&") ? PType.slice(0, -1) : PType;
      */
      //let responseJson = await GetAPI( `/api/Bill/GetAllSaleBill`, PType, PJsonData, cookies);
      let responseJson = await GetAPI(`/api/Bill/GetAllSaleBillRecall`, PType, PJsonData, cookies)
      const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : []
      setSelectBillListData(responseJsonData || [])
      setFilteredSelectBillData([...(responseJsonData || [])].reverse())
      //! New invoice list -> old item list / filter is no longer valid
      resetItemSearchState()
      setLoading(false)
    } catch (error) {
      setSelectBillListData([])
      setFilteredSelectBillData([])
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  const handleSelectBillSearch = (searchText) => {
    setSelectBillSearchText(searchText)
    setSelectBillCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredSelectBillData([...selectBillListData].reverse())
    } else {
      const filteredData = selectBillListData.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
          item.billDate.includes(searchText)
      )
      setFilteredSelectBillData([...filteredData].reverse())
    }
  }
  const totalSelectBillPages = Math.ceil(filteredSelectBillData.length / selectBillPerPage)
  const startSelectBillIndex = (selectBillCurrentPage - 1) * selectBillPerPage
  const currentSelectedBill = filteredSelectBillData.slice(
    startSelectBillIndex,
    startSelectBillIndex + selectBillPerPage
  )
  useEffect(() => {
    if (currentSelectedBill.length === 0) {
      setStoredSelectedBill(null)
      setSelectedBillID(null)
      setSelectedBillData(null)
    }
  }, [currentSelectedBill])

  //Note:
  const toggleSearchBillModal = () => {
    //setSearchBillFromDate(getTodayDate());    //setSearchBillFromDate('');
    //setSearchBillToDate(getTodayDate());      //setSearchBillToDate('');
    setSearchBillPhoneNumber('')
    setSearchBillCustomerName('')

    setSelectedBillDetailsData(null)
    //setPaymentListData([]);
    setScannedItemListData([])
    setPrevScannedItemListData([])

    if (totalBillAmount > 0) {
      //toggleCheckout();
      setShowCheckout(false)
    }

    setShowSearchBillModal((prev) => !prev)
  }
  //Note:
  const toggleSelectBillModal = () => {
    setSelectBillSearchText('')
    /*setSelectBillListData([]);
    setFilteredSelectBillData([]);
    setSelectBillCurrentPage(1);*/
    setSelectedBillID(null)
    setSelectedBillData(null)
    setStoredSelectedBill(null)

    //setShowSelectBillModal((prev) => !prev);
    setShowSelectBillModal((prev) => {
      if (!prev) {
        fetchSearchBillList()
      }
      return !prev
    })
  }
  //Note:
  const toggleBillDetailsModal = () => {
    setSelectBillDetailsSearchText('')
    /*setSelectBillDetailsListData([]);
    setFilteredSelectBillDetailsData([]);
    setSelectBillDetailsCurrentPage(1);*/
    setSelectedBillDetailsID(null)
    setSelectedBillDetailsData(null)
    setStoredSelectedBillDetails(null)

    //setShowBillDetailsModal((prev) => !prev);
    setShowBillDetailsModal((prev) => {
      if (!prev) {
        fetchSelectedBillDeatilsList(selectedBillID)
      }
      return !prev
    })
  }
  //Note:
  const toggleIssueCreditNoteModal = () => {
    setShowApplyIssueCreditNoteModal((prev) => !prev)
  }
  //Note:
  const toggleCheckout = () => {
    setShowCheckout((prev) => !prev)
  }
  //Note:
  const handleGenerateCreditNote = () => {
    // Check if items are selected in the current bill details
    const currentBill = (currentSelectBillDetails as any)?.[0]
    const hasSelectedItems = currentBill?.objDetails?.some((item: any) => item.selectItem)

    if (hasSelectedItems) {
      // Always process the current selection to ensure fresh data
      processSelectedItemsForReturn()
      
      // Show checkout immediately
      setTimeout(() => {
        // Calculate total from currently selected items
        const selectedItems = currentBill.objDetails.filter((item: any) => item.selectItem)
        const currentTotal = selectedItems.reduce((sum: number, item: any) => sum + (item.netAmt || 0), 0)
        
        if (currentTotal > 0) {
          setShowCheckout(true)
        } else {
          toast.error('Total return amount must be greater than 0!', {
            style: { backgroundColor: '#f7edeb', color: '#ff6242' },
          })
        }
      }, 100)
      return
    }

    // If no items selected in current bill, check scanned items
    if (scannedItemListData.length === 0) {
      toast.error('Please select items to return before generating credit note!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    // Check if total bill amount is greater than 0
    if (totalBillAmount <= 0) {
      toast.error('Total return amount must be greater than 0!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    // Open checkout modal
    setShowCheckout(true)
  }
  //Note:
  const toggleImageModal = () => {
    setImageModal((prev) => !prev)
  }

  //Note:
  const handleCheckoutPaymentAmountChange = (index, newValue) => {
    setPaymentListData((prevState) =>
      prevState.map((payment, i) => (i === index ? { ...payment, amount: newValue } : payment))
    )
  }
  //Note:
  const handleSelectBillCheckboxChange = (BillID) => {
    const checkedBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))

    if (checkedBoxes.length > 1) {
      setSelectedBillID(null)
    } else if (checkedBoxes.length === 1) {
      setSelectedBillID(checkedBoxes[0].value)
    } else {
      setSelectedBillID(null)
    }
  }
  //Note:
  const handleSelectBillDetailsCheckboxChange = (lineNum) => {
    //const selectedIDs = selectedBillDetailsID ? selectedBillDetailsID.split(",") : [];
    const selectedIDs = selectedBillDetailsID
      ? selectedBillDetailsID.split(',').filter(Boolean)
      : []
    const updatedIDs = selectedIDs.includes(lineNum.toString())
      ? selectedIDs.filter((id) => id !== lineNum.toString())
      : [...selectedIDs, lineNum.toString()]

    setSelectedBillDetailsID(updatedIDs.join(','))
  }
  //Note:
  const handleSelectAllBillDetails = () => {
    //console.log("handleSelectAllBillDetails=>",currentSelectBillDetails)
    if (
      Array.isArray(currentSelectBillDetails) &&
      currentSelectBillDetails.length > 0 &&
      Array.isArray(currentSelectBillDetails[0].objDetails) &&
      currentSelectBillDetails[0].objDetails.length > 0
    ) {
      const allLineNums = currentSelectBillDetails[0].objDetails.map((item) =>
        item.lineNum.toString()
      )
      /*
      setSelectedBillDetailsID(
        (selectedBillDetailsID || "").split(",").length === allLineNums.length
          ? ""
          : allLineNums.join(",")
      );
      */
      const selectedIDs = selectedBillDetailsID
        ? selectedBillDetailsID.split(',').filter(Boolean)
        : []
      const allSelected = allLineNums.every((id) => selectedIDs.includes(id))
      setSelectedBillDetailsID(allSelected ? '' : allLineNums.join(','))
    }
  }
  //Note:
  const handleQuantityChange = (index, change) => {
    setScannedItemListData((prevList) =>
      prevList.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
              totalPrice: (item.quantity + change) * item.retailPrice,
            }
          : item
      )
    )
  }
  //Note:
  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      //! Keep this Enter away from the page-level keyboard handler (invoice / return shortcuts)
      event.stopPropagation()
      const searchText = barCodeInput.trim()
      setBarCodeInput('')
      if (!searchText) return
      handleSelectBarcodeItem(searchText)
    }
  }
  //Note: handleSelectBarcodeItem is now part of the Item Search block (see "Item Search (Billing @ Return) functions")
  //Note:
  const confirmDeleteItem = () => {
    if (deleteItemIndex !== null) {
      setScannedItemListData((prevData) => prevData.filter((_, i) => i !== deleteItemIndex))
      setDeleteItemIndex(null)
    }
  }
  //Note:
  const handleBillDetailsReturnClick = () => {
    toggleBillDetailsModal()
    toggleSelectBillModal()
    toggleSearchBillModal()

    console.log('Selected Bill Details ID:', currentSelectBillDetails) //selectedBillDetailsID
    const selectedBillDetailsData = currentSelectBillDetails
    setSelectedBillDetailsData(selectedBillDetailsData)
    /*Note: As per Old Logic
    const updatedPaymentList = selectedBillDetailsData[0].objPayment.map(payment => ({
        ...payment,
        amount: payment.value
    }));
    setPaymentListData(updatedPaymentList);
    */
    /* Note: As per new Logic */
    //console.log(paymentListData);
    const billPayments = selectedBillDetailsData?.[0]?.objPayment || []
    const updatedPaymentList = paymentListData.map((payment) => {
      const matched = billPayments.find(
        (b) =>
          //b.modeOfPaymentName?.toLowerCase().trim() === payment.paymentModeName?.toLowerCase().trim()
          b.modeOfPayementID === payment.paymentModeID
      )

      return {
        ...payment,
        amount: '', //matched?.value || '', // Use value if match found, else keep blank
        modeOfPaymentName: payment.paymentModeName,
        modeOfPayementID: payment.paymentModeID,
        billID: matched?.billID ?? '',
        lineNum: matched?.lineNum ?? '',
        upItransactionID: matched?.upItransactionID ?? '',
        cardNo: matched?.cardNo ?? '',
        cardHolderName: matched?.cardHolderName ?? '',
        cardValidity: matched?.cardValidity ?? '',
        cardType: matched?.cardType ?? '',
        cardCommPercent: matched?.cardCommPercent ?? '',
        cardCommAmt: matched?.cardCommAmt ?? '',
        forexRate: matched?.forexRate ?? '',
        forexTender: matched?.forexTender ?? '',
        forexAmt: matched?.forexAmt ?? '',
        forexBalance: matched?.forexBalance ?? '',
      }
    })
    // const updatedPaymentList = paymentListData.map(payment => ({
    //     ...payment,
    //     amount: payment.value,
    //     modeOfPaymentName: payment.paymentModeName,
    //     modeOfPayementID: payment.paymentModeID
    //     /*paymentModeName: payment.paymentModeName,
    //     paymentModeID: payment.paymentModeID*/
    // }));
    setPaymentListData(updatedPaymentList)

    //setScannedItemListData(selectedBillDetailsData[0].objDetails);
    //setPrevScannedItemListData(selectedBillDetailsData[0].objDetails);

    //! arindam da code
    /*
    const selectedLineNums = (selectedBillDetailsID || "").split(",").map((id) => id.trim()).filter((id) => id !== "");
    const allDetails = selectedBillDetailsData[0]?.objDetails || [];
    const filteredDetails = allDetails.filter((item) =>
      selectedLineNums.includes(item.lineNum.toString())
    );
    setScannedItemListData(filteredDetails);
    setPrevScannedItemListData(filteredDetails);
    */
    //! my code
    // Filter items based on selectItem property instead of selectedBillDetailsID
    const allDetails = selectedBillDetailsData[0]?.objDetails || []
    const filteredDetails = allDetails.filter((item: any) => item.selectItem === true)

    // Add return quantity properties to selected items
    const itemsWithReturnQty = filteredDetails.map((item: any) => ({
      ...item,
      returnQty: 0, // Return Quantity starts at 0
      returnAmount: 0.0, // Return Amount starts at 0.00
      originalQuantity: item.quantity, // Store original quantity
      originalNetAmt: item.netAmt, // Store original net amount
    }))

    console.log('Items selected for return:', itemsWithReturnQty)
    setScannedItemListData(itemsWithReturnQty)
    setPrevScannedItemListData(itemsWithReturnQty)
  }
  //Note:
  const handleSaveRefundBill = async () => {
    //const totalPaymentAmount = paymentListData.filter((payment) => payment.amount && payment.amount > 0).reduce((sum, payment) => sum + Number(payment.amount), 0);
    //console.log("totalBillAmount, totalPaymentAmount=>", totalBillAmount,"-",totalPaymentAmount,paymentListData)
    // if (totalBillAmount !== totalPaymentAmount) {
    //   toast.error('Total bill amount and payment amount do not match!', {
    //     style: { backgroundColor: '#f7edeb', color: '#ff6242' },
    //   })
    //   return
    // }

    //! Validation comment on 19-11-2025
    // if (totalBillAmount !== totalPaidAmount) {
    if (Math.round(totalBillAmount) !== Math.round(totalPaidAmount)) {
    toast.error("Total bill amount and payment amount do not match!", { style: { backgroundColor: "#f7edeb", color: "#ff6242" },});
      return;
    }

    setIsBtnSaving(true)    
    const objDetails = scannedItemListData.map((item, index) => {
      
      // Use returnQuantity if available, otherwise use quantity
      const actualReturnQty = item?.returnQuantity !== undefined ? item.returnQuantity : (item?.returnQty !== undefined ? item.returnQty : item?.quantity || 0)
      
      console.log("Arnab=>", scannedItemListData, item.originalQuantity, actualReturnQty)

      // Calculate proportional netAmt based on return quantity
      const originalQty = item?.originalQuantity || item?.quantity || 1;
      const originalAmt = item?.originalNetAmt || item?.netAmt || 0;
      const proportionalNetAmt = (originalAmt / originalQty) * actualReturnQty;

      const originalPromoAmt = item?.promotionAmt || 0;
      const proportionalPromoAmt = (originalPromoAmt / originalQty) * actualReturnQty;

      const originalDiscountAmt = item?.discountAmt || 0;
      const proportionalDiscountAmt = (originalDiscountAmt / originalQty) * actualReturnQty;
      
      return {
        billID: 0, //item.billID,
        lineNum: index + 1, //item.lineNum,
        itemCode: item?.itemCode || '',
        itemName: item?.itemName || '',
        barcode: item?.barcode || '',
        mrp: item?.mrp || 0,
        rsp: item?.rsp || 0,
        discountAmt: proportionalDiscountAmt || 0,          //item?.discountAmt || 0,
        promotionAmt: proportionalPromoAmt || 0,            //item?.promotionAmt || 0,
        netPrice: item?.netPrice || 0,
        quantity: actualReturnQty,
        taxRate: item?.taxRate || 0,
        netAmt: proportionalNetAmt,
        totalDiscAmt: proportionalDiscountAmt,                //item?.totalDiscAmt || 0,
        totalPromotionAmt: proportionalPromoAmt,              //item?.totalPromotionAmt || 0,
        remarks: item?.remarks || '',
        hsNorSACcode: item?.hsNorSACcode || '',
        promotionID: item?.promotionID || 0,
        disCountID: item?.disCountID || 0,
        originalBillID: item?.originalBillID || 0,                //item.billID,
        originalBillLineNum: item?.originalBillLineNum || 0,
        returnBillID: item?.billID || 0,                          //item.returnBillID,
        returnBillLineNum: item?.lineNum || 0,                    //item.returnBillLineNum
        salesPersonID: item?.salesPersonID || 0
      }
    })
    const objPayment = paymentListData.filter((payment) => payment.amount && payment.amount > 0 && (payment.availablePaymentmethod.toLowerCase() === 'cash' || payment.availablePaymentmethod.toLowerCase() === 'creditnoteissued')).map((payment, index) => ({
        billID: 0, //payment.billID,
        lineNum: index + 1, //payment.lineNum,
        modeOfPayementID: payment?.modeOfPayementID || 0,
        modeOfPaymentName: payment?.modeOfPaymentName || '',
        value:  Number(payment?.amount || 0),
        upItransactionID: payment?.upItransactionID || '',
        cardNo: payment?.cardNo || '',
        cardHolderName: payment?.cardHolderName || '',
        cardValidity: payment?.cardValidity || '',
        cardType: payment?.cardType || '',
        cardCommPercent: payment?.cardCommPercent || 0,
        cardCommAmt: payment?.cardCommAmt || 0,
        forexRate: payment?.forexRate || 0,
        forexTender: payment?.forexTender || 0,
        forexAmt: payment?.forexAmt || 0,
        forexBalance: payment?.forexBalance || 0,
        returnDocumentID: selectedBillDetailsData?.[0]?.billID || 0,
        returnDocumentNo: selectedBillDetailsData?.[0]?.billNo || '',
        //returnDocumentDate: selectedBillDetailsData?.[0]?.billDate || ''
    }))
    
    const formData = {
      billID: 0, //selectedBillDetailsData[0].billID,
      billNo: '', //selectedBillDetailsData[0].billNo,
      billDate: today, //today.toLocaleDateString('en-GB').split('/').join('-'), //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),      //selectedBillDetailsData[0].billDate,
      storeID: selectedBillDetailsData[0]?.storeID || 0, //getCookieValue('DefaultStoreId'), //cookies.DefaultStoreId, // Get store ID
      storeCode: selectedBillDetailsData[0]?.storeCode || '',
      storeName: selectedBillDetailsData[0]?.storeName || '',
      terminalNo: selectedBillDetailsData[0]?.terminalNo || '',
      customerID: selectedBillDetailsData[0]?.customerID || 0,
      customerName: selectedBillDetailsData[0]?.customerName || '',
      promotionID: selectedBillDetailsData[0]?.promotionID || 0,
      discountID: selectedBillDetailsData[0]?.discountID || 0,
      totalNoOfItem: scannedItemListData?.length || 0,
      billSaleAmt: selectedBillDetailsData[0]?.billSaleAmt || 0,
      billReturnAmt: Math.round(totalBillAmount) || 0, //selectedBillDetailsData[0].billReturnAmt
      billMRPAmt: selectedBillDetailsData[0]?.billMRPAmt || 0,
      billBasicAmt: selectedBillDetailsData[0]?.billBasicAmt || 0,
      billGrossAmt: selectedBillDetailsData[0]?.billGrossAmt || 0,
      billDiscAmt: selectedBillDetailsData[0]?.billDiscAmt || 0,
      billNetAmt: selectedBillDetailsData[0]?.billNetAmt || 0,
      billChargeAmt: selectedBillDetailsData[0]?.billChargeAmt || 0,
      // billRoundoffAmt: selectedBillDetailsData[0]?.billRoundoffAmt || 0,
      billRoundoffAmt: Math.abs(
        Math.round(totalBillAmount) - totalBillAmount
      ).toFixed(2), //selectedBillDetailsData[0].billRoundoffAmt
      billNetPayableAmt: Math.round(totalBillAmount) || 0, //selectedBillDetailsData[0].billNetPayableAmt
      billRemarks: selectedBillDetailsData[0]?.billRemarks || '',
      noOfBillPrint: selectedBillDetailsData[0]?.noOfBillPrint || 0,
      originalDocumentID: selectedBillDetailsData[0]?.originalDocumentID || 0,
      originalDocumentNo: selectedBillDetailsData[0]?.originalDocumentNo || '',
      originalDocumentDate: selectedBillDetailsData[0]?.originalDocumentDate || '',
      returnDocumentID: selectedBillDetailsData[0]?.billID || 0, //selectedBillDetailsData[0].returnDocumentID,
      returnDocumentNo: selectedBillDetailsData[0]?.billNo || '', //selectedBillDetailsData[0].returnDocumentNo,
      returnDocumentDate: selectedBillDetailsData[0]?.billDate || '',
      // returnDocumentDate: getTodayDate(),                                                   //Use today's date instead of original bill date
      //! Arindam da code old one for enteredBy
      // enteredBy: selectedBillDetailsData[0]?.enteredBy || 0, //getCookieValue('UserId'), //cookies.UserId, //Get Logged-In ID
      //!new 10-03-2026 - to ensure correct userid passes for return the bill
      enteredBy: __getCookieValue('UserId'),    //getCookieValue('UserId') || 0, //cookies.UserId, //Get Logged-In ID
      salesPersonID: selectedBillDetailsData[0]?.salesPersonID || 0,
      usedFor: 'I',
      coupon1: '',
      coupon2: '',
      objDetails: objDetails,
      objPayment: objPayment,
    }
    console.log('handleSaveRefundBill=>', formData)

    try {
      //let cookies = '';
      const response = await PostAPI('/api/BillRep/PostReturnBill', '', formData, cookies)
      console.log('Return Bill has been saved successfully:', response)

      if (response.data[0].returnCode === 'Y') {
        toast.success(`Return Bill has been saved successfully!`, {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        }) //response.data[0].returnMsg
        //handleAllStateClear();
        setScannedItemListData([])
        //setPaymentListData([]);
        const clearedPaymentList = paymentListData.map((payment) => ({
          ...payment,
          amount: '', // Clear the amount
          upItransactionID: '', // Clear UPI transaction ID
          cardNo: '', // Clear Card No if any
          showNote: false, // Hide note field
        }))
        setPaymentListData(clearedPaymentList)

        // Clear right side table (bill details)
        setSelectBillDetailsListData([])
        setFilteredSelectBillDetailsData([])
        setSelectedBillDetailsID(null)
        setSelectedBillDetailsData(null)
        setStoredSelectedBillDetails(null)

        //! Item Search: bills changed after return, fetch fresh next time
        billDetailsCacheRef.current = {}
        setAvailableItemList([])

        setCheckoutSaveRefundBillDocNum(response.data[0].returnDocNum)
        setCheckoutSaveRefundBillDocEntry(response.data[0].returnDocEntry)
        setShowCheckout(false)
        setIsCheckoutSaveRefundModalOpen(true)
      } else if (response.data[0].returnCode === 'F') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else if (response.data[0].returnCode === 'N') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else {
        toast.error('Failed to Save Return Bill. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
      setIsBtnSaving(false)
    } catch (error) {
      console.error('Error saving return bill:', error)
      toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      setIsCheckoutSaveRefundModalOpen(false)
      setIsBtnSaving(false)
    }
  }
  //Note:
  const handleBillPrint = () => {
    //console.log("Printing bill...");
    //window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    let UserId = __getCookieValue("UserId");
    let checkoutSaveRefundBillDocEN = checkoutSaveRefundBillDocEntry; //'DB10000042';
    //window.open(`http://deehub.connectcloud365.com:25693/web/WebForm1.aspx?id1=2&id2=${checkoutSaveRefundBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    window.open(`${import.meta.env.VITE_SERVER_DEV_REPORT}` + `/web/WebForm1.aspx?id1=2&id2=${checkoutSaveRefundBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    handleAllStateClear();
    setIsCheckoutSaveRefundModalOpen(false);
  };

  const handleBillPrint_v2 = async () => {
    const responseJson = await GetAPI(
      `/api/Bill/GetBillPrint?BillId=${checkoutSaveRefundBillDocEntry}`,
      '',
      {},
      cookies
    )

    if (responseJson) {
      printThermalReceipt(responseJson.data)
    }
    handleAllStateClear()
    setIsCheckoutSaveRefundModalOpen(false);
  }
  const printThermalReceipt = (data) => {
    // --- exact same logic as Receipt.jsx ---
    const taxMap = {}
    if (data.objHSNTax) {
      data.objHSNTax.forEach((t) => {
        if (!taxMap[t.taxType]) taxMap[t.taxType] = 0
        taxMap[t.taxType] += t.totTypeTaxAmt
      })
    }

    // item rows — exact same JSX as Receipt.jsx <tbody>
    const itemRows = (data.objItem || []).map((item, index) => `      
      <tr>
        <td>${index + 1}</td>
        <td>
          <span class="item-name">
            ${item.itemName.length > 15
              ? item.itemName.replace(/^(\S+\s+\S+)/, '$1<br/>')
              : item.itemName + '<br/>&nbsp;'}
            </span>
            <span class="item-sub" style="font-weight:bold;">
            ${item.itemName.length > 15 ? item.itemCode : ' ' + item.itemCode}
          </span><br/>
          <span class="item-sub">HSN : ${item.hsNorSACcode}</span>
        </td>
        <td style="text-align:center">
          <span class="item-name">${item.quantity}<br/>${item.saleUOM}</span><br/>
          <span class="item-sub" style="white-space:nowrap;">${(((item.grossAmt - item.netAmt) / item.grossAmt * 100) > 0) ? (((item.grossAmt - item.netAmt) / item.grossAmt * 100).toFixed(2) + '%') : ''}</span>
        </td>
        <td style="text-align:right">
          <span class="item-name">${(item.mrp ?? 0).toFixed(2)}</span><br/><br/>
          <span class="item-sub">${(item.taxRate ?? 0).toFixed(2)}%</span>
        </td>
        <td style="text-align:right">${(item.netAmt ?? 0).toFixed(2)}</td>
      </tr>
    `).join('')

    // tax summary rows — exact same as Receipt.jsx Object.entries(taxMap).map
    const taxSummaryRows = Object.entries(taxMap).map(([type, amount]) => `
      <tr>
        <td>${type}</td>
        <td style="text-align:right">${amount.toFixed(2)}</td>
      </tr>
    `).join('')

    // HSN rows — exact same as Receipt.jsx data.objHSNTax.map
    const hsnRows = (data.objHSNTax || []).map((t, idx) => `
      <tr>
        <td>${t.taxType}</td>
        <td style="text-align:right">${t.rate}%</td>
        <td style="text-align:right">${(t.totTaxableAmt ?? 0).toFixed(2)}</td>
        <td style="text-align:right">${(t.totTypeTaxAmt ?? 0).toFixed(2)}</td>
      </tr>
    `).join('')

    // tender amount rows — 
    const refundRows = data.refund > 0 ? `<p class="bold">Refund &nbsp;: ₹${data.refund.toFixed(2)}</p>` : '';    

    // payment rows — exact same as Receipt.jsx data.objPayment.map
    const paymentRows = (data.objPayment || []).map((p, idx) => `
      <p class="bold">
        Payment : ${p.modeOfPaymentName} — ₹${(p.paymentValue ?? 0).toFixed(2)} <br/>
        ${refundRows}
      </p>
    `).join('')

    const html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>Receipt</title>
      <style>
        /* CSS from Receipt App (index.css) - proven to print correctly */
        @page { size: 80mm auto; margin: 2mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Calibri', monospace; font-size: 12px; width: 68mm; max-width: 68mm; margin: 0; padding: 0 1mm 0 0; color: #000; background: #fff; }
        .center       { text-align: center; }
        .bold         { font-weight: bold; }
        .shop-name    { font-size: 14px; font-weight: 800; margin-bottom: 5px; }
        .bill-no      { font-weight: bold; }
        .section-title {
          font-size: 12px; font-weight: bold; text-align: center; margin: 4px 0;
          border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 4px 0;
        }
        .solid-divider { border-top: 1px solid #000; margin: 4px 0; }
        table          { width: 100%; border-collapse: collapse; table-layout: fixed; }
        th             { font-size: 10px; padding: 3px 2px; border-bottom: 1px solid #000; text-align: left; font-weight: 600; overflow: hidden; word-wrap: break-word; }
        td             { font-size: 11px; padding: 2px 1px; vertical-align: top; overflow: visible; word-wrap: break-word; }
        .item-name     { font-weight: 600; display: block; margin-bottom: 1px; }
        .item-sub      { font-size: 9px; }
        .total-row td  { font-weight: bold; font-size: 13px; border-top: 1px solid #000; padding-top: 4px; }
        p              { margin: 2px 0; font-size: 11px; }
        p span         { font-weight: normal; }
      </style>
    </head>
    <body>

      <!-- exact Receipt.jsx render order -->

      <div style="text-align:center">
        <img src="${logoImg}" alt="Logo" style="max-width:80px;margin-bottom:4px"/>
      </div>

      <p class="center shop-name">DEEHUB LIFESTYLE LIMITED</p>
      <p class="center bold">Store Name : <span>${data.storeName}</span></p>
      ${data.billAddress ? `<p class="center bold">${data.billAddress}</p>` : ''}
      ${data.billCity ? `<p class="center bold">${data.billCity}${data.billPostalCode ? ', ' + data.billPostalCode : ''}</p>` : ''}
      ${data.billStateName ? `<p class="center bold">${data.billStateName}</p>` : ''}
      <br/>
      <p class="bold">GSTIN &nbsp;: <span>${data.gstin}</span></p>
      <p class="bold">PH No. : <span>${data.storePhone}</span></p>

      <div class="section-title">${data.billTypeDesc}</div>

      <p class="bold">Bill Date : <span>${data.billDate}</span>&nbsp;&nbsp;<span>${data.billTime}</span></p>
      <p class="bold">BILL No.   &nbsp;: <span>${data.billNo}</span></p>
      <p class="bold">Terminal   &nbsp;: <span>${data.userName}</span></p>

      <div class="solid-divider"></div>

      <p class="bold">Customer Name : <span>${data.customerName}</span></p>
      <p class="bold">Contact No.   &nbsp;&nbsp;: <span>${data.customerMobile}</span></p>

      <div class="solid-divider"></div>

      <table>
        <thead>
          <tr>
            <!-- <th style="width:6%">SL<br/>No.</th> -->
            <th style="width:6%">#<br /><span style="visibility:hidden;font-size:9px">.</span></th>
            <th style="width:42.5%">PARTICULARS<br/><span style="visibility:hidden;font-weight:normal;font-size:9px">.</span></th>
            <th style="width:10%;text-align:center;padding-left:5px;"">QTY<br/><span style="font-weight:normal;font-size:9px;white-space:nowrap;">DISC%</span></th>
            <th style="width:18%;text-align:right;padding-left:5px;">RATE<br/><span style="font-weight:normal;font-size:9px">GST%</span></th>
            <th style="width:20.5%;text-align:right">AMOUNT<br /><span style="visibility:hidden;font-size:9px">.</span></th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}  
        </tbody>
      </table>

      <div class="solid-divider"></div>

      <table>
        <tbody>
          <tr><td>Total Qty</td><td style="text-align:right"><span>${data.totalQuantity} PCS</span></td></tr>
          <tr><td>Sub Total</td><td style="text-align:right"><span>${(data.totalGross ?? 0).toFixed(2)}</span></td></tr>
          <tr><td>Discount</td><td style="text-align:right"><span>${(data.totalDiscount ?? 0).toFixed(2)}</span></td></tr>
          <tr><td>Taxable Amt</td><td style="text-align:right"><span>${((data.totalPaymentValue - data.totalTaxAmount) ?? 0).toFixed(2)}</span></td></tr>
          ${taxSummaryRows}
          <tr class="total-row">
            <td>Net Amount</td>
            <td style="text-align:right"><span>${(data.totalPaymentValue ?? 0).toFixed(2)}</span></td>
          </tr>
        </tbody>
      </table>

      <div class="solid-divider"></div>

      <table>
        <thead>
          <tr>
            <th>Tax Type</th>
            <th style="text-align:right">Rate%</th>
            <th style="text-align:right">Taxable</th>
            <th style="text-align:right">Tax Amt</th>
          </tr>
        </thead>
        <tbody>${hsnRows}</tbody>
      </table>

      <div class="solid-divider"></div>

      ${paymentRows}

      <div class="solid-divider"></div>

      <p class="center" style="font-size:16px;font-weight:bold;margin:15px 0">Thank You, Visit Again!</p>
      <p style="text-align:right;margin-top:30px;margin-bottom:-10px;font-size:10px">
        ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}&nbsp;&nbsp;${new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true })}
      </p>

      <script>window.onload = () => { window.print(); window.close(); }</script>
    </body>
    </html>`

    const w = Math.min(1020, window.screen.width * 0.92)
    const h = Math.min(680, window.screen.height * 0.92)
    const left = Math.round((window.screen.width - w) / 2)
    const top = Math.round((window.screen.height - h) / 2)
    const pw = window.open('', '_blank', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`)
    pw.document.write(html)
    pw.document.close()
  }

  const toggleNoteField = (index) => {
    const updated = [...paymentListData]
    updated[index].showNote = !updated[index].showNote
    setPaymentListData(updated)
  }
  const handlePaymentNoteChange = (index, key, value) => {
    const updated = [...paymentListData]
    updated[index][key] = value
    setPaymentListData(updated)
  }

  // Toggle Return Search Modal
  const toggleSearchBillReturnModal = () => {
    setSearchBillReturnFromDate('')
    setSearchBillReturnToDate('')
    setSearchBillReturnPhoneNumber('')
    setSearchBillReturnCustomerName('')

    setShowSearchBillReturnModal((prev) => !prev)
  }
  // Toggle Return Select Bill Modal
  const toggleSelectBillReturnModal = () => {
    setSelectBillReturnSearchText('')
    setShowSelectBillReturnModal((prev) => {
      if (!prev) {
        fetchSearchBillReturnList()
      }
      return !prev
    })
  }
  // Fetch Return Bills
  const fetchSearchBillReturnList = async () => {
    setLoadingReturn(true)
    try {
      let PJsonData = {}
      let formattedFromDate = searchBillReturnFromDate
        ? new Date(searchBillReturnFromDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        : ''
      let formattedToDate = searchBillReturnToDate
        ? new Date(searchBillReturnToDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        : ''

      let PType = `?BillID=0&FromDate=${formattedFromDate}&ToDate=${formattedToDate}&Mobile=${searchBillReturnPhoneNumber}&CustomerName=${searchBillReturnCustomerName}`

      let responseJson = await GetAPI(`/api/Bill/GetAllReturnBill`, PType, PJsonData, cookies)
      const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : []

      setSelectBillReturnListData(responseJsonData || [])
      setFilteredSelectBillReturnData(responseJsonData || [])
    } catch (error) {
      setSelectBillReturnListData([])
      setFilteredSelectBillReturnData([])
    } finally {
      setLoadingReturn(false)
    }
  }
  // Handle Return Bill Search
  const handleSelectBillReturnSearch = (searchText) => {
    setSelectBillReturnSearchText(searchText)
    setSelectBillReturnCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredSelectBillReturnData(selectBillReturnListData)
    } else {
      const filteredData = selectBillReturnListData.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
          item.billDate.includes(searchText)
      )
      setFilteredSelectBillReturnData(filteredData)
    }
  }
  const handleReturnReprintBill = (bill) => {
    //console.log("Printing bill...",bill);
    let UserId = __getCookieValue('UserId');  //getCookieValue('UserId')
    let checkoutSaveBillDocEN = bill.billID
    window.open(
      `${import.meta.env.VITE_SERVER_DEV_REPORT}` +
        `/web/WebForm1.aspx?id1=2&id2=${checkoutSaveBillDocEN}|R&id3=2&uid=${UserId}`,
      '_blank'
    )
    handleAllStateClear()
  }

  //! My code
  const [fetchBillToDate, setFetchBillToDate] = useState(new Date().toISOString().split('T')[0])
  const [fetchBillFromDate, setFetchBillFromDate] = useState(fetchBillToDate ? new Date(new Date(fetchBillToDate).setDate(new Date(fetchBillToDate).getDate() - 30)).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
  const [customerSaveData, setCustomerSaveData] = useState({
    customerFirstName: '',
    customerMiddleName: '',
    customerLastName: '',
    mobile: '',
    whatsAppNo: '',
  })

  const [customerExists, setCustomerExists] = useState(false)
  const inputCustomerSaveDataMobileRef = useRef<HTMLInputElement>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    mobile: '',
  })
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false)
  const [fetchedCustomerData, setFetchedCustomerData] = useState<any>(null)
  const [selectedCustomerData, setSelectedCustomerData] = useState<any>(null)
  const [storedCustomer, setStoredCustomer] = useState<any>(null)
  const inputBarCodeRef = useRef<HTMLInputElement>(null)
  const checkoutModalRef = useRef<HTMLDivElement>(null)
  const creditNoteInputRef = useRef<HTMLInputElement>(null)
  const [selectedCustomerID, setSelectedCustomerID] = useState(null)

  // State for keyboard navigation
  const [selectedItemRowIndex, setSelectedItemRowIndex] = useState(0)
  const [selectedInvoiceRowIndex, setSelectedInvoiceRowIndex] = useState(0)
  const [isFocusedOnItemTable, setIsFocusedOnItemTable] = useState(false) // Start with Invoice List focused
  const [selectedItemsSet, setSelectedItemsSet] = useState(new Set())

  //! ================= Item Search (Billing @ Return) - frontend only | 16-09-2026 =================
  //! Return qty set on a line when it is picked through Item Search (every repeat pick adds +1)
  const ITEM_SEARCH_DEFAULT_RETURN_QTY = 1
  //! GetSaleBill responses cached per BillID (promise is stored so parallel scans share one call)
  const billDetailsCacheRef = useRef<Record<string, Promise<any>>>({})
  //! Always points at the latest right-side bill details (avoids stale values after await)
  const latestBillDetailsRef = useRef<any[]>([])
  latestBillDetailsRef.current = filteredSelectBillDetailsData as any[]
  const itemSearchPendingRef = useRef(0)
  const itemSearchModalInputRef = useRef<HTMLInputElement>(null)
  const openItemListRef = useRef<() => void>(() => {})
  const [isItemSearching, setIsItemSearching] = useState(false)
  const [availableItemList, setAvailableItemList] = useState<any[]>([])
  const [showItemSearchModal, setShowItemSearchModal] = useState(false)
  const [itemSearchModalBaseRows, setItemSearchModalBaseRows] = useState<any[]>([])
  const [itemSearchModalText, setItemSearchModalText] = useState('')
  const [itemSearchSelectedIndex, setItemSearchSelectedIndex] = useState(0)
  const [itemFilterInfo, setItemFilterInfo] = useState<{ label: string; count: number } | null>(null)

  const filteredItemSearchRows = useMemo(() => {
    const query = normalizeItemSearchText(itemSearchModalText)
    if (!query) return itemSearchModalBaseRows
    return itemSearchModalBaseRows.filter((row: any) =>
      [row.barcode, row.itemCode, row.itemName, row.billNo, row.randomBillNo].some((value) =>
        normalizeItemSearchText(value).includes(query)
      )
    )
  }, [itemSearchModalBaseRows, itemSearchModalText])

  //! Return qty already put on the loaded invoice, shown in the Item Search modal
  const loadedReturnQtyMap = useMemo(() => {
    const map: Record<string, number> = {}
    const loadedBill = (filteredSelectBillDetailsData as any[])?.[0]
    ;(loadedBill?.objDetails || []).forEach((line: any) => {
      if (!line.selectItem) return
      map[`${loadedBill.billID}-${line.lineNum}`] =
        line.returnQuantity !== undefined ? Number(line.returnQuantity) : Number(line.quantity || 0)
    })
    return map
  }, [filteredSelectBillDetailsData])

  // Dummy data for the left side table (updated with selectItem state)
  const [dummyTableData, setDummyTableData] = useState([
    {
      slNo: 1,
      selectItem: false,
      barcode: 'DB100001',
      itemName: 'Item 100001',
      invoiceQty: 1,
      returnQty: 1,
      mrp: 899.0,
      discount: 0,
      promotion: 0,
      netAmt: 129.0,
    },
    {
      slNo: 2,
      selectItem: false,
      barcode: 'DB100002',
      itemName: 'Item 100002',
      invoiceQty: 2,
      returnQty: 1,
      mrp: 129.0,
      discount: 0,
      promotion: 0,
      netAmt: 129.0,
    },
    {
      slNo: 3,
      selectItem: false,
      barcode: 'DB100003',
      itemName: 'Item 100003',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 749.0,
      discount: 0,
      promotion: 0,
      netAmt: 0,
    },
    {
      slNo: 4,
      selectItem: false,
      barcode: 'DB100004',
      itemName: 'Item 100004',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 529.0,
      discount: 0,
      promotion: 0,
      netAmt: 0,
    },
    {
      slNo: 5,
      selectItem: false,
      barcode: 'DB100005',
      itemName: 'Item 100005',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 2799.0,
      discount: 0,
      promotion: 0,
      netAmt: 0,
    },
    {
      slNo: 6,
      selectItem: false,
      barcode: 'DB100006',
      itemName: 'Item 100006',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 1299.0,
      discount: 0,
      promotion: 0,
      netAmt: 0,
    },
    {
      slNo: 7,
      selectItem: false,
      barcode: 'DB100007',
      itemName: 'Item 100007',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 499.0,
      discount: 0,
      promotion: 499.0,
      netAmt: 499.0,
    },
    {
      slNo: 8,
      selectItem: false,
      barcode: 'DB100008',
      itemName: 'Item 100008',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 579.0,
      discount: 0,
      promotion: 0,
      netAmt: 0,
    },
    {
      slNo: 9,
      selectItem: false,
      barcode: 'DB100009',
      itemName: 'Item 100009',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 548.0,
      discount: 0,
      promotion: 0,
      netAmt: 0,
    },
    {
      slNo: 10,
      selectItem: false,
      barcode: 'DB100010',
      itemName: 'Item 100010',
      invoiceQty: 1,
      returnQty: 0,
      mrp: 448.0,
      discount: 0,
      promotion: 0,
      netAmt: 0,
    },
  ])

  // Using API data from filteredSelectBillData instead of dummy data

  // Updated handleSaveCustomer function
  const handleSaveCustomerNew = async () => {
    if (customerExists && fetchedCustomerData) {
      // Clear existing customer
      setCustomerExists(false)
      setFetchedCustomerData(null)
      setSelectedCustomerData(null)
      setCustomerSaveData({
        customerFirstName: '',
        customerMiddleName: '',
        customerLastName: '',
        mobile: '',
        whatsAppNo: '',
      })
      setCustomerInfo({
        firstName: '',
        middleName: '',
        lastName: '',
        mobile: '',
      })
      toast.success('Customer cleared successfully!', {
        style: { backgroundColor: '#e3ffea', color: '#3ed665' },
      })
      return
    }

    // Validate form before saving
    if (!customerSaveData.mobile || customerSaveData.mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (!customerSaveData.customerFirstName.trim()) {
      toast.error('Please enter first name', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (!customerSaveData.customerLastName.trim()) {
      toast.error('Please enter last name', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    setIsBtnSaving(true)

    const formData = {
      customerID: 0,
      customerFirstName: customerSaveData.customerFirstName.trim(),
      customerMiddleName: customerSaveData.customerMiddleName.trim(),
      customerLastName: customerSaveData.customerLastName.trim(),
      gender: 'M',
      mobile: customerSaveData.mobile,
      dateOfBirth: '',
      anniversary: '',
      profession: '',
      spouseName: '',
      panNo: '',
      gstRegNo: '',
      gstRegDate: '',
      isEmployee: '',
      employeeID: '',
      address: '',
      area: '',
      city: '',
      pinCode: '',
      state: '',
      email: '',
      whatsAppNo: customerSaveData.whatsAppNo || customerSaveData.mobile,
      alternatePhnNo: customerSaveData.mobile,
      preferredComMode: '',
      isPushMessage: '',
      customerCatCode: '',
      customerCatName: '',
      membershipCategoryCode: '',
      membershipCategoryName: '',
      membershipNo: '',
      validTill: '',
      storeID: __getCookieValue('DefaultStoreId') || 0,
      enteredBy: __getCookieValue('UserId'),   //getCookieValue('UserId') || 0,
      usedFor: 'I',
    }

    try {
      const response = await PostAPI('/api/CustomerRep/PostCustomer', '', formData, cookies)

      if (response?.data && response.data[0]?.returnCode === 'Y') {
        toast.success(`Customer saved and tagged successfully!`, {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        })

        // Set customer as existing after successful save
        setCustomerExists(true)
        const savedCustomer = {
          ...formData,
          customerID: response.data[0].returnDocNum,
        }
        setStoredCustomer(savedCustomer)

        // Set fetchedCustomerData to show customer as found
        setFetchedCustomerData(savedCustomer)

        // Set selectedCustomerData for tagging (auto-tag)
        setSelectedCustomerData(savedCustomer)
        setSelectedCustomerID(savedCustomer.customerID)

        // Focus on barcode input after successful customer save
        setTimeout(() => {
          if (inputBarCodeRef.current) {
            inputBarCodeRef.current.focus()
          }
        }, 100)

        return savedCustomer
      } else if (
        response?.data &&
        (response.data[0].returnCode === 'F' || response.data[0].returnCode === 'N')
      ) {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
        return null
      } else {
        toast.error('Failed to save customer. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
        return null
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Error saving customer: ${errorMessage}`, {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return null
    } finally {
      setIsBtnSaving(false)
    }
  }

  // Handle mobile number input change
  const handleMobileInputChange = (mobileNumber: string) => {
    // Only allow numeric characters
    const numericOnly = mobileNumber.replace(/[^0-9]/g, '').slice(0, 10)

    setCustomerSaveData((prev) => ({
      ...prev,
      mobile: numericOnly,
      whatsAppNo: numericOnly,
    }))

    setCustomerInfo((prev: CustomerInfo) => ({ ...prev, mobile: numericOnly }))

    // Reset customer exists when mobile changes
    if (numericOnly.length !== 10) {
      setCustomerExists(false)
      setFetchedCustomerData(null)
      setSelectedCustomerData(null)
    }
  }

  // Fetch customer details from API
  const fetchCustomerDetails = async (mobileNumber: string) => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    setIsFetchingCustomer(true)

    try {
      let PJsonData = {}
      let PType = `?CustomerID=0&MobileNo=${mobileNumber}`
      let responseJson = await GetAPI('/api/Customer/GetCustomerDetails', PType, PJsonData, cookies)

      // console.log('fetchCustomerDetails response:', responseJson);

      if (responseJson && responseJson.data && responseJson.data.length > 0) {
        // Customer found in API
        const apiCustomer = responseJson.data[0]
        setFetchedCustomerData(apiCustomer)

        // Bind the API data to the form fields
        setCustomerSaveData({
          customerFirstName: apiCustomer.customerFirstName || '',
          customerMiddleName: apiCustomer.customerMiddleName || '',
          customerLastName: apiCustomer.customerLastName || '',
          mobile: mobileNumber,
          whatsAppNo: apiCustomer.whatsAppNo || mobileNumber,
        })

        setCustomerInfo({
          firstName: apiCustomer.customerFirstName || '',
          middleName: apiCustomer.customerMiddleName || '',
          lastName: apiCustomer.customerLastName || '',
          mobile: mobileNumber,
        })

        // Set selected customer data for tagging functionality
        setSelectedCustomerData(apiCustomer)

        setCustomerExists(true)

        // Automatically tag the customer when found
        setSelectedCustomerData(apiCustomer)
        setStoredCustomer(apiCustomer)

        toast.success(
          `Customer found and tagged: ${apiCustomer.customerFirstName} ${apiCustomer.customerLastName}`,
          {
            style: { backgroundColor: '#e3ffea', color: '#3ed665' },
          }
        )

        //! Return bill fetch function call after customer is tagged
        fetchSearchBillList()

        // Focus on barcode input after customer is found and tagged
        setTimeout(() => {
          if (inputBarCodeRef.current) {
            inputBarCodeRef.current.focus()
          }
        }, 100)
      } else {
        // Customer not found in API
        setFetchedCustomerData(null)
        setSelectedCustomerData(null)
        setCustomerExists(false)

        // Clear the form but keep the mobile number
        setCustomerSaveData({
          customerFirstName: '',
          customerMiddleName: '',
          customerLastName: '',
          mobile: mobileNumber,
          whatsAppNo: mobileNumber,
        })

        setCustomerInfo({
          firstName: '',
          middleName: '',
          lastName: '',
          mobile: mobileNumber,
        })

        toast.warning('Customer not found. Please add customer details manually.', {
          style: { backgroundColor: '#fff3cd', color: '#856404' },
        })
      }
    } catch (error) {
      // console.error("Error fetching customer:", error);
      setFetchedCustomerData(null)
      setSelectedCustomerData(null)
      setCustomerExists(false)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to fetch customer details: ${errorMessage}`, {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
    } finally {
      setIsFetchingCustomer(false)
    }
  }

  // Clear customer input / fetched state
  const handleClearCustomerInput = () => {
    setCustomerSaveData({
      customerFirstName: '',
      customerMiddleName: '',
      customerLastName: '',
      mobile: '',
      whatsAppNo: '',
    })
    setFetchedCustomerData(null)
    setCustomerExists(false)
    setStoredCustomer(null)
    setSelectedCustomerData(null)
    setSelectedCustomerID(null)

    toast.success('Customer cleared and untagged successfully!', {
      style: { backgroundColor: '#e3ffea', color: '#3ed665' },
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect ALT + N for customer save/clear
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        handleSaveCustomerNew()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [customerExists, customerSaveData, fetchedCustomerData, isBtnSaving])

  // Keyboard navigation functions

  //! arindam da code
  /*
  const handleItemSelection = (index: number) => {
    setDummyTableData(prevData => 
      prevData.map((item, i) => ({
        ...item,
        selectItem: i === index ? !item.selectItem : item.selectItem
      }))
    );
  };
  */
  //! my code
  const handleItemSelection = (index: number) => {
    console.log('handleItemSelection called with index:', index)

    // Move focus to the selected index
    setSelectedItemRowIndex(index)

    // Use the currently displayed bill details (first page slice)
    const currentBill = (currentSelectBillDetails as any)?.[0]
    if (!currentBill || !Array.isArray(currentBill.objDetails)) return

    const targetItem = currentBill.objDetails[index]
    if (!targetItem) return

    const targetLineNum = targetItem.lineNum

    // Update only the matching bill's objDetails in filtered data
    setFilteredSelectBillDetailsData((prevData: any) =>
      prevData.map((bill: any) => {
        if (bill.billID !== currentBill.billID) return bill
        return {
          ...bill,
          objDetails: bill.objDetails.map((item: any) =>
            item.lineNum === targetLineNum 
              ? { 
                  ...item, 
                  selectItem: !item.selectItem,
                  returnQuantity: !item.selectItem ? item.quantity : 0 // Initialize returnQuantity when selecting
                } 
              : item
          ),
        }
      })
    )

    // Keep the master list in sync as well
    setSelectBillDetailsListData((prevData: any) =>
      prevData.map((bill: any) => {
        if (bill.billID !== currentBill.billID) return bill
        return {
          ...bill,
          objDetails: bill.objDetails.map((item: any) =>
            item.lineNum === targetLineNum 
              ? { 
                  ...item, 
                  selectItem: !item.selectItem,
                  returnQuantity: !item.selectItem ? item.quantity : 0 // Initialize returnQuantity when selecting
                } 
              : item
          ),
        }
      })
    )

    // Items are selected, processing will happen when Generate Credit Note is clicked
    console.log('Item selection updated, current selected items:', currentBill.objDetails.filter((item: any) => item.selectItem))
  }

  // Handle return quantity change
  const handleReturnQuantityChange = (index: number, value: string) => {
    const currentBill = (currentSelectBillDetails as any)?.[0]
    if (!currentBill || !Array.isArray(currentBill.objDetails)) return

    const targetItem = currentBill.objDetails[index]
    if (!targetItem) return

    const targetLineNum = targetItem.lineNum
    const newQuantity = parseInt(value) || 0

    // Validate: return quantity cannot exceed invoice quantity
    if (newQuantity > targetItem.quantity) {
      toast.error(`Return quantity cannot exceed invoice quantity (${targetItem.quantity})`)
      return
    }

    if (newQuantity < 0) {
      toast.error('Return quantity cannot be negative')
      return
    }

    // Calculate proportional net amount based on return quantity
    const proportionalNetAmt = (targetItem.netAmt / targetItem.quantity) * newQuantity

    // Update filtered data
    setFilteredSelectBillDetailsData((prevData: any) =>
      prevData.map((bill: any) => {
        if (bill.billID !== currentBill.billID) return bill
        return {
          ...bill,
          objDetails: bill.objDetails.map((item: any) =>
            item.lineNum === targetLineNum
              ? { 
                  ...item, 
                  returnQuantity: newQuantity,
                  returnNetAmt: proportionalNetAmt
                }
              : item
          ),
        }
      })
    )

    // Keep the master list in sync
    setSelectBillDetailsListData((prevData: any) =>
      prevData.map((bill: any) => {
        if (bill.billID !== currentBill.billID) return bill
        return {
          ...bill,
          objDetails: bill.objDetails.map((item: any) =>
            item.lineNum === targetLineNum
              ? { 
                  ...item, 
                  returnQuantity: newQuantity,
                  returnNetAmt: proportionalNetAmt
                }
              : item
          ),
        }
      })
    )
  }

  // Handle return quantity increment
  const handleIncrementReturnQty = (index: number) => {
    const currentBill = (currentSelectBillDetails as any)?.[0]
    if (!currentBill || !Array.isArray(currentBill.objDetails)) return

    const targetItem = currentBill.objDetails[index]
    if (!targetItem || !targetItem.selectItem) return

    const currentReturnQty = targetItem.returnQuantity !== undefined ? targetItem.returnQuantity : targetItem.quantity
    if (currentReturnQty >= targetItem.quantity) {
      toast.error(`Cannot exceed invoice quantity (${targetItem.quantity})`)
      return
    }

    handleReturnQuantityChange(index, String(currentReturnQty + 1))
  }

  // Handle return quantity decrement
  const handleDecrementReturnQty = (index: number) => {
    const currentBill = (currentSelectBillDetails as any)?.[0]
    if (!currentBill || !Array.isArray(currentBill.objDetails)) return

    const targetItem = currentBill.objDetails[index]
    if (!targetItem || !targetItem.selectItem) return

    const currentReturnQty = targetItem.returnQuantity !== undefined ? targetItem.returnQuantity : targetItem.quantity
    if (currentReturnQty <= 0) {
      toast.error('Return quantity cannot be less than 0')
      return
    }

    handleReturnQuantityChange(index, String(currentReturnQty - 1))
  }

  // New function to process selected items for return automatically
  const processSelectedItemsForReturn = () => {
    const currentBill = (currentSelectBillDetails as any)?.[0]
    if (!currentBill || !Array.isArray(currentBill.objDetails)) return

    const selectedItems = currentBill.objDetails.filter((item: any) => item.selectItem)
    
    if (selectedItems.length > 0) {
      // Automatically populate scanned items for return with actual return quantities
      const itemsWithReturnQty = selectedItems.map((item: any) => {
        const actualReturnQty = item.returnQuantity !== undefined ? item.returnQuantity : item.quantity
        const proportionalAmount = (item.netAmt / item.quantity) * actualReturnQty
        return {
          ...item,
          returnQty: actualReturnQty,
          returnAmount: proportionalAmount,
          originalQuantity: item.quantity,
          originalNetAmt: item.netAmt,
        }
      })

      setScannedItemListData(itemsWithReturnQty)
      setPrevScannedItemListData(itemsWithReturnQty)
      
      // Set selected bill details data for checkout
      setSelectedBillDetailsData(currentSelectBillDetails)
      
      // Set up payment data properly (same logic as handleBillDetailsReturnClick)
      const billPayments = currentSelectBillDetails?.[0]?.objPayment || []
      const updatedPaymentList = paymentListData.map((payment) => {
        const matched = billPayments.find(
          (b) => b.modeOfPayementID === payment.paymentModeID
        )

        return {
          ...payment,
          amount: '', //matched?.value || '', // Use value if match found, else keep blank
          modeOfPaymentName: payment.paymentModeName,
          modeOfPayementID: payment.paymentModeID,
          billID: matched?.billID ?? '',
          lineNum: matched?.lineNum ?? '',
          upItransactionID: matched?.upItransactionID ?? '',
          cardNo: matched?.cardNo ?? '',
          cardHolderName: matched?.cardHolderName ?? '',
          cardValidity: matched?.cardValidity ?? '',
          cardType: matched?.cardType ?? '',
          cardCommPercent: matched?.cardCommPercent ?? '',
          cardCommAmt: matched?.cardCommAmt ?? '',
          forexRate: matched?.forexRate ?? '',
          forexTender: matched?.forexTender ?? '',
          forexAmt: matched?.forexAmt ?? '',
          forexBalance: matched?.forexBalance ?? '',
        }
      })
      setPaymentListData(updatedPaymentList)
      
      console.log('Processed items for return:', itemsWithReturnQty)
    }
  }

  const handleInvoiceSelection = (index: number) => {
    // Move focus to the selected index
    setSelectedInvoiceRowIndex(index)

    // Only allow single selection at a time
    const selectedInvoice = (filteredSelectBillData as any)[index]
    if (!selectedInvoice) return

    const isCurrentlySelected = selectedInvoice.selected

    // Update the filtered data to reflect selection - only one at a time
    setFilteredSelectBillData((prevData: any) =>
      prevData.map((invoice: any, i: number) => ({
        ...invoice,
        selected: i === index ? !isCurrentlySelected : false, // Deselect all others, toggle current
      }))
    )

    // If invoice is being selected (not deselected), set selected bill ID
    if (!isCurrentlySelected) {
      setSelectedBillID(selectedInvoice.billID)
      // Automatically fetch bill details when bill is selected - no Enter key needed
      fetchSelectedBillDeatilsList(selectedInvoice.billID)
    } else {
      // If deselecting, clear the selected bill ID and details
      setSelectedBillID(null)
      setSelectBillDetailsListData([])
      setFilteredSelectBillDetailsData([])
    }
  }

  //! ================= Item Search (Billing @ Return) functions =================
  const resetItemSearchState = () => {
    billDetailsCacheRef.current = {}
    setAvailableItemList([])
    setItemFilterInfo(null)
    setShowItemSearchModal(false)
    setItemSearchModalBaseRows([])
    setItemSearchModalText('')
    setItemSearchSelectedIndex(0)
  }

  //! GetSaleBill with cache (same API the invoice click uses)
  const getSaleBillCached = (billID: any): Promise<any> => {
    const key = String(billID)
    if (!billDetailsCacheRef.current[key]) {
      billDetailsCacheRef.current[key] = Promise.resolve(
        GetAPI(`/api/Bill/GetSaleBill`, `?BillID=${billID}`, {}, cookies)
      )
        .then((responseJson: any) => {
          if (!responseJson?.data) throw new Error('Bill not found')
          return responseJson.data
        })
        .catch((error: any) => {
          delete billDetailsCacheRef.current[key]
          throw error
        })
    }
    return billDetailsCacheRef.current[key]
  }

  //! Flat list of every item line across the listed invoices (newest invoice first)
  const buildAvailableItemList = async () => {
    const invoices = [...(selectBillListData as any[])].reverse()
    const rows: any[] = []
    let failedCount = 0
    const chunkSize = 5

    for (let i = 0; i < invoices.length; i += chunkSize) {
      const chunk = invoices.slice(i, i + chunkSize)
      const bills = await Promise.all(
        chunk.map((invoice: any) => getSaleBillCached(invoice.billID).catch(() => null))
      )

      bills.forEach((bill: any, idx: number) => {
        const invoice = chunk[idx]
        if (!bill) {
          failedCount += 1
          return
        }
        ;(bill.objDetails || []).forEach((line: any) => {
          rows.push({
            key: `${invoice.billID}-${line.lineNum}`,
            billID: invoice.billID,
            billNo: invoice.billNo || bill.billNo || '',
            randomBillNo: invoice.randomBillNo || '',
            billDate: invoice.billDate || '',
            lineNum: line.lineNum,
            barcode: line.barcode || '',
            itemCode: line.itemCode || '',
            itemName: line.itemName || '',
            quantity: Number(line.quantity || 0),
            mrp: Number(line.mrp || 0),
            netAmt: Number(line.netAmt || 0),
          })
        })
      })
    }

    if (failedCount > 0) {
      toast.warning(`Items of ${failedCount} invoice(s) could not be loaded. Search again to retry.`, {
        style: ITEM_SEARCH_WARNING_STYLE,
      })
    }

    setAvailableItemList(rows)
    return rows
  }

  //! Scanned label (e.g. 03092026_5) -> item barcode / item code (e.g. 1007-26-NA), same API as Billing
  const resolveItemCodesFromBarcode = async (searchText: string) => {
    const codes = new Set<string>()
    try {
      const PType =
        '?Barcode=' + encodeURIComponent(searchText) + '&StoreID=' + __getCookieValue('DefaultStoreId')
      const responseJson = await GetAPI('/api/Item/GetItemBarcodeWise', PType, {}, cookies)
      const data = Array.isArray(responseJson?.data) ? responseJson.data : []
      data.forEach((item: any) => {
        if (!item || item.returnCode === 'F') return
        ;[item.barCode, item.barcode, item.posBarCode, item.oldBarCode, item.itemCode].forEach((code) => {
          const normalized = normalizeItemSearchText(code)
          if (normalized) codes.add(normalized)
        })
      })
    } catch (error) {
      // Lookup is only a fallback; ignore failures and continue with text match
    }
    return codes
  }

  const findItemSearchMatches = async (searchText: string, list: any[]) => {
    const query = normalizeItemSearchText(searchText)

    // 1. Exact barcode / item code as printed on the invoice line
    let exact = list.filter(
      (row) =>
        normalizeItemSearchText(row.barcode) === query || normalizeItemSearchText(row.itemCode) === query
    )

    // 2. Scanned label resolved through the item master
    if (exact.length === 0) {
      const codes = await resolveItemCodesFromBarcode(searchText)
      if (codes.size > 0) {
        exact = list.filter(
          (row) =>
            codes.has(normalizeItemSearchText(row.barcode)) ||
            codes.has(normalizeItemSearchText(row.itemCode))
        )
      }
    }
    if (exact.length > 0) return { exact, partial: [] as any[] }

    // 3. Partial text on barcode / item code / item name
    const partial = list.filter((row) =>
      [row.barcode, row.itemCode, row.itemName].some((value) =>
        normalizeItemSearchText(value).includes(query)
      )
    )
    return { exact, partial }
  }

  //! Pure: select the line (qty = default) or add +1 up to invoice qty
  const markBillLineForReturn = (bill: any, lineNum: any) => {
    let message = ''
    const objDetails = (bill?.objDetails || []).map((item: any) => {
      if (String(item.lineNum) !== String(lineNum)) return item

      const invoiceQty = Number(item.quantity || 0)
      const unitNetAmt = invoiceQty > 0 ? Number(item.netAmt || 0) / invoiceQty : 0

      if (!item.selectItem) {
        const qty = Math.min(ITEM_SEARCH_DEFAULT_RETURN_QTY, invoiceQty)
        return { ...item, selectItem: true, returnQuantity: qty, returnNetAmt: unitNetAmt * qty }
      }

      const currentQty =
        item.returnQuantity !== undefined ? Number(item.returnQuantity) : invoiceQty
      if (currentQty >= invoiceQty) {
        message = `${item.itemName || item.barcode}: return qty is already equal to invoice qty (${invoiceQty})`
        return item
      }

      const qty = currentQty + 1
      return { ...item, returnQuantity: qty, returnNetAmt: unitNetAmt * qty }
    })
    return { bill: { ...bill, objDetails }, message }
  }

  //! Among matching lines prefer one that still has qty left on the loaded invoice
  const pickReturnableLine = (rows: any[]) => {
    const loadedBill = latestBillDetailsRef.current?.[0]
    const hasQtyLeft = (row: any) => {
      if (!loadedBill || String(loadedBill.billID) !== String(row.billID)) return true
      const line = (loadedBill.objDetails || []).find(
        (l: any) => String(l.lineNum) === String(row.lineNum)
      )
      if (!line || !line.selectItem) return true
      const currentQty =
        line.returnQuantity !== undefined ? Number(line.returnQuantity) : Number(line.quantity || 0)
      return currentQty < Number(line.quantity || 0)
    }
    return rows.find(hasQtyLeft) || rows[0]
  }

  //! Picked item -> filter invoice list, load that invoice, mark the line for return
  const applyItemSearchSelection = async (row: any, list: any[] = availableItemList) => {
    if (!row) return

    // 1. Invoice list: only invoices that contain this item, picked invoice selected
    const rowCode = getItemSearchLineCode(row)
    const billIDsWithItem = new Set<string>(
      list.filter((r) => getItemSearchLineCode(r) === rowCode).map((r) => String(r.billID))
    )
    billIDsWithItem.add(String(row.billID))

    const invoicesWithItem = [...(selectBillListData as any[])]
      .reverse()
      .filter((invoice: any) => billIDsWithItem.has(String(invoice.billID)))
      .map((invoice: any) => ({ ...invoice, selected: String(invoice.billID) === String(row.billID) }))
    const invoiceIndex = Math.max(
      0,
      invoicesWithItem.findIndex((invoice: any) => invoice.selected)
    )

    setFilteredSelectBillData(invoicesWithItem as any)
    setItemFilterInfo({
      label: row.itemName || row.barcode || row.itemCode,
      count: invoicesWithItem.length,
    })
    setSelectedInvoiceRowIndex(invoiceIndex)
    setSelectedBillID(row.billID)
    setTimeout(() => scrollToInvoiceRow(invoiceIndex), 50)

    // 2. Right table: keep current selections when it is the same invoice
    const loadedBill = latestBillDetailsRef.current?.[0]
    const isSameBill = !!loadedBill && String(loadedBill.billID) === String(row.billID)
    let baseBill = loadedBill

    if (!isSameBill) {
      let fetchedBill: any = null
      try {
        fetchedBill = await getSaleBillCached(row.billID)
      } catch (error) {
        toast.error(`Could not load invoice ${row.billNo}. Please try again.`, {
          style: ITEM_SEARCH_ERROR_STYLE,
        })
        return
      }

      if (loadedBill && (loadedBill.objDetails || []).some((line: any) => line.selectItem)) {
        toast.warning(
          `Switched to invoice ${row.billNo}. Items selected on the previous invoice were cleared.`,
          { style: ITEM_SEARCH_WARNING_STYLE }
        )
      }

      baseBill = {
        ...fetchedBill,
        objDetails: (fetchedBill.objDetails || []).map((item: any) => ({ ...item, selectItem: false })),
      }
    }

    // 3. Mark the line
    const { bill: updatedBill, message } = markBillLineForReturn(baseBill, row.lineNum)

    if (isSameBill) {
      if (!message) {
        const updater = (prevData: any) =>
          prevData.map((bill: any) =>
            String(bill.billID) === String(row.billID)
              ? markBillLineForReturn(bill, row.lineNum).bill
              : bill
          )
        setFilteredSelectBillDetailsData(updater)
        setSelectBillDetailsListData(updater)
      }
    } else {
      setSelectBillDetailsListData([updatedBill] as any)
      setFilteredSelectBillDetailsData([updatedBill] as any)
      setSelectBillDetailsCurrentPage(1)
      setSelectBillDetailsSearchText('')
    }
    latestBillDetailsRef.current = [updatedBill]

    // 4. Highlight the line
    const lineIndex = (updatedBill.objDetails || []).findIndex(
      (line: any) => String(line.lineNum) === String(row.lineNum)
    )
    if (lineIndex >= 0) {
      setSelectedItemRowIndex(lineIndex)
      setIsFocusedOnItemTable(true)
      setTimeout(() => scrollToItemRow(lineIndex), 80)
    }

    if (message) {
      toast.error(message, { style: ITEM_SEARCH_ERROR_STYLE })
    } else {
      toast.success(`${row.itemName || row.barcode} added to return (Invoice ${row.billNo})`, {
        style: ITEM_SEARCH_SUCCESS_STYLE,
      })
    }
  }

  const openItemSearchModal = (rows: any[], text: string) => {
    setItemSearchModalBaseRows(rows)
    setItemSearchModalText(text)
    setItemSearchSelectedIndex(0)
    setShowItemSearchModal(true)
  }

  const closeItemSearchModal = () => {
    setShowItemSearchModal(false)
    setItemSearchModalText('')
    setItemSearchSelectedIndex(0)
    setTimeout(() => inputBarCodeRef.current?.focus(), 0)
  }

  const selectItemFromSearchModal = (index: number) => {
    const row = filteredItemSearchRows[index]
    if (!row) return
    closeItemSearchModal()
    applyItemSearchSelection(row, availableItemList)
  }

  const clearItemSearchFilter = () => {
    const invoices = [...(selectBillListData as any[])]
      .reverse()
      .map((invoice: any) => ({
        ...invoice,
        selected: selectedBillID !== null && String(invoice.billID) === String(selectedBillID),
      }))
    const selectedIndex = invoices.findIndex((invoice: any) => invoice.selected)
    setFilteredSelectBillData(invoices as any)
    setItemFilterInfo(null)
    setSelectedInvoiceRowIndex(selectedIndex >= 0 ? selectedIndex : 0)
    if (selectedIndex >= 0) setTimeout(() => scrollToInvoiceRow(selectedIndex), 50)
    inputBarCodeRef.current?.focus()
  }

  //! Main entry: Enter in Item Search / Find Item / Item List
  const handleSelectBarcodeItem = async (barCodeEntered: string) => {
    const searchText = String(barCodeEntered || '').trim()

    if (!selectBillListData || (selectBillListData as any[]).length === 0) {
      toast.error('No invoices listed. Tag the customer and search invoices first.', {
        style: ITEM_SEARCH_ERROR_STYLE,
      })
      return
    }

    itemSearchPendingRef.current += 1
    setIsItemSearching(true)
    try {
      const list = await buildAvailableItemList()
      if (list.length === 0) {
        toast.error('No items found in the listed invoices.', { style: ITEM_SEARCH_ERROR_STYLE })
        return
      }

      // Blank search -> full item list to pick from
      if (!searchText) {
        openItemSearchModal(list, '')
        return
      }

      const { exact, partial } = await findItemSearchMatches(searchText, list)

      if (exact.length > 0) {
        const billIDs = new Set(exact.map((row) => String(row.billID)))
        const loadedBill = latestBillDetailsRef.current?.[0]
        const loadedBillID = loadedBill ? String(loadedBill.billID) : ''
        const matchesOnLoadedBill = exact.filter((row) => String(row.billID) === loadedBillID)
        const isContinuingOnLoadedBill =
          matchesOnLoadedBill.length > 0 &&
          (loadedBill?.objDetails || []).some(
            (line: any) =>
              line.selectItem &&
              matchesOnLoadedBill.some((row) => String(row.lineNum) === String(line.lineNum))
          )

        if (billIDs.size === 1) {
          await applyItemSearchSelection(pickReturnableLine(exact), list)
        } else if (isContinuingOnLoadedBill) {
          // Same item scanned again while working on that invoice -> keep adding there
          await applyItemSearchSelection(pickReturnableLine(matchesOnLoadedBill), list)
        } else {
          // Item sold in more than one invoice -> let the user pick
          openItemSearchModal(exact, '')
        }
        return
      }

      if (partial.length === 0) {
        toast.error(
          `No item matching "${searchText}" in the listed invoices. Check the invoice date range.`,
          { style: ITEM_SEARCH_ERROR_STYLE }
        )
        return
      }

      if (partial.length === 1) {
        await applyItemSearchSelection(partial[0], list)
        return
      }

      openItemSearchModal(list, searchText)
    } catch (error) {
      toast.error('Item search failed. Please try again.', { style: ITEM_SEARCH_ERROR_STYLE })
    } finally {
      itemSearchPendingRef.current = Math.max(0, itemSearchPendingRef.current - 1)
      if (itemSearchPendingRef.current === 0) setIsItemSearching(false)
    }
  }
  openItemListRef.current = () => handleSelectBarcodeItem('')

  useEffect(() => {
    if (showItemSearchModal) {
      setTimeout(() => itemSearchModalInputRef.current?.focus(), 0)
    }
  }, [showItemSearchModal])

  useEffect(() => {
    if (!showItemSearchModal) return
    const row = document.querySelector(`.item-search-row-${itemSearchSelectedIndex}`)
    row?.scrollIntoView({ block: 'nearest' })
  }, [itemSearchSelectedIndex, showItemSearchModal])

  //! ALT + I -> focus Item Search, ALT + L -> open Item List
  useEffect(() => {
    const handleItemSearchShortcut = (e: KeyboardEvent) => {
      if (!e.altKey) return
      const key = e.key.toLowerCase()
      if (key === 'i') {
        e.preventDefault()
        inputBarCodeRef.current?.focus()
      } else if (key === 'l') {
        e.preventDefault()
        openItemListRef.current()
      }
    }
    window.addEventListener('keydown', handleItemSearchShortcut)
    return () => window.removeEventListener('keydown', handleItemSearchShortcut)
  }, [])
  //! ================= End Item Search functions =================

  // Auto-scroll function for invoice table
  const scrollToInvoiceRow = (index: number) => {
    const invoiceTable = document.querySelector('.invoice-table-container')
    const row = document.querySelector(`.invoice-row-${index}`)

    if (invoiceTable && row) {
      row.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }

  // Auto-scroll function for items table
  const scrollToItemRow = (index: number) => {
    const itemsTable = document.querySelector('.items-table-container')
    const row = document.querySelector(`.item-row-${index}`)

    if (itemsTable && row) {
      row.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }

  //! Keyboard navigation effect all keyboard logics
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Ctrl+R for checkout modal
      if (event.ctrlKey && event.key.toLowerCase() === 'r') {
        event.preventDefault()
        handleGenerateCreditNote()
        return
      }

      // Handle Ctrl+Q for reprint modal
      if (__getCookieValue("UserRole")?.toLowerCase() === "admin" && event.ctrlKey && event.key.toLowerCase() === 'q') {
        event.preventDefault()
        toggleSearchBillReturnModal()
        return
      }

      // Handle Ctrl+X for clearing all states
      if (event.ctrlKey && event.key.toLowerCase() === 'x') {
        event.preventDefault()
        handleAllStateClear()
        return
      }

      // Handle Alt+S for saving refund bill (checkout modal)
      if (event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (showCheckout && totalBillAmount > 0 && !isBtnSaving) {
          handleSaveRefundBill()
        }
        return
      }

      // Only handle if no input elements are focused
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'BUTTON'
      ) {
        return
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          if (isFocusedOnItemTable) {
            setSelectedItemRowIndex((prev) => {
              const newIndex = Math.max(0, prev - 1)
              scrollToItemRow(newIndex)
              return newIndex
            })
          } else {
            setSelectedInvoiceRowIndex((prev) => {
              const newIndex = Math.max(0, prev - 1)
              scrollToInvoiceRow(newIndex)
              return newIndex
            })
          }
          break

        case 'ArrowDown':
          event.preventDefault()
          if (isFocusedOnItemTable) {
            setSelectedItemRowIndex((prev) => {
              const currentBill = (currentSelectBillDetails as any)?.[0]
              const itemsLength = currentBill?.objDetails?.length || 0
              const newIndex = Math.min(itemsLength - 1, prev + 1)
              scrollToItemRow(newIndex)
              return newIndex
            })
          } else {
            setSelectedInvoiceRowIndex((prev) => {
              const newIndex = Math.min((filteredSelectBillData as any).length - 1, prev + 1)
              scrollToInvoiceRow(newIndex)
              return newIndex
            })
          }
          break

        case ' ':
          event.preventDefault()
          if (!isFocusedOnItemTable) {
            // Space bar selects/deselects invoice in invoice list
            handleInvoiceSelection(selectedInvoiceRowIndex)
          } else {
            // Space bar selects items in item table
            handleItemSelection(selectedItemRowIndex)
          }
          break

        case 'Enter':
          event.preventDefault()

          //! arindam da code
          /*
          if (!isFocusedOnItemTable) {
            // Enter key calls fetchSelectedBillDeatilsList with current focused invoice
            const selectedInvoice = (filteredSelectBillData as any)[selectedInvoiceRowIndex];
            if (selectedInvoice && selectedInvoice.billID) {
              // First select the invoice if not already selected
              if (!selectedInvoice.selected) {
                handleInvoiceSelection(selectedInvoiceRowIndex);
              }
              // Then call the API with the bill ID
              fetchSelectedBillDeatilsList(selectedInvoice.billID);
            }
          }
          */

          //! my code
          if (!isFocusedOnItemTable) {
            // Enter key calls fetchSelectedBillDeatilsList with current focused invoice
            const selectedInvoice = (filteredSelectBillData as any)[selectedInvoiceRowIndex]
            if (selectedInvoice && selectedInvoice.billID) {
              // First select the invoice if not already selected
              if (!selectedInvoice.selected) {
                handleInvoiceSelection(selectedInvoiceRowIndex)
              }
              // Then call the API with the bill ID
              fetchSelectedBillDeatilsList(selectedInvoice.billID)
            }
          } else {
            // Enter key in item table calls handleBillDetailsReturnClick if items are selected
            const hasSelectedItems =
              (currentSelectBillDetails as any) &&
              (currentSelectBillDetails as any).length > 0 &&
              (currentSelectBillDetails as any)[0]?.objDetails &&
              (currentSelectBillDetails as any)[0].objDetails.some((item: any) => item.selectItem)

            if (hasSelectedItems) {
              handleBillDetailsReturnClick()
            } else {
              toast.error('Please select items to return!', {
                style: { backgroundColor: '#f7edeb', color: '#ff6242' },
              })
            }
          }
          break

        case 'Tab':
          event.preventDefault()
          setIsFocusedOnItemTable((prev) => !prev)
          // Reset selection to first row when switching tables
          if (isFocusedOnItemTable) {
            setSelectedInvoiceRowIndex(0)
          } else {
            setSelectedItemRowIndex(0)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedItemRowIndex,
    selectedInvoiceRowIndex,
    isFocusedOnItemTable,
    currentSelectBillDetails,
    (filteredSelectBillData as any).length,
    showCheckout,
    totalBillAmount,
    isBtnSaving,
  ])

  //! just try 04-12-2025 for select checkbox for returning items
  const handleReturnItems = () => {
    if (!isFocusedOnItemTable) {
            // Enter key calls fetchSelectedBillDeatilsList with current focused invoice
            const selectedInvoice = (filteredSelectBillData as any)[selectedInvoiceRowIndex]
            if (selectedInvoice && selectedInvoice.billID) {
              // First select the invoice if not already selected
              if (!selectedInvoice.selected) {
                handleInvoiceSelection(selectedInvoiceRowIndex)
              }
              // Then call the API with the bill ID
              fetchSelectedBillDeatilsList(selectedInvoice.billID)
            }
          } else {
            // Enter key in item table calls handleBillDetailsReturnClick if items are selected
            const hasSelectedItems =
              (currentSelectBillDetails as any) &&
              (currentSelectBillDetails as any).length > 0 &&
              (currentSelectBillDetails as any)[0]?.objDetails &&
              (currentSelectBillDetails as any)[0].objDetails.some((item: any) => item.selectItem)

            if (hasSelectedItems) {
              handleBillDetailsReturnClick()
            } else {
              toast.error('Please select items to return!', {
                style: { backgroundColor: '#f7edeb', color: '#ff6242' },
              })
            }
          }
  }

  // Auto-focus credit note input when checkout modal opens
  useEffect(() => {
    if (showCheckout && creditNoteInputRef.current) {
      setTimeout(() => {
        creditNoteInputRef.current?.focus()
      }, 100)
    }
  }, [showCheckout])

  return (
    <div className="relative z-30 min-h-screen w-full overflow-hidden p-4" style={{ backgroundColor: '#d6eaf8' }}>
      {/*
        //! FUTURE: "open session before billing" popup — enable when this option is given.
        //! {showNoSessionPopup && (
        //!   <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
        //!     <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm p-5 text-center">
        //!       <div className="flex justify-center mb-3">
        //!         <Calendar className="w-8 h-8 text-rose-600" />
        //!       </div>
        //!       <h3 className="text-base font-semibold text-gray-800 mb-1">Session Not Open</h3>
        //!       <p className="text-sm text-gray-600 mb-4">Please open the session before billing.</p>
        //!       <Button
        //!         size="sm"
        //!         className="bg-rose-600 hover:bg-rose-700 text-white"
        //!         onClick={() => navigate('/transaction/billing/sessions/session-open')}
        //!       >
        //!         Go to Session Open
        //!       </Button>
        //!     </div>
        //!   </div>
        //! )}
      */}
      <div className="w-full px-2" style={{ backgroundColor: '#d6eaf8' }}>
        <div className="flex justify-center mb-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-white bg-sky-600 px-3 py-1 rounded-md shadow-sm whitespace-nowrap">
            <CalendarDays className="w-4 h-4" />
            Return Date: {today || '--'}
          </div>
        </div>

        {/* Customer Information - Top Row */}
        <div className="  p-2 rounded shadow-sm border mb-3">
          <div className="grid grid-cols-12 gap-2 items-center text-sm">
            <div className="col-span-2 font-medium flex items-center gap-1 text-rose-600">
              <Phone className="w-4 h-4 " />
              Mobile Number *
            </div>
            <div className="col-span-2 flex gap-1">
              <input
                type="text"
                value={customerSaveData.mobile}
                onChange={(e) => handleMobileInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Tab') {
                    if (customerSaveData.mobile.length === 10) {
                      fetchCustomerDetails(customerSaveData.mobile)
                    }
                  }
                }}
                placeholder="Enter 10-digit mobile Number"
                className="w-full border p-2 rounded-md"
                maxLength={10}
                disabled={!!(customerExists && fetchedCustomerData)}
                ref={inputCustomerSaveDataMobileRef}
              />
            </div>

            <div className="col-span-1 font-medium" style={{color: 'black'}}>First Name</div>
            <div className="col-span-2">
              <input
                type="text"
                value={customerSaveData.customerFirstName}
                onChange={(e) =>
                  setCustomerSaveData((prev) => ({ ...prev, customerFirstName: e.target.value }))
                }
                placeholder="First Name"
                className="w-full border p-2 rounded-md"
                disabled={!!(customerExists && fetchedCustomerData)}
              />
            </div>
            <div className="col-span-1 font-medium" style={{color: 'black'}}>Middle Name</div>
            <div className="col-span-1">
              <input
                type="text"
                value={customerSaveData.customerMiddleName}
                onChange={(e) =>
                  setCustomerSaveData((prev) => ({ ...prev, customerMiddleName: e.target.value }))
                }
                placeholder="Middle Name"
                className="w-full border p-2 rounded-md"
                disabled={!!(customerExists && fetchedCustomerData)}
              />
            </div>
            <div className="col-span-1 font-medium" style={{color: 'black'}}>Last Name</div>
            <div className="col-span-1">
              <input
                type="text"
                value={customerSaveData.customerLastName}
                onChange={(e) =>
                  setCustomerSaveData((prev) => ({ ...prev, customerLastName: e.target.value }))
                }
                placeholder="Last Name"
                className="w-full border p-2 rounded-md"
                disabled={!!(customerExists && fetchedCustomerData)}
              />
            </div>
            <div className="col-span-1">
              <Button
                size="sm"
                onClick={handleSaveCustomerNew}
                disabled={isBtnSaving}
                className="bg-rose-900 hover:bg-rose-700 hover:shadow-lg text-white text-xs p-1 h-7 w-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              >
                {isBtnSaving ? '⏳' : customerExists ? '🗑️ Clear' : '💾 Save'} ALT+N
              </Button>
            </div>
          </div>

          {/* Show status message */}
          {customerSaveData.mobile.length > 0 && (
            <div className="mt-2 text-xs">
              {customerSaveData.mobile.length < 10 ? (
                <div className="text-red-600 bg-red-50 p-2 rounded border">
                  ⚠️ Please type complete phone number (10 digits required)
                </div>
              ) : isFetchingCustomer ? (
                <div className="text-blue-600 bg-blue-50 p-2 rounded border flex items-center">
                  <span>⏳ Customer is fetching... Please wait</span>
                </div>
              ) : customerExists && fetchedCustomerData ? (
                <div className="text-green-600 p-2 rounded border flex items-center justify-between" style={{backgroundColor: '#fff'}}>
                  <span>
                    ✅ Customer Found & Tagged: {customerSaveData.customerFirstName}{' '}
                    {customerSaveData.customerLastName}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearCustomerInput}
                    className="text-xs px-2 py-1 h-6"
                  >
                    Clear
                  </Button>
                </div>
              ) : customerSaveData.mobile.length === 10 &&
                !customerExists &&
                !fetchedCustomerData ? (
                <div className="text-orange-600 bg-orange-50 p-2 rounded border flex items-center justify-between">
                  <span>⚠️ Customer not found - Add manually</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Invoice Search Section - Full Width */}
        <div className="  p-2 rounded shadow-sm border mb-3">
          <div className="grid grid-cols-12 gap-2 items-end text-sm">
            <div className="col-span-2">
              <label className="font-medium block mb-1" style={{color: 'black'}} >From Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded-md"
                value={fetchBillFromDate}
                onChange={(e) => {
                  setFetchBillFromDate(e.target.value)
                }}
                disabled
                // min={fetchBillFromDate}
              />
            </div>

            <div className="col-span-2">
              <label className="font-medium block mb-1" style={{color: 'black'}}>To Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded-md"
                value={fetchBillToDate}
                onChange={(e) => {
                  setFetchBillToDate(e.target.value)
                }}
              />
            </div>

            {/* <div className="col-span-2">
              <label className="font-medium block mb-1" style={{color: 'black'}}>Customer Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md"
                placeholder="Enter customer name"
              />
            </div> */}

            <div className="col-span-2">
              <label className="font-medium block mb-1" style={{color: 'black'}}>Invoice Amount</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md"
                placeholder="Enter amount"
              />
            </div>

            <div className="col-span-2">
              <label className="font-medium block mb-1" style={{color: 'black'}}>Range From</label>
              <input type="text" className="w-full border p-2 rounded-md" placeholder="0.00" />
            </div>

            <div className="col-span-2">
              <label className="font-medium block mb-1" style={{color: 'black'}}>Range To</label>
              <input type="text" className="w-full border p-2 rounded-md" placeholder="0.00" />
            </div>

            <div className="col-span-2">
              <Button
                size="sm"
                onClick={() => {
                  fetchSearchBillList()
                }}
                className="bg-rose-900 hover:bg-rose-700 hover:shadow-lg text-white text-xs p-2 h-[42px] w-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              >
                <Search className="w-3 h-3 mr-1" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Item Search Section - Billing @ Return */}
        <div className="p-2 rounded shadow-sm border mb-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label
              htmlFor="return-item-search"
              className="font-medium whitespace-nowrap"
              style={{ color: 'black' }}
            >
              Item Search
            </label>
            <div className="relative flex-1 min-w-[260px]">
              <input
                id="return-item-search"
                type="text"
                ref={inputBarCodeRef}
                value={barCodeInput}
                onChange={(e) => setBarCodeInput(e.target.value)}
                onKeyDown={handleEnterPress}
                placeholder="Scan barcode or type item code / name, then press Enter (ALT + I)"
                className="w-full border p-2 rounded-md pr-24"
                autoComplete="off"
              />
              {isItemSearching && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-sky-700">
                  Searching...
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => {
                const searchText = barCodeInput.trim()
                setBarCodeInput('')
                handleSelectBarcodeItem(searchText)
              }}
              className="bg-rose-900 hover:bg-rose-700 hover:shadow-lg text-white text-xs px-4 h-[38px] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              <Search className="w-3 h-3 mr-1" />
              Find Item
            </Button>
            <Button
              size="sm"
              onClick={() => handleSelectBarcodeItem('')}
              className="bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white text-xs px-4 h-[38px] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              title="Show all items of the listed invoices"
            >
              <Package className="w-3 h-3 mr-1" />
              Item List (ALT + L)
            </Button>
            {itemFilterInfo && (
              <div className="flex items-center gap-2 text-xs bg-amber-100 border border-amber-300 text-amber-900 px-2 py-1 rounded-md">
                <span>
                  Showing {itemFilterInfo.count} invoice{itemFilterInfo.count === 1 ? '' : 's'} with{' '}
                  <strong>{itemFilterInfo.label}</strong>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearItemSearchFilter}
                  className="h-6 px-2 text-xs"
                >
                  Show all invoices
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Help */}
        {/* <div className="bg-blue-50 p-2 rounded mb-2 text-xs text-blue-700 border border-blue-200">
          <p><strong>Keyboard Navigation:</strong> Use ↑↓ arrows to navigate rows (with auto-scroll) • Space to select invoice • Enter to fetch bill details • Tab to switch tables</p>
          <p>Currently focused: <span className="font-semibold">{isFocusedOnItemTable ? 'Items Table' : 'Invoice List'}</span></p>
        </div> */}

        <div className="flex gap-4 w-full">
          {/* Left Section - Buttons */}
          <div className="w-16 flex-shrink-0">
            <div className="  p-2 rounded-lg shadow-sm border">
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  title="Generate Cr. Note (CTRL + R)"
                  onClick={handleGenerateCreditNote}
                >
                  <Receipt className="w-5 h-5" />
                </Button>
                {__getCookieValue("UserRole")?.toLowerCase() === "admin" && (
                  <Button
                    size="sm"
                    className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    title="Reprint Cr. Note (CTRL + Q)"
                    onClick={toggleSearchBillReturnModal}
                  >
                    <Printer className="w-5 h-5" />
                  </Button>
                )}
                <Button
                  size="sm"
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  onClick={handleAllStateClear}
                  title="Clear Return (CTRL + X)"
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  onClick={() => navigate('/transaction/billing/billing-request-2')}
                  title="Billing"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Middle Section - Invoice List Table (1/3 width) */}
          <div className="w-1/3 flex-shrink-0" style={{background: 'white'}}>
            <div className="  rounded-sm border border-gray-200 shadow-sm flex flex-col h-[400px] overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 invoice-table-container">
                  <table className="w-full text-xs">
                    <thead className="bg-rose-900 sticky top-0 z-10">
                      <tr>
                        <th className="p-2 text-left border-r border-gray-200 text-white rounded-sm">
                          Select
                        </th>
                        <th className="p-2 text-left border-r border-gray-200 text-white">
                          Invoice No.
                        </th>
                        <th className="p-2 text-left border-r border-gray-200 text-white">
                          Random Bill No.
                        </th>
                        <th className="p-2 text-left border-r border-gray-200 text-white">Date</th>
                        <th className="p-2 text-right text-white rounded-tr-lg">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSelectBillData.length > 0 ? (
                        filteredSelectBillData.map(
                          (
                            invoice: {
                              billID: string | number
                              billNo?: string
                              billDate: string
                              billNetPayableAmt: number
                              selected?: boolean
                              customerName?: string
                              totalNoOfItem?: number
                            },
                            index: number
                          ) => (
                            <tr
                              key={`${invoice?.billID || index}-${index}`}
                              className={`invoice-row-${index} border-b border-gray-100 cursor-pointer transition-colors duration-150 ${
                                !isFocusedOnItemTable && selectedInvoiceRowIndex === index
                                  ? 'bg-amber-200 ring-2 ring-blue-400'
                                  : invoice?.selected
                                    ? 'bg-amber-200'
                                    : 'hover:bg-amber-50'
                              }`}
                              onClick={() => {
                                setSelectedInvoiceRowIndex(index)
                                setIsFocusedOnItemTable(false)
                                handleInvoiceSelection(index)
                              }}
                            >
                              <td className="p-2 border-r border-gray-100" >
                                <input
                                  type="checkbox"
                                  className="w-3 h-3"
                                  checked={invoice?.selected || false}
                                  onChange={(e) => {
                                    setSelectedInvoiceRowIndex(index)
                                    setIsFocusedOnItemTable(false)
                                    handleInvoiceSelection(index)
                                    e.currentTarget.blur()
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  // style={{ color: 'black' }}
                                />
                              </td>
                              <td className="p-2 border-r border-gray-100 text-blue-600 font-medium">
                                {invoice?.billNo || invoice?.billID || 'N/A'}
                              </td>
                              <td className="p-2 border-r border-gray-100 text-blue-600 font-medium">
                                {invoice?.randomBillNo || invoice?.randomBillNo || 'N/A'}
                              </td>
                              <td className="p-2 border-r border-gray-100" style={{color: 'black'}}>
                                {invoice?.billDate || 'N/A'}
                              </td>
                              <td className="p-2 text-right font-medium" style={{color: 'black'}}>
                                {invoice?.billNetPayableAmt?.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                }) || '0.00'}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <Search className="w-8 h-8 mb-2 text-gray-300" />
                              <p>No invoices found</p>
                              <p className="text-xs mt-1">Please search for invoices to display</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className={`px-4 py-3 border-t border-gray-100 flex-shrink-0 ${!isFocusedOnItemTable ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'}`}
              >
                <h3
                  className={`text-sm font-medium ${!isFocusedOnItemTable ? 'text-blue-800' : 'text-gray-800'}`}
                >
                  Invoice List ({filteredSelectBillData.length} records){' '}
                  {!isFocusedOnItemTable && '🎯 FOCUSED'}
                </h3>
              </div>
            </div>
          </div>

          {/* Right Section - Items Table (2/3 width) */}
          <div className="w-2/3 space-y-2 h-[400px]" style={{background: '#fff'}}>
            {/* Items Table New With Api */}
            <div
              className={`  rounded shadow-sm border overflow-hidden ${isFocusedOnItemTable ? 'ring-2 ring-blue-400' : ''}`}
            >
              <div className="max-h-96 overflow-y-auto h-[400px] items-table-container scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <Table className="text-xs">
                  {/* <TableHeader className={`sticky top-0 z-10 ${isFocusedOnItemTable ? 'bg-blue-100' : 'bg-gray-50'}`}> */}
                  <TableHeader className="bg-sky-600 text-white">
                    <TableRow>
                      <TableHead className="w-20 text-xs text-center text-white">Sl No.</TableHead>
                      <TableHead className="w-24 text-xs text-center text-white">
                        Select Item
                      </TableHead>
                      <TableHead className="w-24 text-xs text-center text-white">Barcode</TableHead>
                      <TableHead className="text-xs text-left text-white">Item Name</TableHead>
                      <TableHead className="w-16 text-xs text-center text-white">
                        Invoice Qty.
                      </TableHead>
                      <TableHead className="w-16 text-xs text-center text-white">
                        Return Qty.
                      </TableHead>
                      <TableHead className="w-24 text-xs text-center text-white">
                        Action
                      </TableHead>
                      <TableHead className="w-20 text-xs text-right text-white">MRP</TableHead>
                      <TableHead className="w-20 text-xs text-right text-white">Discount</TableHead>
                      <TableHead className="w-20 text-xs text-right text-white">
                        Promotion
                      </TableHead>
                      <TableHead className="w-28 text-xs text-right text-white">Net Amt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(currentSelectBillDetails as any) &&
                    (currentSelectBillDetails as any).length > 0 &&
                    (currentSelectBillDetails as any)[0]?.objDetails ? (
                      (currentSelectBillDetails as any)[0].objDetails.map(
                        (item: any, index: number) => (
                          <TableRow
                            key={item.lineNum || index + 1}
                            className={`item-row-${index} h-8 cursor-pointer ${
                              isFocusedOnItemTable && selectedItemRowIndex === index
                                ? 'bg-amber-200 ring-2 ring-blue-400'
                                : item.selectItem
                                  ? 'bg-amber-200'
                                  : 'hover:bg-amber-50'
                            }`}
                            onClick={() => {
                              setSelectedItemRowIndex(index)
                              setIsFocusedOnItemTable(true)
                              handleItemSelection(index)
                            }}
                          >
                            
                            <TableCell className="text-xs text-center" style={{color: 'black'}}>{item.lineNum}</TableCell>
                            <TableCell className="text-xs text-center" style={{color: 'black'}}>
                              <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={item.selectItem || false}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  setSelectedItemRowIndex(index)
                                  setIsFocusedOnItemTable(true)
                                  handleItemSelection(index)
                                  e.currentTarget.blur()
                                }}
                                onClick={(e) => e.stopPropagation()}
                                style={{color: 'black'}}
                              />
                            </TableCell>
                            <TableCell className="text-xs text-center" style={{color: 'black'}}>{item.barcode}</TableCell>
                            <TableCell className="text-xs text-left" style={{color: 'black'}}>{item.itemName}</TableCell>
                            <TableCell className="text-xs text-center" style={{color: 'black'}}>{item.quantity}</TableCell>
                            <TableCell className="text-xs text-center" style={{color: 'black'}}>
                              {item.selectItem ? (
                                <input
                                  type="number"
                                  min="0"
                                  max={item.quantity}
                                  value={item.returnQuantity !== undefined ? item.returnQuantity : item.quantity}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    handleReturnQuantityChange(index, e.target.value)
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-16 px-2 py-1 text-center border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400  "
                                />
                              ) : (
                                <span style={{color: 'black'}}>{item.quantity}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-center">
                              {item.selectItem ? (
                                <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDecrementReturnQty(index)
                                    }}
                                    className="w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded font-bold text-sm transition-colors"
                                    title="Decrease quantity"
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleIncrementReturnQty(index)
                                    }}
                                    className="w-6 h-6 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded font-bold text-sm transition-colors"
                                    title="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-xs" style={{color: 'black'}}>
                              {item.mrp ? item.mrp.toFixed(2) : '0.00'}
                            </TableCell>
                            <TableCell className="text-right text-xs" style={{color: 'black'}}>
                              {item.discountAmt && item.discountAmt > 0
                                ? `${item.discountAmt.toFixed(2)}`
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right text-xs" style={{color: 'black'}}>
                              {item.promotionAmt && item.promotionAmt > 0
                                ? `${item.promotionAmt.toFixed(2)}`
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs" style={{color: 'black'}}>
                              {item.netAmt ? item.netAmt.toFixed(2) : '0.00'}
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center text-gray-500 py-8">
                          <div className="flex flex-col items-center">
                            <Search className="w-8 h-8 mb-2 text-gray-300" />
                            <p>No items found</p>
                            <p className="text-xs mt-1">
                              {selectedBillID
                                ? 'This invoice has no items to display'
                                : 'Please select an invoice to view items'}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Return Quantity Row - Fixed at bottom */}
            <div className="  rounded shadow-sm border overflow-hidden">
              <Table className="text-xs">
                <TableBody>
                  <TableRow className="font-bold border-t bg-sky-600 text-white hover:bg-sky-700">
                    <TableCell className="w-20 text-xs text-center">
                      <Button
                        size="sm"
                        className="bg-rose-900 hover:bg-rose-700 hover:shadow-xl text-white text-xs px-3 py-1.5 w-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 font-semibold"
                        onClick={handleGenerateCreditNote}
                      >
                        Generate Cr. Note
                      </Button>
                    </TableCell>
                    <TableCell className="w-24 text-xs text-center"></TableCell>
                    <TableCell className="w-24 text-xs text-center"></TableCell>
                    <TableCell className="text-xs text-left font-bold">
                      <span>Return Quantity</span>
                    </TableCell>
                    <TableCell className="w-16 text-xs text-center"></TableCell>
                    <TableCell className="w-16 text-xs text-center font-bold">
                      {(currentSelectBillDetails as any) &&
                      (currentSelectBillDetails as any).length > 0 &&
                      (currentSelectBillDetails as any)[0]?.objDetails
                        ? (currentSelectBillDetails as any)[0].objDetails
                            .filter((item: any) => item.selectItem)
                            .reduce((total: number, item: any) => total + (item.returnQuantity !== undefined ? item.returnQuantity : item.quantity || 0), 0)
                        : 0}
                    </TableCell>
                    <TableCell className="w-24 text-xs text-center"></TableCell>
                    <TableCell className="w-20 text-right text-xs font-bold">0.00</TableCell>
                    <TableCell className="w-20 text-right text-xs font-bold">0.00</TableCell>
                    <TableCell className="w-20 text-right text-xs"></TableCell>
                    <TableCell className="w-28 text-right font-bold text-xs">
                      {(currentSelectBillDetails as any) &&
                      (currentSelectBillDetails as any).length > 0 &&
                      (currentSelectBillDetails as any)[0]?.objDetails
                        ? (currentSelectBillDetails as any)[0].objDetails
                            .filter((item: any) => item.selectItem)
                            .reduce((total: number, item: any) => {
                              const returnQty = item.returnQuantity !== undefined ? item.returnQuantity : item.quantity
                              const proportionalAmt = (item.netAmt / item.quantity) * returnQty
                              return total + proportionalAmt
                            }, 0)
                            .toFixed(2)
                        : '0.00'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 'Item Search' - Billing @ Return */}
      {showItemSearchModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onMouseDown={closeItemSearchModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select item to return"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                e.stopPropagation()
                setItemSearchSelectedIndex((prev) =>
                  Math.min(prev + 1, Math.max(filteredItemSearchRows.length - 1, 0))
                )
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                e.stopPropagation()
                setItemSearchSelectedIndex((prev) => Math.max(prev - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                selectItemFromSearchModal(itemSearchSelectedIndex)
              } else if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
                closeItemSearchModal()
              }
            }}
            className="w-full max-w-5xl bg-white rounded-lg border border-gray-200 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 bg-rose-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold">Select Item to Return</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={closeItemSearchModal}
                className="h-7 text-xs bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              >
                Close (Esc)
              </Button>
            </div>

            <div className="px-4 py-2 border-b border-gray-200 flex flex-wrap items-center gap-3">
              <input
                ref={itemSearchModalInputRef}
                type="text"
                value={itemSearchModalText}
                onChange={(e) => {
                  setItemSearchModalText(e.target.value)
                  setItemSearchSelectedIndex(0)
                }}
                placeholder="Filter by barcode, item code, item name or invoice no."
                className="flex-1 min-w-[240px] border p-2 rounded-md text-sm"
                autoComplete="off"
              />
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {filteredItemSearchRows.length} of {itemSearchModalBaseRows.length} items. Use Up / Down
                to move, Enter to add.
              </span>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-sky-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="p-2 text-left">Invoice No.</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-center">Barcode</th>
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-center">Invoice Qty.</th>
                    <th className="p-2 text-center">Return Qty.</th>
                    <th className="p-2 text-right">MRP</th>
                    <th className="p-2 text-right">Net Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItemSearchRows.length > 0 ? (
                    filteredItemSearchRows.map((row: any, index: number) => {
                      const returnQtyOnLoadedBill = loadedReturnQtyMap[`${row.billID}-${row.lineNum}`]
                      return (
                        <tr
                          key={row.key || `${row.billID}-${row.lineNum}-${index}`}
                          className={`item-search-row-${index} border-b border-gray-100 cursor-pointer ${
                            itemSearchSelectedIndex === index
                              ? 'bg-amber-200 ring-2 ring-inset ring-blue-400'
                              : 'hover:bg-amber-50'
                          }`}
                          style={{ color: 'black' }}
                          onMouseEnter={() => setItemSearchSelectedIndex(index)}
                          onClick={() => selectItemFromSearchModal(index)}
                        >
                          <td className="p-2 text-blue-600 font-medium">{row.billNo || row.billID}</td>
                          <td className="p-2">{String(row.billDate || '').split(' ')[0] || '-'}</td>
                          <td className="p-2 text-center">{row.barcode || '-'}</td>
                          <td className="p-2">{row.itemName || '-'}</td>
                          <td className="p-2 text-center">{row.quantity}</td>
                          <td className="p-2 text-center">
                            {returnQtyOnLoadedBill !== undefined ? returnQtyOnLoadedBill : '-'}
                          </td>
                          <td className="p-2 text-right">{row.mrp.toFixed(2)}</td>
                          <td className="p-2 text-right">{row.netAmt.toFixed(2)}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        No items match this filter. Change the text to see more items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={checkoutModalRef}
            tabIndex={0}
            className="  rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto focus:outline-none focus:ring-4 focus:ring-blue-500"
            style={{ backgroundColor: '#d6eaf8' }}
          >
            <div className="sticky top-0   border-b border-gray-200 p-4 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-blue-600">Check Out</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4 border-2 border-blue-200 p-4 rounded-lg">
                <p className="font-semibold w-1/3 min-w-[150px]" style={{color: 'black'}}>Total Return Amount:</p>
                <input
                  type="text" 
                  value={Math.round(totalBillAmount)}
                  // value={totalBillAmount.toFixed(2)}
                  className="flex-1 p-3 border-2 border-blue-300 rounded-lg   font-semibold text-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled
                />
              </div>
              {/* 
                        {paymentListData.map((payment, index) => (
                          <div key={index} className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                            <p className="font-normal w-1/3 min-w-[120px]">{payment.modeOfPaymentName}:</p>
                            <div className="flex flex-1 gap-2">
                              <input type="text" value={payment.amount}  onChange={(e) => handleCheckoutPaymentAmountChange(index, e.target.value)} className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                              <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                                Note
                              </Button>
                            </div>
                          </div>
                        ))} 
                        */}
              {/* {
                          paymentListData
                            .map((payment, index) => {
                              const name = payment.paymentModeName?.toLowerCase() || '';
                              const isVisible =
                                name === 'cash' ||
                                name === 'paytm' ||
                                name === 'gpay' ||
                                name === 'credit note' ||
                                name === 'creditnote';
      
                              if (!isVisible) return null;
      
                              const showNoteButton = name.includes('paytm') || name.includes('gpay');
      
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-4 border p-3 rounded-lg shadow-sm"
                                >
                                  <p className="font-normal w-1/3 min-w-[120px]">
                                    {payment.paymentModeName}:
                                  </p>
                                  <div className="flex flex-1 gap-2">
                                    <input
                                      type="text"
                                      value={payment.amount}
                                      onChange={(e) =>
                                        handleCheckoutPaymentAmountChange(index, e.target.value)
                                      }
                                      className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {showNoteButton && (
                                      <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                                        Note
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                        } */}
              {paymentListData.map((payment, index) => {
                //const name = payment.paymentModeName?.toLowerCase() || '';
                const name = payment.availablePaymentmethod?.toLowerCase() || ''
                const isVisible =
                  name === 'cash' ||
                  //name === 'paytm' ||
                  //name === 'gpay' ||
                  //name === 'mobilewallet' ||
                  name === 'credit note' ||
                  name === 'creditnote' ||
                  name === 'creditnoteissued' //||
                //name === 'debit' ||
                //name === 'debitcard' ||
                //name === 'creditcard'

                if (!isVisible) return null

                const showNoteButton =
                  name.includes('paytm') || name.includes('gpay') || name.includes('mobilewallet')
                const isUPI =
                  name.includes('paytm') || name.includes('gpay') || name.includes('mobilewallet')
                const isCash = name === 'cash'
                const isCreditNote = name === 'creditnote' || name === 'creditnoteissued' || name === 'credit note'

                return (
                  <div key={index} className="flex flex-col gap-2 border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <p className="font-normal w-1/3 min-w-[120px]" style={{color: 'black'}}>{payment.paymentModeName}:</p>
                      <div className="flex flex-1 gap-2">
                        <input
                          type="text"
                          value={payment.amount}
                          // value={Math.round(totalBillAmount)}
                          // value={Math.round(payment.amount)}
                          // value={totalBillAmount.toFixed(2)}
                          onChange={(e) => handleCheckoutPaymentAmountChange(index, e.target.value)}
                          className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          disabled={isCash}
                          ref={isCreditNote ? creditNoteInputRef : null}
                        />
                        {showNoteButton && (
                          <Button
                            className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                            onClick={() => toggleNoteField(index)}
                          >
                            Note
                          </Button>
                        )}
                      </div>
                    </div>

                    {payment.showNote && isUPI && (
                      <div className="flex items-center gap-2">
                        <label className="min-w-[150px]">Transaction / Ref No:</label>
                        <input
                          type="number"
                          value={payment.upItransactionID || ''}
                          onChange={(e) =>
                            handlePaymentNoteChange(index, 'upItransactionID', e.target.value)
                          }
                          className="p-2 border rounded-lg w-full"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between gap-3 p-4 back-white border-t border-gray-200 rounded-b-2xl">
              <Button
                className="flex-1 bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                onClick={toggleCheckout}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRefundBill}
                disabled={totalBillAmount === 0 || isBtnSaving}
                className={`flex-1 px-5 py-3 rounded-lg font-medium transition-colors ${
                  totalBillAmount > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Save Return Bill (ALT + S)"
              >
                {isBtnSaving ? 'Saving...' : 'Save (ALT+S)'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for 'Return Search Bill' */}
      {showSearchBillReturnModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="  rounded-lg shadow-lg p-6 w-6/12" style={{background: 'white'}}>
            <h2 className="text-xl font-semibold mb-4" style={{color: 'black'}}>Search Return Bill</h2>
            <div className="box overflow-y-auto w-full p-4">
              <div className="overflow-x-auto border rounded-md w-full p-4 space-y-4">
                <div>
                  <label className="font-medium block" style={{color: 'black'}}>Bill Date Between</label>
                  <div className="flex space-x-2">
                    <span style={{color: 'black'}}>From:</span>
                    <input
                      type="date"
                      value={searchBillReturnFromDate}
                      onChange={(e) => setSearchBillReturnFromDate(e.target.value)}
                      className="border p-2 rounded-md"
                    />
                    <span style={{color: 'black'}}>To:</span>
                    <input
                      type="date"
                      value={searchBillReturnToDate}
                      onChange={(e) => setSearchBillReturnToDate(e.target.value)}
                      className="border p-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium block" style={{color: 'black'}}>Phone Number</label>
                  <input
                    type="text"
                    value={searchBillReturnPhoneNumber}
                    onChange={(e) => setSearchBillReturnPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="border p-2 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="font-medium block" style={{color: 'black'}}>Customer Name</label>
                  <input
                    type="text"
                    value={searchBillReturnCustomerName}
                    onChange={(e) => setSearchBillReturnCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="border p-2 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end items-end">
              <div className="flex gap-6 ">
                <Button
                  onClick={toggleSearchBillReturnModal}
                  className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={toggleSelectBillReturnModal}
                  className={`px-3 text-white rounded-lg shadow-md ${
                    !(
                      searchBillReturnPhoneNumber.trim() ||
                      searchBillReturnCustomerName.trim() ||
                      (searchBillReturnFromDate && searchBillReturnToDate)
                    )
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  disabled={
                    !(
                      searchBillReturnPhoneNumber.trim() ||
                      searchBillReturnCustomerName.trim() ||
                      (searchBillReturnFromDate && searchBillReturnToDate)
                    )
                  }
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal for 'Return Select Bill' */}
      {showSelectBillReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-sky-200" style ={{background: '#d6eaf8'}}>
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 flex items-center gap-3">
              <Receipt className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Select Return Bill</h2>
            </div>

            {/* Search Section */}
            <div className="p-6 border-b border-sky-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sky-400" />
                <input
                  type="text"
                  placeholder="Search Bill No..."
                  value={selectBillReturnSearchText}
                  onChange={(e) => handleSelectBillReturnSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent  "
                />
              </div>
            </div>

            {/* Table Section with Scrollbar */}
            <div className="p-6">
              <div className="  rounded-lg border border-sky-200 overflow-hidden">
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-300 scrollbar-track-sky-100">
                  <table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-sky-600 text-white sticky top-0 z-10">
                        <TableHead className="h-12 text-white font-medium border-r border-sky-500">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Bill No
                          </div>
                        </TableHead>
                        <TableHead className="h-12 text-white font-medium border-r border-sky-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Bill Date
                          </div>
                        </TableHead>
                        <TableHead className="h-12 text-white font-medium border-r border-sky-500">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            No Of Item
                          </div>
                        </TableHead>
                        <TableHead className="h-12 text-white font-medium border-r border-sky-500">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Amount
                          </div>
                        </TableHead>
                        <TableHead className="h-12 text-white font-medium border-r border-sky-500">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Customer Name
                          </div>
                        </TableHead>
                        <TableHead className="h-12 text-white font-medium">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Action
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingReturn ? (
                        <TableRow>
                          <TableCell colSpan="6" className="text-center p-8">
                            <div className="flex flex-col items-center gap-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                              <span className="text-sky-600 font-medium">Loading bills...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredSelectBillReturnData.length ? (
                        filteredSelectBillReturnData.map((bill, index) => (
                          <TableRow key={index + 1} className="hover:bg-sky-50 transition-colors border-b border-sky-100">
                            <td className="p-3 border-r border-sky-100">
                              <span className="font-medium text-c-black">{bill.billNo}</span>
                            </td>
                            <td className="p-3 border-r border-sky-100 text-c-black">{bill.billDate}</td>
                            <td className="p-3 border-r border-sky-100 text-center">
                              <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded-full text-sm font-medium">
                                {bill.totalNoOfItem}
                              </span>
                            </td>
                            <td className="p-3 border-r border-sky-100 text-right font-semibold text-c-black">
                              ₹{bill.billNetPayableAmt?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                            </td>
                            <td className="p-3 border-r border-sky-100 text-c-black">{bill.customerName}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleReturnReprintBill(bill)}
                                className="p-2 text-c-black hover:text-c-black hover:bg-sky-100 rounded-lg transition-all duration-200"
                                title="Print Bill"
                              >
                                <Printer className="w-5 h-5" />
                              </button>
                            </td>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan="6" className="text-center p-8">
                            <div className="flex flex-col items-center gap-3">
                              <FileText className="w-12 h-12 text-sky-300" />
                              <span className="text-sky-600 font-medium">No bills found</span>
                              <span className="text-sky-400 text-sm">Try adjusting your search criteria</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6 px-2">
                <Button
                  onClick={() => setSelectBillReturnCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={selectBillReturnCurrentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2 text-sky-700">
                  <span className="text-sm text-c-black">Page</span>
                  <span className="bg-sky-100 px-3 py-1 rounded-lg font-medium">{selectBillReturnCurrentPage}</span>
                  <span className="text-sm text-c-black">of</span>
                  <span className="bg-sky-100 px-3 py-1 rounded-lg font-medium">{totalSelectBillReturnPages}</span>
                </div>
                
                <Button
                  onClick={() =>
                    setSelectBillReturnCurrentPage((prev) =>
                      Math.min(prev + 1, totalSelectBillReturnPages)
                    )
                  }
                  disabled={selectBillReturnCurrentPage === totalSelectBillReturnPages}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-6 pt-4 border-t border-sky-100">
                <Button
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
                  onClick={toggleSelectBillReturnModal}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Refund Bill Save Modal */}
      {isCheckoutSaveRefundModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-[9999]" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="  p-6 rounded-lg shadow-lg w-[350px] text-center" style={{backgroundColor: '#d6eaf8'}}>
            <div className="text-green-600 text-4xl mb-3">✔️</div>
            <p className="text-lg font-semibold mb-2" style={{color: 'black'}}>Refund Bill saved successfully!</p>
            {checkoutSaveRefundBillDocNum && (
              <p className="text-sm" style={{color: 'black'}}>
                Refund Bill Number: <strong>{checkoutSaveRefundBillDocNum}</strong>
              </p>
            )}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={handleBillPrint_v2} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Print Bill
              </button>
              <button onClick={() => { handleAllStateClear(); setIsCheckoutSaveRefundModalOpen(false); setShowCheckout(false); }} className="px-4 py-2 bg-gray-300 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckout2 && (
                    <div className="w-full p-2   shadow-xl rounded-2xl border border-gray-200">
                      <h2 className="text-xl font-semibold m-2">Check Out</h2>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                          <p className="font-normal w-1/3 min-w-[120px]">Total Return Amount:</p>
                          {/* <input type="text" value={scannedItemListData?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0} className="flex-1 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled  /> */}
                          <input type="text"value={totalBillAmount} className="flex-1 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled />
                        </div>
                        {/* 
                        {paymentListData.map((payment, index) => (
                          <div key={index} className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                            <p className="font-normal w-1/3 min-w-[120px]">{payment.modeOfPaymentName}:</p>
                            <div className="flex flex-1 gap-2">
                              <input type="text" value={payment.amount}  onChange={(e) => handleCheckoutPaymentAmountChange(index, e.target.value)} className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                              <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                                Note
                              </Button>
                            </div>
                          </div>
                        ))} 
                        */}
                        {/* {
                          paymentListData
                            .map((payment, index) => {
                              const name = payment.paymentModeName?.toLowerCase() || '';
                              const isVisible =
                                name === 'cash' ||
                                name === 'paytm' ||
                                name === 'gpay' ||
                                name === 'credit note' ||
                                name === 'creditnote';
      
                              if (!isVisible) return null;
      
                              const showNoteButton = name.includes('paytm') || name.includes('gpay');
      
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-4 border p-3 rounded-lg shadow-sm"
                                >
                                  <p className="font-normal w-1/3 min-w-[120px]">
                                    {payment.paymentModeName}:
                                  </p>
                                  <div className="flex flex-1 gap-2">
                                    <input
                                      type="text"
                                      value={payment.amount}
                                      onChange={(e) =>
                                        handleCheckoutPaymentAmountChange(index, e.target.value)
                                      }
                                      className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {showNoteButton && (
                                      <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                                        Note
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                        } */}
                        {
                          paymentListData.map((payment, index) => {
                            //const name = payment.paymentModeName?.toLowerCase() || '';
                            const name = payment.availablePaymentmethod?.toLowerCase() || '';
                            const isVisible =
                              name === 'cash' ||
                              //name === 'paytm' ||
                              //name === 'gpay' ||
                              //name === 'mobilewallet' ||
                              name === 'credit note' ||
                              name === 'creditnote' ||
                              name === 'creditnoteissued'; //||
                              //name === 'debit' ||
                              //name === 'debitcard' ||
                              //name === 'creditcard'
      
                            if (!isVisible) return null;
      
                            const showNoteButton = name.includes('paytm') || name.includes('gpay') || name.includes('mobilewallet');
                            const isUPI = name.includes('paytm') || name.includes('gpay') || name.includes('mobilewallet');
                            const isCash = name === 'cash'; 
      
                            return (
                              <div
                                key={index}
                                className="flex flex-col gap-2 border p-3 rounded-lg shadow-sm"
                              >
                                <div className="flex items-center gap-4">
                                  <p className="font-normal w-1/3 min-w-[120px]">
                                    {payment.paymentModeName}:
                                  </p>
                                  <div className="flex flex-1 gap-2">
                                    <input
                                      type="text"
                                      value={payment.amount}
                                      onChange={(e) =>
                                        handleCheckoutPaymentAmountChange(index, e.target.value)
                                      }
                                      className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                      disabled={isCash} 
                                    />
                                    {showNoteButton && (
                                      <Button
                                        className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                                        onClick={() => toggleNoteField(index)}
                                      >
                                        Note
                                      </Button>
                                    )}
                                  </div>
                                </div>
      
                                {payment.showNote && isUPI && (
                                  <div className="flex items-center gap-2">
                                    <label className="min-w-[150px]">Transaction / Ref No:</label>
                                    <input
                                      type="number"
                                      value={payment.upItransactionID || ''}
                                      onChange={(e) =>
                                        handlePaymentNoteChange(index, 'upItransactionID', e.target.value)
                                      }
                                      className="p-2 border rounded-lg w-full"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })
                        }
                      </div>
                      <div className="flex justify-between mt-8">
                        <Button className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500" onClick={toggleCheckout}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveRefundBill} disabled={totalBillAmount === 0 || isBtnSaving} className={`px-5 py-2 rounded-lg shadow-md ${totalBillAmount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}  >
                          {isBtnSaving ? 'Saving...' : 'Save'} 
                        </Button>
                        {/* 
                        <Button className={`px-5 py-2 rounded-lg shadow-md ${totalBillAmount > 0 ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`} disabled={totalBillAmount === 0}>
                          Refund
                        </Button> 
                        */}
                      </div>
                    </div>
      )}
    </div>
  )
}

export default BillingReturn2