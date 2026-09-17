import React, { useEffect, useState, useRef } from 'react'
import { Blinds, ChartSpline, DiamondPercent, ShoppingBag, Stamp, TextSearch, TicketX,  } from 'lucide-react';
import { Zap, Keyboard, Search, ShoppingCart, User, PauseCircle, RefreshCcw, Printer, PercentCircle, Tag, X } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import TootlTipWrapper from '@/components/TootlTipWrapper';
import { Link } from "react-router-dom";
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { GetAPI,PostAPI } from '../../../../../../services/apiCall';

const BillingRequest = () => {
  //const today = new Date().toLocaleDateString('en-GB').split('/').join('-'); //new Date().toISOString().split('T')[0];
  const [today, setToday] = useState("");
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };
  //console.log(cookies, cookies.DefaultStoreId)
  //console.log("Cookies from document.cookie:", document.cookie);

  /*const [itemCurrentPage, setItemCurrentPage] = useState(1);
  const itemsPerPage = 3;*/
  const [itemSearchText, setItemSearchText] = useState("");
  const [itemListData, setItemListData] = useState([]);
  const [filteredItemData, setFilteredItemData] = useState([]);
  const [itemCurrentPage, setItemCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false); 
  /*const [customerCurrentPage,setCustomerCurrentPage] = useState(1);
  const customerPerPage = 1;*/
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [customerListData, setCustomerListData] = useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = useState([]);
  const [customerCurrentPage, setCustomerCurrentPage] = useState(1);
  const customerPerPage = 5; 
  const [selectedCustomerID, setSelectedCustomerID] = useState(null);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [storedCustomer, setStoredCustomer] = useState(null); 
  const [customerSaveData, setCustomerSaveData] = useState({
    customerFirstName: "",
    customerMiddleName: "",
    customerLastName: "",
    mobile: "",
    whatsAppNo: "",
  });  
  const [customerErrors, setCustomerErrors] = useState({});

  /*const [promotionCurrentPage,setPromotionCurrentPage] = useState(1);
  const promotionPerPage = 1;*/
  const [promotionSearchText, setPromotionSearchText] = useState("");
  const [promotionListData, setPromotionListData] = useState([]);
  const [filteredPromotionData, setFilteredPromotionData] = useState([]);
  const [promotionCurrentPage, setPromotionCurrentPage] = useState(1);
  const promotionPerPage = 5;
  const [selectedPromotionID, setSelectedPromotionID] = useState(null);
  const [selectedPromotionData, setSelectedPromotionData] = useState(null);
  const [storedPromotion, setStoredPromotion] = useState(null);
  /*const [discountCurrentPage,setDiscountCurrentPage] = useState(1);
  const discountPerPage = 1;*/
  const [discountSearchText, setDiscountSearchText] = useState("");
  const [discountListData, setDiscountListData] = useState([]);
  const [filteredDiscountData, setFilteredDiscountData] = useState([]);
  const [discountCurrentPage, setDiscountCurrentPage] = useState(1);
  const discountPerPage = 5;
  const [selectedDiscountID, setSelectedDiscountID] = useState(null);
  const [selectedDiscountData, setSelectedDiscountData] = useState(null);
  const [storedDiscount, setStoredDiscount] = useState(null);
  
  const [holdBillSearchText, setHoldBillSearchText] = useState('');
  const [holdBillListData, setHoldBillListData] = useState([]);
  const [filteredHoldBillData, setFilteredHoldBillData] = useState([]);
  const [holdBillCurrentPage, setHoldBillCurrentPage] = useState(1);
  const holdBillPerPage = 5;
  const [selectedHoldBillID, setSelectedHoldBillID] = useState(null);
  const [selectedHoldBillData, setSelectedHoldBillData] = useState(null);
  const [storedHoldBill, setStoredHoldBill] = useState(null);

  const [recallBillSearchText, setRecallBillSearchText] = useState('');
  const [recallBillListData, setRecallBillListData] = useState([]);
  const [filteredRecallBillData, setFilteredRecallBillData] = useState([]);
  const [recallBillCurrentPage, setRecallBillCurrentPage] = useState(1);
  const recallBillPerPage = 5;
  const [selectedRecallBillID, setSelectedRecallBillID] = useState(null);
  const [selectedRecallBillData, setSelectedRecallBillData] = useState([]);
  const [storedRecallBill, setStoredRecallBill] = useState(null);

  const [cNReceivedSearchText, setCNReceivedSearchText] = useState("");
  const [cNReceivedListData, setCNReceivedListData] = useState([]);
  const [filteredCNReceivedData, setFilteredCNReceivedData] = useState([]);
  const [cNReceivedCurrentPage, setCNReceivedCurrentPage] = useState(1);
  const cNReceivedPerPage = 5;
  const [selectedCNReceivedID, setSelectedCNReceivedID] = useState(null);
  const [selectedCNReceivedData, setSelectedCNReceivedData] = useState(null);
  const [storedCNReceived, setStoredCNReceived] = useState(null);
  const [selectedCNReceivedList, setSelectedCNReceivedList] = useState([]);

  const [isCheckoutSaveModalOpen, setIsCheckoutSaveModalOpen] = useState(false);
  const [checkoutSaveBillDocNum, setCheckoutSaveBillDocNum] = useState(null);
  const [checkoutSaveBillDocEntry, setCheckoutSaveBillDocEntry] = useState(null);
  const [checkoutSaveBillType, setCheckoutSaveBillType] = useState(null);

  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showTagCustomerModal, setShowTagCustomerModal] = useState(false);
  const [showApplyPromoModal, setShowApplyPromoModal] = useState(false);
  const [showApplyDiscountModal, setShowApplyDiscountModal] = useState(false);
  const [showHoldBillModal, setShowHoldBillModal] = useState(false);
  const [showRecallBillModal, setShowRecallBillModal] = useState(false);
  const [showCNReceivedModal, setShowCNReceivedModal] = useState(false);

  const [showItemList, setShowItemList] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPosOrder, setShowPosOrder] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [showCashDrawerIn, setShowCashDrawerIn] = useState(false);
  const [showCashDrawerOut, setShowCashDrawerOut] = useState(false);
  const [showSearchBillModal, setShowSearchBillModal] = useState(false);
  const [showSelectBillModal, setShowSelectBillModal] = useState(false);
  

  const [scannedItemListData, setScannedItemListData] = useState([]);
  const [prevScannedItemListData, setPrevScannedItemListData] = useState([]); 
  const [deleteItemIndex, setDeleteItemIndex] = useState(null);

  //const [itemListData, setItemListData] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  //const [customerListData, setCustomerListData] = useState([]);
  //const [promotionListData, setPromotionListData] = useState([]);
  //const [discountListData, setDiscountListData] = useState([]);
  const [paymentListData, setPaymentListData] = useState([]);

  const [barCodeInput, setBarCodeInput] = useState('');

  const inputRecallBillSearchTextRef = useRef(null);
  const inputCustomerSearchTextRef = useRef(null);
  const inputCustomerSaveDataMobileRef = useRef(null);
  const inputBarCodeRef = useRef(null);
  const inputCheckOutCashRef = useRef(null);
  const inputItemListSearchTextRef = useRef(null);

  const [isBtnSaving, setIsBtnSaving] = useState(false);

  const [searchBillFromDate, setSearchBillFromDate] = useState("");
  const [searchBillToDate, setSearchBillToDate] = useState("");
  const [searchBillPhoneNumber, setSearchBillPhoneNumber] = useState("");
  const [searchBillCustomerName, setSearchBillCustomerName] = useState("");

  const [selectBillSearchText, setSelectBillSearchText] = useState('');
  const [selectBillListData, setSelectBillListData] = useState([]);
  const [filteredSelectBillData, setFilteredSelectBillData] = useState([]);
  const [selectBillCurrentPage, setSelectBillCurrentPage] = useState(1);
  const selectBillPerPage = 5;
  // const [selectedBillID, setSelectedBillID] = useState(null);
  // const [selectedBillData, setSelectedBillData] = useState(null);
  // const [storedSelectedBill, setStoredSelectedBill] = useState(null);

  // const [selectedBillDetailsData, setSelectedBillDetailsData] = useState(null);

  const [coupon1Code, setCoupon1Code] = useState("");
  const [coupon2Code, setCoupon2Code] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [remarks, setRemarks] = useState("");


  const fetchServerDate = async () => {
    try {
      setLoading(true);
      let PJsonData = {};
      let PType = '';
      //let cookies = '';
      let responseJson = await GetAPI('/api/Bill/GetServerDate', PType, PJsonData, cookies);
      //console.log('fetchServerDate=>', responseJson.data); 
      setToday(responseJson.data || '');
    
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
  useEffect(() => {
    //if (cookies.AuthToken) {
      fetchServerDate();
    //}
  }, []);

  useEffect(() => {
    const fetchStoreWisePaymentListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        let PType = '?StoreID=' + getCookieValue("DefaultStoreId"); //'?StoreID=' + cookies.DefaultStoreId;
        //let cookies = '';
        let responseJson = await GetAPI('/api/StoreMaster/GetStoreWisePayment', PType, PJsonData, cookies);
        //console.log('fetchStoreWisePaymentListData=>', responseJson); 
        
        /*
        const serverDateHeader = responseJson.headers.date; 
        const serverDate = new Date(serverDateHeader); 
        //console.log("fetchStoreWisePaymentListData Server Date =>", serverDate);
        setToday(serverDate);
        */        

        const modifiedData = (responseJson.data || []).map(item => ({
          ...item,
          amount: ""
        }));  
        setPaymentListData(modifiedData  || []);       
        //setPaymentListData(responseJson.data || []);
        setLoading(false);
      } catch (error) {
        setPaymentListData([]);
        setLoading(false);
      }
    }

    //if (cookies.AuthToken) {
      fetchStoreWisePaymentListData();
    //}
  }, []);

  useEffect(() => {
    const fetchItemMasterListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        //let PType = '';
        //let cookies = '';
        //let responseJson = await GetAPI('/api/Item/GetAllItem', PType, PJsonData, cookies);
        let PType = '?StoreID=' + getCookieValue("DefaultStoreId"); //'?StoreID=' + cookies.DefaultStoreId;
        //let cookies = '';
        let responseJson = await GetAPI('/api/Item/GetAllItemStoreWise', PType, PJsonData, cookies);
        //console.log('fetchItemMasterListData=>', responseJson);
        let responseJsonData = responseJson.data;
        const updatedData = responseJsonData.filter(item => item.stock > 0).map(item => ({ // Temp Added few key
          ...item,
          quantity: 1,
          discountPrice: '',
          promoPrice: '',
          totalPrice: '',
          salesPerson: '',
          //taxRate: '',
          //taxAmount: ''
        }));
        setItemListData(updatedData || []);
        setFilteredItemData(updatedData || []);
        setLoading(false);
      } catch (error) {
        setItemListData([]);
        setFilteredItemData([]);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    //if (cookies.AuthToken) {
    fetchItemMasterListData();
    //}
  }, []);
  const handleItemSearch = (searchText) => {
    setItemSearchText(searchText);
    setItemCurrentPage(1);  
    if (searchText.trim() === "") {
      setFilteredItemData(itemListData);
    } else {
      const filteredData = itemListData.filter((item) =>
        item.itemCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.barCode.toLowerCase().includes(searchText.toLowerCase())  ||
        item.posBarCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.oldBarCode.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItemData(filteredData);
    }
  };
  const totalItemPages = Math.ceil(filteredItemData.length / itemsPerPage);
  const startItemIndex = (itemCurrentPage - 1) * itemsPerPage;
  const currentItemData = filteredItemData.slice(startItemIndex, startItemIndex + itemsPerPage);

  //useEffect(() => {
    const fetchCustomerMasterListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        let PType = '';
        //let cookies = '';
        let responseJson = await GetAPI('/api/Customer/GetCustomerDetails', PType, PJsonData, cookies);
        //console.log('fetchCustomerMasterListData=>', responseJson);
        setCustomerListData(responseJson.data || []);
        setFilteredCustomerData(responseJson.data || []);
        setLoading(false);
      } catch (error) {
        setCustomerListData([]);
        setFilteredCustomerData([]);
        setLoading(false);
      }
    };

    //if (cookies.AuthToken) {
      //fetchCustomerMasterListData();
    //}
  //}, []);
  const handleCustomerSearch = (searchText) => {
    setCustomerSearchText(searchText);
    setCustomerCurrentPage(1);
    if (searchText.trim() === "") {
      setFilteredCustomerData(customerListData);
    } else {
      const filteredData = customerListData.filter((customer) =>
        customer.customerFirstName.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.customerLastName.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.mobile.includes(searchText)
      );
      setFilteredCustomerData(filteredData);
    }
  };
  const totalCustomerPages = Math.ceil(filteredCustomerData.length / customerPerPage);
  const startCustomerIndex = (customerCurrentPage - 1) * customerPerPage;
  const currentCustomerData = filteredCustomerData.slice(startCustomerIndex, startCustomerIndex + customerPerPage);
  useEffect(() => {
    const fetchPromotionMasterListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        //let PType = '';
        //let cookies = '';
        //let responseJson = await GetAPI('/api/Promotion/GetAllPromotion', PType, PJsonData, cookies);
        //const today = new Date();
        const formattedDate = today;  //today.toLocaleDateString('en-GB').split('/').join('-'); // 'DD-MM-YYYY'
        const PType = `?BillDate=${formattedDate}&StoreID=`+ getCookieValue("DefaultStoreId");
        let responseJson = await GetAPI('/api/Bill/GetPromotionsForBill', PType, PJsonData, cookies);
        //console.log('fetchPromotionMasterListData=>', responseJson);
        setPromotionListData(responseJson.data || []);
        setFilteredPromotionData(responseJson.data || []);
        setLoading(false);
      } catch (error) {
        setPromotionListData([]);
        setFilteredPromotionData([]);
        setLoading(false);
      }
    }

    //if (cookies.AuthToken) {
    fetchPromotionMasterListData();
    //}
  }, [today]);
  const handlePromotionSearch = (searchText) => {
    setPromotionSearchText(searchText);
    setPromotionCurrentPage(1);
    if (searchText.trim() === "") {
      setFilteredPromotionData(promotionListData);
    } else {
      const filteredData = promotionListData.filter((item) =>
        item.promotionName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPromotionData(filteredData);
    }
  };
  const totalPromotionPages = Math.ceil(filteredPromotionData.length / promotionPerPage);
  const startPromotionIndex = (promotionCurrentPage - 1) * promotionPerPage;
  const currentPromotionData = filteredPromotionData.slice(startPromotionIndex, startPromotionIndex + promotionPerPage);
  useEffect(() => {
    const fetchDiscountMasterListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        //let PType = '';
        //let cookies = '';
        //let responseJson = await GetAPI('/api/Discount/GetAllDiscount', PType, PJsonData, cookies);
        //const today = new Date();
        const formattedDate = today;  //today.toLocaleDateString('en-GB').split('/').join('-'); // 'DD-MM-YYYY'
        const PType = `?BillDate=${formattedDate}&StoreID=`+ getCookieValue("DefaultStoreId");
        let responseJson = await GetAPI('/api/Bill/GetDiscountForBill', PType, PJsonData, cookies);
        //console.log('fetchDiscountMasterListData=>', responseJson);
        setDiscountListData(responseJson.data || []);
        setFilteredDiscountData(responseJson.data || []);
        setLoading(false);
      } catch (error) {
        setDiscountListData([]);
        setFilteredDiscountData([]);
        setLoading(false);
      }
    }

    //if (cookies.AuthToken) {
    fetchDiscountMasterListData();
    //}
  }, [today]);
  const handleDiscountSearch = (searchText) => {
    setDiscountSearchText(searchText);
    setDiscountCurrentPage(1); 
    if (searchText.trim() === "") {
      setFilteredDiscountData(discountListData);
    } else {
      const filteredData = discountListData.filter((item) =>
        item.discountName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDiscountData(filteredData);
    }
  };  
  const totalDiscountPages = Math.ceil(filteredDiscountData.length / discountPerPage);
  const startDiscountIndex = (discountCurrentPage - 1) * discountPerPage;
  const currentDiscountData = filteredDiscountData.slice(startDiscountIndex, startDiscountIndex + discountPerPage);

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
      setLoading(true);
      let PJsonData = {}
      //let PType = '';
      //let cookies = '';
      //let responseJson = await GetAPI('/api/Bill/GetAllHoldBill', PType, PJsonData, cookies);
      //let responseJson = await GetAPI('/api/Bill/GetAllHoldBillRecall', PType, PJsonData, cookies); //FromDate=dd-mm-yyyy & ToDate=dd-mm-yyy
      //const today = new Date();
      const formattedDate = today;  //today.toLocaleDateString('en-GB').split('/').join('-'); // 'DD-MM-YYYY'
      const PType = `?FromDate=${formattedDate}&ToDate=${formattedDate}`;
      let responseJson = await GetAPI('/api/Bill/GetAllHoldBillRecall', PType, PJsonData, cookies);
      setRecallBillListData(responseJson.data || []);
      setFilteredRecallBillData(responseJson.data || []);
      setLoading(false);
    } catch (error) {
      setRecallBillListData([]);
      setFilteredRecallBillData([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    //if (cookies.AuthToken) {
      fetchRecallBillListData();
    //}
  }, []);
  const handleRecallBillSearch = (searchText) => {
    setRecallBillSearchText(searchText);
    setRecallBillCurrentPage(1);
    if (searchText.trim() === '') {
      setFilteredRecallBillData(recallBillListData);
    } else {
      const filteredData = recallBillListData.filter((item) => item.billNo.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredRecallBillData(filteredData);
    }
  };
  const totalRecallBillPages = Math.ceil(filteredRecallBillData.length / recallBillPerPage);
  const startRecallBillIndex = (recallBillCurrentPage - 1) * recallBillPerPage;
  const currentRecallBillData = filteredRecallBillData.slice(startRecallBillIndex, startRecallBillIndex + recallBillPerPage);

  //const [discountedTotal, setDiscountedTotal] = useState(0);
  //const totalBillAmount = scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0;
  //const totalBillAmount = storedDiscount //Note: const was previously there
  const totalBillAmount = Math.round(storedDiscount
  ? storedDiscount.appliedOn === "I"
    ? scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0
    : storedDiscount.appliedOn === "L"
    ? (() => {
        let updatedTotal = scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0;
        let finalTotal = updatedTotal;
        if (storedDiscount.discountBase === "P") {
          finalTotal = updatedTotal - (updatedTotal * storedDiscount.discountValue) / 100;
        } else if (storedDiscount.discountBase === "A") {
          finalTotal = updatedTotal - storedDiscount.discountValue;
        }

        return Math.max(0, finalTotal);
      })()
    : scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0
    //: scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0);
    : (() => {
          let baseTotal =
            scannedItemListData?.reduce(
              (sum, item) => sum + (parseFloat(item.totalPrice) || 0),
              0
            ) || 0;

          //Note:- Static Discount along with Coupan checking for 'Katihar' only (for now)
          //if (isCouponApplied && coupon1Code && coupon2Code && baseTotal >= 1500) {   //Note: Temporary disbaled on 03-10-2025 instructed by Arnab
          if (isCouponApplied && coupon1Code && baseTotal >= 1000) {
            baseTotal = baseTotal - 150;
          }
          //Note:- Static Discount along with Coupan checking for 'Katihar' only (for now)

          return Math.max(0, baseTotal);
        })()
      );
  //const totalDiscountAmount = scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0;
  //const totalDiscountAmount = storedDiscount?.appliedOn === "I" ? scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0 : "";
  const totalDiscountAmount = storedDiscount ? (storedDiscount.appliedOn === "I" ? scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0 : storedDiscount.appliedOn === "L" ? storedDiscount.discountValue : "") : "";
  const totalPaidAmount = paymentListData.filter((payment) => payment.amount && payment.amount > 0).reduce((sum, payment) => sum + Number(payment.amount), 0);
  //console.log(paymentListData)
  const totalDueAmount = (totalBillAmount - totalPaidAmount);
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
  );
  console.log("totalBillBasicAmt=>",totalBillBasicAmt);
  //Note:- BillMRPAmt: MRP * Qty
  const totalBillMRPAmt = scannedItemListData.reduce(
    (sum, item) => sum + (parseFloat(item.mrp) || 0) * (item.quantity || 0),
    0
  );
  console.log("totalBillMRPAmt=>",totalBillMRPAmt);
  //Note:- BillDiscAmt: Total tem wise Discout
  const totalBillDiscAmt = scannedItemListData.reduce(
    (sum, item) => sum + (parseFloat(item.discountPrice) || 0),
    0
  );
  console.log("totalBillDiscAmt=>",totalBillDiscAmt);
  //Note: BillPromoAmt: Total Promo Amt Item wise
  const totalBillPromoAmt = scannedItemListData.reduce(
    (sum, item) => sum + (parseFloat(item.promoPrice) || 0),
    0
  );
  console.log("totalBillPromoAmt=>",totalBillPromoAmt);
  //Note:- BillRoundOffAmt: Total of Itemwise NetAmt - BillNetpayableAmt
  const sumOfNetItems = scannedItemListData.reduce(
    (sum, item) => sum + (parseFloat(item.totalPrice || 0) - (parseFloat(item.discountPrice || 0) + parseFloat(item.promoPrice || 0))),
    0
  );
  const totalBillRoundOffAmt = sumOfNetItems - totalBillAmount;
  console.log("totalBillRoundOffAmt=>",totalBillRoundOffAmt);
  /* Calculation for https://prnt.sc/nAD82HRtbdhb */

  const fetchCNReceivedListData = async () => {
    try {
      setLoading(true);
      let PJsonData = {};
      let PType = '?CustomerID='+storedCustomer?.customerID;
      //let cookies = '';
      let responseJson = await GetAPI('/api/PayMode/GetAllUnAdjustCreditNote', PType, PJsonData, cookies);
      //console.log('fetchCNReceivedListData=>', responseJson);
      setCNReceivedListData(responseJson.data || []);
      setFilteredCNReceivedData(responseJson.data || []);
      setLoading(false);
    } catch (error) {
      setCNReceivedListData([]);
      setFilteredCNReceivedData([]);
      setLoading(false);
    }
  };
  const handleCNReceivedSearch = (searchText) => {
    setCNReceivedSearchText(searchText);
    setCNReceivedCurrentPage(1);
    if (searchText.trim() === "") {
      setFilteredCNReceivedData(cNReceivedListData);
    } else {
      const filteredData = cNReceivedListData.filter((cn) =>
        cn.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
        cn.billDate.includes(searchText) ||
        cn.amount.toString().includes(searchText)
      );
      setFilteredCNReceivedData(filteredData);
    }
  };
  const totalCNReceivedPages = Math.ceil(filteredCNReceivedData.length / cNReceivedPerPage);
  const startCNReceivedIndex = (cNReceivedCurrentPage - 1) * cNReceivedPerPage;
  const currentCNReceivedData = filteredCNReceivedData.slice(startCNReceivedIndex, startCNReceivedIndex + cNReceivedPerPage);	
  const totalSelectedCNAmount = selectedCNReceivedList.reduce((sum, item) => sum + Number(item.amount), 0);
	const handleCNReceivedClick = () => {
     if (!storedCustomer?.customerID) {
        toast.error("Please select a customer first.", { style: { backgroundColor: "#f7edeb", color: "#ff6242" } });
        return;
      }

      toggleCNReceivedModal();
      fetchCNReceivedListData();
  };
	const toggleCNReceivedModal = () => {
	    setShowCNReceivedModal((prev) => !prev);
  };
  const handleCNReceivedSelection = (cnID, cnData) => {
    setSelectedCNReceivedList(prev => {
      const alreadySelected = prev.find(item => item.billID === cnID);
      if (alreadySelected) {
        return prev.filter(item => item.billID !== cnID); // unselect
      } else {
        return [...prev, cnData]; // select & preserve order
      }
    });
  }; 
  const handleApplyCNReceived = () => {
    // console.log("Applied Selected CN Received:", selectedCNReceivedData);
    // setStoredCNReceived(selectedCNReceivedData);
    //console.log(appliedCNList)
    setStoredCNReceived(appliedCNList);
    setPaymentListData((prev) =>
      prev.map((payment) =>
        payment.availablePaymentmethod === "Credit Note Received" ||
        payment.availablePaymentmethod?.toLowerCase() === "credit note received" || payment.availablePaymentmethod?.toLowerCase() === "creditnotereceived" ||
        payment.availablePaymentmethod?.includes('credit note received') ||
        payment.availablePaymentmethod?.includes('creditnotereceived')
          ? { ...payment, amount: totalUsedAmount }
          : payment
      )
    );
    toggleCNReceivedModal();
  };
  const handleClearAndCloseCNReceived = () => {
    toggleCNReceivedModal();
    setStoredCNReceived(null);
    setSelectedCNReceivedList([]);
    setPaymentListData(prev =>
      prev.map(payment =>
        payment.availablePaymentmethod === "Credit Note Received" ||
        payment.availablePaymentmethod?.toLowerCase() === "credit note received" ||
        payment.availablePaymentmethod?.toLowerCase() === "creditnotereceived" ||
        payment.availablePaymentmethod?.includes('credit note received') ||
        payment.availablePaymentmethod?.includes('creditnotereceived')
          ? { ...payment, amount: "" }
          : payment
      )
    );
  };
  const getCNUsedAndDue = (cnList, totalAmount) => {
    let remaining = totalAmount;
    return cnList.map((cn) => {
      const used = Math.min(remaining, cn.amount);
      remaining -= used;
      return {
        ...cn,
        usedAmount: used,
        dueAmount: cn.amount - used,
      };
    });
  };  
  const appliedCNList = getCNUsedAndDue(selectedCNReceivedList, totalBillAmount);
  const totalUsedAmount = appliedCNList.reduce((sum, cn) => sum + cn.usedAmount, 0);


  useEffect(() => {
    if(storedDiscount && scannedItemListData){
      let updatedScannedItemListDataWRTPromo = [];
      const hasEmptyPromo = scannedItemListData.some(item => item.promoPrice !== "");
      if(hasEmptyPromo){
        /*
        const updatedScannedItemListData = scannedItemListData.map(item => ({
          ...item,
          promoPrice: "",
          totalPrice: item.mrp * item.quantity  //item.retailPrice * item.quantity
        }));
        */
        const updatedScannedItemListData = scannedItemListData.map(item => {
            const { mrp, quantity, taxRate, gstUpperLimit, gstSlabRate } = item;
            const taxRateUpdated = mrp <= gstUpperLimit ? taxRate : gstSlabRate;
            const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * quantity).toFixed(2);
            const taxableAmount = (((mrp / (100 + taxRateUpdated)) * 100) * quantity).toFixed(2);

            return {
              ...item,
              discountPrice: "",
              promoPrice: "",
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * quantity
            };
          });
        //setScannedItemListData(updatedScannedItemListData);
        //setPrevScannedItemListData(updatedScannedItemListData);

        //console.log("Clear=>",updatedScannedItemListData)

        setSelectedPromotionID(null);
        setSelectedPromotionData(null);
        setStoredPromotion(null);
        updatedScannedItemListDataWRTPromo = updatedScannedItemListData;
      } else{
        updatedScannedItemListDataWRTPromo = scannedItemListData;
      }

      if(updatedScannedItemListDataWRTPromo.length > 0) {
        //const hasEmptyDiscount = scannedItemListData.some(item => item.discountPrice === "");
        const hasEmptyDiscount = updatedScannedItemListDataWRTPromo.some(item => item.discountPrice === "");
        //console.log(hasEmptyDiscount, "-", updatedScannedItemListDataWRTPromo)

        //Note: Over Each Item
        if (hasEmptyDiscount && storedDiscount.discountType === "G" && storedDiscount.appliedOn === "I") {
          //const updatedScannedItemListData = scannedItemListData.map(item => ({
          const updatedScannedItemListData = updatedScannedItemListDataWRTPromo.map(item => ({
            ...item,
            discountPrice: "",
            totalPrice: item.mrp * item.quantity //item.retailPrice * item.quantity
          }));
          setScannedItemListData(updatedScannedItemListData);
          setPrevScannedItemListData(updatedScannedItemListData);

          //let updatedItems = [...scannedItemListData];
          let updatedItems = [...updatedScannedItemListDataWRTPromo];
          updatedItems = updatedItems.map((item) => {
            let discountPrice = 0;
      
            if (storedDiscount.discountBase === "P") {
              //discountPrice = parseFloat(((item.retailPrice * storedDiscount.discountValue) / 100).toFixed(2));
              discountPrice = parseFloat(((item.mrp * storedDiscount.discountValue) / 100).toFixed(2));
            } 
            if (storedDiscount.discountBase === "A") {
              discountPrice = parseFloat(storedDiscount.discountValue.toFixed(2));
            }
      
            //const totalPrice = parseFloat(((item.retailPrice - discountPrice) * item.quantity).toFixed(2));
            const totalPrice = parseFloat(((item.mrp - discountPrice) * item.quantity).toFixed(2));

            const effectiveMrp = item.mrp - discountPrice;
            const taxRateUpdated = effectiveMrp <= item.gstUpperLimit ? item.taxRate : item.gstSlabRate;
            const taxAmount = (((effectiveMrp / (100 + taxRateUpdated)) * taxRateUpdated) * item.quantity).toFixed(2);
            const taxableAmount = (((effectiveMrp / (100 + taxRateUpdated)) * 100) * item.quantity).toFixed(2);

            return {
              ...item,
              discountPrice,
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice,
            };
          });
          setScannedItemListData(updatedItems);        
        }

        //Note: Over Total Bill Amount
        if (storedDiscount.discountType === "G" && storedDiscount.appliedOn === "L") {
          //const updatedScannedItemListData = scannedItemListData.map(item => ({
          const updatedScannedItemListData = updatedScannedItemListDataWRTPromo.map(item => ({
            ...item,
            discountPrice: "",
            totalPrice: item.mrp * item.quantity //item.retailPrice * item.quantity
          }));
          setScannedItemListData(updatedScannedItemListData);
          setPrevScannedItemListData(updatedScannedItemListData);
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
  }, [storedDiscount, scannedItemListData]);

  /*
  useEffect(() => {
    console.log("scannedItemListData:", scannedItemListData);
  }, [scannedItemListData]);
  */
  const handleAllStateClear = () => {
    fetchServerDate();


    setItemSearchText("");
    //setFilteredItemData([]);
    //setItemCurrentPage(1);
  
    setCustomerSearchText("");
    setFilteredCustomerData([]);
    setCustomerCurrentPage(1);
    setSelectedCustomerID(null);
    setSelectedCustomerData(null);
    setStoredCustomer(null);
    setCustomerSaveData({
      customerFirstName: "",
      customerMiddleName: "",
      customerLastName: "",
      mobile: "",
      whatsAppNo: "",
    });
    setCustomerErrors({});
  
    setPromotionSearchText("");
    //setFilteredPromotionData([]);
    //setFilteredPromotionData(promotionListData);
    setPromotionCurrentPage(1);
    setSelectedPromotionID(null);
    setSelectedPromotionData(null);
    setStoredPromotion(null);
  
    setDiscountSearchText("");
    //setFilteredDiscountData([]);
    //setFilteredDiscountData(discountListData);
    setDiscountCurrentPage(1);
    setSelectedDiscountID(null);
    setSelectedDiscountData(null);
    setStoredDiscount(null);

    setCNReceivedSearchText('');
    setCNReceivedListData([]);
    setFilteredCNReceivedData([]);
    setCNReceivedCurrentPage(1);
    setSelectedCNReceivedID(null);
    setSelectedCNReceivedData(null);
    setStoredCNReceived(null);
    setSelectedCNReceivedList([]);

    setHoldBillSearchText("");
    setFilteredHoldBillData([]);
    setFilteredHoldBillData(holdBillListData);
    setHoldBillCurrentPage(1);
    setSelectedHoldBillID(null);
    setSelectedHoldBillData(null);
    setStoredHoldBill(null);

    setRecallBillSearchText("");
    setFilteredRecallBillData([]);
    setFilteredRecallBillData(recallBillListData);
    setRecallBillCurrentPage(1);
    setSelectedRecallBillID(null);
    setSelectedRecallBillData(null);
    setStoredRecallBill(null);
  
    setIsCheckoutSaveModalOpen(false);
    setCheckoutSaveBillDocNum(null);
    setCheckoutSaveBillDocEntry(null);
    setCheckoutSaveBillType(null);
    setShowNewCustomerModal(false);
    setShowTagCustomerModal(false);
    setShowApplyPromoModal(false);
    setShowApplyDiscountModal(false);
    setShowHoldBillModal(false);
    setShowRecallBillModal(false);
    setShowCNReceivedModal(false);
  
    setShowItemList(false); //setShowItemList(true);
    setShowCheckout(false);
    setShowPosOrder(false);
    setShowAdvance(false);
    setShowCashDrawerIn(false);
    setShowCashDrawerOut(false);
  
    setScannedItemListData([]);
    setPrevScannedItemListData([]);
    setDeleteItemIndex(null);
  
    setImageModal(false);
    setBarCodeInput('');

    setIsBtnSaving(false);

    setIsCouponApplied(false);
    setCoupon1Code('');
    setCoupon2Code('');

    setPaymentListData(prevData =>
      prevData.map(item => ({ ...item, amount: "", upItransactionID: "", transactionID: "", cardNo: "", tenderAmount: '', refundAmount: '' }))
    );

    if (inputBarCodeRef.current) {
      inputBarCodeRef.current.focus();
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
  };

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
    //console.log(scannedItemListData)
    if (scannedItemListData.length === 0) {
      setStoredCustomer(null);
      setSelectedCustomerID(null);
      setSelectedCustomerData(null);

      setSelectedPromotionID(null);
      setSelectedPromotionData(null);
      setStoredPromotion(null);

      setStoredDiscount(null);
      setSelectedDiscountID(null);
      setSelectedDiscountData(null);

      setPrevScannedItemListData([]);
      return;
    }

    if (prevScannedItemListData.length === 0) {
      setPrevScannedItemListData(scannedItemListData);
      return;
    }  

    const hasListChanged = 
    scannedItemListData.length !== prevScannedItemListData.length ||
    scannedItemListData.some((newItem, index) => {
      const prevItem = prevScannedItemListData[index];
      return prevItem && newItem.quantity !== prevItem.quantity;
    });
    //const hasListChanged = JSON.stringify(scannedItemListData) !== JSON.stringify(prevScannedItemListData);
    if (hasListChanged) {
      setSelectedPromotionID(null);
      setSelectedPromotionData(null);
      setStoredPromotion(null);

      setStoredDiscount(null);
      setSelectedDiscountID(null);
      setSelectedDiscountData(null);

      const updatedScannedItemListData = scannedItemListData.map(item => ({
        ...item,
        discountPrice: "",
        promoPrice: "",
        totalPrice: item.mrp * item.quantity //item.retailPrice * item.quantity
      }));
      setScannedItemListData(updatedScannedItemListData);
      setPrevScannedItemListData(updatedScannedItemListData);
    } else{
      setPrevScannedItemListData(scannedItemListData);
    }
    
  }, [scannedItemListData]);
  const handleDiscountSelection = (discountID, discountData) => {
    if (selectedDiscountID === discountID) {
      setSelectedDiscountID(null);
      setSelectedDiscountData(null);
    } else {
      setSelectedDiscountID(discountID);
      setSelectedDiscountData(discountData);
    }
  };
  const handleApplyDiscount = () => {
    //console.log("Applied Selected Discount:", selectedDiscountData);
    if(selectedDiscountData.discountType === 'G' && selectedDiscountData.appliedOn === 'L'){
      if(selectedDiscountData.discountBase === 'A' || selectedDiscountData.discountBase === 'P'){
        if(totalBillAmount >= selectedDiscountData.minimumBilling){

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

          setStoredDiscount(selectedDiscountData);
          toggleApplyDiscountModal();
        } else{
          setSelectedDiscountID(null);
          setSelectedDiscountData(null);
          toast.error("This discount amount cannot be applied because the minimum bill amount required is "  + selectedDiscountData.minimumBilling + ".", { style: { backgroundColor: "#f7edeb", color: "#ff6242" },});
          return;
        }
      }
    } else{
      setStoredDiscount(selectedDiscountData);
      toggleApplyDiscountModal();
    }
  };
  const handleApplyRecallBill = () => {
    //console.log("selectedRecallBillID=>",selectedRecallBillID);
    fetchSelectedBillDeatilsList(selectedRecallBillID)
    setShowRecallBillModal(false);
    //toggleApplyRecallBillModal();
  };
  const handleApplyHoldBill = () => {
    //console.log('Hold Bill Data:', selectedHoldBillData);
    setStoredHoldBill(selectedHoldBillData);
    toggleApplyHoldBillModal();
  }; 
  /*useEffect(() => {
    if (scannedItemListData.length === 0) {
      setStoredPromotion(null);
      setSelectedPromotionID(null);
      setSelectedPromotionData(null);
    }
  }, [scannedItemListData]);*/
  useEffect(() => {
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
    const hasListChanged = JSON.stringify(scannedItemListData) !== JSON.stringify(prevScannedItemListData);
    //console.log(JSON.stringify(scannedItemListData),"<->",JSON.stringify(prevScannedItemListData))
    if (hasListChanged) {
      //Note: Newly checking added only for Promotion API call concept
      const hasAnyPromoPriceApplied = scannedItemListData.some((item, index) => item.promoPrice !== prevScannedItemListData[index]?.promoPrice && parseFloat(item.promoPrice) > 0);
      if(!hasAnyPromoPriceApplied) {
        //console.log("`Useeffect` => setStoredPromotion==>",storedPromotion)
        setStoredPromotion(null);
        setSelectedPromotionID(null);
        setSelectedPromotionData(null);
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
      setPrevScannedItemListData(scannedItemListData); //Temp
    } else{
      setStoredPromotion(null);
      setSelectedPromotionID(null);
      setSelectedPromotionData(null);

      setPrevScannedItemListData(scannedItemListData);
    } 
    
  }, [scannedItemListData]);
  const handlePromotionSelection = (promotionID, promotionData) => {
    if (selectedPromotionID === promotionID) {
      setSelectedPromotionID(null);
      setSelectedPromotionData(null);
    } else {
      setSelectedPromotionID(promotionID);
      setSelectedPromotionData(promotionData);
    }
  };  
  /*
  const handleApplyPromotion = async () => {
    //console.log("Applied Selected Promotion:", selectedPromotionData, selectedPromotionData.promotionID, scannedItemListData, selectedPromotionID);
    setStoredPromotion(selectedPromotionData);   
    toggleApplyPromotionModal();

    if (selectedPromotionData && Object.keys(selectedPromotionData).length > 0 && Array.isArray(scannedItemListData) && scannedItemListData.length > 0) {
      setIsBtnSaving(true);
      const formData = {
        promotionID: selectedPromotionData.promotionID || 0,
        minimumBilling: 0,
        objDetails: scannedItemListData.map((item, index) => ({
          lineNum: index,
          itemCode: item.itemCode || "",
          itemName: item.itemName || "",
          rsp: item.retailPrice || 0,
          mrp: item.mrp || 0,
          quantity: item.quantity || 0,
          promotionValue: 0
        }))
      };
      //console.log("✅ formData created:", formData);
      const response = await PostAPI('/api/Bill/GetBillingPromotionDetails', '', formData, cookies)
      //console.log('Return scannedItemListData After Applied Promotion:', response.data)

      const updatedScannedItemListData = scannedItemListData.map((scannedItem) => {
        const promoItem = response.data.find((promo) => promo.itemCode === scannedItem.itemCode);
        if (promoItem) {
          return {
            ...scannedItem,
            promoPrice: promoItem.promotionValue || 0
          };
        }
        return scannedItem;
      });
      setScannedItemListData(updatedScannedItemListData);  
      setIsBtnSaving(false);   
    } else {
       toast.error('Promotion Data or Item Data is missing or empty.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        })
        setIsBtnSaving(false);
    }
  };
  */
  const handleApplyPromotion = async () => {
    //console.log("handleApplyPromotion=>", selectedPromotionData, selectedPromotionID, storedPromotion)
    if (selectedPromotionData && Object.keys(selectedPromotionData).length > 0 &&  Array.isArray(scannedItemListData) && scannedItemListData.length > 0) {
      setIsBtnSaving(true);
      
      if (storedPromotion && Object.keys(storedPromotion).length > 0 && selectedPromotionID === storedPromotion?.promotionID) {
        toast.warning('Same promotion already applied here.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        });        
      } else {       
        //clearPromotion();

        setStoredPromotion(selectedPromotionData); // set state

        let updatedScannedItemListDataWRTDiscnt = [];
        const hasEmptyDiscount = scannedItemListData.some(item => item.discountPrice === "");
        if(!hasEmptyDiscount){
          /*
          const updatedScannedItemListData = scannedItemListData.map(item => ({
            ...item,
            discountPrice: "",
            totalPrice: item.mrp * item.quantity //item.retailPrice * item.quantity
          }));
          */
          const updatedScannedItemListData = scannedItemListData.map(item => {
            const { mrp, quantity, taxRate, gstUpperLimit, gstSlabRate } = item;
            const taxRateUpdated = mrp <= gstUpperLimit ? taxRate : gstSlabRate;
            const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * quantity).toFixed(2);
            const taxableAmount = (((mrp / (100 + taxRateUpdated)) * 100) * quantity).toFixed(2);

            return {
              ...item,
              discountPrice: "",
              promoPrice: "",
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * quantity
            };
          });
          //setScannedItemListData(updatedScannedItemListData);
          //setPrevScannedItemListData(updatedScannedItemListData);
          setSelectedDiscountID(null);
          setSelectedDiscountData(null);
          setStoredDiscount(null);
          updatedScannedItemListDataWRTDiscnt = updatedScannedItemListData;
        } else{
          updatedScannedItemListDataWRTDiscnt = scannedItemListData;
        }

        const hasEmptyPromo = updatedScannedItemListDataWRTDiscnt.some(item => item.promoPrice !== "")
        if(hasEmptyPromo){    
            updatedScannedItemListDataWRTDiscnt = scannedItemListData.map(item => {
                const { mrp, quantity, taxRate, gstUpperLimit, gstSlabRate } = item;
                const taxRateUpdated = mrp <= gstUpperLimit ? taxRate : gstSlabRate;
                const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * quantity).toFixed(2);
                const taxableAmount = (((mrp / (100 + taxRateUpdated)) * 100) * quantity).toFixed(2);

                return {
                  ...item,
                  discountPrice: "",
                  promoPrice: "",
                  taxRate: taxRateUpdated,
                  taxRateUpdated,
                  taxAmount,
                  taxableAmount,
                  totalPrice: mrp * quantity
                };
            });
        }

        const formData = {
          promotionID: selectedPromotionData.promotionID || 0,
          minimumBilling: totalBillAmount,
          //objDetails: scannedItemListData.map((item, index) => ({
          objDetails: updatedScannedItemListDataWRTDiscnt.map((item, index) => ({
            lineNum: index,
            itemCode: item.itemCode || "",
            itemName: item.itemName || "",
            rsp: item.retailPrice || 0,
            mrp: item.mrp || 0,
            quantity: item.quantity || 0,
            promotionValue: 0,
          })),
        };
        const response = await PostAPI('/api/Bill/GetBillingPromotionDetails', '', formData, cookies);

        /*
        const updatedScannedItemListData = scannedItemListData.map((scannedItem) => {
          const promoItem = response.data.find((promo) => promo.itemCode === scannedItem.itemCode);
          if (promoItem) {
            return {
              ...scannedItem,
              promoPrice: promoItem.promotionValue || 0,
            };
          }
          return scannedItem;
        });
        */
        //const updatedScannedItemListData = scannedItemListData.map((scannedItem) => {
        const updatedScannedItemListData = updatedScannedItemListDataWRTDiscnt.map((scannedItem) => {
          const promoItem = response.data.find((promo) => promo.itemCode === scannedItem.itemCode);
          if (promoItem) {
            const { mrp, quantity, taxRate, gstUpperLimit, gstSlabRate } = scannedItem;
            const promoPrice = promoItem.promotionValue || '';
            const promoPriceNumeric = parseFloat(promoPrice) || 0;

            const totalPrice = (scannedItem.totalPrice || 0) - promoPrice; //Note:(Should Be): (scannedItem.totalPrice || 0) - promoPriceNumeric;

            const effectiveMrp = mrp - promoPriceNumeric;
            const taxRateUpdated = effectiveMrp <= gstUpperLimit ? taxRate : gstSlabRate;
            const taxAmount = (((effectiveMrp / (100 + taxRateUpdated)) * taxRateUpdated) * quantity).toFixed(2);
            const taxableAmount = (((effectiveMrp / (100 + taxRateUpdated)) * 100) * quantity).toFixed(2);

            return {
              ...scannedItem,
              promoPrice: promoPrice,
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: totalPrice >= 0 ? totalPrice : 0  // optional: avoid negative
            };
          }
          return scannedItem;
        });
        //console.log("updatedScannedItemListData=>",updatedScannedItemListData)

        setScannedItemListData(updatedScannedItemListData);

        toggleApplyPromotionModal();
      }

      setIsBtnSaving(false);
    } else {
      toast.error('Promotion Data or Item Data is missing or empty.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      });
      setIsBtnSaving(false);
    }
  };
  const clearPromotion = async () => {
    setSelectedPromotionID(null);
    setSelectedPromotionData(null);
    setStoredPromotion(null);

    setShowCheckout(false);

    const hasEmptyPromo = scannedItemListData.some(item => item.promoPrice !== "");
      if(hasEmptyPromo){     

        const updatedScannedItemListData = scannedItemListData.map(item => {
            const { mrp, quantity, taxRate, gstUpperLimit, gstSlabRate } = item;
            const taxRateUpdated = mrp <= gstUpperLimit ? taxRate : gstSlabRate;
            const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * quantity).toFixed(2);
            const taxableAmount = (((mrp / (100 + taxRateUpdated)) * 100) * quantity).toFixed(2);

            return {
              ...item,
              discountPrice: "",
              promoPrice: "",
              taxRate: taxRateUpdated,
              taxRateUpdated,
              taxAmount,
              taxableAmount,
              totalPrice: mrp * quantity
            };
        });

        //console.log("Clear=>",updatedScannedItemListData);
        setScannedItemListData(updatedScannedItemListData);
        setPrevScannedItemListData(updatedScannedItemListData);
      }
  };

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
      setSelectedCustomerID(null);
      setSelectedCustomerData(null);
    } else {
      setSelectedCustomerID(customerID);
      setSelectedCustomerData(customerData);
    }
  };  
  const handleApplyCustomer = () => {
    //console.log("Applied Selected Customer:", selectedCustomerData);
    setStoredCustomer(selectedCustomerData);
    toggleTagCustomerModal();
  };

  const handleTagCustomerClick = () => {
    toggleTagCustomerModal();
    fetchCustomerMasterListData();
  };
  const toggleTagCustomerModal = () => {
    setShowTagCustomerModal((prev) => !prev);
  };
  const toggleApplyPromotionModal = () => {
    setShowApplyPromoModal((prev) => !prev);
  };
  const toggleApplyDiscountModal = () => {
    setShowApplyDiscountModal((prev) => !prev);
  };
  /*const toggleApplyHoldBillModal = () => {
    setShowHoldBillModal((prev) => !prev);
    fetchHoldBillListData();
  };*/
  const toggleApplyHoldBillModal = () => {
    setShowHoldBillModal((prev) => {
      const isModalOpen = !prev;
      if (isModalOpen) {
        fetchHoldBillListData();
      }
      return isModalOpen;
    });
  };
  const toggleApplyRecallBillModal = () => {
    setSelectedRecallBillID(null);
    setSelectedRecallBillData(null);
    setStoredRecallBill(null);

    //setShowRecallBillModal((prev) => !prev);
    setShowRecallBillModal((prev) => {
      const isModalOpen = !prev;
      if (isModalOpen) {
        fetchRecallBillListData();
      }
      return isModalOpen;
    });
  };
  const toggleItemList = () => {
    setShowItemList((prev) => !prev);
    setShowCheckout(false);
  };
  const toggleCheckout = () => {
    setShowCheckout((prev) => !prev);
    setShowItemList(false);
  };
  const handleCheckoutApplyPromotion = async () => {
    if (!Array.isArray(scannedItemListData) || scannedItemListData.length === 0) {
      return; 
    }

    let updatedScannedItemListDataWRTDiscnt = [];
    // 1. Check if any discount already applied
    const hasDiscount = scannedItemListData.some(item => item.discountPrice !== "");
    if (hasDiscount) {
      return; // stop if discount already applied
    }
    // 2. Check if any promo already applied
    const hasPromo = scannedItemListData.some(item => item.promoPrice !== "");
    if (hasPromo) {
      return; // stop if promo already applied
    }

    // 3. No discount or promo yet → loop through promotions
    for (const promotion of currentPromotionData) {
      const formData = {
        promotionID: promotion.promotionID || 0,
        minimumBilling: totalBillAmount,
        objDetails: scannedItemListData.map((item, index) => ({
          lineNum: index,
          itemCode: item.itemCode || "",
          itemName: item.itemName || "",
          rsp: item.retailPrice || 0,
          mrp: item.mrp || 0,
          quantity: item.quantity || 0,
          promotionValue: 0,
        })),
      };

      try {
        const response = await PostAPI('/api/Bill/GetBillingPromotionDetails', '', formData, cookies);

        if (response?.data?.length > 0) {
          let promotionApplied = false; // flag

          const updatedScannedItemListData = scannedItemListData.map((scannedItem) => {
            const promoItem = response.data.find((promo) => promo.itemCode === scannedItem.itemCode);
            console.log(promoItem.promotionValue)
            if (promoItem && promoItem.promotionValue > 0) {
              promotionApplied = true; // mark as applied

              setSelectedPromotionID(promotion.promotionID);
              setSelectedPromotionData(promotion);
              setStoredPromotion(promotion);

              const { mrp, quantity, taxRate, gstUpperLimit, gstSlabRate } = scannedItem;
              const promoPrice = promoItem.promotionValue || '';
              const promoPriceNumeric = parseFloat(promoPrice) || 0;

              const totalPrice = (scannedItem.totalPrice || 0) - promoPriceNumeric;

              const effectiveMrp = mrp - promoPriceNumeric;
              const taxRateUpdated = effectiveMrp <= gstUpperLimit ? taxRate : gstSlabRate;
              const taxAmount = (((effectiveMrp / (100 + taxRateUpdated)) * taxRateUpdated) * quantity).toFixed(2);
              const taxableAmount = (((effectiveMrp / (100 + taxRateUpdated)) * 100) * quantity).toFixed(2);

              return {
                ...scannedItem,
                promoPrice: promoPrice,
                taxRate: taxRateUpdated,
                taxRateUpdated,
                taxAmount,
                taxableAmount,
                totalPrice: totalPrice >= 0 ? totalPrice : 0
              };
            }
            return scannedItem;
          });

          setScannedItemListData(updatedScannedItemListData);

          if (promotionApplied) { //if (promoItem && promoItem.promotionValue > 0) {
            break;  // Stop loop after first successful promotion applied
          }
        }
      } catch (error) {
        console.error("Error applying promotion:", error);
      }
    }
  };


  const autoHideDiv = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 5000);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPosOrder(false);
      setShowAdvance(false);
      setShowCashDrawerIn(false);
      setShowCashDrawerOut(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showPosOrder, showAdvance, showCashDrawerIn, showCashDrawerOut]);
  const togglePosOrder = () => {
    setShowPosOrder((prev) => !prev);
    setShowAdvance(false);
    setShowCashDrawerIn(false);
    setShowCashDrawerOut(false);
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowPosOrder);
  };
  const toggleAdvance = () => {
    setShowAdvance((prev) => !prev);
    setShowPosOrder(false);
    setShowCashDrawerIn(false);
    setShowCashDrawerOut(false);
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowAdvance);
  };
  const toggleCashDrawerIn = () => {
    setShowCashDrawerIn((prev) => !prev);
    setShowPosOrder(false);
    setShowAdvance(false);
    setShowCashDrawerOut(false);
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowCashDrawerIn);
  };
  const toggleCashDrawerOut = () => {
    setShowCashDrawerOut((prev) => !prev);
    setShowPosOrder(false);
    setShowAdvance(false);
    setShowCashDrawerIn(false);
    //setShowItemList(false);
    //setShowItemList(false);
    //autoHideDiv(setShowCashDrawerOut);
  };
  const toggleImageModal = () => {
    setImageModal((prev) => !prev);
  };
  const toggleNewCustomerModal = () => {
    setShowNewCustomerModal(!showNewCustomerModal);
    //setShowNewCustomerModal((prev) => !prev);
    setShowTagCustomerModal(false);

    // Reset to blank
    setCustomerSaveData({  
      customerFirstName: "",
      customerMiddleName: "",
      customerLastName: "",
      mobile: "",
      whatsAppNo: "",
    });
    setCustomerErrors({});   
  };
  const toggleNewCustomerSavedModal = () => {
    fetchCustomerMasterListData();

    setShowNewCustomerModal(false);
    setShowTagCustomerModal(true);

    // Reset to blank
    setCustomerSaveData({  
      customerFirstName: "",
      customerMiddleName: "",
      customerLastName: "",
      mobile: "",
      whatsAppNo: "",
    });
    setCustomerErrors({});   
  };
  const toggleNewCustomerModalCancel = () => {
    setShowNewCustomerModal(!showNewCustomerModal);
    handleTagCustomerClick();
  };

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
      return prevList.map((item) => {
        if (item.itemCode === itemCode) {
          const newQuantity = item.quantity + 1;
          const mrp = item.mrp || 0;
          const gstUpperLimit = item.gstUpperLimit || 0;
          const gstSlabRate = item.gstSlabRate || 0;
          //const perItemDiscount = item.perItemDiscount || 0;

          const taxRateUpdated = mrp <= gstUpperLimit ? item.taxRate : gstSlabRate;
          const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * newQuantity).toFixed(2);  //(((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
          const taxableAmount =  (((mrp / (100 + taxRateUpdated)) * 100) * newQuantity).toFixed(2); //((mrp * newQuantity) - taxAmount).toFixed(2);  //mrp - ((mrp * taxRateUpdated) / 100) * newQuantity;
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
            totalPrice: mrp * newQuantity
          };
        }
        return item;
      }).concat(
        prevList.some((item) => item.itemCode === itemCode)
          ? []
          : (() => {
              const itemData = itemListData.find((item) => item.itemCode === itemCode);
              if (!itemData) return [];

              const quantity = 1;
              const mrp = itemData.mrp || 0;
              const gstUpperLimit = itemData.gstUpperLimit || 0;
              const gstSlabRate = itemData.gstSlabRate || 0;
              //const perItemDiscount = itemData.perItemDiscount || 0;

              const taxRateUpdated = mrp <= gstUpperLimit ? itemData.taxRate : gstSlabRate;
              const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * quantity).toFixed(2); //(((mrp * taxRateUpdated) / 100) * quantity).toFixed(2);
              const taxableAmount = (((mrp / (100 + taxRateUpdated)) * 100) * quantity).toFixed(2);  //((mrp * quantity) - taxAmount).toFixed(2); //mrp - ((mrp * taxRateUpdated) / 100) * quantity;
              //console.log('✅ NEW Item:', { taxRateUpdated, taxAmount, taxableAmount });

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
  const handleQuantityChange = (index, change) => {
    setScannedItemListData((prevList) =>
      prevList.map((item, i) => {
        if (i !== index) return item;

        const newQuantity = Math.max(1, item.quantity + change);
        const mrp = item.mrp || 0;
        const gstUpperLimit = item.gstUpperLimit || 0;
        const gstSlabRate = item.gstSlabRate || 0;

        const taxRateUpdated = mrp <= gstUpperLimit ? item.taxRate : gstSlabRate;
        const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * newQuantity).toFixed(2); //(((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
        const taxableAmount = (((mrp / (100 + taxRateUpdated)) * 100) * newQuantity).toFixed(2); //((mrp * newQuantity) - taxAmount).toFixed(2); //mrp - ((mrp * taxRateUpdated) / 100) * newQuantity;

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
        };
      })
    );
  }; 
  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSelectBarcodeItem(barCodeInput.trim());
      setBarCodeInput('');
    }
  };  
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
  const handleSelectBarcodeItem = async (barCodeEntered) => {
    const trimmedBarcode = barCodeEntered.trim();
    if (!trimmedBarcode) return;

    setShowCheckout(false);
    //setLoading(true);
    const PJsonData = {};
    const PType = '?Barcode=' + trimmedBarcode + '&StoreID=' + getCookieValue("DefaultStoreId");
    let responseJson = await GetAPI('/api/Item/GetItemBarcodeWise', PType, PJsonData);
    //console.log("/api/Item/GetItemBarcodeWise -> handleSelectBarcodeItem==>",responseJson)
    //setLoading(false);

    const matchedItems = Array.isArray(responseJson.data) ? responseJson.data : [];
    //console.log(matchedItems)

    if (matchedItems.length === 0) return;

    if (matchedItems[0].returnCode === "F") {
      toast.warning(matchedItems[0].returnMsg, {
        style: {
          backgroundColor: '#ffffcc',
          color: '#ff6242',
        },
      });
      return;
    }
    //console.log("Item details:", matchedItems[0]);

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
          // ✅ Update quantity for existing item
          const existingItem = updatedList[existingIndex];
          const newQuantity = existingItem.quantity + 1;

          const taxAmount = (((mrp / (100 + taxRateUpdated)) * taxRateUpdated) * newQuantity).toFixed(2); //(((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
          const taxableAmount = (((mrp / (100 + taxRateUpdated)) * 100) * newQuantity).toFixed(2);  //((mrp * newQuantity) - taxAmount).toFixed(2);

          updatedList[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
            discountPrice: '',
            promoPrice: '',
            salesPerson: '',
            taxRate: taxRateUpdated,
            taxRateUpdated,
            taxAmount,
            taxableAmount,
            totalPrice: mrp * newQuantity
          };
        } else {
          // ➕ Add new item
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
  /**/

  const confirmDeleteItem = () => {
    if (deleteItemIndex !== null) {
      setScannedItemListData(prevData => prevData.filter((_, i) => i !== deleteItemIndex));
      setDeleteItemIndex(null);
    }
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    //console.log("handleCustomerInputChange=>",name, value)
    setCustomerSaveData({ ...customerSaveData, [name]: value });
  };  
  const validateCustomerForm = () => {
    let newErrors = {};
    //console.log("validateCustomerForm=>",customerSaveData)

    //if (!customerSaveData.customerFirstName.trim()) newErrors.customerFirstName = "First Name is required.";
    //if (!customerSaveData.customerLastName.trim()) newErrors.customerLastName = "Last Name is required.";
    //if (!customerSaveData.mobile.trim()) newErrors.mobile = "Mobile Number is required.";
    //if (customerSaveData.mobile.length > 10) newErrors.mobile = "Mobile Number cannot exceed 10 digits.";
    //if (customerSaveData.whatsAppNo.length > 10) newErrors.whatsAppNo = "WhatsApp Number cannot exceed 10 digits.";
    if (!customerSaveData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required.";
    } else if (customerSaveData.mobile.length > 10 || customerSaveData.mobile.length < 10) {
      //newErrors.mobile = "Mobile Number cannot exceed 10 digits.";
      newErrors.mobile = "Mobile Number should be in 10 digits."; 
    }
    
    if (customerSaveData.whatsAppNo && (customerSaveData.whatsAppNo.length > 10 || customerSaveData.whatsAppNo.length < 10)) {
      //newErrors.whatsAppNo = "WhatsApp Number cannot exceed 10 digits.";
       newErrors.mobile = "WhatsApp Number should be in 10 digits."; 
    }
    /**/

    /*
    const latestMobile = inputCustomerSaveDataMobileRef.current?.value || "";
    let newErrors = {};
    if (!latestMobile) newErrors.mobile = "Mobile Number is required.";
    if (latestMobile.length > 10 || latestMobile.length < 10) newErrors.mobile = "Mobile Number should be in 10 digits."; 
    */
  
    setCustomerErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSaveCustomer = async () => {
    setTimeout(async () => {
      if (!validateCustomerForm()) return;
    
      setIsBtnSaving(true);
      const formData = {
        customerID: 0,
        customerFirstName: customerSaveData?.customerFirstName || '',
        customerMiddleName: customerSaveData?.customerMiddleName || '',
        customerLastName: customerSaveData?.customerLastName || '',
        gender: "M",
        mobile: customerSaveData?.mobile || '', //inputCustomerSaveDataMobileRef.current?.value || '', //
        dateOfBirth: "",
        anniversary: "",
        profession: "",
        spouseName: "",
        panNo: "",
        gstRegNo: "",
        gstRegDate: "",
        isEmployee: "",
        employeeID: "",
        address: "",
        area: "",
        city: "",
        pinCode: "",
        state: "",
        email: "",
        whatsAppNo: customerSaveData?.whatsAppNo || customerSaveData?.mobile || '',
        alternatePhnNo: customerSaveData?.mobile || '',
        preferredComMode: "",
        isPushMessage: "",
        customerCatCode: "",
        customerCatName: "",
        membershipCategoryCode: "",
        membershipCategoryName: "",
        membershipNo: "",
        validTill: "",
        storeID: getCookieValue("DefaultStoreId") || 0,   //cookies.DefaultStoreId,
        enteredBy: getCookieValue("UserId") || 0,         //cookies.UserId,
        usedFor: "I"
      };
      //console.log("handleSaveCustomer=>",formData);
    
      try {
        //let cookies = '';
        const response = await PostAPI('/api/CustomerRep/PostCustomer', '', formData, cookies);
        //console.log("Customer saved successfully:", response);
        if (response.data[0].returnCode === "Y") {
          toast.success(`New customer has been saved successfully!`, { style: { backgroundColor: '#e3ffea', color: '#3ed665' } });//response.data[0].returnMsg
          //handleCustomerSelection(response.data[0].returnDocNum, customerListData) // Note: But it wil not work as customerList Data has no updated data
        } else if (response.data[0].returnCode === "F") {
          toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
        } else if (response.data[0].returnCode === "N") {
          toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
        } else {
          toast.error('Failed to Save Customer. Please try again.', { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
        }
        
        setSelectedCustomerID(null);
        setSelectedCustomerData(null);
        setStoredCustomer(null);
        setIsBtnSaving(false);

        toggleNewCustomerSavedModal();
      } catch (error) {
        //console.error("Error saving customer:", error);
        setSelectedCustomerID(null);
        setSelectedCustomerData(null);
        setStoredCustomer(null);
        setIsBtnSaving(false);
        toast.error(error.message, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      }
    }, 100);
  };

  const handleCheckoutPaymentAmountChange = (index, newValue) => {
    /*
    setPaymentListData(prevState =>
      prevState.map((payment, i) =>
        i === index ? { ...payment, amount: newValue } : payment
      )
    );
    */
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
  const validatePaymentListData = (paymentListData) => {
    for (let payment of paymentListData) {
      // Credit/Debit card check
      if ((payment.availablePaymentmethod === "creditCard" || payment.availablePaymentmethod === "debit") && Number(payment.amount) > 0 && (!payment.cardNo || payment.cardNo.trim() === "")) {
        return `Please enter card number for ${payment.paymentModeName}`;
      }

      // Mobile Wallet check
      if (payment.availablePaymentmethod === "mobileWallet" && Number(payment.amount) > 0 && (!payment.transactionID || payment.transactionID.trim() === "")) {
        return `Please enter transaction ID for ${payment.paymentModeName}`;
      }
    }
    return null; // No validation errors
  };
  const handleSaveBill = async () => {
    const paymentError = validatePaymentListData(paymentListData);
    if (paymentError) {
      toast.error(paymentError, { style: { backgroundColor: "#f7edeb", color: "#ff6242" },});
      return;
    }

    //console.log(selectedRecallBillData)
    if (!storedCustomer?.customerID) {
      toast.error("You have to select customer from 'Tag Customer' section!", { style: { backgroundColor: "#f7edeb", color: "#ff6242" }, });
      return;
    }
    //const totalPaymentAmount = paymentListData.filter((payment) => payment.amount && payment.amount > 0).reduce((sum, payment) => sum + Number(payment.amount), 0); 
    if (totalBillAmount !== totalPaidAmount) {
      toast.error("Total bill amount and payment amount do not match!", { style: { backgroundColor: "#f7edeb", color: "#ff6242" },});
      return;
    }

    setIsBtnSaving(true);
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
      returnBillID: (selectedRecallBillData?.length > 0 && item?.lineNum) ? selectedRecallBillData[0]?.billID : 0,
      returnBillLineNum: item?.lineNum || 0,
    }));  
    //const objPayment = paymentListData.filter((payment) => payment.amount && payment.amount > 0 && payment.paymentModeName.toLowerCase() !== 'credit note received').map((payment, index) => ({
    const objPayment = paymentListData.filter((payment) => payment.amount && payment.amount > 0 && payment.availablePaymentmethod.toLowerCase() !== 'creditnotereceived' && payment.availablePaymentmethod.toLowerCase() !== 'creditnoteissued').map((payment, index) => ({
      billID: 0,
      lineNum: index + 1,
      modeOfPayementID: payment?.paymentModeID || 0,
      modeOfPaymentName: payment?.paymentModeName || '',
      value: payment?.amount || 0,
      upItransactionID: payment?.transactionID || '', //(payment.transactionID) ? payment.transactionID : '', //"",
      cardNo: payment?.cardNo || '', //(payment.cardNo) ? payment.cardNo : '', //"",
      cardHolderName: "",
      cardValidity: "",
      cardType: "",
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
    })); 
    //const filteredPaymentsCNR = paymentListData.filter(payment => payment.paymentModeName.toLowerCase() === 'credit note received').map(payment => ({
    const filteredPaymentsCNR = paymentListData.filter(payment => payment.availablePaymentmethod.toLowerCase() === 'creditnotereceived').map(payment => ({
        paymentModeID: payment.paymentModeID,
        paymentModeName: payment.paymentModeName,
    })); 
    const objPayment2 = (storedCNReceived || []).filter(item => item.usedAmount > 0).map((item, index) => ({
      billID: 0,
      lineNum: objPayment.length + index + 1,
      modeOfPayementID: filteredPaymentsCNR[0]?.paymentModeID || 0,
      modeOfPaymentName: filteredPaymentsCNR[0]?.paymentModeName || '',
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
      tenderAmount: 0,
    }));
    const formData = {
      billID: 0,
      billNo: "",
      billDate: today,  //today.toLocaleDateString('en-GB').split('/').join('-'),  //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      storeID: getCookieValue("DefaultStoreId") || 0, //cookies.DefaultStoreId, // Get store ID
      storeCode: "",
      storeName: "",
      terminalNo: "",
      customerID: storedCustomer?.customerID || 0,
      customerName: storedCustomer? `${storedCustomer.customerFirstName} ${storedCustomer.customerMiddleName} ${storedCustomer.customerLastName}`.trim() : "",
      promotionID: storedPromotion?.promotionID || 0,
      discountID: storedDiscount?.discountID || 0,
      totalNoOfItem: scannedItemListData.length || 0,
      billSaleAmt: 0,
      billReturnAmt: 0,
      billMRPAmt: 0,
      billBasicAmt: 0,
      billGrossAmt: 0,
      billDiscAmt: (coupon1Code) ? 150 : 0, //0,
      billNetAmt: 0,
      billChargeAmt: 0,
      billRoundoffAmt: 0,
      billNetPayableAmt: totalBillAmount || 0,
      billRemarks: remarks,
      noOfBillPrint: 0,
      originalDocumentID: 0,
      originalDocumentNo: "",
      originalDocumentDate: "",
      returnDocumentID: selectedRecallBillData?.[0]?.billID || 0, //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billID : 0,
      returnDocumentNo: selectedRecallBillData?.[0]?.billNo || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billNo : "",
      returnDocumentDate: selectedRecallBillData?.[0]?.billDate || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billDate : "",
      enteredBy: getCookieValue("UserId") || 0, //cookies.UserId, //Get Logged-In ID
      usedFor: "I",
      coupon1: coupon1Code,
      coupon2: coupon2Code,
      objDetails: objDetails,
      //objPayment: objPayment, 
      objPayment: [...objPayment, ...objPayment2]
    };
    console.log("handleSaveBill=>",formData);

    try {
      //let cookies = '';
      const response = await PostAPI("/api/BillRep/PostSaleBill-1", '', formData, cookies);
      //console.log("Bill has been saved successfully:", response);

      if (response.data[0].returnCode === "Y") {
        toast.success(`Bill has been saved successfully!`, { style: { backgroundColor: '#e3ffea', color: '#3ed665' } });//response.data[0].returnMsg
        //handleAllStateClear();
        setScannedItemListData([]);
        //setPaymentListData([]);
        const clearedPaymentList = paymentListData.map((payment) => ({
          ...payment,
          amount: '',                         // Clear the amount
          upItransactionID: '',               // Clear UPI transaction ID
          transactionID: '',                   // Clear UPI transaction ID
          cardNo: '',                         // Clear Card No if any
          showNote: false,                    // Hide note field
          showTenderAmt: false, 
          tenderAmount: 0
        }));
        setPaymentListData(clearedPaymentList);

        setCheckoutSaveBillDocNum(response.data[0].returnDocNum);
        setCheckoutSaveBillDocEntry(response.data[0].returnDocEntry);
        setCheckoutSaveBillType('Bill')
        setIsCheckoutSaveModalOpen(true);        
      } else if (response.data[0].returnCode === "F") {
        toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      } else if (response.data[0].returnCode === "N") {
        toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      } else {
        toast.error('Failed to Save Bill. Please try again.', { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      }    
      setIsBtnSaving(false);  
    } catch (error) {
      //console.error("Error saving bill:", error);
      toast.error(error.message, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      setIsCheckoutSaveModalOpen(false);
      setIsBtnSaving(false);
    } 
  };
  const handleBillPrint = () => {
    //console.log("Printing bill...");
    //window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank");
    let UserId = getCookieValue("UserId");
    let checkoutSaveBillDocEN = checkoutSaveBillDocEntry; //'DB10000042';
    //window.open(`http://deehub.connectcloud365.com:25693/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    window.open(`${import.meta.env.VITE_SERVER_DEV_REPORT}` + `/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    handleAllStateClear();
    setIsCheckoutSaveModalOpen(false);
  };
  const handleReprintBill = (bill) => {
    //console.log("Printing bill...",bill);
    let UserId = getCookieValue("UserId");
    let checkoutSaveBillDocEN = bill.billID;
    window.open(`${import.meta.env.VITE_SERVER_DEV_REPORT}` + `/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|R&id3=2&uid=${UserId}`, "_blank");
    handleAllStateClear();
    setIsCheckoutSaveModalOpen(false);
  };
    

  const handleSaveHoldBill = async () => {
    if (!storedCustomer?.customerID) {
      toast.error("You have to select customer from 'Tag Customer' section!", { style: { backgroundColor: "#f7edeb", color: "#ff6242" }, });
      return;
    }

    setIsBtnSaving(true);
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
      returnBillID: 0,            //(selectedRecallBillData?.length > 0 && item?.lineNum) ? selectedRecallBillData[0]?.billID : 0,
      returnBillLineNum: 0,       //item?.lineNum || 0,
    }))
    const objPayment_old = paymentListData.filter((payment) => payment.amount && payment.amount > 0 && payment.paymentModeName.toLowerCase() !== 'credit note received').map((payment, index) => ({
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
      billDate: today,  //today.toLocaleDateString('en-GB').split('/').join('-'), //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      storeID: getCookieValue('DefaultStoreId') || 0, //cookies.DefaultStoreId, // Get store ID
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
      enteredBy: getCookieValue('UserId') || 0, //cookies.UserId, //Get Logged-In ID
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
        //handleAllStateClear();

        fetchRecallBillListData();

        setScannedItemListData([]);
        //setPaymentListData([]);
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

        setCheckoutSaveBillDocNum(response.data[0].returnDocNum)
        setCheckoutSaveBillDocEntry(response.data[0].returnDocEntry);
        setCheckoutSaveBillType('Hold Bill');
        setIsCheckoutSaveModalOpen(true);
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
      setIsBtnSaving(false);
    } catch (error) {
      //console.error("Error saving hold bill:", error);
      toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      setIsCheckoutSaveModalOpen(false);
      setIsBtnSaving(false);
    }
  };
  const handleSelectRecallBillCheckboxChange = (BillID) => {
    const checkedBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
    //console.log(checkedBoxes[0].value)
  
    if (checkedBoxes.length > 1) {
      setSelectedRecallBillID(null);
    } else if (checkedBoxes.length === 1) {
      setSelectedRecallBillID(checkedBoxes[0].value);
    } else {
      setSelectedRecallBillID(null);
    }
  };
  const fetchSelectedBillDeatilsList = async (selectedBillID) => {
    setLoading(true);
    try {
      let PJsonData = {};
      let PType = `?BillID=${selectedBillID}`;
      let responseJson = await GetAPI( `/api/Bill/GetSaleBill`, PType, PJsonData, cookies);
      const responseJsonData = responseJson.data ? [responseJson.data] : [];  
      setSelectedRecallBillData(responseJsonData || []);
      setLoading(false);
    } catch (error) {
      setSelectedRecallBillData([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedRecallBillID === null && (!selectedRecallBillData || selectedRecallBillData.length === 0)) {
      setSelectedRecallBillID(null);
      setSelectedRecallBillData([]);
      setStoredRecallBill(null);
    } else{
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
      const updatedPaymentList = paymentListData.map(payment => ({
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
      }));
      setPaymentListData(updatedPaymentList);

      //console.log("selectedRecallBillData==>",selectedRecallBillData)
      const firstItem = selectedRecallBillData[0];
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
      const allItemDetails = Array.isArray(firstItem?.objDetails)
        ? firstItem.objDetails.map(item => {
            const taxRateUpdated = item.taxRate;
            const taxAmount = ((item.mrp * taxRateUpdated) / 100) * item.quantity;
            const taxableAmount = (item.mrp * item.quantity) - taxAmount;

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
              hsnsacCode: item.hsNorSACcode
            };
          })
      : [];     
      setScannedItemListData(allItemDetails);
      setPrevScannedItemListData(allItemDetails);
    }
  }, [selectedRecallBillID && selectedRecallBillData]);  

  const toggleNoteField = (index) => {
    const updated = [...paymentListData];
    updated[index].showNote = !updated[index].showNote;
    setPaymentListData(updated);
  };
  const toggleTenderAmtField = (index) => {
    const updated = [...paymentListData];
    updated[index].showTenderAmt = !updated[index].showTenderAmt;
    setPaymentListData(updated);
  };
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      //console.log("key:", e.key, "code:", e.code, "keyCode:", e.keyCode, "ctrl:", e.ctrlKey);

      // Detect CTRL + I => 'Item Search'
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        toggleItemList();
      }
      // Detect CTRL + O => 'Check Out'
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        toggleCheckout();
      }
      // Detect CTRL + X => 'Clear'
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        handleAllStateClear();
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
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();        
        toggleNewCustomerModal();
        setShowNewCustomerModal(true); // I have to put this extra line as becuase sometime CTRL + M not able to open the 'New Customer' due to TRUE
      }           
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect CTRL + H => 'Hold Bill'
      if (e.ctrlKey && e.key === 'h') {
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
        handleSaveHoldBill();
      }
      // Detect CTRL + P => 'Apply Promotion'
      if (e.ctrlKey && e.key === 'p') {
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
        toggleApplyPromotionModal();
      }
      // Detect CTRL + D => 'Apply Discount'
      if (e.ctrlKey && e.key === 'd') {
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
        toggleApplyDiscountModal();
      }
      // Detect CTRL + G => 'Tag Customer'
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalBillAmount]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect CTRL + R => 'Recall Bill'
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        if (recallBillListData === 0) {
          toast.error("No hold bill has been saved or drafted.", {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          });
          return;
        }
        toggleApplyRecallBillModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recallBillListData]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect CTRL + A => 'Apply Customer'
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        if (!selectedCustomerID || selectedCustomerID.customerID === 0) {
          toast.error("No customer has been selected.", {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          });
          return;
        }
        handleApplyCustomer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCustomerID]);
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNewCustomerModal, showCheckout]);


  useEffect(() => {
    if (inputBarCodeRef.current) {
      inputBarCodeRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (showRecallBillModal && inputRecallBillSearchTextRef.current) {
      inputRecallBillSearchTextRef.current.focus();
    }
  }, [showRecallBillModal]);
  useEffect(() => {
    if (showTagCustomerModal && inputCustomerSearchTextRef.current) {
      inputCustomerSearchTextRef.current.focus();
    }
  }, [showTagCustomerModal]);
  useEffect(() => {
    if (showNewCustomerModal && inputCustomerSaveDataMobileRef.current) {
      inputCustomerSaveDataMobileRef.current.focus();
    }
  }, [showNewCustomerModal]);
  useEffect(() => {
    if (inputCheckOutCashRef.current) {
      inputCheckOutCashRef.current.focus();
    }
  }, [showCheckout]);
  useEffect(() => {
    if (inputItemListSearchTextRef.current) {
      inputItemListSearchTextRef.current.focus();
    }
  }, [showItemList]);
  
  //Note:
	const toggleSearchBillModal = () => {
    setSearchBillFromDate('');
    setSearchBillToDate('');
    setSearchBillPhoneNumber('');
    setSearchBillCustomerName('');

    //setSelectedBillDetailsData(null);

    setShowSearchBillModal((prev) => !prev);
  };
  //Note:
  const toggleSelectBillModal = () => {
    setSelectBillSearchText('');
    //setSelectedBillID(null);

    //setShowSelectBillModal((prev) => !prev);
    setShowSelectBillModal((prev) => {
      if (!prev) {
          fetchSearchBillList();
      }
      return !prev;
    });    
  };
  //Note:
  const fetchSearchBillList = async () => {
    setLoading(true);
    try {
      let PJsonData = {};
      let formattedFromDate = searchBillFromDate ? new Date(searchBillFromDate).toLocaleDateString('en-GB').replace(/\//g, '-'): '';
      let formattedToDate = searchBillToDate ? new Date(searchBillToDate).toLocaleDateString('en-GB').replace(/\//g, '-'): '';
      let PType = `?BillID=0&FromDate=${formattedFromDate}&ToDate=${formattedToDate}&Mobile=${searchBillPhoneNumber}&CustomerName=${searchBillCustomerName}`;
      
      let responseJson = await GetAPI( `/api/Bill/GetAllSaleBill`, PType, PJsonData, cookies);
      const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : [];
      setSelectBillListData(responseJsonData || []);
      setFilteredSelectBillData(responseJsonData || []);
      setLoading(false);
    } catch (error) {
      setSelectBillListData([]);
      setFilteredSelectBillData([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectBillSearch = (searchText) => {
    setSelectBillSearchText(searchText);
    setSelectBillCurrentPage(1);
    if (searchText.trim() === "") {
      setFilteredSelectBillData(selectBillListData);
    } else {
      const filteredData = selectBillListData.filter((item) =>
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.billDate.includes(searchText)
      );
      setFilteredSelectBillData(filteredData);
    }
  };
  const totalSelectBillPages = Math.ceil(filteredSelectBillData.length / selectBillPerPage);
  const startSelectBillIndex = (selectBillCurrentPage - 1) * selectBillPerPage;
  const currentSelectedBill = filteredSelectBillData.slice(startSelectBillIndex, startSelectBillIndex + selectBillPerPage);
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
      setIsCouponApplied(true);
    }
  };
  useEffect(() => {
    if (coupon1Code && isCouponApplied === false && totalBillAmount < 1000) {
      setIsCouponApplied(false);
      setCoupon1Code('');
    }
  }, [totalBillAmount]);

  return (
    <div className="relative z-30 bg-white min-h-screen overflow-x-hidden">
      <div className='flex justify-between items-center'>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Billing Request</h1>
          <Link to="/transaction/billing/billing-request-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg mb-6">
              Go to Billing Request 2
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-700 border border-gray-300 rounded-md p-4 w-fit bg-gray-50 shadow-sm">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-gray-500" />
            Short Key List
          </div>

          <div className="border border-gray-300 rounded-sm w-full max-w-6xl mb-2">
            {/* Title Bar */}
            {/* <div className="flex items-center justify-between bg-gray-100 px-3 py-1 border-b border-gray-300">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <span>⚡</span>
                <span>Short Key List</span>
              </div>
            </div> */}

            {/* Shortcut Grid 💾 */}
            <div className="grid grid-cols-5 gap-1 p-1">
              {[
                { key: 'Ctrl + I', label: 'Item Search', icon: '🔍' },
                { key: 'Ctrl + O', label: 'Check Out', icon: '💳' },
                { key: 'Ctrl + G', label: 'Tag Customer', icon: '🏷️' },
                { key: 'Ctrl + M', label: 'New Customer', icon: '🙍‍♂️' },
                { key: 'Ctrl + A', label: 'Apply Customer', icon: '✔️' },
                { key: 'Ctrl + H', label: 'Hold Bill', icon: '⏸️' },
                { key: 'Ctrl + R', label: 'Recall Bill', icon: '📤' },
                { key: 'Ctrl + B', label: 'Reprint Bill', icon: '🖨️' },
                { key: 'Ctrl + P', label: 'Apply Promotion', icon: '🎁' },
                { key: 'Ctrl + D', label: 'Apply Discount', icon: '💸' },
                // { key: 'Ctrl + S', label: 'Save', icon: '✅' }, 
                { key: 'Ctrl + X', label: 'Clear', icon: '❌' },
              ].map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-1.5 py-[2px] border border-gray-200 rounded-sm bg-white hover:bg-gray-50"
                >
                  <span className="text-[10px] font-semibold bg-gray-100 px-1 py-px rounded-sm text-gray-700 min-w-[34px] text-center">
                    {shortcut.key}
                  </span>
                  <span className="flex items-center gap-0.5 leading-none text-[10px]">
                    <span>{shortcut.icon}</span>
                    <span>{shortcut.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className='flex gap-2 mb-6'>
          <Button disabled>Billing</Button>
          <Link to="/transaction/billing/billing-return">
            <Button>Return</Button>
          </Link>
          {/* <Button>Return</Button> */}
          <Button onClick={handleAllStateClear}>Clear</Button>
        </div>
      </div>
      <div className="mt-6 grid gap-6 grid-cols-[1fr,80px]">
        <div className="grid gap-6 grid-cols-[2fr,1fr] relative z-30">
          {/* Left Section */}
          <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-2xl border border-gray-300" style={{ border: '1px solid #d1d5db' }}>
            <div className="space-y-6 w-full">
              {/* Scan Here Section */}
              <div className="border-b border-gray-200 pb-4 w-full">
                <h2 className="text-xl font-semibold">Scan Here</h2>
                <input placeholder="Scan Barcode..." value={barCodeInput} ref={inputBarCodeRef} onChange={(e) => setBarCodeInput(e.target.value)} onKeyDown={handleEnterPress}className="mt-2 py-1 px-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {/* Scanned Products Section */}
              <div className="box overflow-y-auto w-full">
                <h2 className="text-xl font-semibold mb-2">Scanned Products</h2>
                <div className="overflow-x-auto border rounded-md w-full min-h-[200px] max-h-[300px] overflow-y-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <TableHeader>
                      <TableRow className="bg-gray-200 h-8">
                        <TableHead className="h-8">No.</TableHead>
                        <TableHead className="h-8">Image</TableHead>
                        <TableHead className="h-8">Barcode</TableHead>
                        <TableHead className="h-8 w-[250px] min-w-[100px]">Item Name</TableHead>
                        <TableHead className="h-8">MRP</TableHead>
                        <TableHead className="h-8">Rate</TableHead>
                        <TableHead className="h-8">Quantity</TableHead>
                        <TableHead className="h-8">Discount Amt</TableHead>
                        <TableHead className="h-8">Promo Amt</TableHead>
                        <TableHead className="h-8">Total Amt</TableHead>
                        <TableHead className="h-8">Sales Person</TableHead>
                        <TableHead className="h-8">HSN Code</TableHead>
                        <TableHead className="h-8">Tax Rate</TableHead>
                        <TableHead className="h-8">Tax Amount</TableHead>
                        <TableHead className="h-8">Per Item Discount</TableHead>
                        <TableHead className="h-8">Per Item Promo Amt</TableHead>
                        <TableHead className="h-8">Taxable Amt</TableHead>
                        <TableHead className="h-8">Actions</TableHead>
                        <TableHead className="h-8">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* {console.log("scannedItemListData==>",scannedItemListData)} */}
                    {scannedItemListData?.length ? (
                        scannedItemListData.map((item, index) => (
                        <TableRow key={(index + 1)} className={item.discountPrice ? "text-green-500 font-medium" : ""}>
                          <td className="p-2">{(index + 1)}</td>
                          <td className="p-2"><span className="text-xl cursor-pointer hover:text-blue-500" onClick={toggleImageModal}>🖼️</span></td>
                          <td className="p-2">{item.barCode}</td>
                          <td className="p-2 w-[250px] min-w-[200px]">{item.itemName}</td>
                          <td className="p-2">{item.mrp}</td>
                          <td className="p-2">{item.retailPrice}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">{item.discountPrice}</td>
                          <td className="p-2">{item.promoPrice}</td>
                          <td className="p-2">{item.totalPrice}</td>
                          <td className="p-2">{item.salesPerson}</td>
                          <td className="p-2">{item.hsnsacCode}</td>
                          <td className="p-2">
                            {item.taxRate}
                            {/* {item.taxRateUpdated} */}
                          </td>
                          <td className="p-2">{item.taxAmount}</td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2">{item.taxableAmount}</td>
                          <td className="p-2 flex items-center justify-center gap-1">
                            <Button size="xs" className="px-2 py-1 text-xs" onClick={() => handleQuantityChange(index, -1)} disabled={item.quantity <= 1}>-</Button>
                            <Button size="xs" className="px-2 py-1 text-xs" onClick={() => handleQuantityChange(index, 1)}>+</Button>
                          </td>
                          <td className="p-2 text-center">
                            <span className="text-red-500 text-lg cursor-pointer hover:text-red-700" onClick={() => setDeleteItemIndex(index)}>🗑️</span>
                          </td>
                        </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <td colSpan={19} className="text-center py-8 text-gray-500">No item scanned yet</td>
                        </TableRow>
                      )}
                    </TableBody>
                  </table>
                </div>
              </div>
              {/* Buttons Section */}
              <div className="flex gap-3 flex-wrap mt-12 !mt-12">
                {/* <Button className="px-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700" onClick={toggleTagCustomerModal}> */}
                {/* <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} onClick={handleTagCustomerClick} disabled={totalBillAmount === 0}>  */}
                <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? (storedCustomer ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-600 text-white hover:bg-red-700") : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} onClick={handleTagCustomerClick} disabled={totalBillAmount === 0}>
                  Tag Customers
                </Button>                
                {/* <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} onClick={toggleApplyPromotionModal} disabled={totalBillAmount === 0}> */}
                <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? (storedPromotion ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-600 text-white hover:bg-red-700") : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} onClick={toggleApplyPromotionModal} disabled={totalBillAmount === 0}>
                  Apply Promotions
                </Button>
                {/* <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} onClick={toggleApplyDiscountModal} disabled={totalBillAmount === 0}> */}
                <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? (storedDiscount ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-600 text-white hover:bg-red-700") : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} onClick={toggleApplyDiscountModal} disabled={totalBillAmount === 0}>
                  Apply Discounts
                </Button>
                {/* <Button onClick={toggleApplyHoldBillModal} className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}> */}
                {/* <Button onClick={toggleApplyHoldBillModal} className={`px-3 rounded-lg shadow-md ${holdBillListData.length > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={holdBillListData.length === 0}> */}
                <Button onClick={handleSaveHoldBill} className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0 || isBtnSaving}>
                  {isBtnSaving ? 'Hold Billing...' : 'Hold Bill'}  
                </Button>
                {/* <Button onClick={toggleAppyRecallBillModal} className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}> */}
                {/* <Button onClick={toggleApplyRecallBillModal} className={`px-3 rounded-lg shadow-md ${recallBillListData.length > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={recallBillListData.length === 0}> */}
                <Button onClick={toggleApplyRecallBillModal} className={`px-3 rounded-lg shadow-md bg-red-600 text-white hover:bg-red-700`}>
                  Recall Bill
                </Button>
                {/* <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}> */}
                  <Button className={`px-3 rounded-lg shadow-md bg-gray-400 text-gray-200 cursor-not-allowed`} disabled>
                  Void Bill
                </Button>
                {/* <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}> */}
                <Button onClick={toggleSearchBillModal} className={`px-3 rounded-lg shadow-md bg-indigo-600 text-white hover:bg-indigo-700`}>
                  Reprint Bill
                </Button>
                {/* <Button className={`px-3 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}>
                  Save
                </Button> */}
              </div>
              <div className="flex gap-3 flex-wrap mt-12 bg-white-200 text-black">
                <textarea
                  className="border border-gray-400 rounded-lg p-2 w-64 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)} 
                ></textarea>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex flex-col gap-6 w-full max-w-[400px] h-full" style={{ border: '0px solid blue' }}>
            {/* Right Section - "Customer" (Futore) */}

            {/* Right Section - "POS Order" */}
            {showPosOrder && (
              <div className="w-full p-2 bg-white shadow-xl rounded-2xl border border-gray-200">
                <h2 className="text-xl font-semibold m-2 text-red-400">Please Contact Your Admin.. (POS Order)</h2>
              </div>
            )}
            {/* Right Section - "Advance" */}
            {showAdvance && (
              <div className="w-full p-2 bg-white shadow-xl rounded-2xl border border-gray-200">
                <h2 className="text-xl font-semibold m-2 text-red-400">Please Contact Your Admin.. (Advance)</h2>
              </div>
            )}
            {/* Right Section - "CshDrawer In " */}
            {showCashDrawerIn && (
              <div className="w-full p-2 bg-white shadow-xl rounded-2xl border border-gray-200">
                <h2 className="text-xl font-semibold m-2 text-red-400">Please Contact Your Admin.. (Cash Drawer In)</h2>
              </div>
            )}
            {/* Right Section - "CshDrawer Out " */}
            {showCashDrawerOut && (
              <div className="w-full p-2 bg-white shadow-xl rounded-2xl border border-gray-200">
                <h2 className="text-xl font-semibold m-2 text-red-400">Please Contact Your Admin.. (Cash Drawer Out)</h2>
              </div>
            )}
            {/* Right Section - "Item List" */}
            {showItemList && (
              <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-300 flex flex-col gap-4">
                <h3 className="text-xl font-semibold">Item List</h3>
                <input
                  placeholder="Search Item..."
                  value={itemSearchText}
                  ref={inputItemListSearchTextRef}
                  onChange={(e) => handleItemSearch(e.target.value)}
                  className="w-48 py-1 px-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="overflow-x-auto border rounded-md">
                  <Table className="w-full text-left border-collapse">
                    <TableHeader>
                      <TableRow className="bg-gray-200">
                        <TableHead className="px-3 py-2 border">No.</TableHead>
                        <TableHead className="px-3 py-2 border">Barcode</TableHead>
                        {/* <TableHead className="px-3 py-2 border">Item Code</TableHead> */}
                        <TableHead className="px-3 py-2 border">Item Name</TableHead>
                        <TableHead className="px-3 py-2 border">MRP</TableHead>
                        <TableHead className="px-3 py-2 border">Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan="5" className="text-center text-blue-500 py-2">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : currentItemData?.length ? (
                        currentItemData.map((item, index) => (
                          <TableRow
                            key={index + 1}
                            value={item.itemCode}
                            className="cursor-pointer hover:bg-red-100"
                            onClick={() => handleSelectItem(item.itemCode)}
                          >
                            <TableCell className="px-3 py-2 border">{index + 1}</TableCell>
                            <TableCell className="px-3 py-2 border">{item.barCode}</TableCell>
                            {/* <TableCell className="px-3 py-2 border">{item.itemCode}</TableCell> */}
                            <TableCell className="px-3 py-2 border">{item.itemName}</TableCell>
                            <TableCell className="px-3 py-2 border">{item.mrp}</TableCell>
                            <TableCell className="px-3 py-2 border">{item.stock}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan="5" className="text-center py-2">
                            No data found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() => setItemCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={itemCurrentPage === 1}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {itemCurrentPage} of {totalItemPages}
                  </span>
                  <Button
                    onClick={() => setItemCurrentPage((prev) => Math.min(prev + 1, totalItemPages))}
                    disabled={itemCurrentPage === totalItemPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            {/* Right Section - "Checkout" */}
            {showCheckout && (
              <div className="w-full p-2 bg-white shadow-xl rounded-2xl border border-gray-200">
                <h2 className="text-xl font-semibold m-2">Check Out</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                    <p className="font-normal w-1/3 min-w-[120px]">Total Bill Amount:</p>
                    {/* <input type="text" value={scannedItemListData?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0} className="flex-1 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled  /> */}
                    <input type="text" value={totalBillAmount} className="flex-1 p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" disabled  />
                  </div>
                  {/* 
                  {paymentListData.map((payment, index) => (
                    <div key={index} className="flex items-center gap-4 border p-3 rounded-lg shadow-sm">
                      <p className="font-normal w-1/3 min-w-[120px]">{payment.paymentModeName}:</p>
                      <div className="flex flex-1 gap-2">
                        <input type="text" value={payment.amount} onChange={(e) => handleCheckoutPaymentAmountChange(index, e.target.value)} className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        <Button className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">
                          Note
                        </Button>
                      </div>
                    </div>
                  ))} 
                  */}
                  {/* {console.log(paymentListData)} */}
                  {loading ? (
                       <>
                       Loading...
                       </>
                      ) : paymentListData.filter(payment => payment.availablePaymentmethod !== 'creditNoteIssued').map((payment, index) => {
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
                    const name = payment.availablePaymentmethod?.toLowerCase() || '';
                    const showNoteButton =
                      name.includes('credit card') || name.includes('creditcard') ||
                      name.includes('debit card') || name.includes('debitcard') || name.includes('debit') ||
                      name.includes('mobilewallet') || name.includes('mobileWallet') || name.includes('mobile wallet') ||
                      name.includes('paytm') ||
                      name.includes('gpay');
                    const showCNRSelectButton = name.includes('credit note received') || name.includes('creditnotereceived');
                    const showTenderAmtButton = name.includes('cash');

                    const isCard = name.includes('credit card') || name.includes('creditcard') || name.includes('debit card') || name.includes('debitcard') || name.includes('debit');
                    const isUPI = name.includes('paytm') || name.includes('gpay') || name.includes('mobilewallet') || name.includes('mobileWallet') || name.includes('mobile wallet');
                    const isCashTenderAmt = name.includes('cash');

                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-1 border p-3 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <p className="font-normal w-1/3 min-w-[120px]">
                            {payment.paymentModeName}:
                          </p>
                          <div className="flex flex-1 gap-2">
                            <input
                              type="number"
                              ref={
                                payment.availablePaymentmethod?.toLowerCase() === "cash"
                                  ? inputCheckOutCashRef
                                  : null
                              }
                              // value={payment.amount}
                              value={
                                payment.availablePaymentmethod === "Credit Note Received" || payment.availablePaymentmethod?.toLowerCase() === "credit note received" || payment.availablePaymentmethod?.includes('credit note received') || payment.availablePaymentmethod?.includes('creditnotereceived')
                                  ? totalUsedAmount
                                  : payment.amount
                              }
                              onChange={(e) => handleCheckoutPaymentAmountChange(index, e.target.value)}
                              className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                              disabled={showCNRSelectButton}
                              // disabled={
                              //   !storedCustomer?.customerID || selectedCNReceivedList.length === 0
                              // }
                            />
                            {showNoteButton && (
                              <Button
                                className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                                onClick={() => toggleNoteField(index)}
                              >
                                Note
                              </Button>
                            )}
                            {showCNRSelectButton && (
                              <Button
                                className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                                //disabled={!storedCustomer?.customerID}
                                onClick={() => handleCNReceivedClick()}
                              >
                                Select
                              </Button>
                            )}
                            {showTenderAmtButton && (
                              <Button
                                className="bg-blue-300 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                                disabled={!payment?.amount}
                                onClick={() => toggleTenderAmtField(index)}
                              >
                                Tender Amount
                              </Button>
                            )}
                          </div>
                        </div>

                        {payment.showNote && (
                          <div className="ml-[30px] mt-1">
                            {isCard && (
                              <div className="flex items-center gap-2">
                                <label className="min-w-[100px]">Card No:</label>
                                <input
                                  type="number"
                                  value={payment.cardNo || ''}
                                  //onChange={(e) => handlePaymentNoteChange(index, 'cardNo', e.target.value)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 50) {
                                      handlePaymentNoteChange(index, 'cardNo', value);
                                    }
                                  }}
                                  className="p-2 border rounded-lg w-full"
                                />
                              </div>
                            )}
                            {isUPI && (
                              <div className="flex items-center gap-2">
                                <label className="min-w-[150px]">Transaction / Ref No:</label>
                                <input
                                  type="number"
                                  value={payment.transactionID || ''}
                                  //onChange={(e) => handlePaymentNoteChange(index, 'transactionID', e.target.value)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 50) {
                                      handlePaymentNoteChange(index, 'transactionID', value);
                                    }
                                  }}
                                  className="p-2 border rounded-lg w-full"
                                />
                              </div>
                            )} 
                          </div>
                        )}
                        {payment.showTenderAmt && (
                          <div className="ml-[30px] mt-1">
                            {isCashTenderAmt && (
                              <>
                              <div className="flex items-center gap-2">
                                <label className="min-w-[150px]">Tender Amount:</label>
                                <input
                                  type="number"
                                  value={payment.tenderAmount || ''}
                                  onChange={(e) => handlePaymentNoteChange(index, 'tenderAmount', e.target.value)}
                                  className="p-2 border rounded-lg w-full"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="min-w-[150px]">Refund Amount:</label>
                                <input
                                  type="number"
                                  value={payment.refundAmount || ''}
                                  //onChange={(e) => handlePaymentNoteChange(index, 'refundAmount', e.target.value)}
                                  disabled
                                  className="p-2 border rounded-lg w-full"
                                />
                              </div>
                              </>
                            )} 
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  <div className="border p-3 rounded-lg shadow-sm mt-2">
                    {/* <p className="font-semibold mb-2">Coupons</p> */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      {/* Coupon 1 */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Coupon</label> {/* Note: Temporary disbaled on 03-10-2025 instructed by Arnab */}
                        <input
                          type="text"
                          value={coupon1Code}
                          onChange={(e) => setCoupon1Code(e.target.value)}
                          className="p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter Coupon code"
                          //placeholder="Enter Coupon 1 code" //Note: Temporary disbaled on 03-10-2025 instructed by Arnab
                        />
                      </div>
                      {/* Coupon 2 */}
                      {/* Note: Temporary disbaled on 03-10-2025 instructed by Arnab
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Coupon 2</label>
                        <input
                          type="text"
                          value={coupon2Code}
                          onChange={(e) => setCoupon2Code(e.target.value)}
                          className="p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter Coupon 2 code"
                        />
                      </div> 
                      */}
                    </div>
                    {/* Apply Button */}
                    <div className="flex justify-end">
                      <Button
                        className={`px-4 py-2 rounded-lg shadow-md ${
                          isCouponApplied
                            ? "bg-green-500 text-white cursor-not-allowed" // after applied
                            //: coupon1Code && coupon2Code && totalBillAmount >= 1500   //Note: Temporary disbaled on 03-10-2025 instructed by Arnab
                            : coupon1Code && totalBillAmount >= 1000 
                            ? "bg-blue-500 text-white hover:bg-blue-600" // ready to apply
                            : "bg-gray-300 text-gray-500 cursor-not-allowed" // invalid
                        }`}
                        //disabled={isCouponApplied || !(coupon1Code && coupon2Code && totalBillAmount >= 1500)}    //Note: Temporary disbaled on 03-10-2025 instructed by Arnab
                        disabled={isCouponApplied || !(coupon1Code && totalBillAmount >= 1000)}
                        onClick={handleApplyCoupon}
                      >
                        {isCouponApplied ? "Applied" : "Apply"}
                      </Button>

                      {/* <Button
                        className={`px-4 py-2 rounded-lg shadow-md ${
                          coupon1Code && coupon2Code && totalBillAmount >= 1500
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!(coupon1Code && coupon2Code && totalBillAmount >= 1500)}
                        onClick={() => handleApplyCoupon()}
                      >
                        Apply
                      </Button> */}

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
                <div className="flex justify-between mt-8">
                  <Button className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500" onClick={toggleCheckout}>
                    Cancel
                  </Button>
                  <div className="px-4 py-2 bg-white shadow border rounded-md text-sm text-gray-800 leading-tight w-48">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500 font-medium">Total Paid Amount:</span>
                      <span className="font-medium">{totalPaidAmount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Total Due Amount:</span>
                      <span className="font-medium">{totalDueAmount || 0}</span>
                    </div>
                  </div>
                  {/* <Button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"> */}
                  <Button onClick={handleSaveBill} className={`px-5 py-2 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0 || isBtnSaving}>
                    {isBtnSaving ? 'Saving...' : 'Save'}
                  </Button>
                  {/* <Button onClick={handleHoldBill} className={`px-5 py-2 rounded-lg shadow-md ${totalBillAmount > 0 ? 'bg-green-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`} disabled={totalBillAmount === 0}>
                    Hold
                  </Button> 
                  <Button className={`px-5 py-2 rounded-lg shadow-md ${totalBillAmount > 0 ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}>
                    Refund
                  </Button> */}
                </div>
              </div>
            )}            
            {/* Right Section - "Promotions/Summary" */}                       
            <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-300 w-full max-w-[400px]">
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-nowrap">
                  <label className="text-sm font-medium w-auto min-w-[110px]">Customer Name</label>
                  <input type="text" value={`${storedCustomer?.customerFirstName || ""} ${storedCustomer?.customerMiddleName || ""} ${storedCustomer?.customerLastName || ""}`.trim()} readOnly className="w-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <Button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap">Show Bill Details</Button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-auto min-w-[110px]">No. of Items</label>
                  {/* <input type="text" value={`${scannedItemListData?.length || ""}`.trim()} readOnly className="w-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" /> */}
                  <input type="text" value={scannedItemListData?.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} readOnly className="w-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  Total Bill Amount: {totalBillAmount}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-auto min-w-[110px]">Applied Promotion</label>
                  <input type="text" value={`${storedPromotion?.promotionName || ""}`.trim()} className="w-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  {/* <Button onClick={() => { setStoredPromotion(null); setSelectedPromotionID(null); setSelectedPromotionData(null); }} readOnly className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 whitespace-nowrap">Clear Promotion</Button> */}
                  <Button onClick={() => { clearPromotion(); }} readOnly className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 whitespace-nowrap">Clear Promotion</Button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-auto min-w-[110px]">Discount Amount</label>
                  {/* <input type="text" value={`${storedDiscount?.discountValue ?? ""}`.trim()} readOnly className="w-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" /> */}
                  {/* <input type="text" value={`${storedDiscount ? (storedDiscount.appliedOn === "I" ? totalDiscountAmount.toFixed(2) : storedDiscount.appliedOn === "L" ? storedDiscount.discountValue : "") : ""}`.trim()} readOnly className="w-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" /> */}
                  <input type="text" value={`${totalDiscountAmount ? totalDiscountAmount.toFixed(2) : ""}`.trim()} readOnly className="w-[100px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
            </div>
            {/*  Right Section - "Add New Customer"  */}
            {showNewCustomerModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-5/12">
                  <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
                  <div className="space-y-4">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-gray-700 font-medium">Mobile Number</label>
                      <input
                        type="text"
                        name="mobile"
                        ref={inputCustomerSaveDataMobileRef}
                        //value={customerSaveData.mobile}
                        value={
                          /^\d+$/.test(customerSearchText) && currentCustomerData.length === 0
                            ? customerSearchText
                            : customerSaveData.mobile
                        }
                        onChange={handleCustomerInputChange}
                        placeholder="Mobile Number"
                        className="w-full border p-2 rounded-md"
                      />
                      {customerErrors.mobile && <p className="text-red-500 text-sm">{customerErrors.mobile}</p>}
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-gray-700 font-medium">First Name</label>
                      <input
                        type="text"
                        name="customerFirstName"
                        value={customerSaveData.customerFirstName}
                        onChange={handleCustomerInputChange}
                        placeholder="First Name"
                        className="w-full border p-2 rounded-md"
                      />
                      {customerErrors.customerFirstName && <p className="text-red-500 text-sm">{customerErrors.customerFirstName}</p>}
                    </div>

                    {/* Middle Name */}
                    <div>
                      <label className="block text-gray-700 font-medium">Middle Name</label>
                      <input
                        type="text"
                        name="customerMiddleName"
                        value={customerSaveData.customerMiddleName}
                        onChange={handleCustomerInputChange}
                        placeholder="Middle Name"
                        className="w-full border p-2 rounded-md"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-gray-700 font-medium">Last Name</label>
                      <input
                        type="text"
                        name="customerLastName"
                        value={customerSaveData.customerLastName}
                        onChange={handleCustomerInputChange}
                        placeholder="Last Name"
                        className="w-full border p-2 rounded-md"
                      />
                      {customerErrors.customerLastName && <p className="text-red-500 text-sm">{customerErrors.customerLastName}</p>}
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-gray-700 font-medium">WhatsApp Number</label>
                      <input
                        type="text"
                        name="whatsAppNo"
                        value={customerSaveData.whatsAppNo}
                        onChange={handleCustomerInputChange}
                        placeholder="WhatsApp Number"
                        className="w-full border p-2 rounded-md"
                      />
                      {customerErrors.whatsAppNo && <p className="text-red-500 text-sm">{customerErrors.whatsAppNo}</p>}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <Button className="px-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleSaveCustomer} disabled={isBtnSaving}>
                      {isBtnSaving ? 'Saving...' : 'Save'} 
                    </Button>
                    <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleNewCustomerModalCancel}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Right Section Icons */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center gap-4">
          <TootlTipWrapper title="Item Search">
            <button onClick={toggleItemList} className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3">
              <TextSearch size={18} />
            </button>
          </TootlTipWrapper>
          <TootlTipWrapper title="Checkout">
            {/* <button onClick={toggleCheckout} className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3"> */}
            <button onClick={() => { toggleCheckout(); handleCheckoutApplyPromotion(); }} className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3">
              <ShoppingBag size={18} />
            </button>
          </TootlTipWrapper>
          <TootlTipWrapper title="POS Order">
            <button onClick = {togglePosOrder} className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3">
              <Blinds size={18} />
            </button>
          </TootlTipWrapper>
          <TootlTipWrapper title="Advance">
            <button onClick={toggleAdvance} className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3">
              <TicketX size={18} />
            </button>
          </TootlTipWrapper>
          <TootlTipWrapper title="Cash Drawer In">
            <button onClick={toggleCashDrawerIn} className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3">
              <Stamp size={18} />
            </button>
          </TootlTipWrapper>
          <TootlTipWrapper title="Cash Drawer Out">
            <button onClick={toggleCashDrawerOut} className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3">
              <DiamondPercent size={18} />
            </button>
          </TootlTipWrapper>
          {/* <TootlTipWrapper title="Apply Promotions">
            <button className="h-10 w-10 text-red-600/80 bg-red-100 rounded-full flex items-center justify-center shadow-md shadow-red-400/50 hover:bg-red-200 mb-3">
              <ChartSpline size={18} />
            </button>
          </TootlTipWrapper> */}
        </div>
      </div>

      {/* Modal 'Customers' */}
      {showTagCustomerModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Tag Customer</h2>
            <input type="text" placeholder="Search Customer..." ref={inputCustomerSearchTextRef} value={customerSearchText} onChange={(e) => handleCustomerSearch(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-md mb-4"/>
            <div className="box overflow-y-auto w-full">
              <div className="overflow-x-auto border rounded-md w-full">
                <table className="w-full border-collapse border border-gray-300">
                  <TableHeader>
                    <TableRow className="bg-gray-200 h-8">
                      <TableHead className="h-8">Select</TableHead>
                      <TableHead className="h-8">No.</TableHead>
                      <TableHead className="h-8">Mobile</TableHead>
                      <TableHead className="h-8">Whatsapp No</TableHead>
                      <TableHead className="h-8">First Name</TableHead>
                      <TableHead className="h-8">Middle Name</TableHead>
                      <TableHead className="h-8">Last Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {loading ? (
                        <TableRow>
                          <TableCell colSpan="7" className="text-center text-blue-500 py-2">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : currentCustomerData?.length ? (
                    currentCustomerData.map((item, index) => (
                      <TableRow key={(index + 1)}>
                        <td className="p-2"><input type="checkbox" value={item.customerID} checked={selectedCustomerID ? selectedCustomerID === item.customerID : storedCustomer?.customerID === item.customerID} onChange={() => handleCustomerSelection(item.customerID, item)}/></td>
                        <td className="p-2">{(index + 1)}</td>
                        <td className="p-2">{item.mobile}</td>
                        <td className="p-2">{item.whatsAppNo}</td>
                        <td className="p-2">{item.customerFirstName}</td>
                        <td className="p-2">{item.customerMiddleName}</td>
                        <td className="p-2">{item.customerLastName}</td>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="7" className="text-center">No data found</TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setCustomerCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={customerCurrentPage === 1}>
                Previous
              </Button>
              <span>
                Page {customerCurrentPage} of {totalCustomerPages}
              </span>
              <Button onClick={() => setCustomerCurrentPage((prev) => Math.min(prev + 1, totalCustomerPages))} disabled={customerCurrentPage === totalCustomerPages}>
                Next
              </Button>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Button className="px-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700" onClick={toggleNewCustomerModal}>
                + New Customer
              </Button>
              <div className="flex gap-4">
                <Button className="px-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleApplyCustomer} disabled={!selectedCustomerID}>
                  Apply
                </Button>
                <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleTagCustomerModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal 'Promotions' */}
      {showApplyPromoModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Apply Promotion</h2>
            <input type="text" placeholder="Search Promotion..." value={promotionSearchText} onChange={(e) => handlePromotionSearch(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-md mb-4" />
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
                    <TableRow key={(index + 1)}>
                      <td className="p-2"><input type="checkbox" value={item.promotionID} checked={selectedPromotionID ? selectedPromotionID === item.promotionID : storedPromotion?.promotionID === item.promotionID} onChange={() => handlePromotionSelection(item.promotionID, item)}/></td>
                      <td className="p-2">{(index + 1)}</td>
                      <td className="p-2">{item.promotionName}</td>
                      <td className="p-2">{item.promotionType}</td>
                      <td className="p-2">{item.isActive}</td>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center">No data found</TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setPromotionCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={promotionCurrentPage === 1}>
                Previous
              </Button>
              <span>
                Page {promotionCurrentPage} of {totalPromotionPages}
              </span>
              <Button onClick={() => setPromotionCurrentPage((prev) => Math.min(prev + 1, totalPromotionPages))} disabled={promotionCurrentPage === totalPromotionPages}>
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleApplyPromotion} disabled={!selectedPromotionID}>
                {isBtnSaving ? 'Applying...' : 'Apply'}
              </Button>
              <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleApplyPromotionModal}>
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
            <input type="text" placeholder="Search Discount..." value={discountSearchText} onChange={(e) => handleDiscountSearch(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-md mb-4" />
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
                    <TableRow key={(index + 1)}>
                      <td className="p-2"><input type="checkbox" value={item.discountID}   checked={selectedDiscountID ? selectedDiscountID === item.discountID : storedDiscount?.discountID === item.discountID} onChange={() => handleDiscountSelection(item.discountID, item)} /></td>
                      <td className="p-2">{(index + 1)}</td>
                      <td className="p-2">{item.discountName}</td>
                      <td className="p-2">{item.appliedOn}</td>
                      <td className="p-2">{item.employeeDiscount}</td>
                      <td className="p-2">{item.isActive}</td>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center">No data found</TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setDiscountCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={discountCurrentPage === 1}>
                Previous
              </Button>
              <span>
                Page {discountCurrentPage} of {totalDiscountPages }
              </span>
              <Button onClick={() => setDiscountCurrentPage((prev) => Math.min(prev + 1, totalDiscountPages))}disabled={discountCurrentPage === totalDiscountPages }>
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleApplyDiscount} disabled={!selectedDiscountID}>
                Apply
              </Button>
              <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleApplyDiscountModal}>
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
            <input type="text" placeholder="Search Hold Bill..." value={holdBillSearchText} onChange={(e) => handleHoldBillSearch(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-md mb-4"/>
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
                          <td className="p-2"><input type="checkbox" value={item.billID} checked={selectedHoldBillID ? selectedHoldBillID === item.billID : storedHoldBill?.billID === item.billID } onChange={() => handleHoldBillSelection(item.billID, item)} /></td>
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
              <Button onClick={() => setHoldBillCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={holdBillCurrentPage === 1}>
                Previous
              </Button>
              <span>
                Page {holdBillCurrentPage} of {totalHoldBillPages}
              </span>
              <Button onClick={() =>setHoldBillCurrentPage((prev) => Math.min(prev + 1, totalHoldBillPages))} disabled={holdBillCurrentPage === totalHoldBillPages}>
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleApplyHoldBill} disabled={!selectedHoldBillID}>
                Apply
              </Button>
              <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleApplyHoldBillModal}>
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
            <input type="text" placeholder="Search Recall Bill..." ref={inputRecallBillSearchTextRef} value={recallBillSearchText} onChange={(e) => handleRecallBillSearch(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-md mb-4" />
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
                      ) :  currentRecallBillData?.length ? (
                      currentRecallBillData.map((item, index) => (
                        <TableRow key={index + 1}>
                          <td className="p-2"><input type="checkbox" value={item.billID} onChange={() => handleSelectRecallBillCheckboxChange(item.billID)} /></td>
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
              <Button onClick={() => setRecallBillCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={recallBillCurrentPage === 1}>
                Previous
              </Button>
              <span>
                Page {recallBillCurrentPage} of {totalRecallBillPages}
              </span>
              <Button onClick={() =>setRecallBillCurrentPage((prev) => Math.min(prev + 1, totalRecallBillPages))} disabled={recallBillCurrentPage === totalRecallBillPages}>
                Next
              </Button>
            </div>
            <div className="mt-4 gap-4 flex justify-end">
              <Button className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleApplyRecallBill} disabled={!selectedRecallBillID}>
                Recall
              </Button>
              <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleApplyRecallBillModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal 'Image' */}
      {imageModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[450px] h-[450px] flex flex-col items-center justify-center p-4">
            <h2 className="text-lg font-semibold mb-2">Item Image</h2>
            <div className="flex items-center justify-center w-[350px] h-[350px]">
              <span className="text-[300px] cursor-pointer hover:text-blue-500">🖼️</span>
            </div>
            <div className="mt-4">
              <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleImageModal}>
                Close
              </Button>
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
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setDeleteItemIndex(null)}>No</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={confirmDeleteItem}>Yes</button>
            </div>
          </div>
        </div>
      )}
      {/* Bill Save Modal */}
      {isCheckoutSaveModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] text-center">
            <div className="text-green-600 text-4xl mb-3">✔️</div>
            <p className="text-lg font-semibold mb-2">{checkoutSaveBillType} saved successfully!</p>
            {checkoutSaveBillDocNum && (
              <p className="text-sm text-gray-600">
                {checkoutSaveBillType} Number: <strong>{checkoutSaveBillDocNum}</strong>
              </p>
            )}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={handleBillPrint} hidden={checkoutSaveBillType === 'Hold Bill'} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Print Bill</button>
              <button onClick={() => {handleAllStateClear(); setIsCheckoutSaveModalOpen(false);}}className="px-4 py-2 bg-gray-300 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      {/* 'Credit Note Received' Modal */}
      {showCNReceivedModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-8/12">
            <h2 className="text-xl font-semibold mb-4">Credit Note</h2>
            <input type="text" placeholder="Search CN..." value={cNReceivedSearchText} onChange={(e) => handleCNReceivedSearch(e.target.value)} className="w-60 p-2 border border-gray-300 rounded-md mb-4" />
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
                        const cnWithApplied = getCNUsedAndDue(selectedCNReceivedList, totalBillAmount).find(cn => cn.billID === item.billID);
                        const used = cnWithApplied?.usedAmount || 0;
                        const due = cnWithApplied ? cnWithApplied.dueAmount : item.amount;

                        return (
                          <tr key={index} className="h-10">
                            <td className="border px-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedCNReceivedList.some((cn) => cn.billID === item.billID)}
                                onChange={() => handleCNReceivedSelection(item.billID, item)}
                              />
                            </td>
                            <td className="border px-2">{item.billNo}</td>
                            <td className="border px-2">{item.billDate.split(' ')[0]}</td>
                            <td className="border px-2">{`${storedCustomer?.customerFirstName || ""} ${storedCustomer?.customerMiddleName || ""} ${storedCustomer?.customerLastName || ""}`.trim()}</td>
                            <td className="border px-2 text-right">{item.amount}</td>
                            <td className="border px-2 text-right">{due}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">No data found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setCNReceivedCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={cNReceivedCurrentPage === 1}>
                Previous
              </Button>
              <span>
                Page {cNReceivedCurrentPage} of {totalCNReceivedPages}
              </span>
              <Button onClick={() => setCNReceivedCurrentPage((prev) => Math.min(prev + 1, totalCNReceivedPages))} disabled={cNReceivedCurrentPage === totalCNReceivedPages}>
                Next
              </Button>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <Button className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={handleApplyCNReceived} disabled={selectedCNReceivedList.length === 0}>
                Apply
              </Button>
              {/* <Button className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={toggleCNReceivedModal}> */}
              {/* setPaymentListData(prev =>prev.map(payment =>payment.availablePaymentmethod === "creditnotereceived" ? { ...payment, amount: "" } : payment)); */}
              {/* <Button className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={() => {toggleCNReceivedModal(); setStoredCNReceived(null); setSelectedCNReceivedList([]); }}> */}
              <Button className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={handleClearAndCloseCNReceived}> 
                Clear & Close
              </Button>
            </div>
          </div>
        </div>        
      )}
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
                    <span>From:</span> <input type="date" value={searchBillFromDate} onChange={(e) => setSearchBillFromDate(e.target.value)} className="border p-2 rounded-md" />
                    <span>To:</span> <input type="date" value={searchBillToDate} onChange={(e) => setSearchBillToDate(e.target.value)} className="border p-2 rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="font-medium block">Phone Number</label>
                  <input type="text" value={searchBillPhoneNumber} onChange={(e) => setSearchBillPhoneNumber(e.target.value)} placeholder="Enter phone number" className="border p-2 rounded-md w-full" />
                </div>
                <div>
                  <label className="font-medium block">Customer Name</label>
                  <input type="text" value={searchBillCustomerName} onChange={(e) => setSearchBillCustomerName(e.target.value)} placeholder="Enter customer name" className="border p-2 rounded-md w-full" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end items-end">
              <div className="flex gap-6 ">
                <Button onClick={toggleSearchBillModal} className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700">
                  Cancel
                </Button>
                <Button onClick={toggleSelectBillModal} className={`px-3 text-white rounded-lg shadow-md ${!(searchBillPhoneNumber.trim() || searchBillCustomerName.trim() || (searchBillFromDate && searchBillToDate)) ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`} disabled={!(searchBillPhoneNumber.trim() || searchBillCustomerName.trim() || (searchBillFromDate && searchBillToDate))}>
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
            <input type="text" placeholder="Search Bill No..." value={selectBillSearchText} onChange={(e) => handleSelectBillSearch(e.target.value)}className="w-48 p-2 border border-gray-300 rounded-md mb-4" />
            <table className="w-full border border-gray-300 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-200 h-8">
                  {/* <TableHead className="h-8">Select</TableHead> */}
                  <TableHead className="h-8">Bill No</TableHead>
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
                      <td className="p-2">{bill.billDate}</td>
                      <td className="p-2">{bill.totalNoOfItem}</td>
                      <td className="p-2">{bill.billNetPayableAmt}</td>
                      <td className="p-2">{bill.customerName}</td>
                      <td className="p-2"><Printer onClick={() => handleReprintBill(bill)} className="w-5 h-5" style={{cursor:'pointer'}} /></td>
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
              <Button onClick={() => setSelectBillCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={selectBillCurrentPage === 1}>
                Previous
              </Button>
              <span>
                Page {selectBillCurrentPage} of {totalSelectBillPages}
              </span>
              <Button onClick={() => setSelectBillCurrentPage((prev) => Math.min(prev + 1, totalSelectBillPages))}disabled={selectBillCurrentPage === totalSelectBillPages} >
                Next
              </Button>
            </div>
            <div className="mt-4 flex justify-end items-end">
              <div className="flex gap-6 ">                
                <Button
                  className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleSelectBillModal}  >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingRequest