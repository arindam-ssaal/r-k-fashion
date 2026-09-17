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
import '../../../../../../style.css';

import { __getCookieValue } from '@/common/authCookies';


const PettyCashExpense = () => {
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

  // Petty Cash Details state
  const [pettyCashRows, setPettyCashRows] = useState([
    {
      id: 1,
      type: '',
      slNo: 1,
      pettyCashHead: '',
      particulars: '',
      amount: ''
    }
  ]);
  const [pettyCashData, setPettyCashData] = useState([]);
  const [filteredPettyCashData, setFilteredPettyCashData] = useState([]);

  


  useEffect(() => {
    const fetchServerDate = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        let PType = '';
        //let cookies = '';
        let responseJson = await GetAPI('/api/Bill/GetServerDate', PType, PJsonData, cookies);
        console.log('fetchServerDate=>', responseJson.data); 
        setToday(responseJson.data || '');      
     
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    //if (cookies.AuthToken) {
      fetchServerDate();
    //}
  }, []);


  useEffect(() => {
    const fetchStoreWisePaymentListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        let PType = '?StoreID=' + __getCookieValue("DefaultStoreId"); //'?StoreID=' + cookies.DefaultStoreId;
        //let cookies = '';
        let responseJson = await GetAPI('/api/StoreMaster/GetStoreWisePayment', PType, PJsonData, cookies);
        //console.log('fetchStoreWisePaymentListData=>', responseJson); 
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
    const fetchPettyCashData = async () => {
      try {
        let PJsonData = {};
        let PType = '?StoreID=' + __getCookieValue("DefaultStoreId");
        let responseJson = await GetAPI('/api/PettyCash/GetStoreWisePettyCash', PType, PJsonData, cookies);
        console.log('fetchPettyCashData=>', responseJson); 
        setPettyCashData(responseJson.data || []);
        setFilteredPettyCashData(responseJson.data || []);
      } catch (error) {
        console.error('Error fetching petty cash data:', error);
        setPettyCashData([]);
        setFilteredPettyCashData([]);
      }
    }

    fetchPettyCashData();
  }, []);

  useEffect(() => {
    const fetchItemMasterListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        //let PType = '';
        //let cookies = '';
        //let responseJson = await GetAPI('/api/Item/GetAllItem', PType, PJsonData, cookies);
        let PType = '?StoreID=' + __getCookieValue("DefaultStoreId"); //'?StoreID=' + cookies.DefaultStoreId;
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
        const PType = `?BillDate=${formattedDate}&StoreID=`+ __getCookieValue("DefaultStoreId");
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
        const PType = `?BillDate=${formattedDate}&StoreID=`+ __getCookieValue("DefaultStoreId");
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
  }, [today]);
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
  : scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0) || 0);
  //const totalDiscountAmount = scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0;
  //const totalDiscountAmount = storedDiscount?.appliedOn === "I" ? scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0 : "";
  const totalDiscountAmount = storedDiscount ? (storedDiscount.appliedOn === "I" ? scannedItemListData?.reduce((sum, item) => sum + (parseFloat(item.discountPrice) * item.quantity || 0), 0) || 0 : storedDiscount.appliedOn === "L" ? storedDiscount.discountValue : "") : "";
  const totalPaidAmount = paymentListData.filter((payment) => payment.amount && payment.amount > 0).reduce((sum, payment) => sum + Number(payment.amount), 0);
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
        payment.paymentModeName === "Credit Note Received" ||
        payment.paymentModeName?.toLowerCase() === "credit note received" ||
        payment.paymentModeName?.includes('credit note received') ||
        payment.paymentModeName?.includes('creditnotereceived')
          ? { ...payment, amount: totalUsedAmount }
          : payment
      )
    );
    toggleCNReceivedModal();
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
        const updatedScannedItemListData = scannedItemListData.map(item => ({
          ...item,
          promoPrice: "",
          totalPrice: item.mrp * item.quantity  //item.retailPrice * item.quantity
        }));
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
            return {
              ...item,
              discountPrice,
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
    setFilteredPromotionData([]);
    setFilteredPromotionData(promotionListData);
    setPromotionCurrentPage(1);
    setSelectedPromotionID(null);
    setSelectedPromotionData(null);
    setStoredPromotion(null);
  
    setDiscountSearchText("");
    setFilteredDiscountData([]);
    setFilteredDiscountData(discountListData);
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
  
    setShowItemList(false);
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



    setPaymentListData(prevData =>
      prevData.map(item => ({ ...item, amount: "", upItransactionID: "", cardNo: "", tenderAmount: 0 }))
    );
    /*
    const clearedPaymentList = paymentListData.map((payment) => ({
      ...payment,
      amount: '',                         // Clear the amount
      upItransactionID: '',               // Clear UPI transaction ID
      cardNo: '',                         // Clear Card No if any
      showNote: false,                    // Hide note field
      showTenderAmt: false, 
      tenderAmount: 0
    }));
    setPaymentListData(clearedPaymentList);
    */
  };

  /*useEffect(() => {
    console.log("Cookies in PettyCashExpense:", cookies);
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
    setStoredDiscount(selectedDiscountData);
    toggleApplyDiscountModal();
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
    if (selectedPromotionData && Object.keys(selectedPromotionData).length > 0 &&  Array.isArray(scannedItemListData) && scannedItemListData.length > 0) {
      setIsBtnSaving(true);
      setStoredPromotion(selectedPromotionData); // set state

      let updatedScannedItemListDataWRTDiscnt = [];
      const hasEmptyDiscount = scannedItemListData.some(item => item.discountPrice === "");
      if(!hasEmptyDiscount){
        const updatedScannedItemListData = scannedItemListData.map(item => ({
          ...item,
          discountPrice: "",
          totalPrice: item.mrp * item.quantity //item.retailPrice * item.quantity
        }));
        //setScannedItemListData(updatedScannedItemListData);
        //setPrevScannedItemListData(updatedScannedItemListData);
        setSelectedDiscountID(null);
        setSelectedDiscountData(null);
        setStoredDiscount(null);
        updatedScannedItemListDataWRTDiscnt = updatedScannedItemListData;
      } else{
        updatedScannedItemListDataWRTDiscnt = scannedItemListData;
      }

      const formData = {
        promotionID: selectedPromotionData.promotionID || 0,
        minimumBilling: 0,
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
          const promoPrice = promoItem.promotionValue || '';
          const totalPrice = (scannedItem.totalPrice || 0) - promoPrice;

          return {
            ...scannedItem,
            promoPrice: promoPrice,
            totalPrice: totalPrice >= 0 ? totalPrice : 0  // optional: avoid negative
          };
        }
        return scannedItem;
      });
      //console.log("updatedScannedItemListData=>",updatedScannedItemListData)

      setScannedItemListData(updatedScannedItemListData);
      setIsBtnSaving(false);

      toggleApplyPromotionModal();
    } else {
      toast.error('Promotion Data or Item Data is missing or empty.', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      });
      setIsBtnSaving(false);
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
      if (isModalOpen && today) {
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
          const taxAmount = (((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
          const taxableAmount = ((mrp * newQuantity) - taxAmount).toFixed(2); //mrp - ((mrp * taxRateUpdated) / 100) * newQuantity;
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
              const taxAmount = (((mrp * taxRateUpdated) / 100) * quantity).toFixed(2);
              const taxableAmount = ((mrp * quantity) - taxAmount).toFixed(2); //mrp - ((mrp * taxRateUpdated) / 100) * quantity;
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
        const taxAmount = (((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
        const taxableAmount = ((mrp * newQuantity) - taxAmount).toFixed(2); //mrp - ((mrp * taxRateUpdated) / 100) * newQuantity;

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

    //setLoading(true);
    const PJsonData = {};
    const PType = '?Barcode=' + trimmedBarcode + '&StoreID=' + __getCookieValue("DefaultStoreId");
    let responseJson = await GetAPI('/api/Item/GetItemBarcodeWise', PType, PJsonData);
    console.log("/api/Item/GetItemBarcodeWise -> handleSelectBarcodeItem==>",responseJson)
    //setLoading(false);

    const matchedItems = Array.isArray(responseJson.data) ? responseJson.data : [];
    console.log(matchedItems)

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
          // ✅ Update quantity for existing item
          const existingItem = updatedList[existingIndex];
          const newQuantity = existingItem.quantity + 1;

          const taxAmount = (((mrp * taxRateUpdated) / 100) * newQuantity).toFixed(2);
          const taxableAmount = ((mrp * newQuantity) - taxAmount).toFixed(2);

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
    setCustomerSaveData({ ...customerSaveData, [name]: value });
  };  
  const validateCustomerForm = () => {
    let newErrors = {};
    //console.log(customerSaveData)

    //if (!customerSaveData.customerFirstName.trim()) newErrors.customerFirstName = "First Name is required.";
    //if (!customerSaveData.customerLastName.trim()) newErrors.customerLastName = "Last Name is required.";
    if (!customerSaveData.mobile.trim()) newErrors.mobile = "Mobile Number is required.";
    //if (customerSaveData.mobile.length > 10) newErrors.mobile = "Mobile Number cannot exceed 10 digits.";
    //if (customerSaveData.whatsAppNo.length > 10) newErrors.whatsAppNo = "WhatsApp Number cannot exceed 10 digits.";
    if (!customerSaveData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required.";
    } else if (customerSaveData.mobile.length > 10) {
      newErrors.mobile = "Mobile Number cannot exceed 10 digits.";
    }
    
    if (customerSaveData.whatsAppNo && customerSaveData.whatsAppNo.length > 10) {
      newErrors.whatsAppNo = "WhatsApp Number cannot exceed 10 digits.";
    }
  
    setCustomerErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSaveCustomer = async () => {
    if (!validateCustomerForm()) return;
  
    setIsBtnSaving(true);
    const formData = {
      customerID: 0,
      customerFirstName: customerSaveData?.customerFirstName || '',
      customerMiddleName: customerSaveData?.customerMiddleName || '',
      customerLastName: customerSaveData?.customerLastName || '',
      gender: "M",
      mobile: customerSaveData?.mobile || '',
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
      storeID: __getCookieValue("DefaultStoreId"),   //cookies.DefaultStoreId,
      enteredBy: __getCookieValue("UserId"),         //cookies.UserId,
      usedFor: "I"
    };
    console.log("handleSaveCustomer=>",formData);
  
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

    const paymentMode = updated[index].paymentModeName?.toLowerCase() || '';

    if (paymentMode === 'cash') {
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
  const handleSaveBill = async () => {
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
    const objPayment = paymentListData.filter((payment) => payment.amount && payment.amount > 0 && payment.paymentModeName.toLowerCase() !== 'credit note received').map((payment, index) => ({
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
    const filteredPaymentsCNR = paymentListData.filter(payment => payment.paymentModeName.toLowerCase() === 'credit note received').map(payment => ({
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
      billDate: today,  //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      storeID: __getCookieValue("DefaultStoreId"), //cookies.DefaultStoreId, // Get store ID
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
      billDiscAmt: 0,
      billNetAmt: 0,
      billChargeAmt: 0,
      billRoundoffAmt: 0,
      billNetPayableAmt: totalBillAmount || 0,
      billRemarks: "",
      noOfBillPrint: 0,
      originalDocumentID: 0,
      originalDocumentNo: "",
      originalDocumentDate: "",
      returnDocumentID: selectedRecallBillData?.[0]?.billID || 0, //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billID : 0,
      returnDocumentNo: selectedRecallBillData?.[0]?.billNo || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billNo : "",
      returnDocumentDate: selectedRecallBillData?.[0]?.billDate || '', //(selectedRecallBillData && selectedRecallBillData.length > 0) ? selectedRecallBillData[0]?.billDate : "",
      enteredBy: __getCookieValue("UserId"), //cookies.UserId, //Get Logged-In ID
      usedFor: "I",
      objDetails: objDetails,
      //objPayment: objPayment, 
      objPayment: [...objPayment, ...objPayment2]
    };
    console.log("handleSaveBill=>",formData);

    try {
      //let cookies = '';
      const response = await PostAPI("/api/BillRep/PostSaleBill", '', formData, cookies);
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
    let UserId = __getCookieValue("UserId");
    let checkoutSaveBillDocEN = checkoutSaveBillDocEntry; //'DB10000042';
    //window.open(`http://deehub.connectcloud365.com:25693/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    window.open(`${import.meta.env.VITE_SERVER_DEV_REPORT}` + `/web/WebForm1.aspx?id1=1&id2=${checkoutSaveBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    handleAllStateClear();
    setIsCheckoutSaveModalOpen(false);
  };
  const handleReprintBill = (bill) => {
    //console.log("Printing bill...",bill);
    let UserId = __getCookieValue("UserId");
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
      billDate: today,  //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
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
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        /*
        if (totalBillAmount === 0) {
          toast.error("Please choose an item or scan a product to proceed.", {
            style: {
              backgroundColor: '#f7edeb',
              color: '#ff6242',
            },
          });
          return;
        }
        */
        handleTagCustomerClick();
      } 
      // Detect CTRL + M => 'New Customer'
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();        
        toggleNewCustomerModal();
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
          handleSaveCustomer(); // for Add New Customer modal
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

  // Petty Cash Handlers
    const handlePettyCashTypeChange = (rowIndex, value) => {
      const updatedRows = pettyCashRows.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, type: value, pettyCashHead: '' }; // Reset petty cash head when type changes
        }
        return row;
      });
      setPettyCashRows(updatedRows);
    };
  
    const handlePettyCashHeadChange = (rowIndex, value) => {
      const updatedRows = pettyCashRows.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, pettyCashHead: value };
        }
        return row;
      });
      setPettyCashRows(updatedRows);
    };
  
    const handlePettyCashFieldChange = (rowIndex, field, value) => {
      const updatedRows = pettyCashRows.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, [field]: value };
        }
        return row;
      });
      setPettyCashRows(updatedRows);
    };
  
    const addPettyCashRow = () => {
      const newRow = {
        id: pettyCashRows.length + 1,
        type: '',
        slNo: pettyCashRows.length + 1,
        pettyCashHead: '',
        particulars: '',
        amount: ''
      };
      setPettyCashRows([...pettyCashRows, newRow]);
    };
  
    const deletePettyCashRow = (rowIndex) => {
      if (pettyCashRows.length > 1) {
        const updatedRows = pettyCashRows.filter((_, index) => index !== rowIndex);
        // Re-number the serial numbers
        const reNumberedRows = updatedRows.map((row, index) => ({
          ...row,
          slNo: index + 1
        }));
        setPettyCashRows(reNumberedRows);
      }
    };
  
    const getFilteredPettyCashOptions = (type) => {
      if (!type || !filteredPettyCashData.length) return [];
      
      const filteredOptions = filteredPettyCashData.filter(cash => {
        if (type === 'Payment') {
          return cash.modeOfOperation === 'P' || cash.modeOfOperation === 'p';
        } else if (type === 'Receipt') {
          return cash.modeOfOperation === 'R' || cash.modeOfOperation === 'r';
        }
        return false;
      });
      
      console.log(`Filtered petty cash options for type "${type}":`, filteredOptions);
      return filteredOptions;
    };
  
    const handlePettyCashSave = async () => {
      // Check if any row has missing Type or Petty Cash Head
      const invalidRows = pettyCashRows.filter((row, index) => {
        const hasAnyData = row.type || row.pettyCashHead || row.particulars || row.amount;
        if (hasAnyData) {
          return !row.type || !row.pettyCashHead;
        }
        return false;
      });

      if (invalidRows.length > 0) {
        toast.error('Please select both Type and Petty Cash Head for all rows with data.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' }
        });
        return;
      }

      const validRows = pettyCashRows.filter(row => 
        row.type && row.pettyCashHead && row.particulars && row.amount
      );
  
      if (validRows.length === 0) {
        toast.error('Please fill in all required fields for at least one row.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' }
        });
        return;
      }
  
      setIsBtnSaving(true);

      const totalPayment = validRows
        .filter(row => row.type === 'Payment')
        .reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);
  
      const totalReceipt = validRows
        .filter(row => row.type === 'Receipt')
        .reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);
  
      const objDetails = validRows.map((row, index) => {
        const selectedPettyCash = filteredPettyCashData.find(
          //cash => cash.pettyCashName === row.pettyCashHead
          cash => cash.pettyCashID == row.pettyCashHead
        );
  
        return {
          documentID: 0,
          lineNum: index + 1,
          pettyCashType: row.type === 'Payment' ? 'O' : 'C',
          pettyCashID: Number(row.pettyCashHead),                   //selectedPettyCash?.pettyCashID || 0,
          pettyCashName: selectedPettyCash?.pettyCashName || "",    //row.type === 'Payment' ? 'O' : 'C', 
          particulars: row.particulars,
          amount: parseFloat(row.amount)
        };
      });
  
      const formData = {
        documentID: 0,
        documentNo: "",
        documentDate: new Date().toISOString().split('T')[0].split('-').reverse().join('-'), 
        storeID: parseInt(cookies.DefaultStoreId || __getCookieValue("DefaultStoreId")),
        totalPayment: totalPayment,
        totalReceipt: totalReceipt,
        enterBy: parseInt(cookies.UserId || __getCookieValue("UserId")),
        payModeID: 0,
        status: "O", 
        usedFor: "I",
        objDetails: objDetails
      };
  
      console.log('Petty Cash Data to Save:', formData);
  
      try {
        const response = await PostAPI('/api/RecPayRep/PostReceiptPayment', '', formData, cookies);
        console.log("Petty Cash saved successfully:", response);
  
        if (response.data && response.data[0] && response.data[0].returnCode === "Y") {
          toast.success('Petty Cash details saved successfully!', {
            style: { backgroundColor: '#e3ffea', color: '#3ed665' }
          });
          
          handlePettyCashCancel();
        } else if (response.data && response.data[0] && response.data[0].returnCode === "F") {
          toast.error(response.data[0].returnMsg || 'Failed to save petty cash details.', {
            style: { backgroundColor: '#f7edeb', color: '#ff6242' }
          });
        } else if (response.data && response.data[0] && response.data[0].returnCode === "N") {
          toast.error(response.data[0].returnMsg || 'Failed to save petty cash details.', {
            style: { backgroundColor: '#f7edeb', color: '#ff6242' }
          });
        } else {
          toast.error('Unexpected response from server.', {
            style: { backgroundColor: '#f7edeb', color: '#ff6242' }
          });
        }

        setIsBtnSaving(false);
      } catch (error) {
        console.error("Error saving petty cash:", error);
        toast.error(error.message || 'An error occurred while saving petty cash details.', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' }
        });
        setIsBtnSaving(false);
      }
    };
  
    const handlePettyCashCancel = () => {
      setPettyCashRows([
        {
          id: 1,
          type: '',
          slNo: 1,
          pettyCashHead: '',
          particulars: '',
          amount: ''
        }
      ]);
    };
  


  return (
    <div className="relative z-30 min-h-screen overflow-x-hidden">
      

      {/* Petty Cash Details Form */}
      <div className="back-white shadow-lg p-6 rounded-xl mt-6 ">
        <h2 className="text-xl font-semibold mb-4 text-c-black ">Petty Cash Details</h2>
        
        {/* Form Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="back-sky-500 ">
                <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Sl.No.</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Petty Cash Head</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Particulars</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pettyCashRows.map((row, index) => (
                <tr key={row.id}>
                  <td className="border border-gray-300 px-3 py-2">
                    <select 
                      value={row.type}
                      onChange={(e) => handlePettyCashTypeChange(index, e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select Type</option>
                      <option value="Payment">Payment</option>
                      <option value="Receipt">Receipt</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      value={row.slNo} 
                      readOnly 
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <select 
                      value={row.pettyCashHead}
                      onChange={(e) => handlePettyCashHeadChange(index, e.target.value)}
                      disabled={!row.type}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                    >
                      <option value="">Select Petty Cash Head</option>
                      {getFilteredPettyCashOptions(row.type).map((option) => (
                        <option key={option.pettyCashID} value={option.pettyCashID}>
                          {option.pettyCashName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="text" 
                      value={row.particulars}
                      onChange={(e) => handlePettyCashFieldChange(index, 'particulars', e.target.value)}
                      placeholder="Enter particulars" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input 
                      type="number" 
                      value={row.amount}
                      onChange={(e) => handlePettyCashFieldChange(index, 'amount', e.target.value)}
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button 
                      onClick={() => deletePettyCashRow(index)}
                      disabled={pettyCashRows.length === 1}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="mt-4">
          <button 
            onClick={addPettyCashRow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Row
          </button>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={handlePettyCashSave}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isBtnSaving}
          >
            {isBtnSaving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={handlePettyCashCancel}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PettyCashExpense