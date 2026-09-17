import {
  Plus,
  Minus,
  Phone,
  Trash2,
  Search,
  Users,
  ShoppingCart,
  Receipt,
  Archive,
  RotateCcw,
  X,
  Percent,
  Gift,
  User,
  ShoppingBag,
  CheckCircle,
  ArrowLeft,
  UserPlus,
  RotateCcwIcon,
  ReplaceAllIcon,
  CircleArrowOutUpLeft,
  TextSearch,
  SearchIcon,
  ShieldCloseIcon,
  XIcon,
  Printer,
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  DollarSign,
  Tag,
  Save,
  FileText,
  Eye,
  UserCheck,
  CalendarDays,
} from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { GetAPI, PostAPI } from '../../../../../../services/apiCall'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useCookies } from 'react-cookie'
import { useClickAway } from '@/hooks/useClickAway'
import TootlTipWrapper from '@/components/TootlTipWrapper'
import { set } from 'date-fns'
import { Label } from '@/components/ui/label'
import logoImg from '@/assets/img/logo.png';
import { itemMasterSchema } from '../../../Administration/Master/ItemMaster/schemas/itemMasterSchema'
import { __getCookieValue } from '@/common/authCookies';

interface Item {
  id: number
  barcode: string
  name: string
  qty: number
  mrp: number
  discount: number
  promotion: number
  tax: number
  netAmt: number
}

interface CustomerInfo {
  firstName: string
  middleName: string
  lastName: string
  mobile: string
}

// Dummy customer database
const dummyCustomers: CustomerInfo[] = [
  { mobile: '9999999999', firstName: 'Niladri', middleName: '', lastName: 'Sarker' },
  { mobile: '9876543210', firstName: 'Rahul', middleName: 'Kumar', lastName: 'Sharma' },
  { mobile: '8765432109', firstName: 'Priya', middleName: '', lastName: 'Patel' },
  { mobile: '7654321098', firstName: 'Amit', middleName: 'Singh', lastName: 'Gupta' },
  { mobile: '6543210987', firstName: 'Sneha', middleName: 'Devi', lastName: 'Yadav' },
  { mobile: '5432109876', firstName: 'Vikash', middleName: '', lastName: 'Jha' },
  { mobile: '4321098765', firstName: 'Ritu', middleName: 'Kumari', lastName: 'Das' },
]

// Demo barcode database
const demoItems = [
  { barcode: 'DB100001', name: 'Item 100001', mrp: 899.0, discount: 89.9, promotion: 0 },
  { barcode: 'DB100002', name: 'Item 100002', mrp: 129.0, discount: 0, promotion: 0 },
  { barcode: 'DB100003', name: 'Item 100003', mrp: 749.0, discount: 0, promotion: 0 },
  { barcode: 'DB100004', name: 'Item 100004', mrp: 529.0, discount: 0, promotion: 0 },
  { barcode: 'DB100005', name: 'Item 100005', mrp: 2799.0, discount: 0, promotion: 0 },
  { barcode: 'DB100006', name: 'Item 100006', mrp: 1299.0, discount: 129.9, promotion: 0 },
  { barcode: 'DB100007', name: 'Item 100007', mrp: 499.0, discount: 0, promotion: 0 },
  { barcode: 'DB100008', name: 'Item 100008', mrp: 579.0, discount: 0, promotion: 0 },
  { barcode: 'DB100009', name: 'Item 100009', mrp: 548.0, discount: 0, promotion: 274.0 },
  { barcode: 'DB100010', name: 'Item 100010', mrp: 448.0, discount: 0, promotion: 0 },
  { barcode: 'DB100011', name: 'Item 100011', mrp: 699.0, discount: 0, promotion: 0 },
  { barcode: 'DB100012', name: 'Item 100012', mrp: 399.0, discount: 39.9, promotion: 0 },
  { barcode: 'DB100013', name: 'Item 100013', mrp: 849.0, discount: 0, promotion: 0 },
  { barcode: 'DB100014', name: 'Item 100014', mrp: 299.0, discount: 0, promotion: 0 },
  { barcode: 'DB100015', name: 'Item 100015', mrp: 1599.0, discount: 159.9, promotion: 0 },
]

const BillingRequest2 = () => {
  const navigate = useNavigate()

  // ! State Variables for new Item Search Implementation
  const [itemNewSearchText, setItemNewSearchText] = useState('')
  const [itemSearchBarcode, setItemSearchBarcode] = useState('')
  const [itemNewSearchResults, setItemNewSearchResults] = useState([])

  const dummy_item_info = [
    {
      itemCode: 'I1001',
      itemName: 'Item One',
      barCode: 'DB100001',
      posBarCode: 'PB100001',
      oldBarCode: 'OB100001',
      envBarcode: 'EN100001',
      mrpMaster: 899.0,
      mrpStock: 899.0,
      stockQty: 50,
    },
    {
      itemCode: 'I1002',
      itemName: 'Item Two',
      barCode: 'DB100002',
      posBarCode: 'PB100002',
      oldBarCode: 'OB100002',
      mrpMaster: 129.0,
      envBarcode: 'EN100002',
      mrpStock: 129.0,
      stockQty: 30,
    },
    {
      itemCode: 'I1003',
      itemName: 'Item Three',
      barCode: 'DB100003',
      posBarCode: 'PB100003',
      oldBarCode: 'OB100003',
      mrpMaster: 749.0,
      envBarcode: 'EN100003',
      mrpStock: 749.0,
      stockQty: 20,
    },
    {
      itemCode: 'I1004',
      itemName: 'Item Four',
      barCode: 'DB100004',
      posBarCode: 'PB100004',
      oldBarCode: 'OB100004',
      mrpMaster: 529.0,
      envBarcode: 'EN100004',
      mrpStock: 529.0,
      stockQty: 15,
    },
    {
      itemCode: 'I1005',
      itemName: 'Item Five',
      barCode: 'DB100005',
      posBarCode: 'PB100005',
      oldBarCode: 'OB100005',
      mrpMaster: 2799.0,
      envBarcode: 'EN100005',
      mrpStock: 2799.0,
      stockQty: 10,
    },
    {
      itemCode: 'I1006',
      itemName: 'Item Six',
      barCode: 'DB100006',
      posBarCode: 'PB100006',
      oldBarCode: 'OB100006',
      mrpMaster: 1299.0,
      envBarcode: 'EN100006',
      mrpStock: 1299.0,
      stockQty: 25,
    },
  ]

  const handleNewItemSearch = async () => {
    const searchTextLower = itemNewSearchText.trim()
    const searchBarcodeLower = itemSearchBarcode.trim()

    if (!searchTextLower && !searchBarcodeLower) {
      toast.error('Please enter item name or barcode to search', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    try {
      setLoading(true)

      // Build query parameters
      let queryParams = []
      if (searchTextLower) {
        queryParams.push(`ItemName=${encodeURIComponent(searchTextLower)}`)
      }
      if (searchBarcodeLower) {
        queryParams.push(`ItemCode=${encodeURIComponent(searchBarcodeLower)}`)
      }

      const PType = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
      const PJsonData = {}

      const responseJson = await GetAPI('/api/Item/GetAllItem', PType, PJsonData, cookies)

      if (responseJson.status === 200 && responseJson.data) {
        // Map API response to match the table structure
        const mappedResults = responseJson.data.map((item) => ({
          itemCode: item.itemCode || '',
          barCode: item.barCode || '',
          itemName: item.itemName || '',
          mrpMaster: item.mrp || 0,
          mrpStock: item.retailPrice || item.mrp || 0, // Using retailPrice as fallback
          stockQty: item.stock || 0,
          posBarCode: item.posBarCode || '',
          envBarcode: '', // API doesn't provide this field
          oldBarCode: item.oldBarCode || '',
        }))

        setItemNewSearchResults(mappedResults)

        if (mappedResults.length === 0) {
          toast.info('No items found matching your search criteria', {
            style: { backgroundColor: '#e8f4f8', color: '#0c5273' },
          })
        } else {
          toast.success(`Found ${mappedResults.length} item(s)`)
        }
      } else {
        setItemNewSearchResults([])
        toast.error('No items found', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      setItemNewSearchResults([])
      toast.error('Failed to fetch items. Please try again.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleItemNewSearchClear = () => {
    setItemNewSearchText('')
    setItemSearchBarcode('')
    setItemNewSearchResults([])
    setShowItemList2(false)
  }

  // useEffect(() => {
  //   setItemNewSearchResults(dummy_item_info);
  // }, []);

  //! Arindam da code starts Here

  //const today = new Date().toLocaleDateString('en-GB').split('/').join('-'); //new Date().toISOString().split('T')[0];
  const [today, setToday] = useState('')
  const [showNoSessionPopup, setShowNoSessionPopup] = useState(false)
  const [cookies] = useCookies(['UserId', 'DefaultStoreId', 'UserRole'])
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }
  //console.log(cookies, cookies.DefaultStoreId)
  //console.log("Cookies from document.cookie:", document.cookie);

  /*const [itemCurrentPage, setItemCurrentPage] = useState(1);
  const itemsPerPage = 3;*/
  const [itemSearchText, setItemSearchText] = useState('')
  const [itemListData, setItemListData] = useState([])
  const [filteredItemData, setFilteredItemData] = useState([])
  const [itemCurrentPage, setItemCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [loading, setLoading] = useState(false)
  /*const [customerCurrentPage,setCustomerCurrentPage] = useState(1);
  const customerPerPage = 1;*/
  const [customerSearchText, setCustomerSearchText] = useState('')
  const [customerListData, setCustomerListData] = useState([])
  const [filteredCustomerData, setFilteredCustomerData] = useState([])
  const [customerCurrentPage, setCustomerCurrentPage] = useState(1)
  const customerPerPage = 5
  const [selectedCustomerID, setSelectedCustomerID] = useState(null)
  const [selectedCustomerData, setSelectedCustomerData] = useState<any>(null)
  const [storedCustomer, setStoredCustomer] = useState<any>(null)
  const [customerSaveData, setCustomerSaveData] = useState({
    customerFirstName: '',
    customerMiddleName: '',
    customerLastName: '',
    mobile: '',
    whatsAppNo: '',
  })
  const [customerErrors, setCustomerErrors] = useState({})

  /*const [promotionCurrentPage,setPromotionCurrentPage] = useState(1);
  const promotionPerPage = 1;*/
  const [promotionSearchText, setPromotionSearchText] = useState('')
  const [promotionListData, setPromotionListData] = useState([])
  const [filteredPromotionData, setFilteredPromotionData] = useState([])
  const [promotionCurrentPage, setPromotionCurrentPage] = useState(1)
  const promotionPerPage = 5
  const [selectedPromotionID, setSelectedPromotionID] = useState(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState(null)
  const [selectedPromotionData, setSelectedPromotionData] = useState(null)
  const [storedPromotion, setStoredPromotion] = useState(null)
  /*const [discountCurrentPage,setDiscountCurrentPage] = useState(1);
  const discountPerPage = 1;*/
  const [discountSearchText, setDiscountSearchText] = useState('')
  const [discountListData, setDiscountListData] = useState([])
  const [filteredDiscountData, setFilteredDiscountData] = useState([])
  const [discountCurrentPage, setDiscountCurrentPage] = useState(1)
  const discountPerPage = 5
  const [selectedDiscountID, setSelectedDiscountID] = useState(null)
  const [selectedDiscountData, setSelectedDiscountData] = useState(null)
  const [storedDiscount, setStoredDiscount] = useState(null)

  const [holdBillSearchText, setHoldBillSearchText] = useState('')
  const [holdBillListData, setHoldBillListData] = useState([])
  const [filteredHoldBillData, setFilteredHoldBillData] = useState([])
  const [holdBillCurrentPage, setHoldBillCurrentPage] = useState(1)
  const holdBillPerPage = 5
  const [selectedHoldBillID, setSelectedHoldBillID] = useState(null)
  const [selectedHoldBillData, setSelectedHoldBillData] = useState(null)
  const [storedHoldBill, setStoredHoldBill] = useState(null)

  const [recallBillSearchText, setRecallBillSearchText] = useState('')
  const [recallBillListData, setRecallBillListData] = useState([])
  const [filteredRecallBillData, setFilteredRecallBillData] = useState([])
  const [recallBillCurrentPage, setRecallBillCurrentPage] = useState(1)
  const recallBillPerPage = 5
  const [selectedRecallBillID, setSelectedRecallBillID] = useState(null)
  const [selectedRecallBillData, setSelectedRecallBillData] = useState([])
  const [storedRecallBill, setStoredRecallBill] = useState(null)

  const [cNReceivedSearchText, setCNReceivedSearchText] = useState('')
  const [cNReceivedListData, setCNReceivedListData] = useState([])
  const [filteredCNReceivedData, setFilteredCNReceivedData] = useState([])
  const [cNReceivedCurrentPage, setCNReceivedCurrentPage] = useState(1)
  const cNReceivedPerPage = 5
  const [selectedCNReceivedID, setSelectedCNReceivedID] = useState(null)
  const [selectedCNReceivedData, setSelectedCNReceivedData] = useState(null)
  const [storedCNReceived, setStoredCNReceived] = useState(null)
  const [selectedCNReceivedList, setSelectedCNReceivedList] = useState([])
  const [hasUnAdjustCreditNote, setHasUnAdjustCreditNote] = useState(false)

  const [isCheckoutSaveModalOpen, setIsCheckoutSaveModalOpen] = useState(false)
  const [checkoutSaveBillDocNum, setCheckoutSaveBillDocNum] = useState(null)
  const [checkoutSaveBillDocEntry, setCheckoutSaveBillDocEntry] = useState(null)
  const [checkoutSaveBillType, setCheckoutSaveBillType] = useState(null)

  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false)
  const [showTagCustomerModal, setShowTagCustomerModal] = useState(false)
  const [showApplyPromoModal, setShowApplyPromoModal] = useState(false)
  const [showApplyDiscountModal, setShowApplyDiscountModal] = useState(false)
  const [showHoldBillModal, setShowHoldBillModal] = useState(false)
  const [showRecallBillModal, setShowRecallBillModal] = useState(false)
  const [showCNReceivedModal, setShowCNReceivedModal] = useState(false)

  const [showItemList, setShowItemList] = useState(false)
  const [showItemList2, setShowItemList2] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  // const [showCheckout2, setShowCheckout2] = useState(false);
  // {/* //! New Checkout Form as per sir instruction on 30-10-2025  */}
  const [showCheckout2, setShowCheckout2] = useState(false)
  const [showPosOrder, setShowPosOrder] = useState(false)
  const [showAdvance, setShowAdvance] = useState(false)
  const [showCashDrawerIn, setShowCashDrawerIn] = useState(false)
  const [showCashDrawerOut, setShowCashDrawerOut] = useState(false)
  const [showSearchBillModal, setShowSearchBillModal] = useState(false)
  const [showSelectBillModal, setShowSelectBillModal] = useState(false)

  const [scannedItemListData, setScannedItemListData] = useState([])
  const [prevScannedItemListData, setPrevScannedItemListData] = useState([])
  const [deleteItemIndex, setDeleteItemIndex] = useState<number | null>(null)

  //const [itemListData, setItemListData] = useState([]);
  const [imageModal, setImageModal] = useState(false)
  //const [customerListData, setCustomerListData] = useState([]);
  //const [promotionListData, setPromotionListData] = useState([]);
  //const [discountListData, setDiscountListData] = useState([]);
  const [paymentListData, setPaymentListData] = useState([])
  const [showWarningPopup, setShowWarningPopup] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  // {/* //! New Checkout Form as per sir instruction on 30-10-2025  */}
  // New Checkout 2 Form States
  const [checkout2TenderAmount, setCheckout2TenderAmount] = useState('')
  const [checkout2CardAmount, setCheckout2CardAmount] = useState('')
  const [checkout2PhonePayAmount, setCheckout2PhonePayAmount] = useState('')
  const [checkout2CrNoteAdj, setCheckout2CrNoteAdj] = useState(0)

  const [barCodeInput, setBarCodeInput] = useState('')

  const inputRecallBillSearchTextRef = useRef<HTMLInputElement>(null)
  const inputCustomerSearchTextRef = useRef<HTMLInputElement>(null)
  const inputCustomerSaveDataMobileRef = useRef<HTMLInputElement>(null)
  const inputBarCodeRef = useRef<HTMLInputElement>(null)
  const inputCheckOutCashRef = useRef<HTMLInputElement>(null)
  const inputItemListSearchTextRef = useRef<HTMLInputElement>(null)
  const inputTenderAmountRef = useRef<HTMLInputElement>(null)
  const inputCouponCodeRef = useRef<HTMLInputElement>(null)
  const beepIntervalRef = useRef<number | null>(null)

  const [isBtnSaving, setIsBtnSaving] = useState(false)

  const [searchBillFromDate, setSearchBillFromDate] = useState('')
  const [searchBillToDate, setSearchBillToDate] = useState('')
  const [searchBillPhoneNumber, setSearchBillPhoneNumber] = useState('')
  const [searchBillCustomerName, setSearchBillCustomerName] = useState('')

  const [selectBillSearchText, setSelectBillSearchText] = useState('')
  const [selectBillListData, setSelectBillListData] = useState([])
  const [filteredSelectBillData, setFilteredSelectBillData] = useState([])
  const [selectBillCurrentPage, setSelectBillCurrentPage] = useState(1)
  const selectBillPerPage = 5
  // const [selectedBillID, setSelectedBillID] = useState(null);
  // const [selectedBillData, setSelectedBillData] = useState(null);
  // const [storedSelectedBill, setStoredSelectedBill] = useState(null);

  // const [selectedBillDetailsData, setSelectedBillDetailsData] = useState(null);

  const [coupon1Code, setCoupon1Code] = useState('')
  const [coupon2Code, setCoupon2Code] = useState('')
  const [isCouponApplied, setIsCouponApplied] = useState(false)

  const [remarks, setRemarks] = useState('')

  const [showStockLimitModal, setShowStockLimitModal] = useState(false)
  const [stockLimitMessage, setStockLimitMessage] = useState('')

  const isClearingRef = useRef(false) 

  const fetchServerDate = async () => {
    try {
      setLoading(true)
      let PJsonData = {}
      let PType = ''
      //let cookies = '';
      let responseJson = await GetAPI('/api/Bill/GetServerDate', PType, PJsonData, cookies)
      setToday(responseJson.data || '')
      //console.log('fetchServerDate=>', responseJson.data);
      // Always use current date instead of server date
      const currentDate = new Date().toLocaleDateString('en-GB').split('/').join('-')
      // setToday(currentDate)

      // If server date is not coming, prompt the user to open the session first
      if (!responseJson.data) {
        setShowNoSessionPopup(true)
      }

      setLoading(false)
    } catch (error) {
      // Set current date even on error
      // const currentDate = new Date().toLocaleDateString('en-GB').split('/').join('-')
      // setToday(currentDate)
      setShowNoSessionPopup(true)
      setLoading(false)
    }
  }
  useEffect(() => {
    //if (cookies.AuthToken) {
    fetchServerDate()
    //}
  }, [])

  // Play beep sound every 3 seconds while warning popup is open
  useEffect(() => {
    const playBeep = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    }

    if (showWarningPopup) {
      // Play immediately when popup opens
      playBeep()
      // Then play every 3 seconds
      beepIntervalRef.current = setInterval(playBeep, 3000)
    }

    return () => {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current)
        beepIntervalRef.current = null
      }
    }
  }, [showWarningPopup])

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
          //console.log("fetchStoreWisePaymentListData Server Date =>", serverDate);
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

  useEffect(() => {
    const fetchItemMasterListData = async () => {
      try {
        setLoading(true)
        let PJsonData = {}
        //let PType = '';
        //let cookies = '';
        //let responseJson = await GetAPI('/api/Item/GetAllItem', PType, PJsonData, cookies);
        let PType = '?StoreID=' + __getCookieValue('DefaultStoreId') //'?StoreID=' + cookies.DefaultStoreId;
        //let cookies = '';
        let responseJson = await GetAPI('/api/Item/GetAllItemStoreWise', PType, PJsonData, cookies)
        //console.log('fetchItemMasterListData=>', responseJson);
        let responseJsonData = responseJson.data
        const updatedData = responseJsonData
          .filter((item) => item.stock > 0)
          .map((item) => ({
            // Temp Added few key
            ...item,
            quantity: 1,
            discountPrice: '',
            promoPrice: '',
            totalPrice: '',
            salesPerson: '',
            //taxRate: '',
            //taxAmount: ''
          }))
        setItemListData(updatedData || [])
        setFilteredItemData(updatedData || [])
        setLoading(false)
      } catch (error) {
        setItemListData([])
        setFilteredItemData([])
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    //if (cookies.AuthToken) {
    //fetchItemMasterListData();
    //}
  }, [])
  const handleItemSearch = (searchText) => {
    setItemSearchText(searchText)
    setItemCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredItemData(itemListData)
    } else {
      const filteredData = itemListData.filter(
        (item) =>
          item.itemCode.toLowerCase().includes(searchText.toLowerCase()) ||
          item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.barCode.toLowerCase().includes(searchText.toLowerCase()) ||
          item.posBarCode.toLowerCase().includes(searchText.toLowerCase()) ||
          item.oldBarCode.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredItemData(filteredData)
    }
  }
  const totalItemPages = Math.ceil(filteredItemData.length / itemsPerPage)
  const startItemIndex = (itemCurrentPage - 1) * itemsPerPage
  const currentItemData = filteredItemData.slice(startItemIndex, startItemIndex + itemsPerPage)

  //useEffect(() => {
  const fetchCustomerMasterListData = async () => {
    try {
      setLoading(true)
      let PJsonData = {}
      let PType = ''
      //let cookies = '';
      let responseJson = await GetAPI('/api/Customer/GetCustomerDetails', PType, PJsonData, cookies)
      //console.log('fetchCustomerMasterListData=>', responseJson);
      setCustomerListData(responseJson.data || [])
      setFilteredCustomerData(responseJson.data || [])
      setLoading(false)
    } catch (error) {
      setCustomerListData([])
      setFilteredCustomerData([])
      setLoading(false)
    }
  }

  //if (cookies.AuthToken) {
  //fetchCustomerMasterListData();
  //}
  //}, []);
  const handleCustomerSearch = (searchText) => {
    setCustomerSearchText(searchText)
    setCustomerCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredCustomerData(customerListData)
    } else {
      const filteredData = customerListData.filter(
        (customer) =>
          customer.customerFirstName.toLowerCase().includes(searchText.toLowerCase()) ||
          customer.customerLastName.toLowerCase().includes(searchText.toLowerCase()) ||
          customer.mobile.includes(searchText)
      )
      setFilteredCustomerData(filteredData)
    }
  }
  const totalCustomerPages = Math.ceil(filteredCustomerData.length / customerPerPage)
  const startCustomerIndex = (customerCurrentPage - 1) * customerPerPage
  const currentCustomerData = filteredCustomerData.slice(
    startCustomerIndex,
    startCustomerIndex + customerPerPage
  )

  useEffect(() => {
    const fetchPromotionMasterListData = async () => {
      try {
        setLoading(true)
        let PJsonData = {}
        //let PType = '';
        //let cookies = '';
        //let responseJson = await GetAPI('/api/Promotion/GetAllPromotion', PType, PJsonData, cookies);
        //const today = new Date();
        const formattedDate = today //today.toLocaleDateString('en-GB').split('/').join('-'); // 'DD-MM-YYYY'
        const PType = `?BillDate=${formattedDate}&StoreID=` + __getCookieValue('DefaultStoreId')
        let responseJson = await GetAPI('/api/Bill/GetPromotionsForBill', PType, PJsonData, cookies)
        //console.log('fetchPromotionMasterListData=>', responseJson);
        setPromotionListData(responseJson.data || [])
        setFilteredPromotionData(responseJson.data || [])
        setLoading(false)
      } catch (error) {
        setPromotionListData([])
        setFilteredPromotionData([])
        setLoading(false)
      }
    }

    //if (cookies.AuthToken) {
    fetchPromotionMasterListData()
    //}
  }, [today])
  const handlePromotionSearch = (searchText) => {
    setPromotionSearchText(searchText)
    setPromotionCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredPromotionData(promotionListData)
    } else {
      const filteredData = promotionListData.filter((item) =>
        item.promotionName.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredPromotionData(filteredData)
    }
  }
  const totalPromotionPages = Math.ceil(filteredPromotionData.length / promotionPerPage)
  const startPromotionIndex = (promotionCurrentPage - 1) * promotionPerPage
  const currentPromotionData = filteredPromotionData.slice(
    startPromotionIndex,
    startPromotionIndex + promotionPerPage
  )
  useEffect(() => {
    const fetchDiscountMasterListData = async () => {
      try {
        setLoading(true)
        let PJsonData = {}
        //let PType = '';
        //let cookies = '';
        //let responseJson = await GetAPI('/api/Discount/GetAllDiscount', PType, PJsonData, cookies);
        //const today = new Date();
        const formattedDate = today //today.toLocaleDateString('en-GB').split('/').join('-'); // 'DD-MM-YYYY'
        const PType = `?BillDate=${formattedDate}&StoreID=` + __getCookieValue('DefaultStoreId')
        let responseJson = await GetAPI('/api/Bill/GetDiscountForBill', PType, PJsonData, cookies)
        //console.log('fetchDiscountMasterListData=>', responseJson);
        setDiscountListData(responseJson.data || [])
        setFilteredDiscountData(responseJson.data || [])
        setLoading(false)
      } catch (error) {
        setDiscountListData([])
        setFilteredDiscountData([])
        setLoading(false)
      }
    }

    //if (cookies.AuthToken) {
    fetchDiscountMasterListData()
    //}
  }, [today])
  const handleDiscountSearch = (searchText) => {
    setDiscountSearchText(searchText)
    setDiscountCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredDiscountData(discountListData)
    } else {
      const filteredData = discountListData.filter((item) =>
        item.discountName.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredDiscountData(filteredData)
    }
  }
  const totalDiscountPages = Math.ceil(filteredDiscountData.length / discountPerPage)
  const startDiscountIndex = (discountCurrentPage - 1) * discountPerPage
  const currentDiscountData = filteredDiscountData.slice(
    startDiscountIndex,
    startDiscountIndex + discountPerPage
  )

  /*
    const fetchHoldBillListData = async () => {
      try {
        let PJsonData = {};
        let PType = '';
        //let cookies = '';
        let responseJson = await GetAPI('/api/Bill/GetAllHoldBill', PType, PJsonData, cookies);
        //console.log("fetchHoldBillListData=>",responseJson)
        setHoldBillListData(responseJson.data || []);
        setFilteredHoldBillData(responseJson.data || []);
      } catch (error) {
        setHoldBillListData([]);
        setFilteredHoldBillData([]);
      }
    }
    useEffect(() => {
      //if (cookies.AuthToken) {
        fetchHoldBillListData();
      //}
    }, []);
    const handleHoldBillSearch = (searchText) => {
      setHoldBillSearchText(searchText);
      setHoldBillCurrentPage(1);
      if (searchText.trim() === '') {
        setFilteredHoldBillData(holdBillListData);
      } else {
        const filteredData = holdBillListData.filter((item) => item.billNo.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredHoldBillData(filteredData);
      }
    };
    const totalHoldBillPages = Math.ceil(filteredHoldBillData.length / holdBillPerPage);
    const startHoldBillIndex = (holdBillCurrentPage - 1) * holdBillPerPage;
    const currentHoldBillData = filteredHoldBillData.slice(startHoldBillIndex, startHoldBillIndex + holdBillPerPage);
    */

  const fetchRecallBillListData = async () => {
    try {
      setLoading(true)
      let PJsonData = {}
      //let PType = '';
      //let cookies = '';
      //let responseJson = await GetAPI('/api/Bill/GetAllHoldBill', PType, PJsonData, cookies);
      //let responseJson = await GetAPI('/api/Bill/GetAllHoldBillRecall', PType, PJsonData, cookies); //FromDate=dd-mm-yyyy & ToDate=dd-mm-yyy
      //const today = new Date();

      const formattedDate = today //today.toLocaleDateString('en-GB').split('/').join('-'); // 'DD-MM-YYYY'
      const PType = `?FromDate=${formattedDate}&ToDate=${formattedDate}`
      let responseJson = await GetAPI('/api/Bill/GetAllHoldBillRecall', PType, PJsonData, cookies)
      setRecallBillListData(responseJson.data || [])
      setFilteredRecallBillData(responseJson.data || [])
      setLoading(false)
    } catch (error) {
      setRecallBillListData([])
      setFilteredRecallBillData([])
      setLoading(false)
    }
  }

  useEffect(() => {
    //if (cookies.AuthToken) {
    if (today) {
      fetchRecallBillListData()
    }
  }, [today])

  const handleRecallBillSearch = (searchText) => {
    setRecallBillSearchText(searchText)
    setRecallBillCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredRecallBillData(recallBillListData)
    } else {
      const filteredData = recallBillListData.filter((item) =>
        item.billNo.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredRecallBillData(filteredData)
    }
  }
  const totalRecallBillPages = Math.ceil(filteredRecallBillData.length / recallBillPerPage)
  const startRecallBillIndex = (recallBillCurrentPage - 1) * recallBillPerPage
  const currentRecallBillData = filteredRecallBillData.slice().reverse().slice(
    startRecallBillIndex,
    startRecallBillIndex + recallBillPerPage
  )

  //const [discountedTotal, setDiscountedTotal] = useState(0);
  //const totalBillAmount = scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0;
  //const totalBillAmount = storedDiscount //Note: const was previously there

  // Arin commnted on 18-06-2026 but this is working perfectly
  const totalBillAmount = Math.round(
    storedDiscount
      ? storedDiscount.appliedOn === 'I'
        ? scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) ||
        0
        : storedDiscount.appliedOn === 'L'
          ? (() => {
            let updatedTotal =
              scannedItemListData?.reduce(
                (sum, item) => sum + (parseFloat(item.totalPrice) || 0),
                0
              ) || 0
            let finalTotal = updatedTotal
            /*
            if (storedDiscount.discountBase === 'P') {
              finalTotal = updatedTotal - (updatedTotal * storedDiscount.discountValue) / 100
            } else if (storedDiscount.discountBase === 'A') {
              finalTotal = updatedTotal - storedDiscount.discountValue
            }
            */

            return Math.max(0, finalTotal)
          })()
          : scannedItemListData?.reduce(
            (sum, item) => sum + (parseFloat(item.totalPrice) || 0),
            0
          ) || 0
      : //: scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0);
      (() => {
        let baseTotal =
          scannedItemListData?.reduce(
            (sum, item) => sum + (parseFloat(item.totalPrice) || 0),
            0
          ) || 0

        //Note:- Static Discount along with Coupan checking for 'Katihar' only (for now)
        //if (isCouponApplied && coupon1Code && coupon2Code && baseTotal >= 1500) {   //Note: Temporary disbaled on 03-10-2025 instructed by Arnab
        if (isCouponApplied && coupon1Code && baseTotal >= 1000) {
          baseTotal = baseTotal - 150
        }
        //Note:- Static Discount along with Coupan checking for 'Katihar' only (for now)

        return Math.max(0, baseTotal)
      })()
  );

  // Arin
  const getItemTotalPrice = (item) => {
    const mrp = parseFloat(item.mrp) || 0
    const qty = parseFloat(item.quantity) || 0
    const discount = parseFloat(item.discountPrice) || 0
    const promo = parseFloat(item.promoPriceNumeric) || 0

    return (mrp * qty) - discount - promo
  }
  const totalBillAmount_new = Math.round(
    storedDiscount
      ? storedDiscount.appliedOn === 'I'
        ? scannedItemListData?.reduce(
          (sum, item) => sum + getItemTotalPrice(item),
          0
        ) || 0

        : storedDiscount.appliedOn === 'L'
          ? (() => {
            let updatedTotal =
              scannedItemListData?.reduce(
                (sum, item) => sum + getItemTotalPrice(item),
                0
              ) || 0

            let finalTotal = updatedTotal

            // (for future purpose)
            /*
            if (storedDiscount.discountBase === 'P') {
              finalTotal = updatedTotal - (updatedTotal * storedDiscount.discountValue) / 100
            } else if (storedDiscount.discountBase === 'A') {
              finalTotal = updatedTotal - storedDiscount.discountValue
            }
            */

            return Math.max(0, finalTotal)
          })()

          : scannedItemListData?.reduce(
            (sum, item) => sum + getItemTotalPrice(item),
            0
          ) || 0

      : (() => {
        let baseTotal =
          scannedItemListData?.reduce(
            (sum, item) => sum + getItemTotalPrice(item),
            0
          ) || 0

        // Coupon logic
        if (isCouponApplied && coupon1Code && baseTotal >= 1000) {
          baseTotal = baseTotal - 150
        }

        return Math.max(0, baseTotal)
      })()
  )

  //const totalDiscountAmount = scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0;
  //const totalDiscountAmount = storedDiscount?.appliedOn === "I" ? scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0 : "";
  const totalDiscountAmount = storedDiscount
    ? storedDiscount.appliedOn === 'I'
      ? scannedItemListData?.reduce(
        (sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0),
        0
      ) || 0
      : storedDiscount.appliedOn === 'L'
        ? storedDiscount.discountValue
        : ''
    : ''
  const totalPaidAmount = paymentListData
    .filter((payment) => payment.amount && payment.amount > 0)
    .reduce((sum, payment) => sum + Number(payment.amount), 0)
  //console.log(paymentListData)
  const totalDueAmount = totalBillAmount - totalPaidAmount
  /*
    const totalPromoPrice = scannedItemListData?.every(item => !item.promoPrice)
    ? 0
    : scannedItemListData?.reduce((sum, item) => {
        const promo = parseFloat(item.promoPrice);
        return sum + (isNaN(promo) ? 0 : promo);
      }, 0);
    totalBillAmount = (totalBillAmount - totalPromoPrice).toFixed(2);
    */
  /* Calculation for https://prnt.sc/nAD82HRtbdhb*/
  //Note:- BillBasicAmt: Befor Tax Amt
  const totalBillBasicAmt = scannedItemListData.reduce(
    (sum, item) => sum + parseFloat(item.taxableAmount || 0),
    0
  )
  //console.log('totalBillBasicAmt=>', totalBillBasicAmt)
  //Note:- BillMRPAmt: MRP * Qty
  const totalBillMRPAmt = scannedItemListData.reduce(
    (sum, item) => sum + (parseFloat(item.mrp) || 0) * (item.quantity || 0),
    0
  )
  //console.log('totalBillMRPAmt=>', totalBillMRPAmt)
  //Note:- BillDiscAmt: Total tem wise Discout
  const totalBillDiscAmt = scannedItemListData.reduce(
    (sum, item) => sum + (parseFloat(item.discountPrice) || 0),
    0
  )
  //console.log('totalBillDiscAmt=>', totalBillDiscAmt)
  //Note: BillPromoAmt: Total Promo Amt Item wise
  const totalBillPromoAmt = scannedItemListData.reduce(
    (sum, item) => sum + (parseFloat(item.promoPrice) || 0),
    0
  )
  //console.log('totalBillPromoAmt=>', totalBillPromoAmt)
  //Note:- BillRoundOffAmt: Total of Itemwise NetAmt - BillNetpayableAmt
  const sumOfNetItems = scannedItemListData.reduce(
    (sum, item) =>
      sum +
      (parseFloat(item.totalPrice || 0) -
        (parseFloat(item.discountPrice || 0) + parseFloat(item.promoPrice || 0))),
    0
  )
  const totalBillRoundOffAmt = sumOfNetItems - totalBillAmount
  //console.log('totalBillRoundOffAmt=>', totalBillRoundOffAmt)
  /* Calculation for https://prnt.sc/nAD82HRtbdhb */

  //! My code
  const totalBillNetPayableAmt = Math.round(totalBillAmount)

  //! Round Off and Net Payable Adjustment Logic

  // const netPayableAdjustment = (totalBillNetPayableAmt - totalBillAmount);
  // const roundedNetPayableAdjustment = Math.round((netPayableAdjustment + Number.EPSILON) * 100) / 100;
  const netPayableAdjustment = Math.round(totalBillAmount)
  const roundedNetPayableAdjustment = Math.abs(netPayableAdjustment - totalBillAmount)

  const isCreditNoteReceivedPayment = (paymentMethod) => {
    const normalizedName = (paymentMethod || '').toLowerCase().replace(/\s+/g, '')
    return normalizedName.includes('creditnotereceived')
  }

  const fetchCreditNoteAvailabilityForCustomer = async (customerID) => {
    if (!customerID) {
      setHasUnAdjustCreditNote(false)
      return
    }

    try {
      let PJsonData = {}
      let PType = '?CustomerID=' + customerID
      let responseJson = await GetAPI(
        '/api/PayMode/GetAllUnAdjustCreditNote',
        PType,
        PJsonData,
        cookies
      )

      const creditNotes = responseJson?.data || []
      const hasCreditNote = creditNotes.length > 0
      setHasUnAdjustCreditNote(hasCreditNote)

      if (!hasCreditNote) {
        setCNReceivedListData([])
        setFilteredCNReceivedData([])
        setSelectedCNReceivedID(null)
        setSelectedCNReceivedData(null)
        setStoredCNReceived(null)
        setSelectedCNReceivedList([])
        setCheckout2CrNoteAdj(0)
        setPaymentListData((prev) =>
          prev.map((payment) =>
            isCreditNoteReceivedPayment(payment.availablePaymentmethod)
              ? { ...payment, amount: '' }
              : payment
          )
        )
      }
    } catch (error) {
      setHasUnAdjustCreditNote(false)
      setCNReceivedListData([])
      setFilteredCNReceivedData([])
      setSelectedCNReceivedID(null)
      setSelectedCNReceivedData(null)
      setStoredCNReceived(null)
      setSelectedCNReceivedList([])
      setCheckout2CrNoteAdj(0)
      setPaymentListData((prev) =>
        prev.map((payment) =>
          isCreditNoteReceivedPayment(payment.availablePaymentmethod)
            ? { ...payment, amount: '' }
            : payment
        )
      )
    }
  }

  const fetchCNReceivedListData = async () => {
    try {
      setLoading(true)
      let PJsonData = {}
      let PType = '?CustomerID=' + storedCustomer?.customerID
      //let cookies = '';
      let responseJson = await GetAPI(
        '/api/PayMode/GetAllUnAdjustCreditNote',
        PType,
        PJsonData,
        cookies
      )
      //console.log('fetchCNReceivedListData=>', responseJson);
      setCNReceivedListData(responseJson.data || [])
      setFilteredCNReceivedData(responseJson.data || [])
      setLoading(false)
    } catch (error) {
      setCNReceivedListData([])
      setFilteredCNReceivedData([])
      setLoading(false)
    }
  }

  const handleCNReceivedSearch = (searchText) => {
    setCNReceivedSearchText(searchText)
    setCNReceivedCurrentPage(1)
    if (searchText.trim() === '') {
      setFilteredCNReceivedData(cNReceivedListData)
    } else {
      const filteredData = cNReceivedListData.filter(
        (cn) =>
          cn.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
          cn.billDate.includes(searchText) ||
          cn.amount.toString().includes(searchText)
      )
      setFilteredCNReceivedData(filteredData)
    }
  }
  const totalCNReceivedPages = Math.ceil(filteredCNReceivedData.length / cNReceivedPerPage)
  const startCNReceivedIndex = (cNReceivedCurrentPage - 1) * cNReceivedPerPage
  const currentCNReceivedData = filteredCNReceivedData.slice(
    startCNReceivedIndex,
    startCNReceivedIndex + cNReceivedPerPage
  )
  const totalSelectedCNAmount = selectedCNReceivedList.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  )
  const handleCNReceivedClick = () => {
    if (!storedCustomer?.customerID) {
      toast.error('Please select a customer first.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (!hasUnAdjustCreditNote) {
      toast.error('No unadjusted credit note found for this customer.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    toggleCNReceivedModal()
    fetchCNReceivedListData()
  }
  const toggleCNReceivedModal = () => {
    setShowCNReceivedModal((prev) => !prev)
  }
  const handleCNReceivedSelection = (cnID, cnData) => {
    setSelectedCNReceivedList((prev) => {
      const alreadySelected = prev.find((item) => item.billID === cnID)
      if (alreadySelected) {
        return prev.filter((item) => item.billID !== cnID) // unselect
      } else {
        return [...prev, cnData] // select & preserve order
      }
    })
  }
  const handleApplyCNReceived = () => {
    // console.log("Applied Selected CN Received:", selectedCNReceivedData);
    // setStoredCNReceived(selectedCNReceivedData);
    //console.log(appliedCNList)
    setStoredCNReceived(appliedCNList)
    setPaymentListData((prev) =>
      prev.map((payment) =>
        payment.availablePaymentmethod === 'Credit Note Received' ||
          payment.availablePaymentmethod?.toLowerCase() === 'credit note received' ||
          payment.availablePaymentmethod?.toLowerCase() === 'creditnotereceived' ||
          payment.availablePaymentmethod?.includes('credit note received') ||
          payment.availablePaymentmethod?.includes('creditnotereceived')
          ? { ...payment, amount: totalUsedAmount }
          : payment
      )
    )
    toggleCNReceivedModal()
  }
  const handleClearAndCloseCNReceived = () => {
    toggleCNReceivedModal()
    setStoredCNReceived(null)
    setSelectedCNReceivedList([])
    setPaymentListData((prev) =>
      prev.map((payment) =>
        payment.availablePaymentmethod === 'Credit Note Received' ||
          payment.availablePaymentmethod?.toLowerCase() === 'credit note received' ||
          payment.availablePaymentmethod?.toLowerCase() === 'creditnotereceived' ||
          payment.availablePaymentmethod?.includes('credit note received') ||
          payment.availablePaymentmethod?.includes('creditnotereceived')
          ? { ...payment, amount: '' }
          : payment
      )
    )
  }
  /**/
  const getCNUsedAndDue = (cnList, totalAmount) => {
    let remaining = totalAmount
    return cnList.map((cn) => {
      const used = Math.min(remaining, cn.amount)
      remaining -= used
      return {
        ...cn,
        usedAmount: used,
        dueAmount: cn.amount - used,
      }
    })
  }
  const appliedCNList = getCNUsedAndDue(selectedCNReceivedList, totalBillAmount)
  const totalUsedAmount = appliedCNList.reduce((sum, cn) => sum + cn.usedAmount, 0)

  useEffect(() => {
    if (storedDiscount && scannedItemListData && isClearingRef.current === false) {
      let updatedScannedItemListDataWRTPromo = []
      const hasEmptyPromo = scannedItemListData.some((item) => item.promoPrice !== '')
      if (hasEmptyPromo) {
        /*
          const updatedScannedItemListData = scannedItemListData.map(item => ({
            ...item,
            promoPrice: "",
            totalPrice: item.mrp * item.quantity  //item.retailPrice * item.quantity
          }));
          */
        const updatedScannedItemListData = scannedItemListData.map((item) => {
          const { mrp, quantity, taxRate, gstUpperLimit, gstSlabRate } = item
          //const taxRateUpdated = mrp <= gstUpperLimit ? taxRate : gstSlabRate //Note: Commented on 19-12-2025
          console.log("taxRateUpdated=>", 1)
          /*let taxRateUpdatedCalculated = 0;
          if (gstUpperLimit === 0) {
            taxRateUpdatedCalculated = taxRate;
          } else if (gstUpperLimit > 0 && mrp < gstUpperLimit) {
            taxRateUpdatedCalculated = taxRate;
          } else if (gstUpperLimit > 0 && mrp >= gstUpperLimit) {
            taxRateUpdatedCalculated = gstSlabRate;
          }*/
          const taxRateUpdated = item.taxRateOriginal; //taxRateUpdatedCalculated;
          const taxAmount = ((mrp / (100 + taxRateUpdated)) * taxRateUpdated * quantity).toFixed(2)
          const taxableAmount = ((mrp / (100 + taxRateUpdated)) * 100 * quantity).toFixed(2)

          return {
            ...item,
            discountPrice: '',
            promoPrice: '',
            taxRate: taxRateUpdated,
            taxRateUpdated,
            taxAmount,
            taxableAmount,
            totalPrice: mrp * quantity,
          }
        })
        //setScannedItemListData(updatedScannedItemListData);
        //setPrevScannedItemListData(updatedScannedItemListData);

        //console.log("Clear=>",updatedScannedItemListData)

        setSelectedPromotionID(null)
        setSelectedPromotionData(null)
        setStoredPromotion(null)
        updatedScannedItemListDataWRTPromo = updatedScannedItemListData
      } else {
        updatedScannedItemListDataWRTPromo = scannedItemListData
      }

      if (updatedScannedItemListDataWRTPromo.length > 0) {
        //const hasEmptyDiscount = scannedItemListData.some(item => item.discountPrice === "");
        const hasEmptyDiscount = updatedScannedItemListDataWRTPromo.some(
          (item) => item.discountPrice === ''
        )
        //console.log(hasEmptyDiscount, "-", updatedScannedItemListDataWRTPromo)

        //Note: Over Each Item
        if (
          hasEmptyDiscount &&
          storedDiscount.discountType === 'G' &&
          storedDiscount.appliedOn === 'I'
        ) {
          //const updatedScannedItemListData = scannedItemListData.map(item => ({
          const updatedScannedItemListData = updatedScannedItemListDataWRTPromo.map((item) => ({
            ...item,
            discountPrice: '',
            totalPrice: item.mrp * item.quantity, //item.retailPrice * item.quantity
          }))
          setScannedItemListData(updatedScannedItemListData)
          setPrevScannedItemListData(updatedScannedItemListData)

          //let updatedItems = [...scannedItemListData];
          let updatedItems = [...updatedScannedItemListDataWRTPromo]
          updatedItems = updatedItems.map((item) => {
            let discountPrice = 0

            if (storedDiscount.discountBase === 'P') {
              //discountPrice = parseFloat(((item.retailPrice * storedDiscount.discountValue) / 100).toFixed(2));
              discountPrice = parseFloat(
                //((item.mrp * storedDiscount.discountValue) / 100).toFixed(2)
                (((item.mrp * storedDiscount.discountValue) / 100) * item.quantity).toFixed(2)
              )
            }
            if (storedDiscount.discountBase === 'A') {
              discountPrice = parseFloat(
                //storedDiscount.discountValue.toFixed(2)
                (storedDiscount.discountValue * item.quantity).toFixed(2)
              )
            }

            //const totalPrice = parseFloat(((item.retailPrice - discountPrice) * item.quantity).toFixed(2));
            //const totalPrice = parseFloat(((item.mrp - discountPrice) * item.quantity).toFixed(2))
            const totalPrice = parseFloat(((item.mrp * item.quantity) - discountPrice).toFixed(2))

            const effectiveMrp = item.mrp - discountPrice
            //const taxRateUpdated = effectiveMrp <= item.gstUpperLimit ? item.taxRate : item.gstSlabRate     //Note: Commented on 19-12-2025
            console.log("taxRateUpdated=>", 2)
            let taxRateUpdatedCalculated = 0;
            if (item.gstUpperLimit === 0) {
              taxRateUpdatedCalculated = item.taxRateOriginal;  //item.taxRate;
            } else if (item.gstUpperLimit > 0 && effectiveMrp < item.gstUpperLimit) {
              taxRateUpdatedCalculated = item.taxRateOriginal;  //item.taxRate;
            } else if (item.gstUpperLimit > 0 && effectiveMrp >= item.gstUpperLimit) {
              taxRateUpdatedCalculated = item.gstSlabRate;
            }
            const taxRateUpdated = taxRateUpdatedCalculated;
            const taxAmount = (
              (effectiveMrp / (100 + taxRateUpdated)) *
              taxRateUpdated *
              item.quantity
            ).toFixed(2)
            const taxableAmount = (
              (effectiveMrp / (100 + taxRateUpdated)) *
              100 *
              item.quantity
            ).toFixed(2)

            return {
              ...item,
              discountPrice,
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice,
            }
          })
          setScannedItemListData(updatedItems)
        }

        //Note: Over Total Bill Amount
        if (storedDiscount.discountType === 'G' && storedDiscount.appliedOn === 'L') {
          //const updatedScannedItemListData = scannedItemListData.map(item => ({
          const updatedScannedItemListData = updatedScannedItemListDataWRTPromo.map((item) => ({
            ...item,
            discountPrice: '',
            totalPrice: item.mrp * item.quantity, //item.retailPrice * item.quantity
          }))
          setScannedItemListData(updatedScannedItemListData)
          setPrevScannedItemListData(updatedScannedItemListData)
          let updatedItems = [...updatedScannedItemListData]
          updatedItems = updatedItems.map((item) => {
            let discountPrice = 0

            if (storedDiscount.discountBase === 'P') {
              //discountPrice = parseFloat(((item.retailPrice * storedDiscount.discountValue) / 100).toFixed(2));
              discountPrice = parseFloat(
                //((item.mrp * storedDiscount.discountValue) / 100).toFixed(2)
                (((item.mrp * storedDiscount.discountValue) / 100) * item.quantity).toFixed(2)
              )
            }
            if (storedDiscount.discountBase === 'A') {
              discountPrice = parseFloat(
                //storedDiscount.discountValue.toFixed(2)
                (storedDiscount.discountValue * item.quantity).toFixed(2)
              )
            }

            //const totalPrice = parseFloat(((item.retailPrice - discountPrice) * item.quantity).toFixed(2));
            //const totalPrice = parseFloat(((item.mrp - discountPrice) * item.quantity).toFixed(2));
            const totalPrice = parseFloat(((item.mrp * item.quantity) - discountPrice).toFixed(2))

            const effectiveMrp = item.mrp - discountPrice
            //const taxRateUpdated = effectiveMrp <= item.gstUpperLimit ? item.taxRate : item.gstSlabRate //Note: Commented on 19-12-2025
            console.log("taxRateUpdated=>", 3)
            let taxRateUpdatedCalculated = 0;
            if (item.gstUpperLimit === 0) {
              taxRateUpdatedCalculated = item.taxRateOriginal; //item.taxRate;
            } else if (item.gstUpperLimit > 0 && effectiveMrp < item.gstUpperLimit) {
              taxRateUpdatedCalculated = item.taxRateOriginal; //item.taxRate;
            } else if (item.gstUpperLimit > 0 && effectiveMrp >= item.gstUpperLimit) {
              taxRateUpdatedCalculated = item.gstSlabRate;
            }
            const taxRateUpdated = taxRateUpdatedCalculated;
            const taxAmount = (
              (effectiveMrp / (100 + taxRateUpdated)) *
              taxRateUpdated *
              item.quantity
            ).toFixed(2)
            const taxableAmount = (
              (effectiveMrp / (100 + taxRateUpdated)) *
              100 *
              item.quantity
            ).toFixed(2)

            return {
              ...item,
              discountPrice,
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice,
            }
          })
          setScannedItemListData(updatedItems)

          /*let updatedTotal = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
            if (storedDiscount.discountBase === "P") {
              updatedTotal -= (updatedTotal * storedDiscount.discountValue) / 100;
            } else if (storedDiscount.discountBase === "A") {
              updatedTotal -= storedDiscount.discountValue;
            }
            setDiscountedTotal(updatedTotal);*/
        }
      }
    }
  }, [storedDiscount, scannedItemListData])

  /*
    useEffect(() => {
      console.log("scannedItemListData:", scannedItemListData);
    }, [scannedItemListData]);
    */

  // Focus on mobile input when component mounts (page open/refresh)
  useEffect(() => {
    setTimeout(() => {
      if (inputCustomerSaveDataMobileRef.current) {
        inputCustomerSaveDataMobileRef.current.focus()
      }
    }, 100)
  }, [])

  useEffect(() => {
    setCNReceivedListData([])
    setFilteredCNReceivedData([])
    setSelectedCNReceivedID(null)
    setSelectedCNReceivedData(null)
    setStoredCNReceived(null)
    setSelectedCNReceivedList([])
    setCheckout2CrNoteAdj(0)
    setPaymentListData((prev) =>
      prev.map((payment) =>
        isCreditNoteReceivedPayment(payment.availablePaymentmethod)
          ? { ...payment, amount: '' }
          : payment
      )
    )

    fetchCreditNoteAvailabilityForCustomer(storedCustomer?.customerID)
  }, [storedCustomer?.customerID])

  // {/* //! New Checkout Form as per sir instruction on 30-10-2025  */}

  // Fetch credit note adjustment data when checkout2 opens
  useEffect(() => {
    if (showCheckout2 && storedCustomer?.customerID) {
      // Get credit note adjustment from the payment list data
      const creditNotePayment = paymentListData.find(
        (payment) =>
          payment.availablePaymentmethod?.toLowerCase().includes('creditnotereceived') ||
          payment.availablePaymentmethod?.toLowerCase().includes('credit note received')
      )

      if (creditNotePayment && creditNotePayment.amount > 0) {
        setCheckout2CrNoteAdj(creditNotePayment.amount)
      } else {
        setCheckout2CrNoteAdj(0)
      }
    }
  }, [showCheckout2, paymentListData, storedCustomer])

  const handleAllStateClear = () => {
    isClearingRef.current = true

    fetchServerDate()

    setItemSearchText('')
    //setFilteredItemData([]);
    //setItemCurrentPage(1);

    setCustomerSearchText('')
    setFilteredCustomerData([])
    setCustomerCurrentPage(1)
    setSelectedCustomerID(null)
    setSelectedCustomerData(null)
    setStoredCustomer(null)
    setCustomerSaveData({
      customerFirstName: '',
      customerMiddleName: '',
      customerLastName: '',
      mobile: '',
      whatsAppNo: '',
    })
    setCustomerErrors({})
    setCustomerExists(false)
    setFetchedCustomerData(null)
    setCustomerInfo({
      firstName: '',
      middleName: '',
      lastName: '',
      mobile: '',
    })

    setPromotionSearchText('')
    //setFilteredPromotionData([]);
    //setFilteredPromotionData(promotionListData);
    setPromotionCurrentPage(1)
    setSelectedPromotionID(null)
    setSelectedPromotionData(null)
    setStoredPromotion(null)

    setDiscountSearchText('')
    //setFilteredDiscountData([]);
    //setFilteredDiscountData(discountListData);
    setDiscountCurrentPage(1)
    setSelectedDiscountID(null)
    setSelectedDiscountData(null)
    setStoredDiscount(null)

    setCNReceivedSearchText('')
    setCNReceivedListData([])
    setFilteredCNReceivedData([])
    setCNReceivedCurrentPage(1)
    setSelectedCNReceivedID(null)
    setSelectedCNReceivedData(null)
    setStoredCNReceived(null)
    setSelectedCNReceivedList([])

    setHoldBillSearchText('')
    setFilteredHoldBillData([])
    setFilteredHoldBillData(holdBillListData)
    setHoldBillCurrentPage(1)
    setSelectedHoldBillID(null)
    setSelectedHoldBillData(null)
    setStoredHoldBill(null)

    setRecallBillSearchText('')
    setFilteredRecallBillData([])
    setFilteredRecallBillData(recallBillListData)
    setRecallBillCurrentPage(1)
    setSelectedRecallBillID(null)
    setSelectedRecallBillData(null)
    setStoredRecallBill(null)

    setIsCheckoutSaveModalOpen(false)
    setCheckoutSaveBillDocNum(null)
    setCheckoutSaveBillDocEntry(null)
    setCheckoutSaveBillType(null)
    setShowNewCustomerModal(false)
    setShowTagCustomerModal(false)
    setShowApplyPromoModal(false)
    setShowApplyDiscountModal(false)
    setShowHoldBillModal(false)
    setShowRecallBillModal(false)
    setShowCNReceivedModal(false)

    setShowItemList(false) //setShowItemList(true);
    setShowCheckout(false)
    setShowPosOrder(false)
    setShowAdvance(false)
    setShowCashDrawerIn(false)
    setShowCashDrawerOut(false)

    setScannedItemListData([])
    setPrevScannedItemListData([])
    setDeleteItemIndex(null)

    setImageModal(false)
    setBarCodeInput('')

    setIsBtnSaving(false)
    setRemarks('')

    setIsCouponApplied(false)
    setCoupon1Code('')
    setCoupon2Code('')

    setPaymentListData((prevData) =>
      prevData.map((item) => ({
        ...item,
        amount: '',
        upItransactionID: '',
        transactionID: '',
        cardNo: '',
        tenderAmount: '',
        refundAmount: '',
      }))
    )

    //! Arindam da code
    // if (inputBarCodeRef.current) {
    //   inputBarCodeRef.current.focus();
    // }

    //! My code
    if (inputCustomerSaveDataMobileRef.current) {
      inputCustomerSaveDataMobileRef.current.focus()
    }

    /*
      const clearedPaymentList = paymentListData.map((payment) => ({
        ...payment,
        amount: '',                         // Clear the amount
        upItransactionID: '',               // Clear UPI transaction ID
        transactionID: '',                  // Clear UPI transaction ID
        cardNo: '',                         // Clear Card No if any
        showNote: false,                    // Hide note field
        showTenderAmt: false, 
        tenderAmount: 0
      }));
      setPaymentListData(clearedPaymentList);
      */

    setShowNoSessionPopup(false);


    setShowStockLimitModal(false);
    setStockLimitMessage('');

    setShowSalesPersonSelectModal(false)
    setShowSalesPersonTaggingModal(false)
    setSalesPersonSearchText('')
    setFilteredSalesPersonList([])
    setSalesPersonCurrentPage(1)
    setSelectedSalesPersonId(null)
    setTaggedSalesPerson(null)
    setSalesPersonTaggingMode(null)
    setEditingRowIndex(null)
  }

  /*useEffect(() => {
      console.log("Cookies in BillingRequest:", cookies);
    }, [cookies]);*/
  /*useEffect(() => {
      if (scannedItemListData.length === 0) {
        setStoredDiscount(null);
        setSelectedDiscountID(null);
        setSelectedDiscountData(null);
      }
    }, [scannedItemListData]);*/
  //Note: If Item Quantity Updated / Item change then again RESET Promotion ID, DIscount ID
  useEffect(() => {
    if (isClearingRef.current) {
      isClearingRef.current = false
      return
    }
    //console.log(scannedItemListData)
    if (scannedItemListData.length === 0) {
      // Don't clear customer data when cart is empty - customer should remain tagged
      // setStoredCustomer(null);
      // setSelectedCustomerID(null);
      // setSelectedCustomerData(null);

      setSelectedPromotionID(null)
      setSelectedPromotionData(null)
      setStoredPromotion(null)

      setStoredDiscount(null)
      setSelectedDiscountID(null)
      setSelectedDiscountData(null)

      setPrevScannedItemListData([])
      return
    }
    if (prevScannedItemListData.length === 0) {
      setPrevScannedItemListData(scannedItemListData)
      return
    }

    const hasListChanged =
      scannedItemListData.length !== prevScannedItemListData.length ||
      scannedItemListData.some((newItem, index) => {
        const prevItem = prevScannedItemListData[index]
        return prevItem && newItem.quantity !== prevItem.quantity
      })
    //const hasListChanged = JSON.stringify(scannedItemListData) !== JSON.stringify(prevScannedItemListData);
    if (hasListChanged) {
      setSelectedPromotionID(null)
      setSelectedPromotionData(null)
      setStoredPromotion(null)

      setStoredDiscount(null)
      setSelectedDiscountID(null)
      setSelectedDiscountData(null)

      const updatedScannedItemListData = scannedItemListData.map((item) => ({
        ...item,
        discountPrice: '',
        promoPrice: '',
        totalPrice: item.mrp * item.quantity, //item.retailPrice * item.quantity
      }))
      //console.log("hasListChanged", updatedScannedItemListData)
      setScannedItemListData(updatedScannedItemListData)
      setPrevScannedItemListData(updatedScannedItemListData)
    } else {
      setPrevScannedItemListData(scannedItemListData)
    }
  }, [scannedItemListData])
  const handleDiscountSelection = (discountID, discountData) => {
    if (selectedDiscountID === discountID) {
      setSelectedDiscountID(null)
      setSelectedDiscountData(null)
    } else {
      setSelectedDiscountID(discountID)
      setSelectedDiscountData(discountData)
    }
  }
  const handleApplyDiscount = () => {
    //console.log("Applied Selected Discount:", selectedDiscountData);
    if (selectedDiscountData.discountType === 'G' && selectedDiscountData.appliedOn === 'L') {
      if (selectedDiscountData.discountBase === 'A' || selectedDiscountData.discountBase === 'P') {
        if (totalBillAmount >= selectedDiscountData.minimumBilling) {
          //Note:- Static Discount along with Coupan checking for 'Katihar' only (for now)
          /*
            if (selectedDiscountData.discountID === 2) {
              if (!coupon1Code || !coupon2Code) {
                setSelectedDiscountID(null);
                setSelectedDiscountData(null);
                toast.error("For this discount, you must enter both Coupon 1 and Coupon 2 values.",{ style: { backgroundColor: "#f7edeb", color: "#ff6242" },});
                return;
              }
            }
            */
          //Note:- Static Discount along with Coupan checking for 'Katihar' only (for now)

          setStoredDiscount(selectedDiscountData)
          toggleApplyDiscountModal()
        } else {
          setSelectedDiscountID(null)
          setSelectedDiscountData(null)
          toast.error(
            'This discount amount cannot be applied because the minimum bill amount required is ' +
            selectedDiscountData.minimumBilling +
            '.',
            { style: { backgroundColor: '#f7edeb', color: '#ff6242' } }
          )
          return
        }
      }
    } else {
      setStoredDiscount(selectedDiscountData)
      toggleApplyDiscountModal()
    }
  }
  const handleApplyRecallBill = () => {
    //console.log("selectedRecallBillID=>",selectedRecallBillID);
    fetchSelectedBillDeatilsList(selectedRecallBillID)
    setShowRecallBillModal(false)
    //toggleApplyRecallBillModal();
  }
  const handleApplyHoldBill = () => {
    //console.log('Hold Bill Data:', selectedHoldBillData);
    setStoredHoldBill(selectedHoldBillData)
    toggleApplyHoldBillModal()
  }
  /*useEffect(() => {
      if (scannedItemListData.length === 0) {
        setStoredPromotion(null);
        setSelectedPromotionID(null);
        setSelectedPromotionData(null);
      }
    }, [scannedItemListData]);*/
  useEffect(() => {
    if (isClearingRef.current) {
      isClearingRef.current = false
      return
    }
    /*
      if (scannedItemListData.length === 0) {
        setStoredPromotion(null);
        setSelectedPromotionID(null);
        setSelectedPromotionData(null);
        setPrevScannedItemListData([]);
        return;
      }
  
      if (prevScannedItemListData.length === 0) {
        setPrevScannedItemListData(scannedItemListData);
        return;
      }  
      */

    /*
      const hasListChanged = 
      scannedItemListData.length !== prevScannedItemListData.length ||
      scannedItemListData.some((newItem, index) => {
        const prevItem = prevScannedItemListData[index];
        return prevItem && newItem.quantity !== prevItem.quantity;
      });
      */
    const hasListChanged =
      JSON.stringify(scannedItemListData) !== JSON.stringify(prevScannedItemListData)
    //console.log(JSON.stringify(scannedItemListData),"<->",JSON.stringify(prevScannedItemListData))
    if (hasListChanged) {
      //Note: Newly checking added only for Promotion API call concept
      const hasAnyPromoPriceApplied = scannedItemListData.some(
        (item, index) =>
          item.promoPrice !== prevScannedItemListData[index]?.promoPrice &&
          parseFloat(item.promoPrice) > 0
      )
      if (!hasAnyPromoPriceApplied) {
        //console.log("`Useeffect` => setStoredPromotion==>",storedPromotion)
        setStoredPromotion(null)
        setSelectedPromotionID(null)
        setSelectedPromotionData(null)
      }

      /*
        const updatedScannedItemListData = scannedItemListData.map(item => ({
          ...item,
          promoPrice: "",
          //totalPrice: item.retailPrice * item.quantity
        }));
        setScannedItemListData(updatedScannedItemListData);
        setPrevScannedItemListData(updatedScannedItemListData);
        */
      setPrevScannedItemListData(scannedItemListData) //Temp
    } else {
      setStoredPromotion(null)
      setSelectedPromotionID(null)
      setSelectedPromotionData(null)

      setPrevScannedItemListData(scannedItemListData)
    }
  }, [scannedItemListData])
  const handlePromotionSelection = (promotionID, promotionData) => {
    if (selectedPromotionID === promotionID) {
      setSelectedPromotionID(null)
      setSelectedPromotionData(null)
    } else {
      setSelectedPromotionID(promotionID)
      setSelectedPromotionData(promotionData)
    }
  }

  /*
    useEffect(() => {
      if (scannedItemListData.length === 0) {
        setStoredCustomer(null);
        setSelectedCustomerID(null);
        setSelectedCustomerData(null);
      }
    }, [scannedItemListData]); 
    */
  const handleCustomerSelection = (customerID, customerData) => {
    if (selectedCustomerID === customerID) {
      setSelectedCustomerID(null)
      setSelectedCustomerData(null)
    } else {
      setSelectedCustomerID(customerID)
      setSelectedCustomerData(customerData)
    }
  }
  const handleApplyCustomer = () => {
    //console.log("Applied Selected Customer:", selectedCustomerData);
    setStoredCustomer(selectedCustomerData)
    toggleTagCustomerModal()

    // Focus on barcode input after customer is applied/tagged
    setTimeout(() => {
      if (inputBarCodeRef.current) {
        inputBarCodeRef.current.focus()
      }
    }, 100)
  }

  const handleTagCustomerClick = () => {
    toggleTagCustomerModal()
    fetchCustomerMasterListData()
  }
  const toggleTagCustomerModal = () => {
    setShowTagCustomerModal((prev) => !prev)
  }
  const toggleApplyPromotionModal = () => {
    setShowApplyPromoModal((prev) => !prev)
  }
  const toggleApplyDiscountModal = () => {
    setShowApplyDiscountModal((prev) => !prev)
  }
  /*const toggleApplyHoldBillModal = () => {
      setShowHoldBillModal((prev) => !prev);
      fetchHoldBillListData();
    };*/
  const toggleApplyHoldBillModal = () => {
    setShowHoldBillModal((prev) => {
      const isModalOpen = !prev
      if (isModalOpen) {
        fetchHoldBillListData()
      }
      return isModalOpen
    })
  }
  const toggleApplyRecallBillModal = () => {
    setSelectedRecallBillID(null)
    setSelectedRecallBillData(null)
    setStoredRecallBill(null)

    //setShowRecallBillModal((prev) => !prev);
    setShowRecallBillModal((prev) => {
      const isModalOpen = !prev
      if (isModalOpen) {
        fetchRecallBillListData()
      }
      return isModalOpen
    })
  }
  const toggleItemList = () => {
    setShowItemList((prev) => !prev)
    setShowCheckout(false)
  }

  //! New Item List implementation
  const toggleItemList2 = () => {
    setShowItemList2((prev) => !prev)
    setShowCheckout2(false)
  }

  const toggleCheckout = () => {
    setShowCheckout((prev) => !prev)
    setShowItemList(false)
  }
  // {/* //! New Checkout Form as per sir instruction on 30-10-2025  */}
  const toggleCheckout2 = () => {
    setShowCheckout2((prev) => !prev)
    // Reset form values when opening
    if (!showCheckout2) {
      setCheckout2TenderAmount('')
      setCheckout2CardAmount('')
      setCheckout2PhonePayAmount('')
    }
  }

  const handleCheckout2SaveBill = async () => {
    // Validation checks
    const billAmt = parseFloat(totalBillAmount) || 0
    const card = parseFloat(checkout2CardAmount) || 0
    const phonePay = parseFloat(checkout2PhonePayAmount) || 0
    const crNote = parseFloat(checkout2CrNoteAdj) || 0
    const cashAmount = billAmt - card - phonePay - crNote
    const tender = parseFloat(checkout2TenderAmount) || 0

    // Basic validation
    if (billAmt <= 0) {
      toast.error('No items in the bill!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    // Enhanced customer validation - prevent saving if customer was cleared
    if (
      !storedCustomer?.customerID &&
      !selectedCustomerData?.customerID &&
      !fetchedCustomerData?.customerID
    ) {
      toast.error('Please tag a customer before saving the bill!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (cashAmount > 0 && tender <= 0) {
      toast.error('Please enter tender amount for cash payment!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    if (cashAmount > 0 && tender < cashAmount) {
      toast.error('Tender amount should be greater than or equal to cash amount!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    // Check if payment total matches bill amount
    const totalPaymentAmount = cashAmount + card + phonePay + crNote
    if (Math.abs(totalPaymentAmount - billAmt) > 0.01) {
      toast.error('Payment amounts do not match the bill total!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    setIsBtnSaving(true)

    try {
      // Prepare payment data from Checkout 2 form - using same logic as handleSaveBill
      const checkout2PaymentList = []

      // Add cash payment if amount > 0
      if (cashAmount > 0) {
        const cashPayment = paymentListData.find((p) =>
          p.availablePaymentmethod?.toLowerCase().includes('cash')
        )
        if (cashPayment) {
          checkout2PaymentList.push({
            ...cashPayment,
            amount: cashAmount,
            tenderAmount: tender,
          })
        }
      }

      // Add card payment if amount > 0
      if (card > 0) {
        const cardPayment = paymentListData.find(
          (p) =>
            p.availablePaymentmethod?.toLowerCase().includes('credit') ||
            p.availablePaymentmethod?.toLowerCase().includes('debit') ||
            p.availablePaymentmethod?.toLowerCase().includes('card')
        )
        if (cardPayment) {
          checkout2PaymentList.push({
            ...cardPayment,
            amount: card,
            cardNo: '', // You can add card number input field if needed
          })
        }
      }

      // Add PhonePay payment if amount > 0
      if (phonePay > 0) {
        const phonePayPayment = paymentListData.find(
          (p) =>
            p.availablePaymentmethod?.toLowerCase().includes('phonepay') ||
            p.availablePaymentmethod?.toLowerCase().includes('upi') ||
            p.availablePaymentmethod?.toLowerCase().includes('digital') ||
            p.availablePaymentmethod?.toLowerCase().includes('wallet')
        )
        if (phonePayPayment) {
          checkout2PaymentList.push({
            ...phonePayPayment,
            amount: phonePay,
            transactionID: '', // You can add transaction ID input field if needed
          })
        }
      }

      // Validate payment methods (same as original handleSaveBill)
      const paymentError = validatePaymentListData(checkout2PaymentList)
      if (paymentError) {
        toast.error(paymentError, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
        setIsBtnSaving(false)
        return
      }

      // Prepare bill details (same as original handleSaveBill)
      const objDetails = scannedItemListData.map((item, index) => ({
        billID: 0,
        lineNum: index + 1,
        itemCode: item?.itemCode || '',
        itemName: item?.itemName || '',
        barcode: item?.barCode || '',
        mrp: item?.mrp || 0,
        rsp: item?.retailPrice || 0,
        discountAmt: item?.discountPrice || 0,
        promotionAmt: item?.promoPrice || 0,
        netPrice: item?.retailPrice || 0,
        quantity: item?.quantity || 0,
        taxRate: item?.taxRateUpdated || 0,
        netAmt: item?.totalPrice || 0,
        totalDiscAmt: 0,
        totalPromotionAmt: 0,
        remarks: item?.remarks || '',
        hsNorSACcode: item?.hsnsacCode || '',
        promotionID: storedPromotion?.promotionID || 0,
        disCountID: storedDiscount?.discountID || 0,
        originalBillID: 0,
        originalBillLineNum: 0,
        returnBillID:
          selectedRecallBillData?.length > 0 && item?.lineNum
            ? selectedRecallBillData[0]?.billID
            : 0,
        returnBillLineNum: item?.lineNum || 0,
        //salesPersonID: taggedSalesPerson?.salesPersonID || 0,
        salesPersonID: item?.salesPersonID || taggedSalesPerson?.salesPersonID || 0,
      }))

      // Prepare payment details (same as original handleSaveBill)
      const objPayment = checkout2PaymentList
        .filter(
          (payment) =>
            payment.amount &&
            payment.amount > 0 &&
            payment.availablePaymentmethod.toLowerCase() !== 'creditnotereceived' &&
            payment.availablePaymentmethod.toLowerCase() !== 'creditnoteissued'
        )
        .map((payment, index) => ({
          billID: 0,
          lineNum: index + 1,
          modeOfPayementID: payment?.paymentModeID || 0,
          modeOfPaymentName: payment?.paymentModeName || '',
          value: payment?.amount || 0,
          upItransactionID: payment?.transactionID || '',
          cardNo: payment?.cardNo || '',
          cardHolderName: '',
          cardValidity: '',
          cardType: '',
          cardCommPercent: 0,
          cardCommAmt: 0,
          forexRate: 0,
          forexTender: 0,
          forexAmt: 0,
          forexBalance: 0,
          returnDocumentID: -1,
          returnDocumentNo: '',
          tenderAmount: payment?.tenderAmount || 0,
        }))

      // Handle credit note payments (same as original handleSaveBill)
      const filteredPaymentsCNR = checkout2PaymentList
        .filter((payment) => payment.availablePaymentmethod.toLowerCase() === 'creditnotereceived')
        .map((payment) => ({
          paymentModeID: payment.paymentModeID,
          paymentModeName: payment.paymentModeName,
        }))

      const objPayment2 = (storedCNReceived || [])
        .filter((item) => item.usedAmount > 0)
        .map((item, index) => ({
          billID: 0,
          lineNum: objPayment.length + index + 1,
          modeOfPayementID: filteredPaymentsCNR[0]?.paymentModeID || 0,
          modeOfPaymentName: filteredPaymentsCNR[0]?.paymentModeName || '',
          value: item?.usedAmount || 0,
          upItransactionID: '',
          cardNo: '',
          cardHolderName: '',
          cardValidity: '',
          cardType: '',
          cardCommPercent: 0,
          cardCommAmt: 0,
          forexRate: 0,
          forexTender: 0,
          forexAmt: 0,
          forexBalance: 0,
          returnDocumentID: item?.billID || 0,
          returnDocumentNo: item?.billNo || '',
          tenderAmount: 0,
        }))

      // Prepare form data (same as original handleSaveBill)
      const formData = {
        billID: 0,
        billNo: '',
        billDate: today,
        //! Commented storeID and Entered 12-06-2026 for better cookie handling 
        // storeID: getCookieValue('DefaultStoreId') || 0,
        storeID: parseInt(cookies.DefaultStoreId || __getCookieValue("DefaultStoreId")),
        storeCode: '',
        storeName: '',
        terminalNo: '',
        customerID: storedCustomer?.customerID || 0,
        customerName: storedCustomer
          ? `${storedCustomer.customerFirstName} ${storedCustomer.customerMiddleName} ${storedCustomer.customerLastName}`.trim()
          : '',
        promotionID: storedPromotion?.promotionID || 0,
        discountID: storedDiscount?.discountID || 0,
        totalNoOfItem: scannedItemListData.length || 0,
        billSaleAmt: 0,
        billReturnAmt: 0,
        billMRPAmt: 0,
        billBasicAmt: 0,
        billGrossAmt: 0,
        billDiscAmt: coupon1Code ? 150 : 0,
        billNetAmt: 0,
        billChargeAmt: 0,
        billRoundoffAmt: 0,
        billNetPayableAmt: totalBillAmount || 0,
        billRemarks: remarks,
        noOfBillPrint: 0,
        originalDocumentID: 0,
        originalDocumentNo: '',
        originalDocumentDate: '',
        returnDocumentID: selectedRecallBillData?.[0]?.billID || 0,
        returnDocumentNo: selectedRecallBillData?.[0]?.billNo || '',
        returnDocumentDate: selectedRecallBillData?.[0]?.billDate || '',
        // enteredBy: getCookieValue('UserId') || 0,
        enterBy: parseInt(cookies.UserId || __getCookieValue("UserId")),
        usedFor: 'I',
        coupon1: coupon1Code,
        coupon2: coupon2Code,
        salesPersonID: (salesPersonTaggingMode === 'item') ? -2 : taggedSalesPerson?.salesPersonID,      //taggedSalesPerson?.salesPersonID || 0,
        objDetails: objDetails,
        objPayment: [...objPayment, ...objPayment2],
      }

      //console.log("handleCheckout2SaveBill formData =>", formData);

      // Save the bill (same API call as original handleSaveBill)
      const response = await PostAPI('/api/BillRep/PostSaleBill', '', formData, cookies)

      if (response.data[0].returnCode === 'Y') {
        toast.success(`Bill has been saved successfully!`, {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        })

        // Clear scanned items
        setScannedItemListData([])

        // Clear payment list
        const clearedPaymentList = paymentListData.map((payment) => ({
          ...payment,
          amount: '',
          upItransactionID: '',
          transactionID: '',
          cardNo: '',
          showNote: false,
          // showTenderAmt: false,
          showTenderAmt: true,
          tenderAmount: 0,
        }))
        setPaymentListData(clearedPaymentList)

        // Set checkout save modal data
        setCheckoutSaveBillDocNum(response.data[0].returnDocNum)
        setCheckoutSaveBillDocEntry(response.data[0].returnDocEntry)
        setCheckoutSaveBillType('Bill')
        setIsCheckoutSaveModalOpen(true)

        // Close checkout2 modal
        setShowCheckout2(false)

        // Reset form values
        setCheckout2TenderAmount('')
        setCheckout2CardAmount('')
        setCheckout2PhonePayAmount('')
      } else if (response.data[0].returnCode === 'F') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else if (response.data[0].returnCode === 'N') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else {
        toast.error('Failed to Save Bill. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }

      setIsBtnSaving(false)
    } catch (error) {
      toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      setIsBtnSaving(false)
    }
  }
  const handleCheckoutApplyPromotion_1 = async () => {
    console.log("handleCheckoutApplyPromotion scannedItemListData=>", scannedItemListData)
    // alert('Promotion will be applied on item list.')
    if (!Array.isArray(scannedItemListData) || scannedItemListData.length === 0) {
      return
    }

    let updatedScannedItemListDataWRTDiscnt = []
    // 1. Check if any discount already applied
    const hasDiscount = scannedItemListData.some((item) => item.discountPrice !== '')
    if (hasDiscount) {
      return // stop if discount already applied
    }
    // 2. Check if any promo already applied
    const hasPromo = scannedItemListData.some((item) => item.promoPrice !== '')
    if (hasPromo) {
      return // stop if promo already applied
    }

    // 3. No discount or promo yet → loop through promotions
    for (const promotion of currentPromotionData) {
      const formData = {
        promotionID: promotion.promotionID || 0,
        minimumBilling: totalBillAmount,
        objDetails: scannedItemListData.map((item, index) => ({
          lineNum: index,
          itemCode: item.itemCode || '',
          itemName: item.itemName || '',
          rsp: item.retailPrice || 0,
          mrp: item.mrp || 0,
          quantity: item.quantity || 0,
          promotionValue: 0,
        })),
      }

      try {
        const response = await PostAPI(
          '/api/Bill/GetBillingPromotionDetails',
          '',
          formData,
          cookies
        )

        if (response?.data?.length > 0) {
          let promotionApplied = false // flag

          const updatedScannedItemListData = scannedItemListData.map((scannedItem) => {
            const promoItem = response.data.find((promo) => promo.itemCode === scannedItem.itemCode)

            if (promoItem && promoItem.promotionValue > 0) {
              promotionApplied = true // mark as applied

              //setSelectedPromotionID(promotion.promotionID)
              setSelectedPromotionID(promoItem?.promotionID || 0)
              setSelectedPromotionData(promotion)
              setStoredPromotion(promotion)

              const { mrp, quantity, taxRate, taxRateOriginal, gstUpperLimit, gstSlabRate } = scannedItem
              const promoPrice = promoItem.promotionValue || ''
              const promoPriceNumeric = parseFloat(promoPrice) || 0

              //const totalPrice = (scannedItem.totalPrice || 0) - promoPriceNumeric // Arin commented on 18-06-2026
              const totalPrice = (scannedItem.mrp * scannedItem.quantity) - (parseFloat(scannedItem.discountPrice) || 0) - promoPriceNumeric


              const effectiveMrp = mrp - promoPriceNumeric
              //const taxRateUpdated = effectiveMrp <= gstUpperLimit ? taxRate : gstSlabRate    //Note: Commented on 19-12-2025
              console.log(gstUpperLimit, taxRate, taxRateOriginal, effectiveMrp, gstSlabRate)
              console.log("taxRateUpdated=>", 8)
              let taxRateUpdatedCalculated = 0;
              if (gstUpperLimit === 0) {
                taxRateUpdatedCalculated = taxRateOriginal; //taxRate;
              } else if (gstUpperLimit > 0 && effectiveMrp < gstUpperLimit) {
                taxRateUpdatedCalculated = taxRateOriginal; //taxRate;
              } else if (gstUpperLimit > 0 && effectiveMrp >= gstUpperLimit) {
                taxRateUpdatedCalculated = gstSlabRate;
              }
              const taxRateUpdated = taxRateUpdatedCalculated;
              console.log("taxRateUpdated=>8=>", taxRateUpdated)
              const taxAmount = (
                (effectiveMrp / (100 + taxRateUpdated)) *
                taxRateUpdated *
                quantity
              ).toFixed(2)
              const taxableAmount = (
                (effectiveMrp / (100 + taxRateUpdated)) *
                100 *
                quantity
              ).toFixed(2)

              return {
                ...scannedItem,
                //promoPrice: promoPrice,
                promotionID: promoItem?.promotionID || 0,
                promoPrice: promoItem?.promotionValue || 0,
                mrp: promoItem?.mrp ? Number(promoItem.mrp.toFixed(2)) : 0,
                taxRate: taxRateUpdated,
                taxRateUpdated,
                taxAmount,
                taxableAmount,
                totalPrice: totalPrice >= 0 ? totalPrice : 0,
              }
            }
            return scannedItem
          })

          setScannedItemListData(updatedScannedItemListData)

          if (promotionApplied) {
            //if (promoItem && promoItem.promotionValue > 0) {
            break // Stop loop after first successful promotion applied
          }
        }
      } catch (error) {
        console.error('Error applying promotion:', error)
      }
    }
  }
  const handleCheckoutApplyPromotion_2 = async () => {
    console.log("handleCheckoutApplyPromotion scannedItemListData=>", scannedItemListData)

    if (!Array.isArray(scannedItemListData) || scannedItemListData.length === 0) {
      return
    }

    // 1. Check if any discount already applied
    const hasDiscount = scannedItemListData.some((item) => item.discountPrice !== '')
    if (hasDiscount) {
      return // stop if discount already applied
    }
    // 2. Check if any promo already applied
    const hasPromo = scannedItemListData.some((item) => item.promoPrice !== '')
    if (hasPromo) {
      return // stop if promo already applied
    }

    // 3. No discount or promo yet → loop through promotions
    for (const promotion of currentPromotionData) {
      const formData = {
        promotionID: promotion.promotionID || 0,
        minimumBilling: totalBillAmount,
        objDetails: scannedItemListData.map((item, index) => ({
          lineNum: index,
          itemCode: item.itemCode || '',
          itemName: item.itemName || '',
          rsp: item.retailPrice || 0,
          mrp: item.mrp || 0,
          quantity: item.quantity || 0,
          promotionValue: 0,
          discountValue: 0
        })),
      }

      try {
        const response = await PostAPI(
          '/api/Bill/GetBillingPromotionDetails',
          '',
          formData,
          cookies
        )

        if (response?.data?.length > 0) {
          let promotionApplied = false // flag

          // ✅ FIX: functional update — always works on latest state, not stale closure
          setScannedItemListData((prevList) =>
            prevList.map((scannedItem) => {
              const promoItem = response.data.find((promo) => promo.itemCode === scannedItem.itemCode)
              console.log("promoItem=>",promoItem)

              if (promoItem && promoItem.promotionValue > 0) {
                promotionApplied = true // mark as applied

                setSelectedPromotionID(promoItem?.promotionID || 0)
                setSelectedPromotionData(promotion)
                setStoredPromotion(promotion)

                const { mrp, quantity, taxRate, taxRateOriginal, gstUpperLimit, gstSlabRate } = scannedItem
                const promoPrice = promoItem.promotionValue || ''
                const promoPriceNumeric = parseFloat(promoPrice) || 0

                //const totalPrice = (scannedItem.totalPrice || 0) - promoPriceNumeric // Arin commented on 18-06-2026
                const totalPrice = (scannedItem.mrp * scannedItem.quantity) - (parseFloat(scannedItem.discountPrice) || 0) - promoPriceNumeric // new line

                const effectiveMrp = mrp - promoPriceNumeric
                //console.log(gstUpperLimit, taxRate, taxRateOriginal, effectiveMrp, gstSlabRate)
                //console.log("taxRateUpdated=>", 8)
                let taxRateUpdatedCalculated = 0
                if (gstUpperLimit === 0) {
                  taxRateUpdatedCalculated = taxRateOriginal
                } else if (gstUpperLimit > 0 && effectiveMrp < gstUpperLimit) {
                  taxRateUpdatedCalculated = taxRateOriginal
                } else if (gstUpperLimit > 0 && effectiveMrp >= gstUpperLimit) {
                  taxRateUpdatedCalculated = gstSlabRate
                }
                const taxRateUpdated = taxRateUpdatedCalculated
                //console.log("taxRateUpdated=>8=>", taxRateUpdated)
                const taxAmount = (
                  (effectiveMrp / (100 + taxRateUpdated)) *
                  taxRateUpdated *
                  quantity
                ).toFixed(2)
                const taxableAmount = (
                  (effectiveMrp / (100 + taxRateUpdated)) *
                  100 *
                  quantity
                ).toFixed(2)

                return {
                  ...scannedItem,
                  promotionID: promoItem?.promotionID || 0,
                  promoPrice: promoItem?.promotionValue || 0,
                  discountPrice: promoItem?.discountValue || 0,
                  mrp: promoItem?.mrp ? Number(promoItem.mrp.toFixed(2)) : 0,
                  taxRate: taxRateUpdated,
                  taxRateUpdated,
                  taxAmount,
                  taxableAmount,
                  totalPrice: totalPrice >= 0 ? totalPrice : 0,
                }
              }
              console.log('UPDATED LIST =>', scannedItem)
              return scannedItem
            })
          )

          //console.log("scannedItemListData==>",scannedItemListData)

          if (promotionApplied) {
            break // Stop loop after first successful promotion applied
          }
        }
      } catch (error) {
        console.error('Error applying promotion:', error)
      }
    }
  }
  const handleCheckoutApplyPromotion = async () => {
    if (!Array.isArray(scannedItemListData) || scannedItemListData.length === 0) return
    if (scannedItemListData.some((item) => item.discountPrice !== '')) return
    if (scannedItemListData.some((item) => item.promoPrice !== '')) return

    // state async, loop/break local copy
    let workingList = [...scannedItemListData]
    let promotionApplied = false
    let appliedPromotionData = null

    for (const promotion of currentPromotionData) {
      const formData = {
        promotionID: promotion.promotionID || 0,
        minimumBilling: totalBillAmount,
        objDetails: workingList.map((item, index) => ({
          lineNum: index,
          itemCode: item.itemCode || '',
          itemName: item.itemName || '',
          rsp: item.retailPrice || 0,
          mrp: item.mrp || 0,
          quantity: item.quantity || 0,
          promotionValue: 0,
          discountValue: 0,
        })),
      }

      try {
        const response = await PostAPI('/api/Bill/GetBillingPromotionDetails', '', formData, cookies)
        if (!response?.data?.length) continue

        workingList = workingList.map((scannedItem) => {
          const promoItem = response.data.find((p) => p.itemCode === scannedItem.itemCode)
          if (!promoItem) return scannedItem

          const promoValue = parseFloat(promoItem.promotionValue) || 0
          const discValue  = parseFloat(promoItem.discountValue)  || 0

          // ✅ FIX 1: promotion / discount — one one will be apply
          if (promoValue <= 0 && discValue <= 0) return scannedItem

          promotionApplied = true
          appliedPromotionData = promotion

          const quantity = scannedItem.quantity || 0
          const mrp = promoItem.mrp ? Number(promoItem.mrp.toFixed(2)) : (scannedItem.mrp || 0)
          const { gstUpperLimit, gstSlabRate, taxRateOriginal } = scannedItem

          // ✅ FIX 2:net
          const totalPrice = (mrp * quantity) - discValue - promoValue

          const perUnitDeduction = quantity > 0 ? (discValue + promoValue) / quantity : 0
          const effectiveMrp = mrp - perUnitDeduction

          let taxRateUpdated = 0
          if (!gstUpperLimit || gstUpperLimit === 0) taxRateUpdated = taxRateOriginal
          else if (effectiveMrp < gstUpperLimit)     taxRateUpdated = taxRateOriginal
          else                                        taxRateUpdated = gstSlabRate

          const taxAmount = ((effectiveMrp / (100 + taxRateUpdated)) * taxRateUpdated * quantity).toFixed(2)
          const taxableAmount = ((effectiveMrp / (100 + taxRateUpdated)) * 100 * quantity).toFixed(2)

          return {
            ...scannedItem,
            promotionID: promoItem.promotionID || 0,
            promoPrice: promoValue,
            discountPrice: discValue,
            mrp,
            taxRate: taxRateUpdated,
            taxRateUpdated,
            taxAmount,
            taxableAmount,
            totalPrice: totalPrice >= 0 ? totalPrice : 0,
          }
        })

        // ✅ FIX 3: break when flag synchronously
        if (promotionApplied) break
      } catch (error) {
        console.error('Error applying promotion:', error)
      }
    }

    if (promotionApplied) {
      setSelectedPromotionID(appliedPromotionData?.promotionID || 0)
      setSelectedPromotionData(appliedPromotionData)
      setStoredPromotion(appliedPromotionData)
      setScannedItemListData(workingList)
    }
  }

  const autoHideDiv = (setter) => {
    setter(true)
    setTimeout(() => setter(false), 5000)
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPosOrder(false)
      setShowAdvance(false)
      setShowCashDrawerIn(false)
      setShowCashDrawerOut(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showPosOrder, showAdvance, showCashDrawerIn, showCashDrawerOut])
  const togglePosOrder = () => {
    setShowPosOrder((prev) => !prev)
    setShowAdvance(false)
    setShowCashDrawerIn(false)
    setShowCashDrawerOut(false)
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowPosOrder);
  }
  const toggleAdvance = () => {
    setShowAdvance((prev) => !prev)
    setShowPosOrder(false)
    setShowCashDrawerIn(false)
    setShowCashDrawerOut(false)
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowAdvance);
  }
  const toggleCashDrawerIn = () => {
    setShowCashDrawerIn((prev) => !prev)
    setShowPosOrder(false)
    setShowAdvance(false)
    setShowCashDrawerOut(false)
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowCashDrawerIn);
  }
  const toggleCashDrawerOut = () => {
    setShowCashDrawerOut((prev) => !prev)
    setShowPosOrder(false)
    setShowAdvance(false)
    setShowCashDrawerIn(false)
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowCashDrawerOut);
  }
  const toggleImageModal = () => {
    setImageModal((prev) => !prev)
  }
  const toggleNewCustomerModal = () => {
    setShowNewCustomerModal(!showNewCustomerModal)
    //setShowNewCustomerModal((prev) => !prev);
    setShowTagCustomerModal(false)

    // Reset to blank
    setCustomerSaveData({
      customerFirstName: '',
      customerMiddleName: '',
      customerLastName: '',
      mobile: '',
      whatsAppNo: '',
    })
    setCustomerErrors({})
  }
  const toggleNewCustomerSavedModal = () => {
    fetchCustomerMasterListData()

    setShowNewCustomerModal(false)
    setShowTagCustomerModal(true)

    // Reset to blank
    setCustomerSaveData({
      customerFirstName: '',
      customerMiddleName: '',
      customerLastName: '',
      mobile: '',
      whatsAppNo: '',
    })
    setCustomerErrors({})
  }
  const toggleNewCustomerModalCancel = () => {
    setShowNewCustomerModal(!showNewCustomerModal)
    handleTagCustomerClick()
  }

  /*
    const handleSelectItem = (itemCode) => {
      setScannedItemListData((prevList) => {
        const existingItem = prevList.find((item) => item.itemCode === itemCode);
        if (existingItem) {
          return prevList;
        }  
        const selectedItem = itemListData.find((item) => item.itemCode === itemCode);
        if (selectedItem) {
          return [
            ...prevList,
            {
              ...selectedItem,
              quantity: 1,
              discountPrice: '',
              promoPrice: '',
              salesPerson: '',
              taxRate: '',
              taxAmount: '',
              totalPrice: selectedItem.retailPrice * 1
            }
          ];
        }  
        return prevList;
      });
    };
    */
  /*
    const handleSelectItem = (itemCode) => {
      setScannedItemListData((prevList) => {
        return prevList.map((item) =>
          item.itemCode === itemCode
            ? { 
                ...item, 
                quantity: item.quantity + 1, 
                totalPrice: (item.quantity + 1) * item.retailPrice 
              }
            : item
        ).concat(
          prevList.some((item) => item.itemCode === itemCode)
            ? [] 
            : [{
                ...itemListData.find((item) => item.itemCode === itemCode),
                quantity: 1,
                discountPrice: '',
                promoPrice: '',
                salesPerson: '',
                taxRate: '',
                taxAmount: '',
                totalPrice: itemListData.find((item) => item.itemCode === itemCode)?.retailPrice * 1
              }]
        );
      });
    };  
    */
  const handleSelectItem = (itemCode) => {
    setScannedItemListData((prevList) => {
      return prevList
        .map((item) => {
          if (item.itemCode === itemCode) {
            const newQuantity = item.quantity + 1
            const mrp = item.mrp || 0
            const gstUpperLimit = item.gstUpperLimit || 0
            const gstSlabRate = item.gstSlabRate || 0
            //const perItemDiscount = item.perItemDiscount || 0;

            //const taxRateUpdated = mrp <= gstUpperLimit ? item.taxRate : gstSlabRate //Note: Commented on 19-12-2025
            console.log("taxRateUpdated=>", 9)
            let taxRateUpdatedCalculated = 0;
            if (gstUpperLimit === 0) {
              taxRateUpdatedCalculated = item.taxRate;
            } else if (gstUpperLimit > 0 && mrp < gstUpperLimit) {
              taxRateUpdatedCalculated = item.taxRate;
            } else if (gstUpperLimit > 0 && mrp >= gstUpperLimit) {
              taxRateUpdatedCalculated = gstSlabRate;
            }
            const taxRateUpdated = taxRateUpdatedCalculated;
            const taxAmount = (
              (mrp / (100 + taxRateUpdated)) *
              taxRateUpdated *
              newQuantity
            ).toFixed(2) //(((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
            const taxableAmount = ((mrp / (100 + taxRateUpdated)) * 100 * newQuantity).toFixed(2) //((mrp * newQuantity) - taxAmount).toFixed(2);  //mrp - ((mrp * taxRateUpdated) / 100) * newQuantity;
            //console.log('✅ Existing Item:', { taxRateUpdated, taxAmount, taxableAmount, mrp, newQuantity  });

            return {
              ...item,
              quantity: newQuantity,
              discountPrice: '',
              promoPrice: '',
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * newQuantity,
            }
          }
          return item
        })
        .concat(
          prevList.some((item) => item.itemCode === itemCode)
            ? []
            : (() => {
              const itemData = itemListData.find((item) => item.itemCode === itemCode)
              if (!itemData) return []

              const quantity = 1
              const mrp = itemData.mrp || 0
              const gstUpperLimit = itemData.gstUpperLimit || 0
              const gstSlabRate = itemData.gstSlabRate || 0
              //const perItemDiscount = itemData.perItemDiscount || 0;

              //const taxRateUpdated = mrp <= gstUpperLimit ? itemData.taxRate : gstSlabRate    //Note: Commented on 19-12-2025
              console.log("taxRateUpdated=>", 10)
              let taxRateUpdatedCalculated = 0;
              if (gstUpperLimit === 0) {
                taxRateUpdatedCalculated = itemData.taxRate;
              } else if (gstUpperLimit > 0 && mrp < gstUpperLimit) {
                taxRateUpdatedCalculated = itemData.taxRate;
              } else if (gstUpperLimit > 0 && mrp >= gstUpperLimit) {
                taxRateUpdatedCalculated = gstSlabRate;
              }
              const taxRateUpdated = taxRateUpdatedCalculated;
              const taxAmount = (
                (mrp / (100 + taxRateUpdated)) *
                taxRateUpdated *
                quantity
              ).toFixed(2) //(((mrp * taxRateUpdated) / 100) * quantity).toFixed(2);
              const taxableAmount = ((mrp / (100 + taxRateUpdated)) * 100 * quantity).toFixed(2) //((mrp * quantity) - taxAmount).toFixed(2); //mrp - ((mrp * taxRateUpdated) / 100) * quantity;
              //console.log('✅ NEW Item:', { taxRateUpdated, taxAmount, taxableAmount });

              return [
                {
                  ...itemData,
                  quantity,
                  discountPrice: '',
                  promoPrice: '',
                  salesPerson: '',
                  taxRate: taxRateUpdated,
                  taxRateUpdated,
                  taxAmount,
                  taxableAmount,
                  totalPrice: mrp * quantity,
                },
              ]
            })()
        )
    })
  }
  /*
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
      );
    };
    */
  const handleBarcodeInputClick = () => {
    //! Clear discounts and promotions from all scanned items when barcode input is clicked
    setScannedItemListData((prevList) =>
      prevList.map((item) => ({
        ...item,
        discountPrice: '',
        promoPrice: '',
      }))
    )

    // Clear stored discount and promotion data
    setStoredDiscount(null)
    setSelectedDiscountID(null)
    setSelectedDiscountData(null)
    setStoredPromotion(null)
    setSelectedPromotionID(null)
    setSelectedPromotionData(null)
  }

  const handleQuantityChange = (index, change) => {
    setScannedItemListData((prevList) =>
      prevList.map((item, i) => {
        if (i !== index) return item

        const newQuantity = Math.max(1, item.quantity + change)
        const mrp = item.mrp || 0
        const gstUpperLimit = item.gstUpperLimit || 0
        const gstSlabRate = item.gstSlabRate || 0

        //const taxRateUpdated = mrp <= gstUpperLimit ? item.taxRate : gstSlabRate    //Note: Commented on 19-12-2025
        console.log("taxRateUpdated=>", 11)
        let taxRateUpdatedCalculated = 0;
        if (gstUpperLimit === 0) {
          taxRateUpdatedCalculated = item.taxRateOriginal; //item.taxRate;
        } else if (gstUpperLimit > 0 && mrp < gstUpperLimit) {
          taxRateUpdatedCalculated = item.taxRateOriginal;  //item.taxRate;
        } else if (gstUpperLimit > 0 && mrp >= gstUpperLimit) {
          taxRateUpdatedCalculated = gstSlabRate;
        }
        const taxRateUpdated = taxRateUpdatedCalculated;
        const taxAmount = ((mrp / (100 + taxRateUpdated)) * taxRateUpdated * newQuantity).toFixed(2) //(((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
        const taxableAmount = ((mrp / (100 + taxRateUpdated)) * 100 * newQuantity).toFixed(2) //((mrp * newQuantity) - taxAmount).toFixed(2); //mrp - ((mrp * taxRateUpdated) / 100) * newQuantity;

        return {
          ...item,
          quantity: newQuantity,
          discountPrice: '',
          promoPrice: '',
          totalPrice: mrp * newQuantity,
          taxRate: taxRateUpdated,
          taxRateUpdated,
          taxAmount,
          taxableAmount,
        }
      })
    )

    //! Reset non-cash payment allocations whenever bill quantity is changed. Change at 10-06-2026
    setCheckout2CardAmount('')
    setCheckout2PhonePayAmount('')
    setCheckout2CrNoteAdj(0)
    setStoredCNReceived(null)
    setSelectedCNReceivedID(null)
    setSelectedCNReceivedData(null)
    setSelectedCNReceivedList([])
    //! Reset payment list data
    setPaymentListData((prev) =>
      prev.map((payment) => {
        const normalizedMethod =
          (payment.availablePaymentmethod || '').toLowerCase().replace(/\s+/g, '')

        const shouldResetAmount =
          normalizedMethod.includes('creditcard') ||
          normalizedMethod.includes('debitcard') ||
          normalizedMethod.includes('debit') ||
          normalizedMethod.includes('mobilewallet') ||
          normalizedMethod.includes('paytm') ||
          normalizedMethod.includes('gpay') ||
          normalizedMethod.includes('phonepay') ||
          normalizedMethod.includes('creditnotereceived')

        if (!shouldResetAmount) return payment

        return {
          ...payment,
          amount: '',
          cardNo: '',
          transactionID: '',
        }
      })
    )
  }
  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSelectBarcodeItem(barCodeInput.trim())
      setBarCodeInput('')
    }
  }
  /*
    const handleSelectBarcodeItem = (barCodeEntered) => {
      setScannedItemListData((prevList) => {
        const existingItem = prevList.find((item) => item.barCode === barCodeEntered);
        if (existingItem) {
          return prevList;
        }  
        const selectedItem = itemListData.find((item) => item.barCode === barCodeEntered);
        if (selectedItem) {
          return [
            ...prevList,
            {
              ...selectedItem,
              quantity: 1,
              discountPrice: '',
              promoPrice: '',
              salesPerson: '',
              taxRate: '',
              taxAmount: '',
              totalPrice: selectedItem.retailPrice * 1
            }
          ];
        }  
        return prevList;
      });
    };
    */
  /*
    const handleSelectBarcodeItem = (barCodeEntered) => {
      const trimmedBarcode = barCodeEntered.trim(); 
      setScannedItemListData((prevList) => {
        const foundItem = itemListData.find((item) => item.barCode === trimmedBarcode);
        if (!foundItem) return prevList; 
  
        return prevList.map((item) =>
          item.barCode === trimmedBarcode
            ? { 
                ...item, 
                quantity: item.quantity + 1, 
                totalPrice: (item.quantity + 1) * item.retailPrice 
              }
            : item
        ).concat(
          prevList.some((item) => item.barCode === trimmedBarcode)
            ? [] 
            : [{
                ...itemListData.find((item) => item.barCode === trimmedBarcode),
                quantity: 1,
                discountPrice: '',
                promoPrice: '',
                salesPerson: '',
                //taxRate: '',
                //taxAmount: '',
                totalPrice: itemListData.find((item) => item.barCode === barCodeEntered)?.retailPrice * 1
              }]
        );
      });
    }; 
    */
  /*
    const handleSelectBarcodeItem = (barCodeEntered) => {
      const trimmedBarcode = barCodeEntered.trim();
  
      setScannedItemListData((prevList) => {
        const foundItem = itemListData.find((item) => item.barCode === trimmedBarcode);
        if (!foundItem) return prevList;
  
        return prevList.map((item) => {
          if (item.barCode === trimmedBarcode) {
            const newQuantity = item.quantity + 1;
            const mrp = item.mrp || 0;
            const gstUpperLimit = item.gstUpperLimit || 0;
            const gstSlabRate = item.gstSlabRate || 0;
  
            const taxRateUpdated = mrp <= gstUpperLimit ? item.taxRate : gstSlabRate;
            const taxAmount = (((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
            const taxableAmount = ((mrp * newQuantity) - taxAmount).toFixed(2);
  
            console.log('✅ Existing Barcode Item:', { taxRateUpdated, taxAmount, taxableAmount });
  
            return {
              ...item,
              quantity: newQuantity,
              discountPrice: '',
              promoPrice: '',
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * newQuantity
            };
          }
          return item;
        }).concat(
          prevList.some((item) => item.barCode === trimmedBarcode)
            ? []
            : (() => {
                const itemData = itemListData.find((item) => item.barCode === trimmedBarcode);
                if (!itemData) return [];
  
                const quantity = 1;
                const mrp = itemData.mrp || 0;
                const gstUpperLimit = itemData.gstUpperLimit || 0;
                const gstSlabRate = itemData.gstSlabRate || 0;
  
                const taxRateUpdated = mrp <= gstUpperLimit ? itemData.taxRate : gstSlabRate;
                const taxAmount = (((mrp * taxRateUpdated) / 100) * quantity).toFixed(2);
                const taxableAmount = ((mrp * quantity) - taxAmount).toFixed(2);
  
                console.log('✅ NEW Barcode Item:', { taxRateUpdated, taxAmount, taxableAmount });
  
                return [{
                  ...itemData,
                  quantity,
                  discountPrice: '',
                  promoPrice: '',
                  salesPerson: '',
                  taxRate: taxRateUpdated,
                  taxRateUpdated,
                  taxAmount,
                  taxableAmount,
                  totalPrice: mrp * quantity
                }];
              })()
        );
      });
    }; 
    */
  /*
    const handleSelectBarcodeItem = (barCodeEntered) => {
      const trimmedBarcode = barCodeEntered.trim();
  
      // const matchItem = (item) => {
      //   return item.posBarCode && item.posBarCode !== ''
      //     ? item.posBarCode === trimmedBarcode
      //     : item.barCode === trimmedBarcode;
      // };
      const matchItem = (item) => {
        return (
          item.posBarCode === trimmedBarcode ||
          item.barCode === trimmedBarcode ||
          item.oldBarCode === trimmedBarcode
        );
      };
      console.log(matchItem)
  
      setScannedItemListData((prevList) => {
        const foundItem = itemListData.find((item) => matchItem(item));
        if (!foundItem) return prevList;
  
        const alreadyExists = prevList.some((item) => matchItem(item));
  
        return prevList.map((item) => {
          if (matchItem(item)) {
            const newQuantity = item.quantity + 1;
            const mrp = item.mrp || 0;
            const gstUpperLimit = item.gstUpperLimit || 0;
            const gstSlabRate = item.gstSlabRate || 0;
  
            const taxRateUpdated = mrp <= gstUpperLimit ? item.taxRate : gstSlabRate;
            const taxAmount = (((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
            const taxableAmount = ((mrp * newQuantity) - taxAmount).toFixed(2);
  
            //console.log('✅ Existing Barcode Item:', { taxRateUpdated, taxAmount, taxableAmount });
  
            return {
              ...item,
              quantity: newQuantity,
              discountPrice: '',
              promoPrice: '',
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * newQuantity
            };
          }
          return item;
        }).concat(
          alreadyExists
            ? []
            : (() => {
                const itemData = itemListData.find((item) => matchItem(item));
                if (!itemData) return [];
  
                const quantity = 1;
                const mrp = itemData.mrp || 0;
                const gstUpperLimit = itemData.gstUpperLimit || 0;
                const gstSlabRate = itemData.gstSlabRate || 0;
  
                const taxRateUpdated = mrp <= gstUpperLimit ? itemData.taxRate : gstSlabRate;
                const taxAmount = (((mrp * taxRateUpdated) / 100) * quantity).toFixed(2);
                const taxableAmount = ((mrp * quantity) - taxAmount).toFixed(2);
  
                //console.log('✅ NEW Barcode Item:', { taxRateUpdated, taxAmount, taxableAmount });
  
                return [{
                  ...itemData,
                  quantity,
                  discountPrice: '',
                  promoPrice: '',
                  salesPerson: '',
                  taxRate: taxRateUpdated,
                  taxRateUpdated,
                  taxAmount,
                  taxableAmount,
                  totalPrice: mrp * quantity
                }];
              })()
        );
      });
    };
    */
  /*
    const handleSelectBarcodeItem = (barCodeEntered) => {
      const trimmedBarcode = barCodeEntered.trim();
  
      const matchItem = (item) => {
        return (
          item.posBarCode === trimmedBarcode ||
          item.barCode === trimmedBarcode ||
          item.oldBarCode === trimmedBarcode
        );
      };
  
      const matchedItems = itemListData.filter(matchItem);
  
      if (matchedItems.length === 0) return; 
  
      setScannedItemListData((prevList) => {
        const updatedList = [...prevList];
  
        matchedItems.forEach((matchedItem) => {
          const existingIndex = updatedList.findIndex(
            (item) => item.itemCode === matchedItem.itemCode
          );
  
          const mrp = matchedItem.mrp || 0;
          const gstUpperLimit = matchedItem.gstUpperLimit || 0;
          const gstSlabRate = matchedItem.gstSlabRate || 0;
          const taxRateUpdated = mrp <= gstUpperLimit ? matchedItem.taxRate : gstSlabRate;
  
          if (existingIndex !== -1) {
            // ✅ Item already in list, update quantity
            const existingItem = updatedList[existingIndex];
            const newQuantity = existingItem.quantity + 1;
  
            const taxAmount = (((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
            const taxableAmount = ((mrp * newQuantity) - taxAmount).toFixed(2);
  
            updatedList[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
              discountPrice: '',
              promoPrice: '',
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * newQuantity
            };
          } else {
            // ➕ New item, add to list
            const quantity = 1;
            const taxAmount = (((mrp * taxRateUpdated) / 100) * quantity).toFixed(2);
            const taxableAmount = ((mrp * quantity) - taxAmount).toFixed(2);
  
            updatedList.push({
              ...matchedItem,
              quantity,
              discountPrice: '',
              promoPrice: '',
              salesPerson: '',
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * quantity
            });
          }
        });
  
        return updatedList;
      });
    };
    */
  const getScannedItemIdentityKey = (item) => {
    const barcodeKey =
      item?.barCode || item?.barcode || item?.posBarCode || item?.oldBarCode || item?.itemCode || ''
    const mrpKey = Number(item?.mrp || 0).toFixed(2)

    return `${barcodeKey}__${mrpKey}`
  }

  const upsertScannedItemFromBarcode = (matchedItem) => {
    console.log("Subho====>", matchedItem, scannedItemListData)
    setScannedItemListData((prevList) => {
      const updatedList = [...prevList]
      const incomingIdentityKey = getScannedItemIdentityKey(matchedItem)
      const existingIndex = updatedList.findIndex(
        (item) => getScannedItemIdentityKey(item) === incomingIdentityKey
      )

      const mrp = matchedItem.mrp || 0
      const gstUpperLimit = matchedItem.gstUpperLimit || 0
      const gstSlabRate = matchedItem.gstSlabRate || 0

      let taxRateUpdatedCalculated = 0
      if (gstUpperLimit === 0) {
        taxRateUpdatedCalculated = matchedItem.taxRate
      } else if (gstUpperLimit > 0 && mrp < gstUpperLimit) {
        taxRateUpdatedCalculated = matchedItem.taxRate
      } else if (gstUpperLimit > 0 && mrp >= gstUpperLimit) {
        taxRateUpdatedCalculated = gstSlabRate
      }

      const taxRateUpdated = taxRateUpdatedCalculated

      if (existingIndex !== -1) {
        const existingItem = updatedList[existingIndex]
        const newQuantity = existingItem.quantity + 1

        // Added on 24-06-2026 by Arin
        if (newQuantity > matchedItem.stock) {
          // toast.error(`Stock available: ${matchedItem.stock}`, {
          //   style: { backgroundColor: '#f7edeb', color: '#ff6242' },
          // })
          setStockLimitMessage(`${matchedItem.itemName} (${matchedItem.barCode}) — Stock available: ${matchedItem.stock}`)
          setShowStockLimitModal(true)
          return updatedList
        }

        const taxAmount = ((mrp / (100 + taxRateUpdated)) * taxRateUpdated * newQuantity).toFixed(2)
        const taxableAmount = ((mrp / (100 + taxRateUpdated)) * 100 * newQuantity).toFixed(2)

        // updatedList[existingIndex] = {
        //   ...existingItem,
        //   quantity: newQuantity,
        //   discountPrice: '',
        //   promoPrice: '',
        //   salesPerson: '',
        //   taxRate: taxRateUpdated,
        //   taxRateUpdated,
        //   taxAmount,
        //   taxableAmount,
        //   totalPrice: mrp * newQuantity,
        // }
        updatedList[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
            discountPrice: '',
            promoPrice: '',
            salesPersonID:
              existingItem.salesPersonID || taggedSalesPerson?.salesPersonID || 0,
            salesPersonName:
              existingItem.salesPersonName ||
              (taggedSalesPerson
                ? `${taggedSalesPerson.firstName} ${taggedSalesPerson.lastName || ''}`.trim()
                : ''),
            taxRate: taxRateUpdated,
            taxRateUpdated,
            taxAmount,
            taxableAmount,
            totalPrice: mrp * newQuantity,
        }
      } else {
        const quantity = 1
        const taxAmount = (((mrp * taxRateUpdated) / 100) * quantity).toFixed(2)
        const taxableAmount = (mrp * quantity - taxAmount).toFixed(2)

        // updatedList.push({
        //   ...matchedItem,
        //   quantity,
        //   discountPrice: '',
        //   promoPrice: '',
        //   salesPerson: '',
        //   taxRate: taxRateUpdated,
        //   taxRateUpdated,
        //   taxAmount,
        //   taxableAmount,
        //   totalPrice: mrp * quantity,
        // })

        updatedList.push({
          ...matchedItem,
          quantity,
          discountPrice: '',
          promoPrice: '',
          salesPersonID: taggedSalesPerson?.salesPersonID || 0,
          salesPersonName: taggedSalesPerson
            ? `${taggedSalesPerson.firstName} ${taggedSalesPerson.lastName || ''}`.trim()
            : '',
          taxRate: taxRateUpdated,
          taxRateUpdated,
          taxAmount,
          taxableAmount,
          totalPrice: mrp * quantity,
        })
      }

      return updatedList
    })
  }

  const closeBarcodeSelectionModal = () => {
    setShowBarcodeSelectionModal(false)
    setBarcodeSelectionItems([])
    setSelectedBarcodeSelectionIndex(0)
    setTimeout(() => {
      inputBarCodeRef.current?.focus()
    }, 0)
  }

  const selectBarcodeModalItem = (index) => {
    const selectedItem = barcodeSelectionItems[index]
    if (!selectedItem) return
    upsertScannedItemFromBarcode(selectedItem)
    closeBarcodeSelectionModal()
  }

  const handleSelectBarcodeItem = async (barCodeEntered) => {
    const trimmedBarcode = barCodeEntered.trim()
    if (!trimmedBarcode) return

    // Validate customer is tagged before allowing items to be scanned
    // if (!customerExists && !fetchedCustomerData && !selectedCustomerData) {
    //   toast.error('Please tag a customer before scanning items!', {
    //     style: { backgroundColor: '#f7edeb', color: '#ff6242' },
    //   })
    //   setBarCodeInput('') // Clear barcode input
    //   return
    // }

    setShowCheckout(false)
    //setLoading(true);
    const PJsonData = {}
    const PType = '?Barcode=' + trimmedBarcode + '&StoreID=' + __getCookieValue('DefaultStoreId')
    let responseJson = await GetAPI('/api/Item/GetItemBarcodeWise', PType, PJsonData)
    //console.log("/api/Item/GetItemBarcodeWise -> handleSelectBarcodeItem==>",responseJson)
    //setLoading(false);

    //! When new item scan also reset non-cash payment allocations to avoid mismatch due to quantity or item changes. Change at 10-06-2026
    //! Reset non-cash payment allocations whenever bill quantity is changed. Change at 10-06-2026
    setCheckout2CardAmount('')
    setCheckout2PhonePayAmount('')
    setCheckout2CrNoteAdj(0)
    setStoredCNReceived(null)
    setSelectedCNReceivedID(null)
    setSelectedCNReceivedData(null)
    setSelectedCNReceivedList([])
    //! Reset payment list data
    setPaymentListData((prev) =>
      prev.map((payment) => {
        const normalizedMethod =
          (payment.availablePaymentmethod || '').toLowerCase().replace(/\s+/g, '')

        const shouldResetAmount =
          normalizedMethod.includes('creditcard') ||
          normalizedMethod.includes('debitcard') ||
          normalizedMethod.includes('debit') ||
          normalizedMethod.includes('mobilewallet') ||
          normalizedMethod.includes('paytm') ||
          normalizedMethod.includes('gpay') ||
          normalizedMethod.includes('phonepay') ||
          normalizedMethod.includes('creditnotereceived')

        if (!shouldResetAmount) return payment

        return {
          ...payment,
          amount: '',
          cardNo: '',
          transactionID: '',
        }
      })
    )

    const matchedItems1 = Array.isArray(responseJson.data) ? responseJson.data : []
    //console.log(matchedItems)

    if (matchedItems1.length === 0) return

    if (matchedItems1[0].returnCode === 'F') {
      // Show centered warning popup
      setWarningMessage(matchedItems1[0].returnMsg)
      setShowWarningPopup(true)
      return
    }
    const matchedItems = matchedItems1.map((item) => ({
      ...item,
      taxRateOriginal: item.taxRate,
    }))

    if (matchedItems.length > 1) { //! Eta Hobe
      // if (matchedItems.length > 0 ) {
      setBarcodeSelectionItems(matchedItems)
      setSelectedBarcodeSelectionIndex(0)
      setShowBarcodeSelectionModal(true)
      return
    }

    upsertScannedItemFromBarcode(matchedItems[0])
  }
  /**/
  //!New my delete functionn no need for now
  const handleDeleteItem = (index) => {
    setScannedItemListData((prevData) => prevData.filter((_, i) => i !== index))
  }
  //! This is old Arindam da
  const confirmDeleteItem = () => {
    if (deleteItemIndex !== null) {
      setScannedItemListData((prevData) => prevData.filter((_, i) => i !== deleteItemIndex))
      setDeleteItemIndex(null)
    }
  }

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target
    //console.log("handleCustomerInputChange=>",name, value)
    setCustomerSaveData({ ...customerSaveData, [name]: value })
  }
  const validateCustomerForm = () => {
    let newErrors = {}
    //console.log("validateCustomerForm=>",customerSaveData)

    //if (!customerSaveData.customerFirstName.trim()) newErrors.customerFirstName = "First Name is required.";
    //if (!customerSaveData.customerLastName.trim()) newErrors.customerLastName = "Last Name is required.";
    //if (!customerSaveData.mobile.trim()) newErrors.mobile = "Mobile Number is required.";
    //if (customerSaveData.mobile.length > 10) newErrors.mobile = "Mobile Number cannot exceed 10 digits.";
    //if (customerSaveData.whatsAppNo.length > 10) newErrors.whatsAppNo = "WhatsApp Number cannot exceed 10 digits.";
    if (!customerSaveData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required.'
    } else if (customerSaveData.mobile.length > 10 || customerSaveData.mobile.length < 10) {
      //newErrors.mobile = "Mobile Number cannot exceed 10 digits.";
      newErrors.mobile = 'Mobile Number should be in 10 digits.'
    }

    if (
      customerSaveData.whatsAppNo &&
      (customerSaveData.whatsAppNo.length > 10 || customerSaveData.whatsAppNo.length < 10)
    ) {
      //newErrors.whatsAppNo = "WhatsApp Number cannot exceed 10 digits.";
      newErrors.mobile = 'WhatsApp Number should be in 10 digits.'
    }
    /**/

    /*
      const latestMobile = inputCustomerSaveDataMobileRef.current?.value || "";
      let newErrors = {};
      if (!latestMobile) newErrors.mobile = "Mobile Number is required.";
      if (latestMobile.length > 10 || latestMobile.length < 10) newErrors.mobile = "Mobile Number should be in 10 digits."; 
      */

    setCustomerErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSaveCustomer = async () => {
    setTimeout(async () => {
      if (!validateCustomerForm()) return

      setIsBtnSaving(true)
      const formData = {
        customerID: 0,
        customerFirstName: customerSaveData?.customerFirstName || '',
        customerMiddleName: customerSaveData?.customerMiddleName || '',
        customerLastName: customerSaveData?.customerLastName || '',
        gender: 'M',
        mobile: customerSaveData?.mobile || '', //inputCustomerSaveDataMobileRef.current?.value || '', //
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
        whatsAppNo: customerSaveData?.whatsAppNo || customerSaveData?.mobile || '',
        alternatePhnNo: customerSaveData?.mobile || '',
        preferredComMode: '',
        isPushMessage: '',
        customerCatCode: '',
        customerCatName: '',
        membershipCategoryCode: '',
        membershipCategoryName: '',
        membershipNo: '',
        validTill: '',
        storeID: __getCookieValue('DefaultStoreId'), //cookies.DefaultStoreId,
        enteredBy: __getCookieValue('UserId'), //cookies.UserId,
        usedFor: 'I',
      }
      //console.log("handleSaveCustomer=>",formData);

      try {
        //let cookies = '';
        const response = await PostAPI('/api/CustomerRep/PostCustomer', '', formData, cookies)
        //console.log("Customer saved successfully:", response);
        if (response.data[0].returnCode === 'Y') {
          toast.success(`New customer has been saved successfully!`, {
            style: { backgroundColor: '#e3ffea', color: '#3ed665' },
          }) //response.data[0].returnMsg
          //handleCustomerSelection(response.data[0].returnDocNum, customerListData) // Note: But it wil not work as customerList Data has no updated data
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

        setSelectedCustomerID(null)
        setSelectedCustomerData(null)
        setStoredCustomer(null)
        setIsBtnSaving(false)

        toggleNewCustomerSavedModal()
      } catch (error) {
        //console.error("Error saving customer:", error);
        setSelectedCustomerID(null)
        setSelectedCustomerData(null)
        setStoredCustomer(null)
        setIsBtnSaving(false)
        toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      }
    }, 100)
  }

  /*
    const handleCheckoutPaymentAmountChange = (index, newValue) => {
      // setPaymentListData(prevState =>
      //   prevState.map((payment, i) =>
      //     i === index ? { ...payment, amount: newValue } : payment
      //   )
      // );
      const updated = [...paymentListData];
      const amt = parseFloat(newValue) || 0;
      updated[index].amount = amt;
  
      //const paymentMode = updated[index].paymentModeName?.toLowerCase() || '';
      const availablePaymentMethodMode = updated[index].availablePaymentmethod?.toLowerCase() || '';
  
      //if (paymentMode === 'cash') {
      if (availablePaymentMethodMode === 'cash') {
        if (amt <= 0) {
          updated[index].tenderAmount = 0;
          updated[index].refundAmount = 0;
        } else {
          const tender = parseFloat(updated[index].tenderAmount) || 0;
          updated[index].refundAmount = tender > amt ? tender - amt : 0;
        }
      }
  
      setPaymentListData(updated);
    };
    */

  const recalculateCashAndRefund = (updated) => {
    const normalizedUpdated = updated.map((payment) => ({ ...payment }))
    const bill = parseFloat(totalBillAmount) || 0

    const cashIndex = normalizedUpdated.findIndex(
      (p) => p.availablePaymentmethod?.toLowerCase() === 'cash'
    )
    const tender = cashIndex >= 0 ? parseFloat(normalizedUpdated[cashIndex].tenderAmount) || 0 : 0

    if (cashIndex < 0) return normalizedUpdated

    // Total non-cash amount
    let nonCashTotal = 0
    normalizedUpdated.forEach((p) => {
      const name = (p.availablePaymentmethod || '').toLowerCase()
      if (
        name.includes('creditcard') ||
        name.includes('credit card') ||
        name.includes('debitcard') ||
        name.includes('debit card') ||
        name.includes('debit') ||
        name.includes('mobilewallet') ||
        name.includes('mobile wallet') ||
        name.includes('gpay') ||
        name.includes('paytm') ||
        name.includes('creditnotereceived') ||
        name.includes('credit note received')
      ) {
        nonCashTotal += parseFloat(p.amount) || 0
      }
    })

    const remainingCashNeeded = bill - nonCashTotal
    const finalCash = Math.min(tender, remainingCashNeeded > 0 ? remainingCashNeeded : 0)
    const refund = tender - finalCash > 0 ? tender - finalCash : 0

    normalizedUpdated[cashIndex].amount = finalCash
    normalizedUpdated[cashIndex].refundAmount = refund

    return normalizedUpdated
  }

  useEffect(() => {
    setPaymentListData((prev) => {
      if (!prev.length) return prev

      const recalculated = recalculateCashAndRefund(prev)
      const hasChanged = recalculated.some((payment, index) => {
        const prevPayment = prev[index]
        return (
          (parseFloat(payment.amount) || 0) !== (parseFloat(prevPayment?.amount) || 0) ||
          (parseFloat(payment.refundAmount) || 0) !==
          (parseFloat(prevPayment?.refundAmount) || 0)
        )
      })

      return hasChanged ? recalculated : prev
    })
  }, [totalBillAmount])

  const handleCheckoutPaymentAmountChange = (index, newValue) => {
    const updated = paymentListData.map((payment) => ({ ...payment }))
    const amt = parseFloat(newValue) || 0

    updated[index].amount = amt // update card/upi/credit note amount only

    // Recalculate everything using new formula
    const finalUpdated = recalculateCashAndRefund(updated)

    setPaymentListData(finalUpdated)
  }
  const handlePaymentNoteChange = (index, key, value) => {
    const updated = paymentListData.map((payment) => ({ ...payment }))

    // If tender changed
    if (key === 'tenderAmount') {
      updated[index].tenderAmount = parseFloat(value) || 0
    }
    // If card/upi/credit note amounts changed through note-field (rare)
    else if (key === 'amount') {
      updated[index].amount = parseFloat(value) || 0
    } else {
      // Other fields (cardNo / transactionID)
      updated[index][key] = value
    }

    // Recalculate all
    const finalUpdated = recalculateCashAndRefund(updated)

    setPaymentListData(finalUpdated)
  }

  const validatePaymentListData = (paymentListData) => {
    for (let payment of paymentListData) {
      // Credit/Debit card check
      //! Temoporary Validation remove
      // if ((payment.availablePaymentmethod === "creditCard" || payment.availablePaymentmethod === "debit") && Number(payment.amount) > 0 && (!payment.cardNo || payment.cardNo.trim() === "")) {
      //   return `Please enter card number for ${payment.paymentModeName}`;
      // }
      // Mobile Wallet check
      // if (payment.availablePaymentmethod === "mobileWallet" && Number(payment.amount) > 0 && (!payment.transactionID || payment.transactionID.trim() === "")) {
      //   return `Please enter transaction ID for ${payment.paymentModeName}`;
      // }
    }
    return null // No validation errors
  }
  const handleSaveBill = async () => {
    const paymentError = validatePaymentListData(paymentListData)
    if (paymentError) {
      toast.error(paymentError, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      return
    }

    //console.log(selectedRecallBillData)
    // Enhanced customer validation - prevent saving if customer was cleared
    if (
      !storedCustomer?.customerID &&
      !selectedCustomerData?.customerID &&
      !fetchedCustomerData?.customerID
    ) {
      toast.error('Please tag a customer before saving the bill!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }
    //const totalPaymentAmount = paymentListData.filter((payment) => payment.amount && payment.amount > 0).reduce((sum, payment) => sum + Number(payment.amount), 0);
    //!This is comment by me
    if (totalBillAmount !== totalPaidAmount) {
      toast.error('Total bill amount and payment amount do not match!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    setIsBtnSaving(true)
    const objDetails = scannedItemListData.map((item, index) => ({
      billID: 0,
      lineNum: index + 1,
      itemCode: item?.itemCode || '',
      itemName: item?.itemName || '',
      barcode: item?.barCode || '',
      mrp: item?.mrp || 0,
      rsp: item?.retailPrice || 0,
      discountAmt: item?.discountPrice || 0,
      promotionAmt: item?.promoPrice || 0,
      netPrice: item?.retailPrice || 0,
      quantity: item?.quantity || 0,
      taxRate: item?.taxRateUpdated || 0,
      netAmt: item?.totalPrice || 0,
      totalDiscAmt: 0,
      totalPromotionAmt: 0,
      remarks: item?.remarks || '',
      hsNorSACcode: item?.hsnsacCode || '',
      promotionID: item?.promotionID || 0, //storedPromotion?.promotionID || 0,
      disCountID: storedDiscount?.discountID || 0,
      originalBillID: 0,
      originalBillLineNum: 0,
      returnBillID:
        selectedRecallBillData?.length > 0 && item?.lineNum ? selectedRecallBillData[0]?.billID : 0,
      returnBillLineNum: item?.lineNum || 0,
      //salesPersonID: taggedSalesPerson?.salesPersonID || 0,
      salesPersonID: item?.salesPersonID || taggedSalesPerson?.salesPersonID || 0,
    }))
    //const objPayment = paymentListData.filter((payment) => payment.amount && payment.amount > 0 && payment.paymentModeName.toLowerCase() !== 'credit note received').map((payment, index) => ({
    const objPayment = paymentListData
      .filter(
        (payment) =>
          payment.amount &&
          payment.amount > 0 &&
          payment.availablePaymentmethod.toLowerCase() !== 'creditnotereceived' &&
          payment.availablePaymentmethod.toLowerCase() !== 'creditnoteissued'
      )
      .map((payment, index) => ({
        billID: 0,
        lineNum: index + 1,
        modeOfPayementID: payment?.paymentModeID || 0,
        modeOfPaymentName: payment?.paymentModeName || '',
        value: payment?.amount || 0,
        upItransactionID: payment?.transactionID || '', //(payment.transactionID) ? payment.transactionID : '', //"",
        cardNo: payment?.cardNo || '', //(payment.cardNo) ? payment.cardNo : '', //"",
        cardHolderName: '',
        cardValidity: '',
        cardType: '',
        cardCommPercent: 0,
        cardCommAmt: 0,
        forexRate: 0,
        forexTender: 0,
        forexAmt: 0,
        forexBalance: 0,
        returnDocumentID: -1, //selectedRecallBillData?.[0]?.billID || 0, //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billID : 0,
        returnDocumentNo: '', //selectedRecallBillData?.[0]?.billNo || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billNo : "",
        //returnDocumentDate: (selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billDate : "",
        tenderAmount: payment?.tenderAmount || 0,
      }))
    //const filteredPaymentsCNR = paymentListData.filter(payment => payment.paymentModeName.toLowerCase() === 'credit note received').map(payment => ({
    const filteredPaymentsCNR = paymentListData
      .filter((payment) => payment.availablePaymentmethod.toLowerCase() === 'creditnotereceived')
      .map((payment) => ({
        paymentModeID: payment.paymentModeID,
        paymentModeName: payment.paymentModeName,
      }))
    const objPayment2 = (storedCNReceived || [])
      .filter((item) => item.usedAmount > 0)
      .map((item, index) => ({
        billID: 0,
        lineNum: objPayment.length + index + 1,
        modeOfPayementID: filteredPaymentsCNR[0]?.paymentModeID || 0,
        modeOfPaymentName: filteredPaymentsCNR[0]?.paymentModeName || '',
        value: item?.usedAmount || 0,
        upItransactionID: '',
        cardNo: '',
        cardHolderName: '',
        cardValidity: '',
        cardType: '',
        cardCommPercent: 0,
        cardCommAmt: 0,
        forexRate: 0,
        forexTender: 0,
        forexAmt: 0,
        forexBalance: 0,
        returnDocumentID: item?.billID || 0,
        returnDocumentNo: item?.billNo || '',
        // returnDocumentDate: '' // Optional
        tenderAmount: 0,
      }))

    //! Gives current date and time in "dd-mm-yyyy hh:mm:ss" format
    // const dateTime = new Date().toLocaleString('en-GB').replace(',', ''); 

    const formData = {
      billID: 0,
      billNo: '',
      billDate: today, //today.toLocaleDateString('en-GB').split('/').join('-'),  //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      // billDate: dateTime, //today.toLocaleDateString('en-GB').split('/').join('-'),  //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      storeID: __getCookieValue('DefaultStoreId'), //cookies.DefaultStoreId, // Get store ID
      storeCode: '',
      storeName: '',
      terminalNo: '',
      customerID: storedCustomer?.customerID || 0,
      customerName: storedCustomer
        ? `${storedCustomer.customerFirstName} ${storedCustomer.customerMiddleName} ${storedCustomer.customerLastName}`.trim()
        : '',
      promotionID: 0, //storedPromotion?.promotionID || 0,
      discountID: storedDiscount?.discountID || 0,
      totalNoOfItem: scannedItemListData.length || 0,
      billSaleAmt: 0,
      billReturnAmt: 0,
      billMRPAmt: 0,
      billBasicAmt: 0,
      billGrossAmt: 0,
      billDiscAmt: coupon1Code ? 150 : 0, //0,
      billNetAmt: 0,
      billChargeAmt: 0,
      billRoundoffAmt: 0,
      billNetPayableAmt: totalBillAmount || 0,
      billRemarks: remarks,
      noOfBillPrint: 0,
      originalDocumentID: 0,
      originalDocumentNo: '',
      originalDocumentDate: '',
      returnDocumentID: selectedRecallBillData?.[0]?.billID || 0, //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billID : 0,
      returnDocumentNo: selectedRecallBillData?.[0]?.billNo || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billNo : "",
      returnDocumentDate: selectedRecallBillData?.[0]?.billDate || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billDate : "",
      enteredBy: __getCookieValue('UserId'), //cookies.UserId, //Get Logged-In ID
      usedFor: 'I',
      coupon1: coupon1Code,
      coupon2: coupon2Code,
      salesPersonID: (salesPersonTaggingMode === 'item') ? -2 : taggedSalesPerson?.salesPersonID,      //taggedSalesPerson?.salesPersonID || 0,
      objDetails: objDetails,
      //objPayment: objPayment,
      objPayment: [...objPayment, ...objPayment2],
    }
    console.log('handleSaveBill=>', formData)

    try {
      //let cookies = '';
      const response = await PostAPI('/api/BillRep/PostSaleBill', '', formData, cookies)
      //console.log("Bill has been saved successfully:", response);

      if (response.data[0].returnCode === 'Y') {
        toast.success(`Bill has been saved successfully!`, {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        }) //response.data[0].returnMsg
        //handleAllStateClear();
        handleAllStateClear()
        setScannedItemListData([])
        //setPaymentListData([]);
        const clearedPaymentList = paymentListData.map((payment) => ({
          ...payment,
          amount: '', // Clear the amount
          upItransactionID: '', // Clear UPI transaction ID
          transactionID: '', // Clear UPI transaction ID
          cardNo: '', // Clear Card No if any
          showNote: false, // Hide note field
          // showTenderAmt: false,
          showTenderAmt: true,
          tenderAmount: 0,
        }))
        setPaymentListData(clearedPaymentList)

        setCheckoutSaveBillDocNum(response.data[0].returnDocNum)
        setCheckoutSaveBillDocEntry(response.data[0].returnDocEntry)
        setCheckoutSaveBillType('Bill')
        //setIsCheckoutSaveModalOpen(true);
        handleBillPrint_v2(response.data[0].returnDocEntry)
      } else if (response.data[0].returnCode === 'F') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else if (response.data[0].returnCode === 'N') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else {
        toast.error('Failed to Save Bill. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
      setIsBtnSaving(false)
      //! For close the Modal After Succesfully Save
      setShowCheckOutModal(false)
    } catch (error) {
      //console.error("Error saving bill:", error);
      toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      setIsCheckoutSaveModalOpen(false)
      setIsBtnSaving(false)
    }
  }
  const handleBillPrint = (param_checkoutSaveBillDocEntry) => {
    //console.log("Printing bill...");
    //window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank");
    let UserId = __getCookieValue('UserId')
    let checkoutSaveBillDocEN = param_checkoutSaveBillDocEntry //checkoutSaveBillDocEntry; //'DB10000042';
    //window.open(`http://deehub.connectcloud365.com:25693/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    window.open(
      `${import.meta.env.VITE_SERVER_DEV_REPORT}` +
      `/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|P&id3=2&uid=${UserId}`,
      '_blank'
    )
    handleAllStateClear()
    setIsCheckoutSaveModalOpen(false)
  }
  const handleBillPrint_v2 = async (param_checkoutSaveBillDocEntry) => {
    const responseJson = await GetAPI(
      `/api/Bill/GetBillPrint?BillId=${param_checkoutSaveBillDocEntry}`,
      '',
      {},
      cookies
    )

    if (responseJson) {
      printThermalReceipt(responseJson.data)
    }
    handleAllStateClear()
    setIsCheckoutSaveModalOpen(false)
  }





  const handleReprintBill = (bill) => {
    //console.log("Printing bill...",bill);
    let UserId = __getCookieValue('UserId')
    let checkoutSaveBillDocEN = bill.billID
    window.open(
      `${import.meta.env.VITE_SERVER_DEV_REPORT}` +
      `/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|R&id3=2&uid=${UserId}`,
      '_blank'
    )
    handleAllStateClear()
    setIsCheckoutSaveModalOpen(false)
  }
  const handleReprintBill_v2 = async (bill) => {
    const responseJson = await GetAPI(
      `/api/Bill/GetBillPrint?BillId=${bill.billID}`,
      '',
      {},
      cookies
    )

    if (responseJson) {
      printThermalReceipt(responseJson.data)
    }
    handleAllStateClear()
    setIsCheckoutSaveModalOpen(false)
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

      <p class="bold center">Net Saved By You <br/> <span style="font-size:17px;font-weight:bold;">${(data.totalDiscount ?? 0).toFixed(2)}</span></p>

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

  const handleSaveHoldBill = async () => {
    if (!storedCustomer?.customerID) {
      toast.error('Please fetch or save a customer first!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    setIsBtnSaving(true)
    const objDetails = scannedItemListData.map((item, index) => ({
      billID: 0,
      lineNum: index + 1,
      itemCode: item?.itemCode || '',
      itemName: item?.itemName || '',
      barcode: item?.barCode || '',
      mrp: item?.mrp || 0,
      rsp: item?.retailPrice || 0,
      discountAmt: item?.discountPrice || 0,
      promotionAmt: item?.promoPrice || 0,
      netPrice: item?.retailPrice || 0,
      quantity: item?.quantity || 0,
      taxRate: item?.taxRateUpdated || 0,
      netAmt: item?.totalPrice || 0,
      totalDiscAmt: 0,
      totalPromotionAmt: 0,
      remarks: item?.remarks || '',
      hsNorSACcode: item?.hsnsacCode || '',
      promotionID: storedPromotion?.promotionID || 0,
      disCountID: storedDiscount?.discountID || 0,
      originalBillID: 0,
      originalBillLineNum: 0,
      returnBillID: 0, //(selectedRecallBillData?.length > 0 && item?.lineNum) ? selectedRecallBillData[0]?.billID : 0,
      returnBillLineNum: 0, //item?.lineNum || 0,
      //salesPersonID: item?.salesPersonID || taggedSalesPerson?.salesPersonID || 0,
    }))
    const objPayment_old = paymentListData
      .filter(
        (payment) =>
          payment.amount &&
          payment.amount > 0 &&
          payment.paymentModeName.toLowerCase() !== 'credit note received'
      )
      .map((payment, index) => ({
        //const objPayment = paymentListData.filter((payment) => payment.amount && payment.amount > 0).map((payment, index) => ({
        billID: 0,
        lineNum: index + 1,
        modeOfPayementID: payment?.paymentModeID || 0,
        modeOfPaymentName: payment?.paymentModeName || '',
        value: payment?.amount || 0,
        upItransactionID: payment?.transactionID || '', //'',
        cardNo: payment?.cardNo || '', //'',
        cardHolderName: '',
        cardValidity: '',
        cardType: '',
        cardCommPercent: 0,
        cardCommAmt: 0,
        forexRate: 0,
        forexTender: 0,
        forexAmt: 0,
        forexBalance: 0,
        returnDocumentID: -1, //selectedRecallBillData?.[0]?.billID || 0,
        returnDocumentNo: '', //selectedRecallBillData?.[0]?.billNo || '',
        //returnDocumentDate: (selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billDate : "",
        tenderAmount: payment?.tenderAmount || 0,
      }))
    /*
      const filteredPaymentsCNR = paymentListData.filter(payment => payment.paymentModeName.toLowerCase() === 'credit note received').map(payment => ({
          paymentModeID: payment.paymentModeID,
          paymentModeName: payment.paymentModeName,
      })); 
      const objPayment2 = storedCNReceived.filter(item => item.usedAmount > 0).map((item, index) => ({
        billID: 0,
        lineNum: objPayment.length + index + 1,
        modeOfPayementID: filteredPaymentsCNR?.paymentModeID || 0,
        modeOfPaymentName: filteredPaymentsCNR?.paymentModeName || '',
        value: item?.usedAmount || 0,
        upItransactionID: '',
        cardNo: '',
        cardHolderName: "",
        cardValidity: "",
        cardType: "",
        cardCommPercent: 0,
        cardCommAmt: 0,
        forexRate: 0,
        forexTender: 0,
        forexAmt: 0,
        forexBalance: 0,
        returnDocumentID: item?.billID || 0,
        returnDocumentNo: item?.billNo || '',
        // returnDocumentDate: '' // Optional
      }));
      */
    const formData = {
      billID: 0,
      billNo: '',
      billDate: today, //today.toLocaleDateString('en-GB').split('/').join('-'), //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      storeID: __getCookieValue('DefaultStoreId'), //cookies.DefaultStoreId, // Get store ID
      storeCode: '',
      storeName: '',
      terminalNo: '',
      customerID: storedCustomer?.customerID || 0,
      customerName: storedCustomer
        ? `${storedCustomer.customerFirstName} ${storedCustomer.customerMiddleName} ${storedCustomer.customerLastName}`.trim()
        : '',
      promotionID: storedPromotion?.promotionID || 0,
      discountID: storedDiscount?.discountID || 0,
      totalNoOfItem: scannedItemListData.length || 0,
      billSaleAmt: 0,
      billReturnAmt: 0,
      billMRPAmt: 0,
      billBasicAmt: 0,
      billGrossAmt: 0,
      billDiscAmt: 0,
      billNetAmt: 0,
      billChargeAmt: 0,
      billRoundoffAmt: 0,
      billNetPayableAmt: totalBillAmount || 0,
      billRemarks: '',
      noOfBillPrint: 0,
      originalDocumentID: 0,
      originalDocumentNo: '',
      originalDocumentDate: '',
      returnDocumentID: selectedRecallBillData?.[0]?.billID || 0, //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billID : 0,
      returnDocumentNo: selectedRecallBillData?.[0]?.billNo || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billNo : "",
      returnDocumentDate: selectedRecallBillData?.[0]?.billDate || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billDate : "",
      enteredBy: __getCookieValue('UserId'), //cookies.UserId, //Get Logged-In ID
      usedFor: 'I',
      coupon1: '',
      coupon2: '',
      objDetails: objDetails,
      objPayment: [], //objPayment,
      //objPayment: [...objPayment, ...objPayment2]
    }
    console.log('handleHoldBill=>', formData)

    try {
      //let cookies = '';
      const response = await PostAPI('/api/BillRep/PostHoldBill', '', formData, cookies)
      //console.log("Hold Bill has been saved successfully:", response);

      if (response.data[0].returnCode === 'Y') {
        toast.success(`Hold Bill has been saved successfully!`, {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        }) //response.data[0].returnMsg
        handleAllStateClear();

        fetchRecallBillListData()

        setScannedItemListData([])
        //setPaymentListData([]);
        const clearedPaymentList = paymentListData.map((payment) => ({
          ...payment,
          amount: '', // Clear the amount
          upItransactionID: '', // Clear UPI transaction ID
          transactionID: '', // Clear UPI transaction ID
          cardNo: '', // Clear Card No if any
          showNote: false, // Hide note field
          // showTenderAmt: false,
          showTenderAmt: true,
          tenderAmount: 0,
        }))
        setPaymentListData(clearedPaymentList)

        setCheckoutSaveBillDocNum(response.data[0].returnDocNum)
        setCheckoutSaveBillDocEntry(response.data[0].returnDocEntry)
        setCheckoutSaveBillType('Hold Bill')
        setIsCheckoutSaveModalOpen(true)
      } else if (response.data[0].returnCode === 'F') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else if (response.data[0].returnCode === 'N') {
        toast.error(response.data[0].returnMsg, {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      } else {
        toast.error('Failed to Save Hold Bill. Please try again.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
      setIsBtnSaving(false)
    } catch (error) {
      //console.error("Error saving hold bill:", error);
      toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      setIsCheckoutSaveModalOpen(false)
      setIsBtnSaving(false)
    }
  }
  const handleSelectRecallBillCheckboxChange = (BillID) => {
    const checkedBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    //console.log(checkedBoxes[0].value)

    if (checkedBoxes.length > 1) {
      setSelectedRecallBillID(null)
    } else if (checkedBoxes.length === 1) {
      setSelectedRecallBillID(checkedBoxes[0].value)
    } else {
      setSelectedRecallBillID(null)
    }
  }

  const fetchAndTagRecalledBillCustomer = async (customerID) => {
    if (!customerID || Number(customerID) <= 0) {
      return
    }

    try {
      let customerPJsonData = {}
      let customerPType = `?CustomerID=${customerID}`
      let customerResponseJson = await GetAPI(
        '/api/Customer/GetCustomerDetails',
        customerPType,
        customerPJsonData,
        cookies
      )

      const customerDataRaw = customerResponseJson?.data
      const customerData = Array.isArray(customerDataRaw) ? customerDataRaw[0] : customerDataRaw

      if (customerData?.customerID) {
        setSelectedCustomerID(customerData.customerID)
        setSelectedCustomerData(customerData)
        setStoredCustomer(customerData)
        setFetchedCustomerData(customerData)
        setCustomerExists(true)

        setCustomerSaveData((prev) => ({
          ...prev,
          customerFirstName: customerData.customerFirstName || '',
          customerMiddleName: customerData.customerMiddleName || '',
          customerLastName: customerData.customerLastName || '',
          mobile: customerData.mobile || '',
          whatsAppNo: customerData.whatsAppNo || customerData.mobile || '',
        }))

        setCustomerInfo({
          firstName: customerData.customerFirstName || '',
          middleName: customerData.customerMiddleName || '',
          lastName: customerData.customerLastName || '',
          mobile: customerData.mobile || '',
        })
      }
    } catch (error) {
      // Keep recalled bill flow intact even if customer enrichment fails.
      console.error('Failed to auto-tag recalled bill customer:', error)
    }
  }

  const fetchSelectedBillDeatilsList = async (selectedBillID) => {
    setLoading(true)
    try {
      let PJsonData = {}
      let PType = `?BillID=${selectedBillID}`
      let responseJson = await GetAPI(`/api/Bill/GetSaleBill`, PType, PJsonData, cookies)
      const responseJsonData = responseJson.data ? [responseJson.data] : []
      setSelectedRecallBillData(responseJsonData || [])

      const recalledBill = responseJson?.data
      if (recalledBill?.customerID) {
        await fetchAndTagRecalledBillCustomer(recalledBill.customerID)
      }

      setLoading(false)
    } catch (error) {
      setSelectedRecallBillData([])
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (
      selectedRecallBillID === null &&
      (!selectedRecallBillData || selectedRecallBillData.length === 0)
    ) {
      setSelectedRecallBillID(null)
      setSelectedRecallBillData([])
      setStoredRecallBill(null)
    } else {
      /*Note: As per Old Logic
        const updatedPaymentList = selectedRecallBillData[0].objPayment.map(payment => ({
            ...payment,
            amount: payment.value,
            paymentModeName: payment.modeOfPaymentName,
            paymentModeID: payment.modeOfPayementID
        }));
        setPaymentListData(updatedPaymentList);
        */
      /* Note: As per new Logic */
      const updatedPaymentList = paymentListData.map((payment) => ({
        ...payment,
        amount: payment.value,
        paymentModeName: payment.paymentModeName,
        paymentModeID: payment.paymentModeID,

        cardNo: payment.cardNo,
        /*cardHolderName:
            cardValidity:
            cardType:*/
        transactionID: payment.transactionID,
        tenderAmount: payment.tenderAmount,
      }))
      setPaymentListData(updatedPaymentList)

      //console.log("selectedRecallBillData==>",selectedRecallBillData)
      const firstItem = selectedRecallBillData[0]
      //const allItemDetails = selectedRecallBillData[0]?.objDetails.map(item => ({
      /*
        const allItemDetails = Array.isArray(firstItem?.objDetails) ? firstItem.objDetails.map(item => ({
          ...item,
          barCode: item.barcode,
          retailPrice: item.rsp,
          discountPrice: item.discountAmt,
          promoPrice: item.promotionAmt,
          totalPrice: item.netAmt, //.netPrice
          salesPerson: '',
          hsnsacCode: item.hsNorSACcode,
          taxAmount: 0
        }))
        : [];
        */
      console.log("taxRateUpdated=>", 13)
      const allItemDetails = Array.isArray(firstItem?.objDetails)
        ? firstItem.objDetails.map((item) => {
          const taxRateUpdated = item.taxRate
          const taxAmount = ((item.mrp * taxRateUpdated) / 100) * item.quantity
          const taxableAmount = item.mrp * item.quantity - taxAmount

          return {
            ...item,
            barCode: item.barcode,
            retailPrice: item.rsp,
            discountPrice: item.discountAmt,
            promoPrice: item.promotionAmt,
            taxRateUpdated,
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            taxableAmount: parseFloat(taxableAmount.toFixed(2)),
            totalPrice: item.netAmt,
            salesPerson: '',
            hsnsacCode: item.hsNorSACcode,
          }
        })
        : []
      setScannedItemListData(allItemDetails)
      setPrevScannedItemListData(allItemDetails)
    }
  }, [selectedRecallBillID && selectedRecallBillData])

  const toggleNoteField = (index) => {
    const updated = [...paymentListData]
    updated[index].showNote = !updated[index].showNote
    setPaymentListData(updated)
  }
  const toggleTenderAmtField = (index) => {
    const updated = [...paymentListData]
    updated[index].showTenderAmt = !updated[index].showTenderAmt
    setPaymentListData(updated)
  }
  /*
    const handlePaymentNoteChange = (index, key, value) => {
      const updated = [...paymentListData];
      //updated[index][key] = value;
      if (key === 'tenderAmount') {
        const tender = parseFloat(value) || 0;
        const amount = parseFloat(updated[index].amount) || 0;
  
        updated[index]['tenderAmount'] = tender;
        updated[index]['refundAmount'] = tender > amount ? tender - amount : 0;
      } else if (key === 'amount') {
        const amt = parseFloat(value) || 0;
        updated[index]['amount'] = amt;
  
        // Reset tender and refund if amount is invalid
        if (amt <= 0) {
          updated[index]['tenderAmount'] = 0;
          updated[index]['refundAmount'] = 0;
        } else {
          const tender = parseFloat(updated[index]['tenderAmount']) || 0;
          updated[index]['refundAmount'] = tender > amt ? tender - amt : 0;
        }
      } else {
        updated[index][key] = value;
      }
      setPaymentListData(updated);
    };
    */

  //! Keyboard Shortcuts Implementation
  useEffect(() => {
    const handleKeyDown = (e) => {
      //console.log("key:", e.key, "code:", e.code, "keyCode:", e.keyCode, "ctrl:", e.ctrlKey);

      // Detect CTRL + I => 'Item Search'
      if (e.ctrlKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault()
        toggleItemList2()
      }
      // Detect ALT + C => 'Check Out'
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault()
        toggleCheckOutModal()
        // Call the async function properly
        // handleCheckoutApplyPromotion().catch((err) => {
        //   console.error('Error applying promotion on checkout:', err);
        // });
        // handleCheckoutApplyPromotion();
      }
      // Detect CTRL + X => 'Clear'
      if (e.ctrlKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault()
        handleAllStateClear()
      }
      // Detect CTRL + G => 'Tag Customer'
      /*
        if (e.ctrlKey && e.key === 'g') {
          e.preventDefault();
  
          if (totalBillAmount === 0) {
            toast.error("Please choose an item or scan a product to proceed.", {
              style: {
                backgroundColor: '#f7edeb',
                color: '#ff6242',
              },
            });
            return;
          }
  
          handleTagCustomerClick();
        } 
        */
      // Detect CTRL + M => 'New Customer'
      if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault()
        toggleNewCustomerModal()
        setShowNewCustomerModal(true) // I have to put this extra line as becuase sometime CTRL + M not able to open the 'New Customer' due to TRUE
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCheckoutApplyPromotion])
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect ALT + H => 'Hold Bill'
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault()
        if (totalBillAmount === 0) {
          toast.error('Please choose an item or scan a product to proceed.', {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          })
          return
        }
        handleSaveHoldBill()
      }
      // Detect ALT + P => 'Apply Promotion'
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault()
        if (totalBillAmount === 0) {
          toast.error('Please choose an item or scan a product to proceed.', {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          })
          return
        }
        toggleApplyPromotionModal()
      }
      // Detect CTRL + D => 'Apply Discount'
      if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault()
        if (totalBillAmount === 0) {
          toast.error('Please choose an item or scan a product to proceed.', {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          })
          return
        }
        toggleApplyDiscountModal()
      }
      // Detect CTRL + B => 'Search Bill'
      if (__getCookieValue("UserRole")?.toLowerCase() === "admin" && e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault()
        toggleSearchBillModal()
      }
      // Detect CTRL + G => 'Tag Customer'
      if (e.ctrlKey && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault()
        if (totalBillAmount === 0) {
          toast.error('Please choose an item or scan a product to proceed.', {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          })
          return
        }
        handleTagCustomerClick()
      }
      // Detect ALT + T => 'Sales Person Tagging'
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault()
        setShowSalesPersonTaggingModal((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [totalBillAmount])
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect CTRL + R => 'Recall Bill'
      if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault()
        if (recallBillListData === 0) {
          toast.error('No hold bill has been saved or drafted.', {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          })
          return
        }
        toggleApplyRecallBillModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recallBillListData])
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect CTRL + A => 'Apply Customer'
      if (e.ctrlKey && e.key === 'aa') {
        e.preventDefault()
        if (!selectedCustomerID || selectedCustomerID.customerID === 0) {
          toast.error('No customer has been selected.', {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          })
          return
        }
        handleApplyCustomer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCustomerID])
  /*
    useEffect(() => {
      const handleKeyDown = (e) => {
        // Detect CTRL + S
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          if (!showNewCustomerModal) {
            toast.error("Kindly open the 'Add New Customer' section.", {
              style: {
                backgroundColor: '#f7edeb',
                color: '#ff6242',
              },
            });
            return;
          }
          handleSaveCustomer();
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showNewCustomerModal]);
    useEffect(() => {
      const handleKeyDown = (e) => {
        // Detect CTRL + S
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          if (!showNewshowCheckoutCustomerModal) {
            toast.error("Kindly open the 'Check Out' section.", {
              style: {
                backgroundColor: '#f7edeb',
                color: '#ff6242',
              },
            });
            return;
          }
          handleSaveCustomer();
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showCheckout]);
    */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect CTRL + S => 'Save' => 'New Customer' / 'Check Out'
      /*
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
  
          if (showNewCustomerModal) {
            //setTimeout(() => {
              handleSaveCustomer(); // for Add New Customer modal
            //}, 100);
            return;
          }
  
          if (showCheckout) {
            handleSaveBill(); // for Check Out modal
            return;
          }
  
          // If no modal is open
          toast.error("No save option is currently open. Please open a section where saving is available.", {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          });
        }
        */
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showNewCustomerModal, showCheckout])

  useEffect(() => {
    if (inputBarCodeRef.current) {
      inputBarCodeRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (showRecallBillModal && inputRecallBillSearchTextRef.current) {
      inputRecallBillSearchTextRef.current.focus()
    }
  }, [showRecallBillModal])

  useEffect(() => {
    if (showTagCustomerModal && inputCustomerSearchTextRef.current) {
      inputCustomerSearchTextRef.current.focus()
    }
  }, [showTagCustomerModal])

  useEffect(() => {
    if (showNewCustomerModal && inputCustomerSaveDataMobileRef.current) {
      inputCustomerSaveDataMobileRef.current.focus()
    }
  }, [showNewCustomerModal])

  useEffect(() => {
    if (inputCheckOutCashRef.current) {
      inputCheckOutCashRef.current.focus()
    }
  }, [showCheckout])

  useEffect(() => {
    if (inputItemListSearchTextRef.current) {
      inputItemListSearchTextRef.current.focus()
    }
  }, [showItemList])

  //Note:
  const toggleSearchBillModal = () => {
    setSearchBillFromDate('')
    setSearchBillToDate('')
    setSearchBillPhoneNumber('')
    setSearchBillCustomerName('')

    //setSelectedBillDetailsData(null);

    setShowSearchBillModal((prev) => !prev)
  }
  //Note:
  const toggleSelectBillModal = () => {
    setSelectBillSearchText('')
    //setSelectedBillID(null);

    //setShowSelectBillModal((prev) => !prev);
    setShowSelectBillModal((prev) => {
      if (!prev) {
        fetchSearchBillList()
      }
      return !prev
    })
  }
  //Note:
  const fetchSearchBillList = async () => {
    setLoading(true)
    try {
      let PJsonData = {}
      let formattedFromDate = searchBillFromDate
        ? new Date(searchBillFromDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        : ''
      let formattedToDate = searchBillToDate
        ? new Date(searchBillToDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        : ''
      let PType = `?BillID=0&FromDate=${formattedFromDate}&ToDate=${formattedToDate}&Mobile=${searchBillPhoneNumber}&CustomerName=${searchBillCustomerName}`

      let responseJson = await GetAPI(`/api/Bill/GetAllSaleBill`, PType, PJsonData, cookies)
      const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : []
      console.log('fetchSearchBillList=>', responseJsonData)
      setSelectBillListData(responseJsonData || [])
      setFilteredSelectBillData(responseJsonData || [])
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
      setFilteredSelectBillData(selectBillListData)
    } else {
      const filteredData = selectBillListData.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
          item.billDate.includes(searchText)
      )
      setFilteredSelectBillData(filteredData)
    }
  }
  const totalSelectBillPages = Math.ceil(filteredSelectBillData.length / selectBillPerPage)
  const startSelectBillIndex = (selectBillCurrentPage - 1) * selectBillPerPage
  const currentSelectedBill = filteredSelectBillData.slice(
    startSelectBillIndex,
    startSelectBillIndex + selectBillPerPage
  )
  /*
    useEffect(() => {
      if (currentSelectedBill.length === 0) {
        setStoredSelectedBill(null);
        setSelectedBillID(null);
        setSelectedBillData(null);
      }
    }, [currentSelectedBill]);
    */

  const handleApplyCoupon = () => {
    //if (coupon1Code && coupon2Code && totalBillAmount >= 1500) { //Note: Temporary disbaled on 03-10-2025 instructed by Arnab
    if (coupon1Code && totalBillAmount >= 1000) {
      setIsCouponApplied(true)
    }
  }
  useEffect(() => {
    if (coupon1Code && isCouponApplied === false && totalBillAmount < 1000) {
      setIsCouponApplied(false)
      setCoupon1Code('')
    }
  }, [totalBillAmount])

  //! Arindam Da Code Ends Here

  //! My Code Starts Here

  const [showVoidBillModal, setShowVoidBillModal] = useState(false)
  const [showReprintBillModal, setShowReprintBillModal] = useState(false)
  const [showClearPromotionModal, setShowClearPromotionModal] = useState(false)
  const [showClearDiscountModal, setShowClearDiscountModal] = useState(false)
  const [showSalesPersonTaggingModal, setShowSalesPersonTaggingModal] = useState(false)
  const [showSalesPersonSelectModal, setShowSalesPersonSelectModal] = useState(false)
  const [salesPersonTaggingMode, setSalesPersonTaggingMode] = useState<'bill' | 'item' | null>(null)
  const [salesPersonList, setSalesPersonList] = useState<any[]>([])
  const [salesPersonListLoading, setSalesPersonListLoading] = useState(false)
  const [selectedSalesPersonId, setSelectedSalesPersonId] = useState<number | null>(null)
  const [taggedSalesPerson, setTaggedSalesPerson] = useState<any>(null)
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [showItemSearchModal, setShowItemSearchModal] = useState(false)
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false)
  const [showCheckOutModal, setShowCheckOutModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageItem, setSelectedImageItem] = useState(null)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [showBarcodeSelectionModal, setShowBarcodeSelectionModal] = useState(false)
  const [barcodeSelectionItems, setBarcodeSelectionItems] = useState<any[]>([])
  const [selectedBarcodeSelectionIndex, setSelectedBarcodeSelectionIndex] = useState(0)
  //! Search Stock Online Modal State - 19/01/2026
  const [showSearchStockOnlineModal, setShowSearchStockOnlineModal] = useState(false)
  //! Search Stock Online Item Code State - 19/01/2026
  const [searchStockOnlineItemCode, setSearchStockOnlineItemCode] = useState('')
  //! Search Stock Online Data State - 19/01/2026
  const [stockOnlineData, setStockOnlineData] = useState([])
  const [stockOnlineLoading, setStockOnlineLoading] = useState(false)

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    mobile: '',
  })

  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false)
  const [fetchedCustomerData, setFetchedCustomerData] = useState<any>(null)

  // Modal refs for click outside functionality
  const tagCustomerModalRef = useRef<HTMLDivElement>(null)
  const applyPromoModalRef = useRef<HTMLDivElement>(null)
  const applyDiscountModalRef = useRef<HTMLDivElement>(null)
  const holdBillModalRef = useRef<HTMLDivElement>(null)
  const recallBillModalRef = useRef<HTMLDivElement>(null)
  const voidBillModalRef = useRef<HTMLDivElement>(null)
  const reprintBillModalRef = useRef<HTMLDivElement>(null)
  const clearPromotionModalRef = useRef<HTMLDivElement>(null)
  const clearDiscountModalRef = useRef<HTMLDivElement>(null)
  const salesPersonTaggingModalRef = useRef<HTMLDivElement>(null)
  const salesPersonSelectModalRef = useRef<HTMLDivElement>(null)
  const itemSearchModalRef = useRef<HTMLDivElement>(null)
  const customerDetailsModalRef = useRef<HTMLDivElement>(null)
  const checkOutModalRef = useRef<HTMLDivElement>(null)
  const imageModalRef = useRef<HTMLDivElement>(null)
  const barcodeSelectionModalRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const [customerExists, setCustomerExists] = useState(false)

  const handleClearAll = () => {
    // Reset customer information
    setCustomerInfo({
      firstName: '',
      middleName: '',
      lastName: '',
      mobile: '',
    })

    // Reset customer form states
    setShowNewCustomerForm(false)
    setCustomerExists(false)

    // Reset scanned items to empty array
    setScannedItems([])

    // Reset barcode input
    setBarCodeInput('')

    // Focus on mobile input after clearing
    setTimeout(() => {
      if (mobileInputRef.current) {
        mobileInputRef.current.focus()
      }
    }, 100)

    // Show success message
    toast.success('All data cleared! Ready for new transaction.')
  }

  const toggleHoldBillModal = React.useCallback(() => {
    setShowHoldBillModal((prev) => !prev)
  }, [])

  const toggleRecallBillModal = React.useCallback(() => {
    setShowRecallBillModal((prev) => !prev)
  }, [])

  const toggleVoidBillModal = React.useCallback(() => {
    setShowVoidBillModal((prev) => !prev)
  }, [])

  const toggleReprintBillModal = React.useCallback(() => {
    setShowReprintBillModal((prev) => !prev)
  }, [])

  const toggleClearPromotionModal = React.useCallback(() => {
    setShowClearPromotionModal((prev) => !prev)
  }, [])

  const toggleClearDiscountModal = React.useCallback(() => {
    setShowClearDiscountModal((prev) => !prev)
  }, [])

  const toggleSalesPersonTaggingModal = React.useCallback(() => {
    setShowSalesPersonTaggingModal((prev) => !prev)
  }, [])

  const fetchSalesPersonList = async () => {
    try {
      setSalesPersonListLoading(true)
      const responseJson = await GetAPI('/api/SalePerson/GetAllSalesPerson', '', {}, cookies)
      if (responseJson.status === 200 && responseJson.data) {
        setSalesPersonList(responseJson.data)
      } else {
        setSalesPersonList([])
        toast.error('Failed to load sales persons', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
    } catch (error) {
      setSalesPersonList([])
      toast.error('Failed to load sales persons', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
    } finally {
      setSalesPersonListLoading(false)
    }
  }

  const handleOpenSalesPersonSelect = async (mode: 'bill' | 'item') => {
    setSalesPersonTaggingMode(mode)
    setSelectedSalesPersonId(null)
    setShowSalesPersonTaggingModal(false)
    await fetchSalesPersonList()
    setShowSalesPersonSelectModal(true)
  }

  const __handleConfirmSalesPersonTag = () => { alert(salesPersonTaggingMode)
    if (selectedSalesPersonId === null) {
      toast.error('Please select a sales person', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }
    const person = salesPersonList.find((p) => p.salesPersonID === selectedSalesPersonId)
    setTaggedSalesPerson({ ...person, mode: salesPersonTaggingMode })
    setShowSalesPersonSelectModal(false)
    toast.success(
      `${person.firstName} ${person.lastName || ''} tagged for ${salesPersonTaggingMode === 'bill' ? 'Bill' : 'Item'} Wise Tagging`.trim()
    )
  }

  const ____handleConfirmSalesPersonTag = () => {
    if (selectedSalesPersonId === null) {
      toast.error('Please select a sales person', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    const person = salesPersonList.find(
      (p) => p.salesPersonID === selectedSalesPersonId
    )

    if (!person) return

    // Row Wise Edit
    if (editingRowIndex !== null) {
      const updated = [...scannedItemListData]

      updated[editingRowIndex] = {
        ...updated[editingRowIndex],
        salesPersonID: person.salesPersonID,
        salesPersonName: `${person.firstName} ${person.lastName || ""}`.trim(),
      }

      setScannedItemListData(updated)
      setEditingRowIndex(null)
    }

    // Item Wise Default
    else if (salesPersonTaggingMode === "item") {
      const updated = scannedItemListData.map((item) => ({
        ...item,
        salesPersonID: person.salesPersonID,
        salesPersonName: `${person.firstName} ${person.lastName || ""}`.trim(),
      }))

      setScannedItemListData(updated)
    }

    // Bill Wise
    else {
      setTaggedSalesPerson({
        ...person,
        mode: salesPersonTaggingMode,
      })
    }

    setShowSalesPersonSelectModal(false)

    toast.success(
      `${person.firstName} ${person.lastName || ""} tagged successfully`
    )
  }

  const handleConfirmSalesPersonTag = () => {
    if (selectedSalesPersonId === null) {
      toast.error('Please select a sales person', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    const person = salesPersonList.find(
      (p) => p.salesPersonID === selectedSalesPersonId
    )

    if (!person) return

    // Row Wise Edit (Only Item Wise)
    if (editingRowIndex !== null && salesPersonTaggingMode === "item") {
      const updated = [...scannedItemListData]

      updated[editingRowIndex] = {
        ...updated[editingRowIndex],
        salesPersonID: person.salesPersonID,
        salesPersonName: `${person.firstName} ${person.lastName || ""}`.trim(),
      }

      setScannedItemListData(updated)
      setEditingRowIndex(null)
    }

    // Item Wise Default
    else if (salesPersonTaggingMode === "item") {

      const updated = scannedItemListData.map(item => ({
        ...item,
        salesPersonID: person.salesPersonID,
        salesPersonName: `${person.firstName} ${person.lastName || ""}`.trim(),
      }))

      setScannedItemListData(updated)

      setTaggedSalesPerson({
        ...person,
        mode: "item",
      })
    }

    // Bill Wise
    else {

      const updated = scannedItemListData.map(item => ({
        ...item,
        salesPersonID: person.salesPersonID,
        salesPersonName: `${person.firstName} ${person.lastName || ""}`.trim(),
      }))

      setScannedItemListData(updated)

      setTaggedSalesPerson({
        ...person,
        mode: "bill",
      })
    }

    setShowSalesPersonSelectModal(false)

    toast.success(
      `${person.firstName} ${person.lastName || ""} tagged successfully`
    )
  } 

  //! Toggle Functions for Right Side Modals
  const toggleItemSearchModal = React.useCallback(() => {
    setShowItemSearchModal((prev) => !prev)
  }, [])

  const toggleCustomerDetailsModal = React.useCallback(() => {
    setShowCustomerDetailsModal((prev) => !prev)
  }, [])

  //! Toggle Check Out Modal with Customer Validation when user open checkout modal then this happen -> 12/12/2025
  const toggleCheckOutModal = async () => {
    if (!customerExists && !fetchedCustomerData && !selectedCustomerData) {
      toast.error('Please tag a customer before scanning items!', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      setBarCodeInput('') // Clear barcode input
      return
    }

    setShowCheckOutModal((prev) => !prev)
    handleCheckoutApplyPromotion()
  }

  //! Toggle Search Stock Online Modal - 19/01/2026
  const toggleSearchStockOnlineModal = React.useCallback(() => {
    setShowSearchStockOnlineModal((prev) => !prev)
  }, [])

  //! Handle Search Stock Online from Item Search Modal - 19/01/2026
  const handleSearchStockOnline = async () => {
    if (searchStockOnlineItemCode.trim() === '') {
      toast.error('Please enter an item code to search stock online', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
      return
    }

    try {
      setStockOnlineLoading(true)
      setStockOnlineData([]) // Clear previous data

      const PType = `?ItemCode=${searchStockOnlineItemCode.trim()}`
      const PJsonData = {}

      const responseJson = await GetAPI('/api/Item/GetAllItemStoreStock', PType, PJsonData, cookies)

      if (responseJson.status === 200 && responseJson.data) {
        setStockOnlineData(responseJson.data)
        setShowSearchStockOnlineModal(true)
        toast.success(`Stock data loaded for item: ${searchStockOnlineItemCode}`)
      } else {
        toast.error('No stock data found for this item code', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
      }
    } catch (error) {
      console.error('Error fetching stock data:', error)
      toast.error('Failed to fetch stock data. Please try again.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      })
    } finally {
      setStockOnlineLoading(false)
    }
  }

  //! Click Outside Modal Handlers
  useClickAway(tagCustomerModalRef, () => setShowTagCustomerModal(false), showTagCustomerModal)
  useClickAway(applyPromoModalRef, () => setShowApplyPromoModal(false), showApplyPromoModal)
  useClickAway(
    applyDiscountModalRef,
    () => setShowApplyDiscountModal(false),
    showApplyDiscountModal
  )
  useClickAway(holdBillModalRef, () => setShowHoldBillModal(false), showHoldBillModal)
  useClickAway(recallBillModalRef, () => setShowRecallBillModal(false), showRecallBillModal)
  useClickAway(voidBillModalRef, () => setShowVoidBillModal(false), showVoidBillModal)
  useClickAway(reprintBillModalRef, () => setShowReprintBillModal(false), showReprintBillModal)
  useClickAway(
    clearPromotionModalRef,
    () => setShowClearPromotionModal(false),
    showClearPromotionModal
  )
  useClickAway(
    clearDiscountModalRef,
    () => setShowClearDiscountModal(false),
    showClearDiscountModal
  )
  useClickAway(
    salesPersonTaggingModalRef,
    () => setShowSalesPersonTaggingModal(false),
    showSalesPersonTaggingModal
  )
  useClickAway(
    salesPersonSelectModalRef,
    () => setShowSalesPersonSelectModal(false),
    showSalesPersonSelectModal
  )
  useClickAway(itemSearchModalRef, () => setShowItemSearchModal(false), showItemSearchModal)
  useClickAway(
    customerDetailsModalRef,
    () => setShowCustomerDetailsModal(false),
    showCustomerDetailsModal
  )
  useClickAway(checkOutModalRef, () => setShowCheckOutModal(false), showCheckOutModal)
  useClickAway(imageModalRef, () => setShowImageModal(false), showImageModal)
  useClickAway(
    barcodeSelectionModalRef,
    () => closeBarcodeSelectionModal(),
    showBarcodeSelectionModal
  )

  useEffect(() => {
    if (showBarcodeSelectionModal) {
      setTimeout(() => {
        barcodeSelectionModalRef.current?.focus()
      }, 0)
    }
  }, [showBarcodeSelectionModal])

  // Auto-focus on Tender Amount input when checkout modal opens
  useEffect(() => {
    if (showCheckOutModal && inputTenderAmountRef.current) {
      setTimeout(() => {
        inputTenderAmountRef.current?.focus()
      }, 100)
    }
  }, [showCheckOutModal])

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

      //console.log('fetchCustomerDetails response:', responseJson)

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

  // Handle mobile number input change
  const handleMobileInputChange = (mobileNumber: string) => {
    // Only allow numeric characters
    const numericOnly = mobileNumber.replace(/[^0-9]/g, '').slice(0, 10)

    setCustomerSaveData((prev) => ({
      ...prev,
      mobile: numericOnly,
      whatsAppNo: numericOnly,
    }))

    setCustomerInfo((prev) => ({ ...prev, mobile: numericOnly }))

    // Reset customer exists when mobile changes
    if (numericOnly.length !== 10) {
      setCustomerExists(false)
      setFetchedCustomerData(null)
      setSelectedCustomerData(null)
    }
  }

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
      storeID: __getCookieValue('DefaultStoreId'),
      enteredBy: __getCookieValue('UserId'),
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

  // (tagging handled by consolidated async `handleTagCustomer` above)

  // Add keyboard handler for ALT+N to save/clear customer
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

  // Handle Alt + S keyboard shortcut for Save button
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault() // Prevent default browser behavior
        if (totalBillAmount > 0 && !isBtnSaving) {
          handleSaveBill()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [totalBillAmount, isBtnSaving, handleSaveBill])

  // Handle Alt + C keyboard shortcut for Credit Note Received Select button
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key.toLowerCase() === 'v') {
        event.preventDefault() // Prevent default browser behavior
        if (showCheckOutModal) {
          handleCNReceivedClick()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showCheckOutModal, handleCNReceivedClick])

  // Handle Alt + B for Card Note and Alt + M for UPI/PhonePe Note
  useEffect(() => {
    const handleKeyDown = (event) => {
      // const key = event.key.toLowerCase();

      if (showCheckOutModal && event.altKey) {
        const key = event.key.toLowerCase()

        // Alt + L for Coupon Code
        if (key === 'l') {
          event.preventDefault()
          inputCouponCodeRef.current?.focus()
          return
        }

        // Find the payment index for card or UPI
        paymentListData.forEach((payment, index) => {
          const name = payment.availablePaymentmethod?.toLowerCase() || ''

          // Alt + B for Card (Credit/Debit Card)
          if (
            key === 'b' &&
            (name.includes('credit card') ||
              name.includes('creditcard') ||
              name.includes('debit card') ||
              name.includes('debitcard') ||
              name.includes('debit'))
          ) {
            event.preventDefault()
            toggleNoteField(index)
          }

          // Alt + M for Mobile Wallet/UPI (PayTM, GPay, Mobile Wallet)
          if (
            key === 'm' &&
            (name.includes('paytm') ||
              name.includes('gpay') ||
              name.includes('mobilewallet') ||
              name.includes('mobileWallet') ||
              name.includes('mobile wallet'))
          ) {
            event.preventDefault()
            toggleNoteField(index)
          }
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showCheckOutModal, paymentListData, toggleNoteField])

  //! New Checkout for try -> Mahiber 15th Nove 2025

  //! State Variebles
  const [totalBillAmttry, setTotalBillAmttry] = useState()
  const [cashTry, setCashTry] = useState()
  const [cardSaleTry, setCardSaleTry] = useState()
  const [uipSaleTry, setUipSaleTry] = useState()
  const [creditNoteTry, setCreditNoteTry] = useState()
  const [couponTry, setCouponTry] = useState()
  const [checkoutModalTry, setCheckoutModalTry] = useState(false)

  //! Fuctions
  const toggleCheckoutTry = () => {
    setCheckoutModalTry((prev) => !prev)
  }

  const handleClearAllTry = () => {
    setTotalBillAmttry('')
    setCashTry('')
    setCardSaleTry('')
    setUipSaleTry('')
    setCreditNoteTry('')
    setCouponTry('')
    setCheckoutModalTry(false)
    toast.success('All data cleared! Ready for new transaction.')
  }

  //console.log(scannedItemListData);

  /* -------------- Item Wise Tagging — Select Sales Person ----------------- */
  // States
  const [salesPersonSearchText, setSalesPersonSearchText] = useState('');
  const [filteredSalesPersonList, setFilteredSalesPersonList] = useState([]);
  const [salesPersonCurrentPage, setSalesPersonCurrentPage] = useState(1);
  const salesPersonPerPage = 10;

  // Search
  const handleSalesPersonSearch = (searchText: string) => {
    setSalesPersonSearchText(searchText);
    setSalesPersonCurrentPage(1);

    if (searchText.trim() === '') {
      setFilteredSalesPersonList(salesPersonList);
    } else {
      const filtered = salesPersonList.filter(
        (person) =>
          `${person.firstName || ''} ${person.lastName || ''}`
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (person.employeeID || '')
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (person.mobileNo || '').includes(searchText)
      );

      setFilteredSalesPersonList(filtered);
    }
  };

  useEffect(() => {
    setFilteredSalesPersonList(salesPersonList);
  }, [salesPersonList]);

  const totalSalesPersonPages = Math.ceil(
    filteredSalesPersonList.length / salesPersonPerPage
  );

  const startSalesPersonIndex = (salesPersonCurrentPage - 1) * salesPersonPerPage;

  const currentSalesPersonData = filteredSalesPersonList.slice(
    startSalesPersonIndex,
    startSalesPersonIndex + salesPersonPerPage
  );
  /* -------------- Item Wise Tagging — Select Sales Person ----------------- */


  return (
    <div className="light-theme relative z-30 min-h-screen w-full overflow-hidden" style={{ backgroundColor: '#d6eaf8' }}>
      {/* No session / server date popup */}
      {showNoSessionPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm p-5 text-center">
            <div className="flex justify-center mb-3">
              <CalendarDays className="w-8 h-8 text-[#0A6ED1]" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Session Not Open</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please open the session before billing.
            </p>
            <Button
              size="sm"
              className="bg-sky-600 hover:bg-sky-700 text-white"
              onClick={() => navigate('/transaction/billing/sessions/session-open')}
            >
              Go to Session Open
            </Button>
          </div>
        </div>
      )}
      {/* Stock Unavailable */}
      {showStockLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm p-5 text-center">
            <div className="flex justify-center mb-3">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Stock Not Available</h3>
            <p className="text-sm text-gray-600 mb-4">{stockLimitMessage}</p>
            <Button
              size="sm"
              className="bg-sky-600 hover:bg-sky-700 text-white"
              onClick={() => setShowStockLimitModal(false)}
            >
              OK
            </Button>
          </div>
        </div>
      )}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: '#d6eaf8',
          width: (showCheckout2 || showCheckOutModal) ? 'calc(100% - 500px)' : '100%',
          overflow: 'hidden'
        }}
      >
        {/* Server Date - Top Middle */}
        <div className="flex justify-center mb-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-white bg-sky-600 px-3 py-1 rounded-md shadow-sm whitespace-nowrap">
            <CalendarDays className="w-4 h-4" />
            Bill Date: {today || '--'}
          </div>
        </div>

        {/* Header */}
        {/* <div className="flex justify-end items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Billing Request 2</h1>
          <div className="flex justify-right gap-2">
            <Link to="/transaction/billing/billing-request">
              <Button variant="outline" className="transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Billing Request 1
              </Button>
            </Link>
            
          </div>
        </div> */}

        {/* Top Action Buttons */}
        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 mb-2">
          <div className="flex gap-1 items-center flex-wrap">
            <Button
              size="sm"
              className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={toggleApplyDiscountModal}
              title="Apply Discount (CTRL + D)"
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              Apply Discount (CTRL + D)
            </Button>
            <Button
              size="sm"
              className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={handleSaveHoldBill}
              title="Hold Bill (ALT + H)"
            >
              <Archive className="w-4 h-4 mr-1" />
              Hold Bill (ALT + H)
            </Button>
            <Button
              size="sm"
              className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={toggleRecallBillModal}
              title="Recall Bill (CTRL + R)"
            >
              <CircleArrowOutUpLeft className="w-4 h-4 mr-1" />
              Recall Bill (CTRL + R)
            </Button>
            <Button
              size="sm"
              className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={toggleVoidBillModal}
              title="Void Bill (CTRL + V)"
            >
              <X className="w-4 h-4 mr-1" />
              Void Bill (CTRL + V)
            </Button>
            {__getCookieValue("UserRole")?.toLowerCase() === "admin" && (
              <Button
                size="sm"
                className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                onClick={toggleSearchBillModal}
                title="Reprint Bill (CTRL + B)"
              >
                <Receipt className="w-4 h-4 mr-1" />
                Reprint Bill (CTRL + B)
              </Button>
            )}
            <Button
              size="sm"
              className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={toggleClearPromotionModal}
              title="Clear Promotion (CTRL + Q)"
            >
              <Gift className="w-4 h-4 mr-1" />
              Clear Promotion (CTRL + Q)
            </Button>
            <Button
              size="sm"
              className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={toggleClearDiscountModal}
              title="Clear Discount (CTRL + Z)"
            >
              <Percent className="w-4 h-4 mr-1" />
              Clear Discount (CTRL + Z)
            </Button>
            <Button
              size="sm"
              className="h-9 px-2 text-xs bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={toggleSalesPersonTaggingModal}
              title="Sales Person Tagging (ALT + T)"
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Sales Person Tagging (ALT + T)
            </Button>
          </div>
        </div>

        {/* Customer Information - Top Row */}
        <div className="bg-white p-2 rounded shadow-sm border border-gray-200 mb-3">
          <div className="grid grid-cols-12 gap-1 items-center text-xs">
            <div className="col-span-2 font-medium flex items-center gap-1 text-[#0A6ED1]">
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
                className="w-full border p-1 rounded-md text-xs"
                maxLength={10}
                disabled={!!(customerExists && fetchedCustomerData)}
                ref={inputCustomerSaveDataMobileRef}
              />
              {/* <Button 
                size="sm" 
                onClick={() => fetchCustomerDetails(customerSaveData.mobile)}
                disabled={customerSaveData.mobile.length !== 10 || isFetchingCustomer || !!(customerExists && fetchedCustomerData)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs p-2 w-8 h-8 rounded-sm m-1 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              >
                {isFetchingCustomer ? '⏳' : '🔍'}
              </Button> */}
            </div>

            <div className="col-span-1 font-medium">First Name</div>
            <div className="col-span-2">
              <input
                type="text"
                value={customerSaveData.customerFirstName}
                onChange={(e) =>
                  setCustomerSaveData((prev) => ({ ...prev, customerFirstName: e.target.value }))
                }
                placeholder="First Name"
                className="w-full border p-1 rounded-md text-xs"
                disabled={!!(customerExists && fetchedCustomerData)}
              />
            </div>
            <div className="col-span-1 font-medium">Middle Name</div>
            <div className="col-span-1">
              <input
                type="text"
                value={customerSaveData.customerMiddleName}
                onChange={(e) =>
                  setCustomerSaveData((prev) => ({ ...prev, customerMiddleName: e.target.value }))
                }
                placeholder="Middle Name"
                className="w-full border p-1 rounded-md text-xs"
                disabled={!!(customerExists && fetchedCustomerData)}
              />
            </div>
            <div className="col-span-1 font-medium">Last Name</div>
            <div className="col-span-1">
              <input
                type="text"
                value={customerSaveData.customerLastName}
                onChange={(e) =>
                  setCustomerSaveData((prev) => ({ ...prev, customerLastName: e.target.value }))
                }
                placeholder="Last Name"
                className="w-full border p-1 rounded-md text-xs"
                disabled={!!(customerExists && fetchedCustomerData)}
              />
            </div>
            <div className="col-span-1">
              <Button
                size="sm"
                onClick={handleSaveCustomerNew}
                disabled={isBtnSaving}
                className="bg-[#0A6ED1] hover:bg-[#085BA6] hover:shadow-lg text-white text-[10px] px-0.5 h-7 w-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                title={customerExists ? "Clear Customer (ALT+N)" : "Save Customer (ALT+N)"}
              >
                {isBtnSaving ? '⏳' : customerExists ? '🗑️ Clear' : '💾 Save'}
              </Button>
            </div>
          </div>

          {/* Show status message */}
          {customerSaveData.mobile.length > 0 && (
            <div className="mt-2 text-xs">
              {customerSaveData.mobile.length < 10 ? (
                <div className="text-red-600 bg-white p-2 rounded border border-red-300">
                  ⚠️ Please type complete phone number (10 digits required)
                </div>
              ) : isFetchingCustomer ? (
                <div className="text-blue-600 bg-white p-2 rounded border border-blue-300 flex items-center">
                  <span>⏳ Customer is fetching... Please wait</span>
                </div>
              ) : customerExists && fetchedCustomerData ? (
                <div className="text-green-600 bg-white p-2 rounded border border-green-300 flex items-center justify-between">
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
                <div className="text-orange-600 bg-white p-2 rounded border border-orange-300 flex items-center justify-between">
                  <span>⚠️ Customer not found - Add manually</span>
                  {/* <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => fetchCustomerDetails(customerSaveData.mobile)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 h-6"
                    >
                      🔍 Fetch Customer
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveCustomerNew}
                      disabled={isBtnSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-6"
                    >
                      💾 Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleClearCustomerInput}
                      className="text-xs px-2 py-1 h-6"
                    >
                      Clear
                    </Button>
                  </div> */}
                </div>
              ) : null}
            </div>
          )}

          {/* New Customer Form - Commented out as per requirement */}
          {/* {showNewCustomerForm && (
            <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
              <h4 className="text-sm font-medium mb-2 text-yellow-800">Add New Customer</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-600 block">First Name *</label>
                  <Input 
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo(prev => ({...prev, firstName: e.target.value}))}
                    className="h-7 text-sm"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">Middle Name</label>
                  <Input 
                    value={customerInfo.middleName}
                    onChange={(e) => setCustomerInfo(prev => ({...prev, middleName: e.target.value}))}
                    className="h-7 text-sm"
                    placeholder="Enter middle name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">Last Name *</label>
                  <Input 
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo(prev => ({...prev, lastName: e.target.value}))}
                    className="h-7 text-sm"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => {
                    if (customerInfo.firstName && customerInfo.lastName) {
                      setCustomerExists(true);
                      setShowNewCustomerForm(false);
                      toast.success("Customer added successfully!");
                    } else {
                      toast.error("Please fill in first name and last name");
                    }
                  }}
                >
                  Save Customer
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs"
                  onClick={() => setShowNewCustomerForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )} */}
        </div>

        <div className="flex gap-2 w-full">
          {/* Middle Section - Items & Billing */}
          <div className="flex-1 space-y-2">
            {/* Scan Item */}
            <div className="bg-white p-2 rounded shadow-sm border">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <h4 className="font-medium mb-1 text-sm">Scan Item</h4>
                  <Input
                    placeholder="Scan Barcode..."
                    value={barCodeInput}
                    ref={inputBarCodeRef}
                    onChange={(e) => setBarCodeInput(e.target.value)}
                    // onKeyDown={handleScanItem}
                    onKeyDown={handleEnterPress}
                    onClick={handleBarcodeInputClick}
                    className="h-8"
                  />
                </div>
                <div className="flex gap-2">
                  {/* <Button size="sm" className="bg-gray-500">Return</Button> */}
                  {/* <Button size="sm" variant="outline" onClick={handleClearAll}>Clear Bill</Button> */}
                </div>
              </div>
            </div>

            {/* Items Table */}
            {/* <div className="bg-white rounded shadow-sm border overflow-hidden">
              <div className="max-h-96 overflow-y-auto" style={{ maxHeight: '370px' }}>
                <Table className="text-xs">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="w-20 text-xs text-center">Sl No.</TableHead>
                      <TableHead className="w-24 text-xs text-center">Barcode</TableHead>
                      <TableHead className="text-xs text-left">Item Name</TableHead>
                      <TableHead className="w-16 text-xs text-center">Qty.</TableHead>
                      <TableHead className="w-20 text-xs text-right">MRP</TableHead>
                      <TableHead className="w-20 text-xs text-right">Discount</TableHead>
                      <TableHead className="w-20 text-xs text-right">Promotion</TableHead>
                      <TableHead className="w-28 text-xs text-right">Net Payable</TableHead>
                      <TableHead className="w-24 text-xs text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {scannedItemListData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-sm">No items scanned</div>
                            <div className="text-xs text-gray-400">
                              Scan a barcode to add items to the cart
                            </div>
                            <div className="text-xs text-blue-600 mt-2">
                              Example barcodes: DB100001, DB100002, DB100003, etc.
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      scannedItems.map((item, index) => (
                        <TableRow key={item.id} className="h-8">
                          <TableCell className="text-xs text-center">{index + 1}</TableCell>
                          <TableCell className="text-xs text-center">{item.barcode}</TableCell>
                          <TableCell className="text-xs text-left">{item.name}</TableCell>
                          <TableCell className="text-xs text-center">{item.qty}</TableCell>
                          <TableCell className="text-right text-xs">{item.mrp.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-xs">
                            {item.discount > 0 ? `${item.discount.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {item.promotion > 0 ? `${item.promotion.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs">{item.netAmt.toFixed(2)}</TableCell>
                          <TableCell className="text-xs text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                                disabled={item.qty <= 1}
                                onKeyDown={(e) => e.preventDefault()}
                                tabIndex={-1} 
                                className="w-4 h-4 p-0 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 hover:shadow-md hover:bg-red-50 hover:border-red-300"
                              >
                                <Minus className="w-2 h-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                                onKeyDown={(e) => e.preventDefault()}
                                tabIndex={-1}
                                className="w-4 h-4 p-0 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 hover:shadow-md hover:bg-green-50 hover:border-green-300"
                              >
                                <Plus className="w-2 h-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteItem(item.id)}
                                onKeyDown={(e) => e.preventDefault()}
                                tabIndex={-1}
                                className="w-4 h-4 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 hover:shadow-md hover:border-red-300"
                              >
                                <Trash2 className="w-2 h-2" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {scannedItems.length > 0 && (
                      <TableRow className="bg-gray-50 border-t-2 font-semibold">
                        <TableCell className="text-xs text-center">-</TableCell>
                        <TableCell className="text-xs text-center">-</TableCell>
                        <TableCell className="text-xs text-left font-bold">NO. OF PCS</TableCell>
                        <TableCell className="text-xs text-center font-bold">{totals.totalQty}</TableCell>
                        <TableCell className="text-right text-xs">-</TableCell>
                        <TableCell 
                          className="text-right text-xs font-bold text-red-600 cursor-pointer hover:bg-red-50 transition-colors duration-200" 
                          title="Total Discount"
                        >
                          {totals.totalDiscount.toFixed(2)}
                        </TableCell>
                        <TableCell 
                          className="text-right text-xs font-bold text-green-600 cursor-pointer hover:bg-green-50 transition-colors duration-200" 
                          title="Total Promotion"
                        >
                          {totals.totalPromotion.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-xs">{totals.billAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-xs text-center">-</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div> */}

            {/* //! Header Frezz try  */}
            <Table className="text-xs border-separate border-spacing-0">
              <TableHeader className="sticky top-0 bg-gradient-to-r from-[#0A6ED1] to-[#085BA6] text-white z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-16 text-xs text-center text-white">Sl No.</TableHead>
                  {/* <TableHead className="w-16 text-xs text-center text-white">Select</TableHead> */}
                  {/* <TableHead className="w-24 text-xs text-center">Image</TableHead> */}
                  <TableHead className="w-28 text-xs text-center text-white">Barcode</TableHead>
                  <TableHead className="text-xs text-left text-white">Item Name</TableHead>
                  {/* <TableHead className="w-20 text-xs text-right">Rate</TableHead> */}
                  <TableHead className="w-20 text-xs text-right text-white">Qty.</TableHead>
                  <TableHead className="w-24 text-xs text-right text-white">MRP</TableHead>
                  <TableHead className="w-24 text-xs text-right text-white">Discount</TableHead>
                  <TableHead className="w-24 text-xs text-right text-white">Promotion</TableHead>
                  <TableHead className="w-28 text-xs text-right text-white">Net Payable</TableHead>
                  {/* <TableHead className="w-20 text-xs text-center">Sales Person</TableHead> */}
                  {/* <TableHead className="w-20 text-xs text-center">HSN Code</TableHead> */}
                  {/* <TableHead className="w-20 text-xs text-center">Tax Rate</TableHead> */}
                  {/* <TableHead className="w-20 text-xs text-right">Tax Amount</TableHead> */}
                  {/* <TableHead className="w-20 text-xs text-right">Per Item Discount</TableHead> */}
                  {/* <TableHead className="w-20 text-xs text-right">Per Item Promo Amt</TableHead> */}
                  {/* <TableHead className="w-20 text-xs text-right">Taxable Amt</TableHead> */}
                  <TableHead className="w-32 text-xs text-center text-white">Sales Person Name</TableHead>
                  <TableHead className="w-24 text-xs text-center text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
            </Table>

            {/* Items Table New With Api */}
            <div
              className="bg-white rounded-md shadow-[0_10px_30px_rgba(2,32,71,0.08)] border border-slate-200 overflow-hidden"
              tabIndex={0}
              onKeyDown={(e) => {
                if (scannedItemListData.length === 0) return

                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setSelectedRowIndex((prev) => {
                    const newIndex =
                      prev === null ? 0 : Math.min(prev + 1, scannedItemListData.length - 1)
                    return newIndex
                  })
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setSelectedRowIndex((prev) => {
                    const newIndex = prev === null ? 0 : Math.max(prev - 1, 0)
                    return newIndex
                  })
                } else if (e.key === 'Enter' && selectedRowIndex !== null) {
                  e.preventDefault()
                  // Focus on quantity increase button when Enter is pressed
                  handleQuantityChange(selectedRowIndex, 1)
                } else if (e.key === 'Delete' && selectedRowIndex !== null) {
                  e.preventDefault()
                  // Delete the selected row
                  setDeleteItemIndex(selectedRowIndex)
                } else if (e.key === '-' && selectedRowIndex !== null) {
                  e.preventDefault()
                  // Decrease quantity when minus key is pressed
                  handleQuantityChange(selectedRowIndex, -1)
                } else if (e.key === '+' && selectedRowIndex !== null) {
                  e.preventDefault()
                  // Increase quantity when plus key is pressed
                  handleQuantityChange(selectedRowIndex, 1)
                }
              }}
            >
              <div
                ref={(el) => {
                  if (el && scannedItemListData.length > 0) {
                    // Auto-scroll to bottom when new items are added
                    el.scrollTop = el.scrollHeight
                  }
                }}
                className="max-h-96 overflow-y-auto"
                style={{ minHeight: '290px', maxHeight: '290px' }}
              >
                {console.log(scannedItemListData)}
                <Table className="text-xs">
                  <TableBody>
                    {scannedItemListData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={18} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-sm">No items scanned</div>
                            <div className="text-xs text-gray-400">
                              Scan a barcode to add items to the cart
                            </div>
                            <div className="text-xs text-blue-600 mt-2">
                              {/* Example barcodes: DB108082, DB100001, DB100002, etc. */}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      scannedItemListData.map((item, index) => (
                        <TableRow
                          key={`${item.itemCode || item.barCode || index}-${Number(item.mrp || 0).toFixed(2)}`}
                          className={`w-20 h-8 cursor-pointer transition-all duration-200 ${selectedRowIndex === index
                            ? 'bg-[#EAF3FF] ring-1 ring-inset ring-[#0A6ED1]/35'
                            : ''
                            } ${item.discountPrice ? 'text-green-500 font-medium' : ''
                            } hover:bg-gray-50`}
                          onClick={() => setSelectedRowIndex(index)}
                        >
                          <TableCell className="w-16 text-xs text-center">{index + 1}</TableCell>
                          {/* <TableCell className="w-16 text-xs text-center">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(index)}
                              onChange={(e) => {
                                e.stopPropagation()
                                const newSelected = new Set(selectedItems)
                                if (newSelected.has(index)) {
                                  newSelected.delete(index)
                                } else {
                                  newSelected.add(index)
                                }
                                setSelectedItems(newSelected)
                              }}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </TableCell> */}
                          {/* <TableCell className="text-xs text-center">
                            <span className="text-xl cursor-pointer hover:text-blue-500" onClick={() => toggleImageModal(item)}>🖼️</span>
                          </TableCell> */}
                          <TableCell className="w-28 text-xs text-center">{item.barCode}</TableCell>
                          <TableCell className={`text-xs text-left ${item.promExists === 'Y' ? 'text-red-500' : ''}`}>{item.itemName}</TableCell>
                          {/* <TableCell className="text-right text-xs">{item.retailPrice}</TableCell> */}
                          <TableCell className="w-20 text-xs text-right">{item.quantity}</TableCell>
                          <TableCell className="w-24 text-xs text-right">{item.mrp}</TableCell>
                          <TableCell className="w-24 text-right text-xs">
                            {item.discountPrice > 0 ? `${item.discountPrice.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="w-24 text-right text-xs">
                            {item.promoPrice > 0 ? `${item.promoPrice.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="w-28 text-right font-medium text-xs">
                            {item.totalPrice.toFixed(2)}
                            {/* {item.totalPrice} */}
                          </TableCell>
                          {/* 
                          <TableCell className="w-32 text-xs text-center">
                            {taggedSalesPerson
                              ? taggedSalesPerson.mode === 'bill' || taggedSalesPerson.mode === 'item'
                                ? <span className="text-sky-700 font-medium">{`${taggedSalesPerson.firstName || ''} ${taggedSalesPerson.lastName || ''}`.trim()}</span>
                                : selectedItems.has(index)
                                  ? <span className="text-sky-700 font-medium">{`${taggedSalesPerson.firstName || ''} ${taggedSalesPerson.lastName || ''}`.trim()}</span>
                                  : <span className="text-gray-400">—</span>
                              : <span className="text-gray-400">—</span>}
                          </TableCell> 
                          */}
                          <TableCell className="w-32 text-xs text-center">
                            <span
                              className={`font-medium ${
                                taggedSalesPerson?.mode === "item"
                                  ? "text-sky-700 cursor-pointer"
                                  : "text-sky-700"
                              }`}
                              onClick={(e) => {
                                if (taggedSalesPerson?.mode !== "item") return

                                e.stopPropagation()
                                setEditingRowIndex(index)
                                setSelectedSalesPersonId(item.salesPersonID || null)
                                setShowSalesPersonSelectModal(true)
                              }}
                            >
                              {item.salesPersonName || "-"}
                            </span>
                          </TableCell>
                          {/* <TableCell className="text-xs text-center">{item.hsnsacCode}</TableCell> */}
                          {/* <TableCell className="text-xs text-center">{item.taxRate}</TableCell> */}
                          {/* <TableCell className="text-right text-xs">{item.taxAmount}</TableCell> */}
                          {/* <TableCell className="text-right text-xs">-</TableCell> */}
                          {/* <TableCell className="text-right text-xs">-</TableCell> */}
                          {/* <TableCell className="text-right text-xs">{item.taxableAmount}</TableCell> */}
                          <TableCell className="w-24 text-xs text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedImageItem(item)
                                  setShowImageModal(true)
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                                tabIndex={-1}
                                className="w-4 h-4 p-0 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 hover:shadow-md hover:bg-blue-50 hover:border-blue-300"
                                title="View Image"
                              >
                                <Eye className="w-2 h-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(index, -1)}
                                disabled={item.quantity <= 1}
                                onKeyDown={(e) => e.preventDefault()}
                                tabIndex={-1}
                                className="w-4 h-4 p-0 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 hover:shadow-md hover:bg-red-50 hover:border-red-300"
                              >
                                <Minus className="w-2 h-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(index, 1)}
                                onKeyDown={(e) => e.preventDefault()}
                                tabIndex={-1}
                                className="w-4 h-4 p-0 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 hover:shadow-md hover:bg-green-50 hover:border-green-300"
                              >
                                <Plus className="w-2 h-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                // onClick={() => handleDeleteItem(index)}
                                onClick={() => setDeleteItemIndex(index)}
                                onKeyDown={(e) => e.preventDefault()}
                                tabIndex={-1}
                                className="w-4 h-4 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 hover:shadow-md hover:border-red-300"
                              >
                                <Trash2 className="w-2 h-2" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Billing Summary This section should be old like*/}
            <div className="bg-white p-2 rounded shadow-sm border">
              {/* <h4 className="text-sm font-semibold mb-2 text-gray-800">Billing Summary</h4> */}

              {/* Billing Summary Table */}
              {scannedItemListData.length > 0 && (
                <div className="mb-4">
                  <Table className="text-xs">
                    <TableBody>
                      <TableRow className="bg-[#EBF5FF] border-[#0A6ED1] border font-semibold">
                        <TableCell className="w-16 text-xs text-center">-</TableCell>
                        <TableCell className="w-16 text-xs text-center">-</TableCell>
                        <TableCell className="w-28 text-xs text-center">-</TableCell>
                        <TableCell className="text-xs text-left font-bold">
                          Basket Quantity
                        </TableCell>
                        <TableCell className="w-20 text-xs text-right font-bold">
                          {scannedItemListData?.reduce(
                            (sum, item) => sum + (parseInt(item.quantity) || 0),
                            0
                          )}
                        </TableCell>
                        <TableCell className="w-24 text-xs text-right">-</TableCell>
                        <TableCell
                          className="w-24 text-xs text-right font-bold text-red-600 cursor-pointer hover:bg-red-50 transition-colors duration-200"
                          title="Total Discount"
                        >
                          {scannedItemListData
                            ?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) || 0), 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell
                          className="w-24 text-xs text-right font-bold text-green-600 cursor-pointer hover:bg-green-50 transition-colors duration-200"
                          title="Total Promotion"
                        >
                          {scannedItemListData
                            ?.reduce((sum, item) => sum + (parseFloat(item.promoPrice) || 0), 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell className="w-28 text-xs text-right font-bold">
                          {scannedItemListData
                            ?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell className="w-32 text-xs text-center">-</TableCell>
                        <TableCell className="w-24 text-xs text-center">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 text-xs mt-4">
                {/* Left Section - Checkout Button and Remarks */}
                <div className="space-y-2">
                  <Button
                    className="w-full h-10 bg-[#0A6ED1] hover:bg-[#085BA6] hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    onClick={() => {
                      toggleCheckOutModal()
                      // handleCheckoutApplyPromotion()
                    }}
                    title="Check Out (ALT + C)"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Check Out
                  </Button>
                  <Input
                    className="w-full h-8 px-2 text-xs border border-[#0A6ED1]/20 rounded focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                    placeholder="Remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                {/* Empty Middle Column */}
                <div className="space-y-2"></div>

                {/* Net Amount - Moved to Right End */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-red-600">
                      <span>Discount Base {storedDiscount ? (storedDiscount?.discountBase === 'P' ? '%' : 'Amt.') : ''}</span>
                      <span>{totalDiscountAmount ? totalDiscountAmount.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-red-600">
                      <span>Round Off</span>
                      <span>{roundedNetPayableAdjustment}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="font-bold">Net Payable</span>
                      <span className="font-bold">{netPayableAdjustment}</span>
                    </div>
                  </div>
                  {/* <Button className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg h-8 text-xs text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                    Process Payment
                  </Button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Quick Actions */}
          <div className="w-16 flex-shrink-0">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-2">
                {/* <Button 
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95" 
                  onClick={toggleItemList}
                  title="Item Search (CTRL + I)"
                >
                  <Search className="w-5 h-5" />
                </Button> */}

                {/* //! New Item Search Button  */}
                <Button
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  onClick={toggleItemList2}
                  title="Item Search (CTRL + I)"
                >
                  <Search className="w-5 h-5" />
                </Button>
                {/* //! New Checkout Form as per sir instruction on 15-11-2025 */}
                {/* <Button 
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95" 
                  onClick={toggleCheckoutTry}
                  title="Check Out Try (CTRL + SHIFT + O)"
                >
                  <ShoppingBag className="w-5 h-5" />
                </Button> */}
                {/* //! Search Stock Online Button - 19/01/2026 */}
                {/* <Button
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  onClick={toggleSearchStockOnlineModal}
                  title="Search Stock Online (CTRL + SHIFT + S)"
                >
                  <Search className="w-5 h-5" />
                </Button> */}
                <Button
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  onClick={toggleCustomerDetailsModal}
                  title="Customer Details (CTRL + U)"
                >
                  <Users className="w-5 h-5" />
                </Button>
                <Button
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  // onClick={toggleCheckOutModal}
                  onClick={() => {
                    toggleCheckOutModal()
                    // handleCheckoutApplyPromotion()
                  }}
                  title="Check Out (ALT + C)"
                >
                  <CheckCircle className="w-5 h-5" />
                </Button>
                {/* //! New Checkout Form as per sir instruction on 30-10-2025  */}
                {/* <Button
                  className="w-full h-10 p-0 bg-green-600 hover:bg-green-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  onClick={toggleCheckout2}
                  title="Check Out 2 - Simple (CTRL + SHIFT + O)"
                >
                  <CheckCircle className="w-5 h-5" />
                </Button> */}
                <Button
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  onClick={() => navigate('/transaction/billing/billing-return-2')}
                  title="Return"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleAllStateClear}
                  className="w-full h-10 p-0 bg-sky-600 hover:bg-sky-700 hover:shadow-lg text-white hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  title="Clear Bill (CTRL + X)"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ! Modal 'Barcode Selection' for multiple items with same barcode */}
      {showBarcodeSelectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center">
          <div
            ref={barcodeSelectionModalRef}
            tabIndex={0}
            onKeyDown={(e) => {
              if (barcodeSelectionItems.length === 0) return

              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedBarcodeSelectionIndex((prev) =>
                  Math.min(prev + 1, barcodeSelectionItems.length - 1)
                )
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedBarcodeSelectionIndex((prev) => Math.max(prev - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                selectBarcodeModalItem(selectedBarcodeSelectionIndex)
              } else if (e.key === 'Escape') {
                e.preventDefault()
                closeBarcodeSelectionModal()
              }
            }}
            className="w-full max-w-4xl bg-white rounded-lg border border-slate-200 shadow-2xl overflow-hidden outline-none"
          >
            <div className="px-5 py-3 bg-gradient-to-r from-[#0A6ED1] to-[#085BA6] text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold">Multiple Items Found - Select One</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={closeBarcodeSelectionModal}
                className="h-7 text-xs bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              >
                Close
              </Button>
            </div>

            <div className="px-5 py-2 text-xs border-b border-slate-200">
              Use Arrow Up/Down to move and press Enter to select item.
            </div>

            <div className="max-h-80 overflow-y-auto">
              <Table className="text-xs">
                <TableHeader className="sticky top-0 bg-slate-100 z-10">
                  <TableRow>
                    <TableHead className="w-14 text-center">No.</TableHead>
                    <TableHead className="w-40 text-center">Barcode</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="w-28 text-right">MRP</TableHead>
                    <TableHead className="w-28 text-right">System Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barcodeSelectionItems.map((item, index) => (
                    <TableRow
                      key={`${item.itemCode || item.barCode || index}-${index}`}
                      className={`cursor-pointer ${selectedBarcodeSelectionIndex === index
                        ? 'bg-[#CFE4FF] ring-2 ring-inset ring-[#0A6ED1] shadow-[inset_4px_0_0_#0A6ED1]'
                        : 'hover:bg-slate-50'
                        }`}
                      onMouseEnter={() => setSelectedBarcodeSelectionIndex(index)}
                      onDoubleClick={() => selectBarcodeModalItem(index)}
                      onClick={() => selectBarcodeModalItem(index)}
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center font-medium">{item.barCode || '-'}</TableCell>
                      <TableCell>{item.itemName || '-'}</TableCell>
                      <TableCell className="text-right">{Number(item.mrp || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{Number(item.retailPrice || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Promotions' */}
      {showApplyPromoModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={applyPromoModalRef} className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Apply Promotion</h2>
            <input
              type="text"
              placeholder="Search Promotion..."
              value={promotionSearchText}
              onChange={(e) => handlePromotionSearch(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="box overflow-y-auto w-full">
              <div className="overflow-x-auto border rounded-md w-full">
                <table className="min-w-full border-collapse border border-gray-300">
                  <TableHeader>
                    <TableRow className="bg-gray-200 h-8">
                      <TableHead className="h-8">Select</TableHead>
                      <TableHead className="h-8">No.</TableHead>
                      <TableHead className="h-8">Promotion Name</TableHead>
                      <TableHead className="h-8">Promotion Type</TableHead>
                      <TableHead className="h-8">Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan="5" className="text-center text-blue-500 py-2">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPromotionData?.length ? (
                      currentPromotionData.map((item, index) => (
                        <TableRow key={index + 1}>
                          <td className="p-2">
                            <input
                              type="checkbox"
                              value={item.promotionID}
                              checked={
                                selectedPromotionID
                                  ? selectedPromotionID === item.promotionID
                                  : storedPromotion?.promotionID === item.promotionID
                              }
                              onChange={() => handlePromotionSelection(item.promotionID, item)}
                            />
                          </td>
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.promotionName}</td>
                          <td className="p-2">{item.promotionType}</td>
                          <td className="p-2">{item.isActive}</td>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="5" className="text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setPromotionCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={promotionCurrentPage === 1}
                className="transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-md"
              >
                Previous
              </Button>
              <span>
                Page {promotionCurrentPage} of {totalPromotionPages}
              </span>
              <Button
                onClick={() =>
                  setPromotionCurrentPage((prev) => Math.min(prev + 1, totalPromotionPages))
                }
                disabled={promotionCurrentPage === totalPromotionPages}
                className="transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-md"
              >
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button
                className="px-3 bg-green-600 text-white hover:text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-lg"
                //onClick={handleApplyPromotion}
                disabled={!selectedPromotionID}
              >
                {isBtnSaving ? 'Applying...' : 'Apply'}
              </Button>
              <Button
                className="px-3 bg-gray-600 text-white hover:text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-lg"
                onClick={toggleApplyPromotionModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Discounts' */}
      {showApplyDiscountModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Apply Discount</h2>
            <input
              type="text"
              placeholder="Search Discount..."
              value={discountSearchText}
              onChange={(e) => handleDiscountSearch(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="box overflow-y-auto w-full">
              <div className="overflow-x-auto border rounded-md ">
                <table className="min-w-full border-collapse border border-gray-300">
                  <TableHeader>
                    <TableRow className="bg-gray-200 h-8">
                      <TableHead className="h-8">Select</TableHead>
                      <TableHead className="h-8">No.</TableHead>
                      <TableHead className="h-8">Discount</TableHead>
                      <TableHead className="h-8">Applied On</TableHead>
                      <TableHead className="h-8">Emp Discount</TableHead>
                      <TableHead className="h-8">Active </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan="5" className="text-center text-blue-500 py-2">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentDiscountData?.length ? (
                      currentDiscountData.map((item, index) => (
                        <TableRow key={index + 1}>
                          <td className="p-2">
                            <input
                              type="checkbox"
                              value={item.discountID}
                              checked={
                                selectedDiscountID
                                  ? selectedDiscountID === item.discountID
                                  : storedDiscount?.discountID === item.discountID
                              }
                              onChange={() => handleDiscountSelection(item.discountID, item)}
                            />
                          </td>
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.discountName}</td>
                          <td className="p-2">{item.appliedOn}</td>
                          <td className="p-2">{item.employeeDiscount}</td>
                          <td className="p-2">{item.isActive}</td>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="6" className="text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setDiscountCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={discountCurrentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {discountCurrentPage} of {totalDiscountPages}
              </span>
              <Button
                onClick={() =>
                  setDiscountCurrentPage((prev) => Math.min(prev + 1, totalDiscountPages))
                }
                disabled={discountCurrentPage === totalDiscountPages}
              >
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button
                className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                onClick={handleApplyDiscount}
                //disabled={!selectedDiscountID}
                disabled={!selectedDiscountID || scannedItemListData?.length === 0}
              >
                Apply
              </Button>
              <Button
                className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
                onClick={toggleApplyDiscountModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Hold Bill' */}
      {showHoldBillModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Hold Bill</h2>
            <input
              type="text"
              placeholder="Search Hold Bill..."
              value={holdBillSearchText}
              onChange={(e) => handleHoldBillSearch(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="box overflow-y-auto w-full">
              <div className="overflow-x-auto border rounded-md ">
                <table className="min-w-full border-collapse border border-gray-300">
                  <TableHeader>
                    <TableRow className="bg-gray-200 h-8">
                      <TableHead className="h-8">Select</TableHead>
                      <TableHead className="h-8">No.</TableHead>
                      <TableHead className="h-8">Hold Bill No.</TableHead>
                      <TableHead className="h-8">Bill Date</TableHead>
                      <TableHead className="h-8">Bill NetPay Amt </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentHoldBillData?.length ? (
                      currentHoldBillData.map((item, index) => (
                        <TableRow key={index + 1}>
                          <td className="p-2">
                            <input
                              type="checkbox"
                              value={item.billID}
                              checked={
                                selectedHoldBillID
                                  ? selectedHoldBillID === item.billID
                                  : storedHoldBill?.billID === item.billID
                              }
                              onChange={() => handleHoldBillSelection(item.billID, item)}
                            />
                          </td>
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.billNo}</td>
                          <td className="p-2">{item.billDate}</td>
                          <td className="p-2">{item.billNetPayableAmt}</td>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="6" className="text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setHoldBillCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={holdBillCurrentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {holdBillCurrentPage} of {totalHoldBillPages}
              </span>
              <Button
                onClick={() =>
                  setHoldBillCurrentPage((prev) => Math.min(prev + 1, totalHoldBillPages))
                }
                disabled={holdBillCurrentPage === totalHoldBillPages}
              >
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button
                className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                onClick={handleApplyHoldBill}
                disabled={!selectedHoldBillID}
              >
                Apply
              </Button>
              <Button
                className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
                onClick={toggleApplyHoldBillModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Recall Bill' */}
      {showRecallBillModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Recall Bill</h2>
            <input
              type="text"
              placeholder="Search Recall Bill..."
              ref={inputRecallBillSearchTextRef}
              value={recallBillSearchText}
              onChange={(e) => handleRecallBillSearch(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="box overflow-y-auto w-full">
              <div className="overflow-x-auto border rounded-md ">
                <table className="min-w-full border-collapse border border-gray-300">
                  <TableHeader>
                    <TableRow className="bg-gray-200 h-8">
                      <TableHead className="h-8">Select</TableHead>
                      <TableHead className="h-8">No.</TableHead>
                      <TableHead className="h-8">Hold Bill No.</TableHead>
                      <TableHead className="h-8">Bill Date</TableHead>
                      <TableHead className="h-8">Bill NetPay Amt</TableHead>
                      <TableHead className="h-8">No. of Items</TableHead>
                      <TableHead className="h-8">Customer Name</TableHead>
                      <TableHead className="h-8">User Name</TableHead>
                      {/* <TableHead className="h-8">Active</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan="8" className="text-center text-blue-500 py-2">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentRecallBillData?.length ? (
                      currentRecallBillData.map((item, index) => (
                        <TableRow key={index + 1}>
                          <td className="p-2">
                            <input
                              type="checkbox"
                              value={item.billID}
                              onChange={() => handleSelectRecallBillCheckboxChange(item.billID)}
                            />
                          </td>
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.billNo}</td>
                          <td className="p-2">{item.billDate}</td>
                          <td className="p-2">{item.billNetPayableAmt}</td>
                          <td className="p-2">{item.totalNoOfItem}</td>
                          <td className="p-2">{item.customerName}</td>
                          <td className="p-2"></td>
                          {/* <td className="p-2">{item.isActive}</td> */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="8" className="text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setRecallBillCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={recallBillCurrentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {recallBillCurrentPage} of {totalRecallBillPages}
              </span>
              <Button
                onClick={() =>
                  setRecallBillCurrentPage((prev) => Math.min(prev + 1, totalRecallBillPages))
                }
                disabled={recallBillCurrentPage === totalRecallBillPages}
              >
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button
                className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                onClick={handleApplyRecallBill}
                disabled={!selectedRecallBillID}
              >
                Recall
              </Button>
              <Button
                className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
                onClick={toggleApplyRecallBillModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Void Bill' */}
      {showVoidBillModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={voidBillModalRef} className="bg-white rounded-lg shadow-lg p-6 w-4/12">
            <h2 className="text-xl font-semibold mb-4">Void Bill</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">
                This is a dummy modal for Void Bill functionality.
              </p>
              <p className="text-sm text-gray-500">
                Future implementation will include bill voiding and cancellation features.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                onClick={toggleVoidBillModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Reprint Bill' */}
      {/* Modal for 'Search Bill' */}
      {showSearchBillModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Search Bill</h2>
            <div className="box overflow-y-auto w-full p-4">
              <div className="overflow-x-auto border rounded-md w-full p-4 space-y-4">
                <div>
                  <label className="font-medium block">Bill Date Between</label>
                  <div className="flex space-x-2">
                    <span>From:</span>{' '}
                    <input
                      type="date"
                      value={searchBillFromDate}
                      onChange={(e) => setSearchBillFromDate(e.target.value)}
                      className="border p-2 rounded-md"
                    />
                    <span>To:</span>{' '}
                    <input
                      type="date"
                      value={searchBillToDate}
                      onChange={(e) => setSearchBillToDate(e.target.value)}
                      className="border p-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium block">Phone Number</label>
                  <input
                    type="text"
                    value={searchBillPhoneNumber}
                    onChange={(e) => setSearchBillPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="border p-2 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="font-medium block">Customer Name</label>
                  <input
                    type="text"
                    value={searchBillCustomerName}
                    onChange={(e) => setSearchBillCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="border p-2 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end items-end">
              <div className="flex gap-6 ">
                <Button
                  onClick={toggleSearchBillModal}
                  className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={toggleSelectBillModal}
                  className={`px-3 text-white rounded-lg shadow-md ${!(searchBillPhoneNumber.trim() || searchBillCustomerName.trim() || (searchBillFromDate && searchBillToDate)) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={
                    !(
                      searchBillPhoneNumber.trim() ||
                      searchBillCustomerName.trim() ||
                      (searchBillFromDate && searchBillToDate)
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

      {/* Modal for 'Search(Select Bill)' */}
      {showSelectBillModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Print Bill</h2>
            <input
              type="text"
              placeholder="Search Bill No..."
              value={selectBillSearchText}
              onChange={(e) => handleSelectBillSearch(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md mb-4"
            />
            <table className="w-full border border-gray-300 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-200 h-8">
                  {/* <TableHead className="h-8">Select</TableHead> */}
                  <TableHead className="h-8">Bill No</TableHead>
                  <TableHead className="h-8">Random Bill No</TableHead>
                  <TableHead className="h-8">Bill Date</TableHead>
                  <TableHead className="h-8">No Of Item</TableHead>
                  <TableHead className="h-8">Amount</TableHead>
                  <TableHead className="h-8">Customer Name</TableHead>
                  <TableHead className="h-8">Print</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center p-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : currentSelectedBill.length ? (
                  currentSelectedBill.map((bill, index) => (
                    <TableRow key={index + 1}>
                      {/* <td className="p-2"><input type="checkbox" value={bill.billID} onChange={() => handleSelectBillCheckboxChange(bill.billID)}/></td> */}
                      <td className="p-2">{bill.billNo}</td>
                      <td className="p-2">{bill.randomBillNo}</td>
                      <td className="p-2">{bill.billDate}</td>
                      <td className="p-2">{bill.totalNoOfItem}</td>
                      <td className="p-2">{bill.billNetPayableAmt}</td>
                      <td className="p-2">{bill.customerName}</td>
                      <td className="p-2">
                        <Printer
                          onClick={() => handleReprintBill_v2(bill)}
                          className="w-5 h-5"
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setSelectBillCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={selectBillCurrentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {selectBillCurrentPage} of {totalSelectBillPages}
              </span>
              <Button
                onClick={() =>
                  setSelectBillCurrentPage((prev) => Math.min(prev + 1, totalSelectBillPages))
                }
                disabled={selectBillCurrentPage === totalSelectBillPages}
              >
                Next
              </Button>
            </div>
            <div className="mt-4 flex justify-end items-end">
              <div className="flex gap-6 ">
                <Button
                  className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
                  onClick={toggleSelectBillModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Clear Promotion' */}
      {showClearPromotionModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={clearPromotionModalRef} className="bg-white rounded-lg shadow-lg p-6 w-4/12">
            <h2 className="text-xl font-semibold mb-4">Clear Promotion</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">
                This is a dummy modal for Clear Promotion functionality.
              </p>
              <p className="text-sm text-gray-500">
                Future implementation will include promotion clearing and removal features.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                onClick={toggleClearPromotionModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Sales Person Tagging' */}
      {showSalesPersonTaggingModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={salesPersonTaggingModalRef} className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden">
            {/* Header */}
            <div className="bg-sky-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">Sales Person Tagging</h2>
              </div>
              <button
                onClick={toggleSalesPersonTaggingModal}
                className="text-white hover:text-sky-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5 text-center">
                Select a tagging mode to assign a sales person
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Bill Wise Tagging */}
                <button
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-sky-200 bg-white hover:bg-sky-50 hover:border-sky-500 hover:shadow-md transition-all duration-200 group"
                  onClick={() => handleOpenSalesPersonSelect('bill')}
                >
                  <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-sky-700">Bill Wise Tagging</span>
                </button>

                {/* Item Wise Tagging */}
                <button
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-sky-200 bg-white hover:bg-sky-50 hover:border-sky-500 hover:shadow-md transition-all duration-200 group"
                  onClick={() => handleOpenSalesPersonSelect('item')}
                >
                  <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-sky-700">Item Wise Tagging</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex justify-end border-t border-sky-100">
              <Button
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white px-5"
                onClick={toggleSalesPersonTaggingModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Sales Person Select' */}
      {/* {showSalesPersonSelectModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={salesPersonSelectModalRef} className="bg-white rounded-2xl shadow-2xl w-[780px] overflow-hidden">
            //Header
            <div className="bg-sky-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">
                  {salesPersonTaggingMode === 'bill' ? 'Bill Wise Tagging' : 'Item Wise Tagging'} — Select Sales Person
                </h2>
              </div>
              <button
                onClick={() => setShowSalesPersonSelectModal(false)}
                className="text-white hover:text-sky-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            //Body
            <div className="p-4">
              {salesPersonListLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                  <span className="ml-3 text-sm text-gray-500">Loading sales persons...</span>
                </div>
              ) : salesPersonList.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No sales persons found.</div>
              ) : (
                <div className="overflow-auto max-h-72">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className=" text-sky-700">
                        <th className="px-3 py-2 text-center font-semibold w-20">Sl No</th>
                        <th className="px-3 py-2 text-left font-semibold">Sales Person Name</th>
                        <th className="px-3 py-2 text-left font-semibold">Employee ID</th>
                        <th className="px-3 py-2 text-left font-semibold">Phone Number</th>
                        <th className="px-3 py-2 text-center font-semibold w-12">Select</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {salesPersonList.map((person, index) => (
                        <tr
                          key={person.salesPersonID}
                          className={`border-b border-gray-100 cursor-pointer transition-colors ${selectedSalesPersonId === person.salesPersonID
                            ? ' border-l-2 border-l-sky-500'
                            : ' '
                            }`}
                          onClick={() => setSelectedSalesPersonId(person.salesPersonID)}
                        >
                          <td className="px-3 py-2.5 text-center text-gray-500">{index + 1}</td>
                          <td className="px-3 py-2.5 text-gray-800 font-medium">
                            {`${person.firstName || ''} ${person.lastName || ''}`.trim() || '—'}
                          </td>
                          <td className="px-3 py-2.5 text-gray-600">{person.employeeID || '—'}</td>
                          <td className="px-3 py-2.5 text-gray-600">{person.mobileNo || '—'}</td>
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="radio"
                              name="salesPersonSelect"
                              checked={selectedSalesPersonId === person.salesPersonID}
                              onChange={() => setSelectedSalesPersonId(person.salesPersonID)}
                              className="accent-sky-600 w-4 h-4 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            //Footer
            <div className="px-6 py-3 flex justify-end gap-2 border-t border-sky-100">
              <Button
                size="sm"
                variant="outline"
                className="border-sky-300 text-sky-700 hover:bg-sky-50 px-5"
                onClick={() => setShowSalesPersonSelectModal(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white px-5"
                onClick={handleConfirmSalesPersonTag}
                disabled={selectedSalesPersonId === null}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )} */}

      {/* Modal 'Sales Person Select' */}
      {showSalesPersonSelectModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={salesPersonSelectModalRef}
            className="bg-white rounded-2xl shadow-2xl w-[780px] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-sky-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">
                  {salesPersonTaggingMode === 'bill'
                    ? 'Bill Wise Tagging'
                    : 'Item Wise Tagging'}{' '}
                  — Select Sales Person
                </h2>
              </div>

              <button
                onClick={() => setShowSalesPersonSelectModal(false)}
                className="text-white hover:text-sky-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="mb-3 flex">
                <Input
                  className="w-72"
                  placeholder="Search Sales Person..."
                  value={salesPersonSearchText}
                  onChange={(e) => handleSalesPersonSearch(e.target.value)}
                />
              </div>

              {salesPersonListLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                  <span className="ml-3 text-sm text-gray-500">
                    Loading sales persons...
                  </span>
                </div>
              ) : filteredSalesPersonList.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No sales persons found.
                </div>
              ) : (
                <>
                  <div className="overflow-auto max-h-72">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-sky-700">
                          <th className="px-3 py-2 text-center w-20">Sl No</th>
                          <th className="px-3 py-2 text-left">
                            Sales Person Name
                          </th>
                          <th className="px-3 py-2 text-left">Employee ID</th>
                          <th className="px-3 py-2 text-left">Phone Number</th>
                          <th className="px-3 py-2 text-center w-12">
                            Select
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {currentSalesPersonData.map((person, index) => (
                          <tr
                            key={person.salesPersonID}
                            className={`border-b border-gray-100 cursor-pointer ${
                              selectedSalesPersonId === person.salesPersonID
                                ? 'border-l-2 border-l-sky-500'
                                : ''
                            }`}
                            onClick={() =>
                              setSelectedSalesPersonId(person.salesPersonID)
                            }
                          >
                            <td className="px-3 py-2.5 text-center">
                              {startSalesPersonIndex + index + 1}
                            </td>

                            <td className="px-3 py-2.5">
                              {`${person.firstName || ''} ${
                                person.lastName || ''
                              }`.trim() || '—'}
                            </td>

                            <td className="px-3 py-2.5">
                              {person.employeeID || '—'}
                            </td>

                            <td className="px-3 py-2.5">
                              {person.mobileNo || '—'}
                            </td>

                            <td className="px-3 py-2.5 text-center">
                              <input
                                type="radio"
                                name="salesPersonSelect"
                                checked={
                                  selectedSalesPersonId ===
                                  person.salesPersonID
                                }
                                onChange={() =>
                                  setSelectedSalesPersonId(
                                    person.salesPersonID
                                  )
                                }
                                className="accent-sky-600 w-4 h-4"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      Page {salesPersonCurrentPage} of{' '}
                      {totalSalesPersonPages || 1}
                    </span>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={salesPersonCurrentPage === 1}
                        onClick={() =>
                          setSalesPersonCurrentPage((prev) => prev - 1)
                        }
                      >
                        Previous
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          salesPersonCurrentPage ===
                          totalSalesPersonPages
                        }
                        onClick={() =>
                          setSalesPersonCurrentPage((prev) => prev + 1)
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex justify-end gap-2 border-t border-sky-100">
              <Button
                size="sm"
                variant="outline"
                className="border-sky-300 text-sky-700 hover:bg-sky-50 px-5"
                onClick={() => setShowSalesPersonSelectModal(false)}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white px-5"
                onClick={handleConfirmSalesPersonTag}
                disabled={selectedSalesPersonId === null}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Clear Discount' */}
      {showClearDiscountModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={clearDiscountModalRef} className="bg-white rounded-lg shadow-lg p-6 w-4/12">
            <h2 className="text-xl font-semibold mb-4">Clear Discount</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">
                This is a dummy modal for Clear Discount functionality.
              </p>
              <p className="text-sm text-gray-500">
                Future implementation will include discount clearing and removal features.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                onClick={toggleClearDiscountModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Item Search' */}
      {/* {showItemSearchModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={itemSearchModalRef} className="bg-white rounded-lg shadow-lg p-6 w-4/12">
            <h2 className="text-xl font-semibold mb-4">Item Search</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">This is a dummy modal for Item Search functionality.</p>
              <p className="text-sm text-gray-500">Future implementation will include item searching and selection features.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300" onClick={toggleItemSearchModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )} */}

      {/* Modal 'Customer Details' */}
      {showCustomerDetailsModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={customerDetailsModalRef} className="bg-white rounded-lg shadow-lg p-6 w-4/12">
            <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">
                This is a dummy modal for Customer Details functionality.
              </p>
              <p className="text-sm text-gray-500">
                Future implementation will include customer information viewing and editing
                features.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                onClick={toggleCustomerDetailsModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Right Section - "Checkout" */}
      {showCheckOutModal && (
        <div
          className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 overflow-y-auto"
          style={{
            transform: showCheckOutModal ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-sm">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Checkout</h2>
                    <p className="text-sky-100 text-xs">Complete your transaction</p>
                  </div>
                </div>
                <button
                  onClick={toggleCheckOutModal}
                  className="p-2 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white p-4">
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-3 bg-white p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-2 bg-sky-500">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium mb-1">Total Bill Amount</p>
                        <input
                          type="text"
                          value={totalBillAmount}
                          className="w-full text-xl font-bold text-gray-800 bg-transparent border-none focus:outline-none"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-2 gap-2">
                  {loading ? (
                    <>Loading...</>
                  ) : (
                    paymentListData
                      .filter(
                        (payment) =>
                          (payment.availablePaymentmethod !== 'creditNoteIssued') &&
                          (hasUnAdjustCreditNote ||
                            !isCreditNoteReceivedPayment(payment.availablePaymentmethod))
                      )
                      .map((payment, index) => {
                        /*
                          const name = payment.paymentModeName?.toLowerCase() || '';
                          const showNoteButton =
                            name.includes('credit card') || name.includes('creditcard') ||
                            name.includes('debit card') || name.includes('debitcard') ||
                            name.includes('paytm') ||
                            name.includes('gpay');
                          const showCNRSelectButton = name.includes('credit note received') || name.includes('creditnotereceived');
                          const showTenderAmtButton = name.includes('cash');
      
                          const isCard = name.includes('credit card') || name.includes('creditcard') || name.includes('debit card') || name.includes('debitcard');
                          const isUPI = name.includes('paytm') || name.includes('gpay');
                          const isCashTenderAmt = name.includes('cash');
                          */
                        const name = payment.availablePaymentmethod?.toLowerCase() || ''
                        const showNoteButton =
                          name.includes('credit card') ||
                          name.includes('creditcard') ||
                          name.includes('debit card') ||
                          name.includes('debitcard') ||
                          name.includes('debit') ||
                          name.includes('mobilewallet') ||
                          name.includes('mobileWallet') ||
                          name.includes('mobile wallet') ||
                          name.includes('paytm') ||
                          name.includes('gpay')
                        const showCNRSelectButton =
                          hasUnAdjustCreditNote &&
                          (name.includes('credit note received') ||
                            name.includes('creditnotereceived'))
                        const showTenderAmtButton = name.includes('cash')

                        const isCard =
                          name.includes('credit card') ||
                          name.includes('creditcard') ||
                          name.includes('debit card') ||
                          name.includes('debitcard') ||
                          name.includes('debit')
                        const isUPI =
                          name.includes('paytm') ||
                          name.includes('gpay') ||
                          name.includes('mobilewallet') ||
                          name.includes('mobileWallet') ||
                          name.includes('mobile wallet')
                        const isCashTenderAmt = name.includes('cash')

                        const PaymentIcon = isCard
                          ? CreditCard
                          : isCashTenderAmt
                            ? Banknote
                            : isUPI
                              ? Smartphone
                              : Wallet

                        return (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white border border-gray-300 rounded">
                                  <PaymentIcon className="w-4 h-4 text-orange-500" />
                                </div>
                                <p className="text-xs font-semibold text-gray-800 truncate">
                                  {payment.paymentModeName}
                                </p>
                              </div>
                              <input
                                type="number"
                                ref={
                                  payment.availablePaymentmethod?.toLowerCase() === 'cash'
                                    ? inputCheckOutCashRef
                                    : null
                                }
                                value={
                                  payment.availablePaymentmethod === 'Credit Note Received' ||
                                    payment.availablePaymentmethod?.toLowerCase() ===
                                    'credit note received' ||
                                    payment.availablePaymentmethod?.includes(
                                      'credit note received'
                                    ) ||
                                    payment.availablePaymentmethod?.includes('creditnotereceived')
                                    ? totalUsedAmount
                                    : payment.amount || ''
                                }
                                onChange={(e) =>
                                  handleCheckoutPaymentAmountChange(index, e.target.value)
                                }
                                onKeyDown={(e) => {
                                  const isCreditNote = payment.availablePaymentmethod
                                    ?.toLowerCase()
                                    .replace(/\s+/g, '')
                                    .includes('creditnotereceived')
                                  if (isCreditNote && e.key === 'Tab' && !e.shiftKey) {
                                    e.preventDefault()
                                    inputTenderAmountRef.current?.focus()
                                  }
                                }}
                                className="w-full p-1.5 text-sm border-2 border-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 font-semibold"
                                disabled={
                                  payment.availablePaymentmethod?.toLowerCase() === 'cash' ||
                                  payment.availablePaymentmethod?.toLowerCase() ===
                                  'creditnotereceived'
                                }
                              />
                              <div className="flex gap-1">
                                {showNoteButton && (
                                  <Button
                                    className="bg-sky-500 text-white px-1.5 py-0.5 text-[10px] hover:bg-sky-600 whitespace-nowrap shadow-sm flex-1"
                                    onClick={() => toggleNoteField(index)}
                                    tabIndex={-1}
                                  >
                                    <FileText className="w-2.5 h-2.5 mr-0.5 inline" />
                                    {isCard
                                      ? 'Note ( ALT + B )'
                                      : isUPI
                                        ? 'Note ( ALT + M )'
                                        : 'Note'}
                                  </Button>
                                )}
                                {showCNRSelectButton && (
                                  <Button
                                    className="bg-sky-500 text-white px-1.5 py-0.5 text-[10px] hover:bg-sky-600 whitespace-nowrap shadow-sm flex-1"
                                    onClick={() => handleCNReceivedClick()}
                                    tabIndex={-1}
                                  >
                                    <Receipt className="w-2.5 h-2.5 mr-0.5 inline" />
                                    Select ( ALT + V )
                                  </Button>
                                )}
                                {/* {showTenderAmtButton && (
                                <Button
                                  className="bg-sky-500 text-white px-1.5 py-0.5 text-[10px] hover:bg-sky-600 whitespace-nowrap shadow-sm flex-1"
                                  onClick={() => toggleTenderAmtField(index)}
                                  tabIndex={-1}
                                >
                                  <Banknote className="w-2.5 h-2.5 mr-0.5 inline" />
                                  Tender Amount
                                </Button>
                              )} */}
                              </div>
                            </div>

                            {payment.showNote && (
                              <div className="mt-1 pt-1 border-t border-sky-100">
                                {isCard && (
                                  <div className="flex flex-col gap-0.5">
                                    <label className="text-[10px] font-medium text-gray-700">
                                      <CreditCard className="w-2.5 h-2.5 inline mr-0.5" />
                                      Card No:
                                    </label>
                                    <input
                                      type="number"
                                      value={payment.cardNo || ''}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        if (value.length <= 50) {
                                          handlePaymentNoteChange(index, 'cardNo', value)
                                        }
                                      }}
                                      className="w-full p-1 text-xs border-2 border-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400"
                                    />
                                  </div>
                                )}
                                {isUPI && (
                                  <div className="flex flex-col gap-0.5">
                                    <label className="text-[10px] font-medium text-gray-700">
                                      <Smartphone className="w-2.5 h-2.5 inline mr-0.5" />
                                      Trans/Ref:
                                    </label>
                                    <input
                                      type="number"
                                      value={payment.transactionID || ''}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        if (value.length <= 50) {
                                          handlePaymentNoteChange(index, 'transactionID', value)
                                        }
                                      }}
                                      className="w-full p-1 text-xs border-2 border-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            {/* {isCashTenderAmt && payment.showTenderAmt && ( */}
                            {isCashTenderAmt && (
                              <div className="mt-1 pt-1 border-t border-sky-100 space-y-1">
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[10px] font-medium text-gray-700">
                                    <Banknote className="w-2.5 h-2.5 inline mr-0.5" />
                                    Tender:
                                  </label>
                                  <input
                                    ref={inputTenderAmountRef}
                                    type="number"
                                    value={payment.tenderAmount || ''}
                                    onChange={(e) =>
                                      handlePaymentNoteChange(index, 'tenderAmount', e.target.value)
                                    }
                                    className="w-full p-1 text-xs border-2 border-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-900 focus:border-rose-900"
                                  />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[10px] font-medium text-gray-700">
                                    <DollarSign className="w-2.5 h-2.5 inline mr-0.5" />
                                    Refund:
                                  </label>
                                  <input
                                    type="number"
                                    value={payment.refundAmount || ''}
                                    disabled
                                    className="w-full p-1 text-xs border-2 border-sky-200 bg-sky-50/50 text-gray-600"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })
                  )}

                  {/* Coupon Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-white border border-gray-300 rounded">
                        <Tag className="w-4 h-4 text-orange-500" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">Coupon Code</h3>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">
                          Enter Coupon ( ALT + L )
                        </label>
                        <input
                          ref={inputCouponCodeRef}
                          type="text"
                          value={coupon1Code}
                          onChange={(e) => setCoupon1Code(e.target.value)}
                          className="w-full p-2 text-sm border-2 border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                          placeholder="Enter coupon code"
                          tabIndex={-1}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          className={`px-3 py-2 text-xs shadow-md ${isCouponApplied
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : coupon1Code && totalBillAmount >= 1000
                              ? 'bg-sky-500 text-white hover:bg-sky-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          disabled={isCouponApplied || !(coupon1Code && totalBillAmount >= 1000)}
                          onClick={handleApplyCoupon}
                        >
                          {isCouponApplied ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 inline" />
                              Applied
                            </>
                          ) : (
                            <>
                              <Tag className="w-3 h-3 mr-1 inline" />
                              Apply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex items-center gap-2 border p-3 rounded-lg shadow-sm">
                            <p className="font-normal">Coupon 1:</p>
                            <input
                              type="text"
                              value={coupon1Code}
                              onChange={(e) => setCoupon1Code(e.target.value)}
                              className="w-20 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </div>
                          <div className="flex items-center gap-2 border p-3 rounded-lg shadow-sm">
                            <p className="font-normal">Coupon 2:</p>
                            <input
                              type="text"
                              value={coupon2Code}
                              onChange={(e) => setCoupon2Code(e.target.value)}
                              className="w-20 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </div>
                        </div> */}

                  {/* {paymentListData.map((payment, index) => {
                          const name = payment.paymentModeName?.toLowerCase() || '';
                          const showNoteButton =
                            name.includes('credit card') || name.includes('creditcard') ||
                            name.includes('debit card') || name.includes('debitcard') ||
                            name.includes('paytm') ||
                            name.includes('gpay');
      
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
                        })} */}

                  {/* 
                        <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                          <p className="font-normal w-1/3 min-w-[120px]">Cash:</p>
                          <div className="flex flex-1 gap-2">
                            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                              Tender Amount
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                          <p className="font-normal w-1/3 min-w-[120px]">Credit Card:</p>
                          <div className="flex flex-1 gap-2">
                            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                              Credit Card Details
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                          <p className="font-normal w-1/3 min-w-[120px]">Credit Note Issued:</p>
                          <div className="flex flex-1 gap-2">
                            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                              Adjust Credit Note
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                          <p className="font-normal w-1/3 min-w-[120px]">Debit Note:</p>
                          <div className="flex flex-1 gap-2">
                            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                              Adjust Debit Note
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                          <p className="font-normal w-1/3 min-w-[120px]">PayTM:</p>
                          <div className="flex flex-1 gap-2">
                            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                              Authorization No.
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                          <p className="font-normal w-1/3 min-w-[120px]">Gpay:</p>
                          <div className="flex flex-1 gap-2">
                            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                              Authorization No.
                            </Button>
                          </div>
                        </div>  
                        */}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 p-3 mt-auto">
              <div className="flex justify-center items-center gap-3">
                <Button
                  className="bg-gray-400 text-white px-4 py-2 text-sm hover:bg-gray-500 shadow-sm"
                  onClick={toggleCheckOutModal}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>

                <div className="flex-1 max-w-xs">
                  <div className="bg-gray-50 p-2 border border-gray-200 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-sky-600" />
                          Total Paid:
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          ₹{totalPaidAmount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-rose-900 font-medium flex items-center gap-1">
                          <Receipt className="w-3 h-3 text-rose-900" />
                          Total Due:
                        </span>
                        <span className="text-sm font-bold text-rose-900">
                          ₹{totalDueAmount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-rose-900 font-medium flex items-center gap-1">
                          {/* <Total className="w-3 h-3 text-rose-900" /> */}
                          Total Qty:
                        </span>
                        <span className="text-sm font-bold text-rose-900">
                          {scannedItemListData?.reduce(
                            (sum, item) => sum + (parseInt(item.quantity) || 0),
                            0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveBill}
                  className={`px-4 py-2 text-sm shadow-md text-white ${totalBillAmount > 0
                    ? 'bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  disabled={totalBillAmount === 0 || isBtnSaving}
                >
                  {isBtnSaving ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin mr-1 inline-block" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Save (ALT + S)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* //! New Checkout Form as per sir instruction on 30-10-2025  */}
      {/* Checkout Panel - Slides in from right */}
      {showCheckout2 && (
        <div
          className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 overflow-y-auto"
          style={{
            transform: showCheckout2 ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-2xl font-bold">Quick Checkout</h2>
                  <p className="text-blue-100 text-sm">Fast & Simple Payment</p>
                </div>
                <button
                  onClick={toggleCheckout2}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Bill Amount - From API (Disabled) */}
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-slate-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="font-semibold text-slate-700">Bill Amount</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">₹{totalBillAmount || 0}</div>
                    <div className="text-xs text-slate-500">Total Due</div>
                  </div>
                </div>
              </div>

              {/* Cash Amount - Auto calculated (Disabled) */}
              <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="font-semibold text-amber-700">Cash</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-amber-800">
                      ₹
                      {(() => {
                        const billAmt = parseFloat(totalBillAmount) || 0
                        const card = parseFloat(checkout2CardAmount) || 0
                        const phonePay = parseFloat(checkout2PhonePayAmount) || 0
                        const crNote = parseFloat(checkout2CrNoteAdj) || 0
                        const cash = billAmt - card - phonePay - crNote
                        return cash > 0 ? cash.toFixed(2) : '0.00'
                      })()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-amber-600 mt-2 bg-amber-100 p-2 rounded-lg">
                  Auto-calculated: Bill - Card - PhonePay - Cr.Note
                </div>
              </div>

              {/* Tender Amount - Entered by User */}
              <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="font-semibold text-red-700">Tender Amount</span>
                  </div>
                  <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Required</div>
                </div>
                <input
                  type="number"
                  value={checkout2TenderAmount}
                  onChange={(e) => setCheckout2TenderAmount(e.target.value)}
                  className="w-full p-3 text-right text-xl font-semibold border-2 border-red-200 rounded-lg focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200"
                  placeholder="1200.00"
                />
              </div>

              {/* Refund Amount - Auto calculated (Disabled) */}
              <div className="bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="font-semibold text-emerald-700">Refund Amount</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-800">
                      ₹
                      {(() => {
                        const tender = parseFloat(checkout2TenderAmount) || 0
                        const billAmt = parseFloat(totalBillAmount) || 0
                        const card = parseFloat(checkout2CardAmount) || 0
                        const phonePay = parseFloat(checkout2PhonePayAmount) || 0
                        const crNote = parseFloat(checkout2CrNoteAdj) || 0
                        const cash = billAmt - card - phonePay - crNote
                        const refund = tender - cash
                        return refund > 0 ? refund.toFixed(2) : '0.00'
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card - Entered by User */}
              <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="font-semibold text-purple-700">Card Payment</span>
                  </div>
                  <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    Optional
                  </div>
                </div>
                <input
                  type="number"
                  value={checkout2CardAmount}
                  onChange={(e) => setCheckout2CardAmount(e.target.value)}
                  className="w-full p-3 text-right text-xl font-semibold border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                  placeholder="0.00"
                />
              </div>

              {/* PhonePay - Entered by User */}
              <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span className="font-semibold text-indigo-700">PhonePay/UPI</span>
                  </div>
                  <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                    Optional
                  </div>
                </div>
                <input
                  type="number"
                  value={checkout2PhonePayAmount}
                  onChange={(e) => setCheckout2PhonePayAmount(e.target.value)}
                  className="w-full p-3 text-right text-xl font-semibold border-2 border-indigo-200 rounded-lg focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                  placeholder="0.00"
                />
              </div>

              {/* Cr. Note Adj - From API (Disabled) */}
              {checkout2CrNoteAdj > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="font-semibold text-blue-700">Credit Note Adj.</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-800">₹{checkout2CrNoteAdj}</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 mt-2 bg-blue-100 p-2 rounded-lg">
                    Applied from pending credit notes
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                  onClick={toggleCheckout2}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout2SaveBill}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={totalBillAmount === 0 || isBtnSaving}
                >
                  {isBtnSaving ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Bill'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItemIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeleteItemIndex(null)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDeleteItem}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Image Viewer' */}
      {showImageModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={imageModalRef} className="bg-white rounded-lg shadow-lg p-6 w-6/12 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Product Image</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              {selectedImageItem ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <div className="text-6xl mb-2">📷</div>
                        <p className="text-gray-600">No Image Available</p>
                        <p className="text-sm text-gray-500">
                          Product: {selectedImageItem.itemName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Barcode: {selectedImageItem.barCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left bg-white p-4 rounded border">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Item Name:</p>
                      <p className="text-lg">{selectedImageItem.itemName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Barcode:</p>
                      <p className="text-lg">{selectedImageItem.barCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">MRP:</p>
                      <p className="text-lg">₹{selectedImageItem.mrp}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Selling Price:</p>
                      <p className="text-lg">₹{selectedImageItem.retailPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Quantity:</p>
                      <p className="text-lg">{selectedImageItem.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Amount:</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{selectedImageItem.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No product selected</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                onClick={() => setShowImageModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 'Item List' */}
      {showItemList && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Item List</h2>
            <input
              type="text"
              placeholder="Search Item..."
              value={itemSearchText}
              ref={inputItemListSearchTextRef}
              onChange={(e) => handleItemSearch(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="box overflow-y-auto w-full">
              <div className="overflow-x-auto border rounded-md w-full">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 h-8">
                      <th className="h-8 px-3 py-2 border">No.</th>
                      <th className="h-8 px-3 py-2 border">Barcode</th>
                      <th className="h-8 px-3 py-2 border">Item Name</th>
                      <th className="h-8 px-3 py-2 border">MRP</th>
                      <th className="h-8 px-3 py-2 border">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center text-blue-500 py-2">
                          Loading...
                        </td>
                      </tr>
                    ) : currentItemData?.length ? (
                      currentItemData.map((item, index) => (
                        <tr
                          key={index + 1}
                          className="cursor-pointer hover:bg-red-100"
                        //onClick={() => handleSelectItem(item.itemCode)}
                        >
                          <td className="px-3 py-2 border">{index + 1}</td>
                          <td className="px-3 py-2 border">{item.barCode}</td>
                          <td className="px-3 py-2 border">{item.itemName}</td>
                          <td className="px-3 py-2 border">{item.mrp}</td>
                          <td className="px-3 py-2 border">{item.stock}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-2">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setItemCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={itemCurrentPage === 1}
                className="transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-md"
              >
                Previous
              </Button>
              <span>
                Page {itemCurrentPage} of {totalItemPages}
              </span>
              <Button
                onClick={() => setItemCurrentPage((prev) => Math.min(prev + 1, totalItemPages))}
                disabled={itemCurrentPage === totalItemPages}
                className="transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-md"
              >
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button
                className="px-3 bg-gray-600 text-white hover:text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-lg"
                onClick={() => setShowItemList(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* //! New Item Search Modal as per sir instruction on 14-11-2025  */}
      {showItemList2 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={handleItemNewSearchClear}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-6xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-2xl px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className=" bg-opacity-20 p-2 rounded-lg">
                    <SearchIcon className="h-6 w-6 " />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Advanced Item Search</h2>
                    <p className="text-indigo-100 text-sm">Search by item name or barcode</p>
                  </div>
                </div>
                <Button
                  className=" bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-lg transition-all duration-200 p-2"
                  onClick={handleItemNewSearchClear}
                >
                  <XIcon className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Search Section */}
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b">
              <div className="flex gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Enter item name..."
                    value={itemNewSearchText}
                    onChange={(e) => setItemNewSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNewItemSearch()}
                    className="pl-10 pr-4 py-6 text-base border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Enter barcode..."
                    value={itemSearchBarcode}
                    onChange={(e) => setItemSearchBarcode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNewItemSearch()}
                    className="pl-10 pr-4 py-6 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>

                <Button
                  aria-label="Search"
                  className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  onClick={handleNewItemSearch}
                >
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>

              {/* //! Search Stock Online Section - 19/01/2026 */}
              <div className="flex gap-3 max-w-4xl mx-auto mt-4 pt-4 border-t border-gray-200">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Enter item code for stock search..."
                    value={searchStockOnlineItemCode}
                    onChange={(e) => setSearchStockOnlineItemCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchStockOnline()}
                    className="pl-10 pr-4 py-6 text-base border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <Button
                  aria-label="Search Stock Online"
                  className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  onClick={handleSearchStockOnline}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Stock Online
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className=" text-indigo-700 px-3 py-1 rounded-full text-sm mr-2">
                    {itemNewSearchResults?.length || 0}
                  </span>
                  Search Results
                </h3>
              </div>

              {itemNewSearchResults && itemNewSearchResults.length > 0 ? (
                <div className="overflow-hidden rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 z-10">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-white font-semibold py-4 px-4">
                            Item Name
                          </TableHead>
                          <TableHead className="text-white font-semibold py-4 px-4">
                            Barcode
                          </TableHead>
                          <TableHead className="text-right text-white font-semibold py-4 px-4">
                            MRP (Master)
                          </TableHead>
                          <TableHead className="text-right text-white font-semibold py-4 px-4">
                            MRP (Stock)
                          </TableHead>
                          <TableHead className="text-right text-white font-semibold py-4 px-4">
                            Stock Qty
                          </TableHead>
                          <TableHead className="text-right text-white font-semibold py-4 px-4">
                            POS Barcode
                          </TableHead>
                          <TableHead className="text-right text-white font-semibold py-4 px-4">
                            ENV Barcode
                          </TableHead>
                          <TableHead className="text-right text-white font-semibold py-4 px-4">
                            Old Barcode
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemNewSearchResults.map((item, index) => (
                          <TableRow
                            key={item.itemCode}
                            className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 cursor-pointer`}
                          >
                            <TableCell className="font-medium text-gray-900 py-4 px-4">
                              {item.itemName}
                            </TableCell>
                            <TableCell className="text-gray-700 py-4 px-4">
                              {item.barCode}
                            </TableCell>
                            <TableCell className="text-right text-gray-700 py-4 px-4 font-medium">
                              ₹{item.mrpMaster}
                            </TableCell>
                            <TableCell className="text-right text-gray-700 py-4 px-4 font-medium">
                              ₹{item.mrpStock}
                            </TableCell>
                            <TableCell className="text-right py-4 px-4">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${item.stockQty > 10
                                  ? ' text-green-800'
                                  : item.stockQty > 0
                                    ? ' text-yellow-800'
                                    : ' text-red-800'
                                  }`}
                              >
                                {item.stockQty}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-gray-600 py-4 px-4">
                              {item.posBarCode}
                            </TableCell>
                            <TableCell className="text-right text-gray-600 py-4 px-4">
                              {item.envBarcode}
                            </TableCell>
                            <TableCell className="text-right text-gray-600 py-4 px-4">
                              {item.oldBarCode}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try searching with different keywords or barcode. Make sure you've entered the
                    correct information.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Press{' '}
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    Enter
                  </kbd>{' '}
                  to search
                </p>
                <Button
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-200"
                  onClick={handleItemNewSearchClear}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* //! New Checkout Form as per sir instruction on 15-11-2025 */}
      {checkoutModalTry && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClearAllTry}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-7/12 max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-4">New Checkout Form</h2>
                <Button
                  className="mb-4 px-3 bg-red-600 text-white hover:text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-lg"
                  onClick={handleClearAllTry}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex gap-4">
                <Label className="mb-6 font-bold w-40 mt-2">Total Bill Amount: </Label>
                <Input
                  type="number"
                  placeholder="Total Bill Amount"
                  value={totalBillAmttry}
                  onChange={(e) => setTotalBillAmttry(e.target.value)}
                  className="mb-2 w-30"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="mb-6 font-bold w-40 mt-2">Cash: </Label>
                <Input
                  type="number"
                  placeholder="Cash"
                  value={cashTry}
                  onChange={(e) => setCashTry(e.target.value)}
                  className="mb-2 w-30"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="mb-6 font-bold w-40 mt-2">Card Sale: </Label>
                <Input
                  type="number"
                  placeholder="Card Sale"
                  value={cardSaleTry}
                  onChange={(e) => setCardSaleTry(e.target.value)}
                  className="mb-2 w-30"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="mb-6 font-bold w-40 mt-2">PhonePay Sale: </Label>
                <Input
                  type="number"
                  placeholder="PhonePay Sale"
                  value={uipSaleTry}
                  onChange={(e) => setUipSaleTry(e.target.value)}
                  className="mb-2 w-30"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="mb-6 font-bold w-40 mt-2">Credit Note Adj: </Label>
                <Input
                  type="number"
                  placeholder="Credit Note Adj"
                  value={creditNoteTry}
                  onChange={(e) => setCreditNoteTry(e.target.value)}
                  className="mb-2 w-30"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="mb-6 font-bold w-40 mt-2">Coupon: </Label>
                <Input
                  type="text"
                  placeholder="Coupon"
                  value={couponTry}
                  onChange={(e) => setCouponTry(e.target.value)}
                  className="mb-2 w-30"
                />
                <Button
                  variant="outline"
                  className="mb-2 w-30 bg-sky-600 hover:bg-sky-700 hover:text-white text-white"
                >
                  Apply Coupon
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button className="mb-2 w-30" onClick={handleClearAllTry}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="mb-2 w-30 bg-sky-600 hover:bg-sky-700 hover:text-white text-white"
                  onClick={toggleCheckoutTry}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Popup Modal */}
      {showWarningPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="h-10 w-10 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Warning!</h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{warningMessage}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setShowWarningPopup(false)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  OK
                </Button>
                <Button
                  onClick={() => setShowWarningPopup(false)}
                  variant="outline"
                  className="px-8 py-3 font-semibold text-lg rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 'Credit Note Received' Modal */}
      {showCNReceivedModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-8/12">
            <h2 className="text-xl font-semibold mb-4">Credit Note</h2>
            <input
              type="text"
              placeholder="Search CN..."
              value={cNReceivedSearchText}
              onChange={(e) => handleCNReceivedSearch(e.target.value)}
              className="w-60 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="overflow-y-auto max-h-96">
              <div className="overflow-x-auto border rounded-md w-full">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-200 h-10 text-left">
                      <th className="border px-2">Select</th>
                      <th className="border px-2">CN No.</th>
                      <th className="border px-2">CN Date</th>
                      <th className="border px-2">Customer Name</th>
                      <th className="border px-2 text-right">Amount</th>
                      <th className="border px-2 text-right">Due Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center text-blue-500 py-2">
                          Loading...
                        </td>
                      </tr>
                    ) : currentCNReceivedData?.length ? (
                      currentCNReceivedData.map((item, index) => {
                        const cnWithApplied = getCNUsedAndDue(
                          selectedCNReceivedList,
                          totalBillAmount
                        ).find((cn) => cn.billID === item.billID)
                        const used = cnWithApplied?.usedAmount || 0
                        const due = cnWithApplied ? cnWithApplied.dueAmount : item.amount

                        return (
                          <tr key={index} className="h-10">
                            <td className="border px-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedCNReceivedList.some(
                                  (cn) => cn.billID === item.billID
                                )}
                                onChange={() => handleCNReceivedSelection(item.billID, item)}
                              />
                            </td>
                            <td className="border px-2">{item.billNo}</td>
                            <td className="border px-2">{item.billDate.split(' ')[0]}</td>
                            <td className="border px-2">
                              {`${storedCustomer?.customerFirstName || ''} ${storedCustomer?.customerMiddleName || ''} ${storedCustomer?.customerLastName || ''}`.trim()}
                            </td>
                            <td className="border px-2 text-right">{item.amount}</td>
                            <td className="border px-2 text-right">{due}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCNReceivedCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={cNReceivedCurrentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {cNReceivedCurrentPage} of {totalCNReceivedPages}
              </span>
              <Button
                onClick={() =>
                  setCNReceivedCurrentPage((prev) => Math.min(prev + 1, totalCNReceivedPages))
                }
                disabled={cNReceivedCurrentPage === totalCNReceivedPages}
              >
                Next
              </Button>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <Button
                className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleApplyCNReceived}
                disabled={selectedCNReceivedList.length === 0}
              >
                Apply
              </Button>
              {/* <Button className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={toggleCNReceivedModal}> */}
              {/* setPaymentListData(prev =>prev.map(payment =>payment.availablePaymentmethod === "creditnotereceived" ? { ...payment, amount: "" } : payment)); */}
              {/* <Button className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={() => {toggleCNReceivedModal(); setStoredCNReceived(null); setSelectedCNReceivedList([]); }}> */}
              <Button
                className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={handleClearAndCloseCNReceived}
              >
                Clear & Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* //! Search Stock Online Modal - 19/01/2026 */}
      {showSearchStockOnlineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Search Stock Online</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleSearchStockOnlineModal()
                  setSearchStockOnlineItemCode('') // Clear item code on close
                }}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {stockOnlineLoading ? (
                /* //! Loading State - 19/01/2026 */
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading stock data...</p>
                </div>
              ) : stockOnlineData.length > 0 ? (
                /* //! Item Information - Dynamic Data from API - 19/01/2026 */
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Item Code</label>
                      <div className="mt-1 px-3 py-2 bg-white border rounded text-sm font-semibold">
                        {stockOnlineData[0]?.itemCode || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Item Name</label>
                      <div className="mt-1 px-3 py-2 bg-white border rounded text-sm font-semibold">
                        {stockOnlineData[0]?.itemName || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* //! Store-wise Stock Table - Dynamic Data from API */}
                  <div className="mt-4">
                    <Table className="text-sm">
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead className="font-semibold text-gray-700">Store Name</TableHead>
                          <TableHead className="font-semibold text-gray-700">Warehouse</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">Stock Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* //! Dynamic Store Data from API - 19/01/2026 */}
                        {stockOnlineData.map((store, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{store.storeName}</TableCell>
                            <TableCell className="text-gray-600 text-xs">{store.whsName}</TableCell>
                            <TableCell className={`text-right font-semibold ${store.onHand > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {store.onHand}
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* //! Total Stock Row - 19/01/2026 */}
                        <TableRow className="bg-gray-50 border-t-2">
                          <TableCell className="font-bold text-gray-800" colSpan={2}>Total Stock</TableCell>
                          <TableCell className="text-right font-bold text-blue-600 text-lg">
                            {stockOnlineData.reduce((total, store) => total + (store.onHand || 0), 0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                /* //! No Data State - 19/01/2026 */
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No stock data available</p>
                  <p className="text-gray-400 text-sm">Try searching with a different item code</p>
                </div>
              )}

              {/* //! Close Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    toggleSearchStockOnlineModal()
                    setSearchStockOnlineItemCode('') // Clear item code on close
                  }}
                  className="w-32 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  )
}

export default BillingRequest2


//! Main Billing Updated Page => 29-05-2026 after updated recall bill customer tagging