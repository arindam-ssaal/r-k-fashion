import React, { useEffect, useState, useMemo } from 'react';
import {Table,TableBody,TableHead,TableHeader,TableRow,TableCell,} from '@/components/ui/table';
import { Zap, Keyboard, Search, ShoppingCart, User, PauseCircle, RefreshCcw, Printer, PercentCircle, Tag, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { GetAPI, PostAPI } from '../../../../../../services/apiCall';
import { Link } from 'react-router-dom';

const BillingReturn = () => {
  //const today = new Date().toISOString().split('T')[0];
  const [today, setToday] = useState("");
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  const [maxFromToDate, setMaxFromToDate] = useState('');
  const [minFromToDate, setMinFromToDate] = useState('');
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };  
  /*
  const todayDate = new Date(); // today
  const sevenDaysAgo = new Date();  // 7 days ago
  sevenDaysAgo.setDate(todayDate.getDate() - 21);
  const maxFromToDate = formatDate(todayDate); // formatted values
  const minFromToDate = formatDate(sevenDaysAgo);
  */
  //Note: Notis Used
  const getTodayDate = () => {
    const serverDate = new Date(today);

    const year = serverDate.getFullYear();
    const month = String(serverDate.getMonth() + 1).padStart(2, '0');
    const day = String(serverDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

    /*
    //const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    */
  }; 





  const [loading, setLoading] = useState(false);
  const [isBtnSaving, setIsBtnSaving] = useState(false);

  const [barCodeInput, setBarCodeInput] = useState('');
  const [scannedItemListData, setScannedItemListData] = useState([]);
  const [prevScannedItemListData, setPrevScannedItemListData] = useState([]);
  const [deleteItemIndex, setDeleteItemIndex] = useState(null);
  const [imageModal, setImageModal] = useState(false);
  const [paymentListData, setPaymentListData] = useState([]);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showSearchBillModal, setShowSearchBillModal] = useState(false);
  const [showSelectBillModal, setShowSelectBillModal] = useState(false);
  const [showBillDetailsModal, setShowBillDetailsModal] = useState(false);
  const [showApplyIssueCreditNoteModal, setShowApplyIssueCreditNoteModal] = useState(false);

  const [isCheckoutSaveRefundModalOpen, setIsCheckoutSaveRefundModalOpen] = useState(false);
  const [checkoutSaveRefundBillDocNum, setCheckoutSaveRefundBillDocNum] = useState(null);
  const [checkoutSaveRefundBillDocEntry, setCheckoutSaveRefundBillDocEntry] = useState(null);

  const [searchBillFromDate, setSearchBillFromDate] = useState("");
  const [searchBillToDate, setSearchBillToDate] = useState("");
  const [searchBillPhoneNumber, setSearchBillPhoneNumber] = useState("");
  const [searchBillCustomerName, setSearchBillCustomerName] = useState("");

  const [selectBillSearchText, setSelectBillSearchText] = useState('');
  const [selectBillListData, setSelectBillListData] = useState([]);
  const [filteredSelectBillData, setFilteredSelectBillData] = useState([]);
  const [selectBillCurrentPage, setSelectBillCurrentPage] = useState(1);
  const selectBillPerPage = 5;
  const [selectedBillID, setSelectedBillID] = useState(null);
  const [selectedBillData, setSelectedBillData] = useState(null);
  const [storedSelectedBill, setStoredSelectedBill] = useState(null);

  const [selectBillDetailsSearchText, setSelectBillDetailsSearchText] = useState('');
  const [selectBillDetailsListData, setSelectBillDetailsListData] = useState([]);
  const [filteredSelectBillDetailsData, setFilteredSelectBillDetailsData] = useState([]);
  const [selectBillDetailsCurrentPage, setSelectBillDetailsCurrentPage] = useState(1);
  const selectBillDetailsPerPage = 5;
  const [selectedBillDetailsID, setSelectedBillDetailsID] = useState(null);
  const [selectedBillDetailsData, setSelectedBillDetailsData] = useState(null);
  const [storedSelectedBillDetails, setStoredSelectedBillDetails] = useState(null); 

  const totalBillAmount = scannedItemListData.reduce((sum, item) => sum + (item.netAmt || 0), 0);
  const totalPaidAmount = paymentListData.filter((payment) => payment.amount && payment.amount > 0 && ((payment.availablePaymentmethod.toLowerCase() === 'cash' || payment.availablePaymentmethod.toLowerCase() === 'creditnoteissued'))).reduce((sum, payment) => sum + Number(payment.amount), 0);




  const [searchBillReturnFromDate, setSearchBillReturnFromDate] = useState("");
  const [searchBillReturnToDate, setSearchBillReturnToDate] = useState("");
  const [searchBillReturnPhoneNumber, setSearchBillReturnPhoneNumber] = useState("");
  const [searchBillReturnCustomerName, setSearchBillReturnCustomerName] = useState("");

  const [showSearchBillReturnModal, setShowSearchBillReturnModal] = useState(false);
  const [showSelectBillReturnModal, setShowSelectBillReturnModal] = useState(false);

  const [selectBillReturnSearchText, setSelectBillReturnSearchText] = useState("");
  const [selectBillReturnListData, setSelectBillReturnListData] = useState([]);
  const [filteredSelectBillReturnData, setFilteredSelectBillReturnData] = useState([]);
  const [selectBillReturnCurrentPage, setSelectBillReturnCurrentPage] = useState(1);
  const [totalSelectBillReturnPages, setTotalSelectBillReturnPages] = useState(1);
  const [loadingReturn, setLoadingReturn] = useState(false);





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
    if (!today) return;

    const [day, month, year] = today.split("-"); // API: "DD-MM-YYYY"
    const todayDate = new Date(`${year}-${month}-${day}`); // valid date

    const twentyOneDaysAgo = new Date(todayDate);
    twentyOneDaysAgo.setDate(todayDate.getDate() - 21);

    setMaxFromToDate(formatDate(todayDate));
    setMinFromToDate(formatDate(twentyOneDaysAgo));

    setSearchBillFromDate(formatDate(todayDate));
    setSearchBillToDate(formatDate(todayDate));
  }, [today]);

///////////////////////////////////////////////////////////////////////////////////////////

  const handleAllStateClear = () => {
    //setSearchBillSearchText('');
    //setFilteredCustomerData([]);
    //setSearchBillSearchCurrentPage(1);


    setSelectBillSearchText("");
    setSelectBillListData([]);
    setSelectBillListData(selectBillListData);
    setSelectBillCurrentPage(1);
    setSelectedBillID(null);
    setSelectedBillData(null);
    setStoredSelectedBill(null);

    setSelectBillDetailsSearchText("");
    setSelectBillDetailsListData([]);
    setSelectBillDetailsListData(selectBillDetailsListData);
    setSelectBillDetailsCurrentPage(1);
  // setSelectedBillDetailsID(null)
    setSelectedBillDetailsData(null);
    //setStoredBillDetails(null);


    //setIsCheckoutSaveModalOpen(false);
    //setCheckoutSaveBillDocNum(null);
    setCheckoutSaveRefundBillDocNum(null);
    setCheckoutSaveRefundBillDocEntry(null);

    setShowSearchBillModal(false);
    setShowApplyIssueCreditNoteModal(false);

    setShowCheckout(false);

    setScannedItemListData([]);
    setPrevScannedItemListData([]);
    setDeleteItemIndex(null);

    setImageModal(false);
    setBarCodeInput('');

    setPaymentListData((prevData) => prevData.map((item) => ({ ...item, amount: '' })));
  };

///////////////////////////////////////////////////////////////////////////////////////////


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
        //console.log("Server Date =>", serverDateHeader, serverDate);
        setToday(serverDate); 
        */

        const modifiedData = (responseJson.data || []).map(item => ({
          ...item,
          amount: ""
        }));  
        setPaymentListData(modifiedData || []);       
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

  //Note:
  const fetchSelectedBillDeatilsList = async (selectedBillID) => {
    setLoading(true);
    try {
      let PJsonData = {};
      let PType = `?BillID=${selectedBillID}`;
      let responseJson = await GetAPI( `/api/Bill/GetSaleBill`, PType, PJsonData, cookies);
      //const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : []; //Note: As the format was not amn Array
      const responseJsonData = responseJson.data ? [responseJson.data] : [];  
      setSelectBillDetailsListData(responseJsonData || []);
      setFilteredSelectBillDetailsData(responseJsonData || []);
      setLoading(false);
    } catch (error) {
      setSelectBillDetailsListData([]);
      setFilteredSelectBillDetailsData([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectBillDetailsSearch = (searchText) => {
    setSelectBillDetailsSearchText(searchText);
    setSelectBillDetailsCurrentPage(1);
    if (searchText.trim() === "") {
       setFilteredSelectBillDetailsData(selectBillDetailsListData);
    } else {
      //const selectBillDetailsListData_2 = Array.isArray(selectBillDetailsListData) ? selectBillDetailsListData : [];
      const filteredData = selectBillDetailsListData.filter((item) =>
        item.barcode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.quantity.toLowerCase().includes(searchText.toLowerCase()) ||
        item.netAmt.toLowerCase().includes(searchText.toLowerCase())
      );     
      setFilteredSelectBillDetailsData(filteredData);
    }
  };
  const totalSelectBillDetailsPages = Math.ceil(filteredSelectBillDetailsData.length / selectBillDetailsPerPage);
  const startSelectBillDetailsIndex = (selectBillDetailsCurrentPage - 1) * selectBillDetailsPerPage;
  const currentSelectBillDetails = filteredSelectBillDetailsData.slice(startSelectBillDetailsIndex, startSelectBillDetailsIndex + selectBillDetailsPerPage);
  //console.log("currentSelectBillDetails=>",currentSelectBillDetails)
  useEffect(() => {
    if (currentSelectBillDetails.length === 0) {
      setStoredSelectedBillDetails(null);
      setSelectedBillDetailsID(null);
      setSelectedBillDetailsData(null);
    }  /*else {
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
  }, [currentSelectBillDetails]);

  //Note:
  const fetchSearchBillList = async () => {
    setLoading(true);
    try {
      let PJsonData = {};
      let formattedFromDate = searchBillFromDate ? new Date(searchBillFromDate).toLocaleDateString('en-GB').replace(/\//g, '-'): '';
      let formattedToDate = searchBillToDate ? new Date(searchBillToDate).toLocaleDateString('en-GB').replace(/\//g, '-'): '';
      let PType = `?FromDate=${formattedFromDate}&ToDate=${formattedToDate}&Mobile=${searchBillPhoneNumber}&CustomerName=${searchBillCustomerName}`;
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
      let responseJson = await GetAPI( `/api/Bill/GetAllSaleBillRecall`, PType, PJsonData, cookies);
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
  useEffect(() => {
    if (currentSelectedBill.length === 0) {
      setStoredSelectedBill(null);
      setSelectedBillID(null);
      setSelectedBillData(null);
    }
  }, [currentSelectedBill]);

  //Note:
  const toggleSearchBillModal = () => {
    //setSearchBillFromDate(getTodayDate());    //setSearchBillFromDate('');
    //setSearchBillToDate(getTodayDate());      //setSearchBillToDate('');
    setSearchBillPhoneNumber('');
    setSearchBillCustomerName('');

    setSelectedBillDetailsData(null);
    //setPaymentListData([]);
    setScannedItemListData([]);
    setPrevScannedItemListData([]);

    if(totalBillAmount > 0){
      //toggleCheckout();
      setShowCheckout(false);
    }    

    setShowSearchBillModal((prev) => !prev);
  };
  //Note:
  const toggleSelectBillModal = () => {
    setSelectBillSearchText('');
    /*setSelectBillListData([]);
    setFilteredSelectBillData([]);
    setSelectBillCurrentPage(1);*/
    setSelectedBillID(null);
    setSelectedBillData(null);
    setStoredSelectedBill(null);

    //setShowSelectBillModal((prev) => !prev);
    setShowSelectBillModal((prev) => {
      if (!prev) {
          fetchSearchBillList();
      }
      return !prev;
    });    
  };  
  //Note:
  const toggleBillDetailsModal = () => {
    setSelectBillDetailsSearchText('');
    /*setSelectBillDetailsListData([]);
    setFilteredSelectBillDetailsData([]);
    setSelectBillDetailsCurrentPage(1);*/
    setSelectedBillDetailsID(null);
    setSelectedBillDetailsData(null);
    setStoredSelectedBillDetails(null);

    //setShowBillDetailsModal((prev) => !prev);
    setShowBillDetailsModal((prev) => {
      if (!prev) {
        fetchSelectedBillDeatilsList(selectedBillID);
      }
      return !prev;
    });
  };
  //Note:
  const toggleIssueCreditNoteModal = () => {
    setShowApplyIssueCreditNoteModal((prev) => !prev);
  };
  //Note:
  const toggleCheckout = () => {
    setShowCheckout((prev) => !prev);
  };
  //Note:
  const toggleImageModal = () => {
    setImageModal((prev) => !prev);
  }


  //Note:
  const handleCheckoutPaymentAmountChange = (index, newValue) => {
    setPaymentListData((prevState) =>
      prevState.map((payment, i) => (i === index ? { ...payment, amount: newValue } : payment))
    )
  };
  //Note:
  const handleSelectBillCheckboxChange = (BillID) => {
    const checkedBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  
    if (checkedBoxes.length > 1) {
      setSelectedBillID(null);
    } else if (checkedBoxes.length === 1) {
      setSelectedBillID(checkedBoxes[0].value);
    } else {
      setSelectedBillID(null);
    }
  };
  //Note:
  const handleSelectBillDetailsCheckboxChange = (lineNum) => {
    //const selectedIDs = selectedBillDetailsID ? selectedBillDetailsID.split(",") : [];
    const selectedIDs = selectedBillDetailsID ? selectedBillDetailsID.split(",").filter(Boolean) : [];
    const updatedIDs = selectedIDs.includes(lineNum.toString())
      ? selectedIDs.filter((id) => id !== lineNum.toString())
      : [...selectedIDs, lineNum.toString()];
  
    setSelectedBillDetailsID(updatedIDs.join(","));
  };
  //Note:
  const handleSelectAllBillDetails = () => {
    //console.log("handleSelectAllBillDetails=>",currentSelectBillDetails)
    if (Array.isArray(currentSelectBillDetails) && currentSelectBillDetails.length > 0 &&
        Array.isArray(currentSelectBillDetails[0].objDetails) && currentSelectBillDetails[0].objDetails.length > 0) {
  
      const allLineNums = currentSelectBillDetails[0].objDetails.map(item => item.lineNum.toString());
      /*
      setSelectedBillDetailsID(
        (selectedBillDetailsID || "").split(",").length === allLineNums.length
          ? ""
          : allLineNums.join(",")
      );
      */
      const selectedIDs = selectedBillDetailsID ? selectedBillDetailsID.split(",").filter(Boolean) : [];
      const allSelected = allLineNums.every(id => selectedIDs.includes(id));
      setSelectedBillDetailsID(
        allSelected ? "" : allLineNums.join(",")
      );      
    }
  };
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
  };
  //Note:
  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSelectBarcodeItem(barCodeInput.trim())
      setBarCodeInput('');
    }
  };
  //Note:
  const handleSelectBarcodeItem = (barCodeEntered) => {
    const trimmedBarcode = barCodeEntered.trim()
  };
  //Note:
  const confirmDeleteItem = () => {
    if (deleteItemIndex !== null) {
      setScannedItemListData((prevData) => prevData.filter((_, i) => i !== deleteItemIndex));
      setDeleteItemIndex(null);
    }
  };
  //Note:
  const handleBillDetailsReturnClick = () => {
    toggleBillDetailsModal();
    toggleSelectBillModal();
    toggleSearchBillModal();

    console.log("Selected Bill Details ID:", currentSelectBillDetails); //selectedBillDetailsID
    const selectedBillDetailsData = currentSelectBillDetails;
    setSelectedBillDetailsData(selectedBillDetailsData);
    /*Note: As per Old Logic
    const updatedPaymentList = selectedBillDetailsData[0].objPayment.map(payment => ({
        ...payment,
        amount: payment.value
    }));
    setPaymentListData(updatedPaymentList);
    */
    /* Note: As per new Logic */
    //console.log(paymentListData);
    const billPayments = selectedBillDetailsData?.[0]?.objPayment || [];
    const updatedPaymentList = paymentListData.map(payment => {
      const matched = billPayments.find(
        b =>
          //b.modeOfPaymentName?.toLowerCase().trim() === payment.paymentModeName?.toLowerCase().trim()
          b.modeOfPayementID === payment.paymentModeID
      );

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
        forexBalance: matched?.forexBalance ?? ''
      };
    });
    // const updatedPaymentList = paymentListData.map(payment => ({
    //     ...payment,
    //     amount: payment.value,
    //     modeOfPaymentName: payment.paymentModeName,
    //     modeOfPayementID: payment.paymentModeID
    //     /*paymentModeName: payment.paymentModeName,
    //     paymentModeID: payment.paymentModeID*/
    // }));
    setPaymentListData(updatedPaymentList);

    //setScannedItemListData(selectedBillDetailsData[0].objDetails);
    //setPrevScannedItemListData(selectedBillDetailsData[0].objDetails);

    const selectedLineNums = (selectedBillDetailsID || "").split(",").map((id) => id.trim()).filter((id) => id !== "");
    const allDetails = selectedBillDetailsData[0]?.objDetails || [];
    const filteredDetails = allDetails.filter((item) =>
      selectedLineNums.includes(item.lineNum.toString())
    );
    setScannedItemListData(filteredDetails);
    setPrevScannedItemListData(filteredDetails);
  };
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
    if (totalBillAmount !== totalPaidAmount) {
      toast.error("Total bill amount and payment amount do not match!", { style: { backgroundColor: "#f7edeb", color: "#ff6242" },});
      return;
    }

    setIsBtnSaving(true);
    const objDetails = scannedItemListData.map((item, index) => ({
      billID: 0, //item.billID,
      lineNum: index + 1, //item.lineNum,
      itemCode: item?.itemCode || '',
      itemName: item?.itemName || '',
      barcode: item?.barcode || '',
      mrp: item?.mrp || 0,
      rsp: item?.rsp || 0,
      discountAmt: item?.discountAmt || 0,
      promotionAmt: item?.promotionAmt || 0,
      netPrice: item?.netPrice || 0,
      quantity: item?.quantity || 0,
      taxRate: item?.taxRate || 0,
      netAmt: item?.netAmt || 0,
      totalDiscAmt: item?.totalDiscAmt || 0,
      totalPromotionAmt: item?.totalPromotionAmt || 0,
      remarks: item?.remarks || '',
      hsNorSACcode: item?.hsNorSACcode || '',
      promotionID: item?.promotionID || 0,
      disCountID: item?.disCountID || 0,
      originalBillID: item?.originalBillID || 0, //item.billID,
      originalBillLineNum: item?.originalBillLineNum || 0,
      returnBillID: item?.billID || 0, //item.returnBillID,
      returnBillLineNum: item?.lineNum || 0 //item.returnBillLineNum
    }))    
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
      billID: 0,                                                                            //selectedBillDetailsData[0].billID,
      billNo: "",                                                                           //selectedBillDetailsData[0].billNo,
      billDate: today,  //today.toLocaleDateString('en-GB').split('/').join('-'), //new Date().toLocaleDateString('en-GB').split('/').join('-'), //new Date().toISOString().split('T')[0].split('-').reverse().join('-'),      //selectedBillDetailsData[0].billDate,
      storeID: selectedBillDetailsData[0]?.storeID || 0,                                    //getCookieValue('DefaultStoreId'), //cookies.DefaultStoreId, // Get store ID
      storeCode: selectedBillDetailsData[0]?.storeCode || '',
      storeName: selectedBillDetailsData[0]?.storeName || '',
      terminalNo: selectedBillDetailsData[0]?.terminalNo || '',
      customerID: selectedBillDetailsData[0]?.customerID || 0,
      customerName: selectedBillDetailsData[0]?.customerName || '',
      promotionID: selectedBillDetailsData[0]?.promotionID || 0,
      discountID: selectedBillDetailsData[0]?.discountID || 0,
      totalNoOfItem: scannedItemListData?.length || 0,
      billSaleAmt: selectedBillDetailsData[0]?.billSaleAmt || 0,
      billReturnAmt: totalBillAmount || 0,                                                  //selectedBillDetailsData[0].billReturnAmt
      billMRPAmt: selectedBillDetailsData[0]?.billMRPAmt || 0,
      billBasicAmt: selectedBillDetailsData[0]?.billBasicAmt || 0,
      billGrossAmt: selectedBillDetailsData[0]?.billGrossAmt || 0,
      billDiscAmt: selectedBillDetailsData[0]?.billDiscAmt || 0,
      billNetAmt: selectedBillDetailsData[0]?.billNetAmt || 0,
      billChargeAmt: selectedBillDetailsData[0]?.billChargeAmt || 0,
      billRoundoffAmt: selectedBillDetailsData[0]?.billRoundoffAmt || 0,
      billNetPayableAmt: totalBillAmount || 0,                                              //selectedBillDetailsData[0].billNetPayableAmt
      billRemarks: selectedBillDetailsData[0]?.billRemarks || '',
      noOfBillPrint: selectedBillDetailsData[0]?.noOfBillPrint || 0,
      originalDocumentID: selectedBillDetailsData[0]?.originalDocumentID || 0,
      originalDocumentNo: selectedBillDetailsData[0]?.originalDocumentNo || '',
      originalDocumentDate: selectedBillDetailsData[0]?.originalDocumentDate || '',
      returnDocumentID: selectedBillDetailsData[0]?.billID || 0,                            //selectedBillDetailsData[0].returnDocumentID,
      returnDocumentNo: selectedBillDetailsData[0]?.billNo || '',                           //selectedBillDetailsData[0].returnDocumentNo,
      returnDocumentDate: selectedBillDetailsData[0]?.billDate || '',                       //selectedBillDetailsData[0].returnDocumentDate,
      enteredBy: selectedBillDetailsData[0]?.enteredBy || 0,                                //getCookieValue('UserId'), //cookies.UserId, //Get Logged-In ID
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
        setScannedItemListData([]);
        //setPaymentListData([]);
        const clearedPaymentList = paymentListData.map((payment) => ({
          ...payment,
          amount: '',                         // Clear the amount
          upItransactionID: '',               // Clear UPI transaction ID
          cardNo: '',                         // Clear Card No if any
          showNote: false                     // Hide note field
        }));
        setPaymentListData(clearedPaymentList);
        
        setCheckoutSaveRefundBillDocNum(response.data[0].returnDocNum)
        setCheckoutSaveRefundBillDocEntry(response.data[0].returnDocEntry)
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
      setIsBtnSaving(false);
    } catch (error) {
      console.error('Error saving return bill:', error)
      toast.error(error.message, { style: { backgroundColor: '#f7edeb', color: '#ff6242' } })
      setIsCheckoutSaveRefundModalOpen(false);
      setIsBtnSaving(false);
    }
  };
  //Note:
  const handleBillPrint = () => {
    //console.log("Printing bill...");
    //window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    let UserId = getCookieValue("UserId");
    let checkoutSaveRefundBillDocEN = checkoutSaveRefundBillDocEntry; //'DB10000042';
    //window.open(`http://deehub.connectcloud365.com:25693/web/WebForm1.aspx?id1=2&id2=${checkoutSaveRefundBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    window.open(`${import.meta.env.VITE_SERVER_DEV_REPORT}` + `/web/WebForm1.aspx?id1=2&id2=${checkoutSaveRefundBillDocEN}|P&id3=2&uid=${UserId}`, "_blank");
    handleAllStateClear();
    setIsCheckoutSaveRefundModalOpen(false);
  };





  const toggleNoteField = (index) => {
    const updated = [...paymentListData];
    updated[index].showNote = !updated[index].showNote;
    setPaymentListData(updated);
  };
  const handlePaymentNoteChange = (index, key, value) => {
    const updated = [...paymentListData];
    updated[index][key] = value;
    setPaymentListData(updated);
  };




  // Toggle Return Search Modal
  const toggleSearchBillReturnModal = () => {
    setSearchBillReturnFromDate('');
    setSearchBillReturnToDate('');
    setSearchBillReturnPhoneNumber('');
    setSearchBillReturnCustomerName('');

    setShowSearchBillReturnModal((prev) => !prev);
  };
  // Toggle Return Select Bill Modal
  const toggleSelectBillReturnModal = () => {
    setSelectBillReturnSearchText('');
    setShowSelectBillReturnModal((prev) => {
      if (!prev) {
        fetchSearchBillReturnList();
      }
      return !prev;
    });
  };
  // Fetch Return Bills
  const fetchSearchBillReturnList = async () => {
    setLoadingReturn(true);
    try {
      let PJsonData = {};
      let formattedFromDate = searchBillReturnFromDate ? new Date(searchBillReturnFromDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '';
      let formattedToDate = searchBillReturnToDate ? new Date(searchBillReturnToDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '';
      
      let PType = `?BillID=0&FromDate=${formattedFromDate}&ToDate=${formattedToDate}&Mobile=${searchBillReturnPhoneNumber}&CustomerName=${searchBillReturnCustomerName}`;
      
      let responseJson = await GetAPI(`/api/Bill/GetAllReturnBill`, PType, PJsonData, cookies);
      const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : [];
      
      setSelectBillReturnListData(responseJsonData || []);
      setFilteredSelectBillReturnData(responseJsonData || []);
    } catch (error) {
      setSelectBillReturnListData([]);
      setFilteredSelectBillReturnData([]);
    } finally {
      setLoadingReturn(false);
    }
  };
  // Handle Return Bill Search
  const handleSelectBillReturnSearch = (searchText) => {
    setSelectBillReturnSearchText(searchText);
    setSelectBillReturnCurrentPage(1);
    if (searchText.trim() === "") {
      setFilteredSelectBillReturnData(selectBillReturnListData);
    } else {
      const filteredData = selectBillReturnListData.filter((item) =>
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.billDate.includes(searchText)
      );
      setFilteredSelectBillReturnData(filteredData);
    }
  };
  const handleReturnReprintBill = (bill) => {
    //console.log("Printing bill...",bill);
    let UserId = getCookieValue("UserId");
    let checkoutSaveBillDocEN = bill.billID;
    window.open(`${import.meta.env.VITE_SERVER_DEV_REPORT}` + `/web/WebForm1.aspx?id1=2&id2=${checkoutSaveBillDocEN}|R&id3=2&uid=${UserId}`, "_blank");
    handleAllStateClear();
  };





  return (
    <div className="relative z-30 bg-white min-h-screen overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Billing Return</h1>
          <Link to="/transaction/billing/billing-return-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg mb-6">
              Go to Billing Return 2
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 mb-6">
          <Link to="/transaction/billing/billing-request">
            <Button>Billing</Button>
          </Link>
          <Button disabled>Return</Button>
          <Button onClick={handleAllStateClear}>Clear</Button>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-[1fr,80px]">
        <div className="grid gap-6 grid-cols-[2fr,1fr] relative z-30">
          {/* Left Section */}
          <div className="bg-white shadow-lg p-6 rounded-xl w-screen max-w-2xl border border-gray-300" style={{ border: '1px solid #d1d5db' }}>
            <div className="space-y-6 w-full">
              {/* Scan Here Section */}
              <div className="border-b border-gray-200 pb-4 w-full">
                <h2 className="text-xl font-semibold">Scan Here</h2>
                <input placeholder="Scan Barcode..." value={barCodeInput} onChange={(e) => setBarCodeInput(e.target.value)} onKeyDown={handleEnterPress} className="mt-2 py-1 px-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                        <TableHead className="h-8">Sales Person</TableHead>
                        <TableHead className="h-8">Barcode</TableHead>
                        <TableHead className="h-8 w-[250px] min-w-[100px]">Item Name</TableHead>
                        <TableHead className="h-8">MRP</TableHead>
                        <TableHead className="h-8">Discount Amt</TableHead>
                        <TableHead className="h-8">Promo Amt</TableHead>
                        <TableHead className="h-8">Net Rate</TableHead>
                        <TableHead className="h-8">Quantity</TableHead>
                        <TableHead className="h-8">Tax Rate</TableHead>
                        <TableHead className="h-8">Net Amt</TableHead>
                        <TableHead className="h-8">Total Discount</TableHead>
                        <TableHead className="h-8">Total Promotion Amt.</TableHead>
                        <TableHead className="h-8">Remaks</TableHead>
                        {/* <TableHead className="h-8">Actions</TableHead> */}
                        <TableHead className="h-8">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scannedItemListData?.length ? (
                        scannedItemListData.map((item, index) => (
                          <TableRow key={index + 1}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2"><span className="text-xl cursor-pointer hover:text-blue-500"onClick={toggleImageModal}>🖼️</span> </td>
                            <td className="p-2">-</td>
                            <td className="p-2">{item.barcode}</td>
                            <td className="p-2 w-[250px] min-w-[200px]">{item.itemName}</td>
                            <td className="p-2">{item.mrp}</td>
                            <td className="p-2">{item.discountAmt}</td>
                            <td className="p-2">{item.promotionAmt}</td>
                            <td className="p-2">{item.netPrice}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">{item.taxRate}</td>
                            <td className="p-2">{item.netAmt}</td>
                            <td className="p-2" style={{ opacity: 0 }}>{item.totalDiscAmt}</td>
                            <td className="p-2" style={{ opacity: 0 }}>{item.totalPromotionAmt} </td>
                            <td className="p-2">{item.remarks}</td>
                            {/* <td className="p-2"></td>
                            <td className="p-2"></td> */}
                            {/* <td className="p-2 flex items-center justify-center gap-1">
                              <Button size="xs" className="px-2 py-1 text-xs" onClick={() => handleQuantityChange(index, -1)}disabled={item.quantity <= 1} >  - </Button>
                              <Button size="xs" className="px-2 py-1 text-xs" onClick={() => handleQuantityChange(index, 1)} >+</Button> 
                            </td> */}
                            <td className="p-2 text-center"> <span className="text-red-500 text-lg cursor-pointer hover:text-red-700" onClick={() => setDeleteItemIndex(index)} > 🗑️ </span> </td>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <td colSpan={19} className="text-center py-8 text-gray-500">
                            No item scanned yet
                          </td>
                        </TableRow>
                      )}
                    </TableBody>
                  </table>
                </div>
              </div>
              {/* Buttons Section */}
              <div className="flex gap-3 flex-wrap mt-12 !mt-12">
                <Button onClick={toggleSearchBillModal} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 whitespace-nowrap"> 
                  Search Bill
                </Button>
                {/* <Button onClick={toggleIssueCreditNoteModal} className={`px-3 py-1 rounded-lg whitespace-nowrap ${totalBillAmount > 0 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}>
                  Issue Credit Note
                </Button> */}
                <Button onClick={toggleCheckout} className={`px-3 py-1 rounded-lg whitespace-nowrap ${totalBillAmount > 0 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={totalBillAmount === 0}>
                  Refund / Credit Note
                </Button>
                <Button onClick={toggleSearchBillReturnModal} className="px-3 rounded-lg shadow-md bg-indigo-600 text-white hover:bg-indigo-700">
                  Reprint of Credit Note
                </Button>               
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex flex-col gap-6 w-full max-w-[400px] h-full" style={{ border: '0px solid blue' }}>
            {/* Modal for 'Refund / Check Out' */}
            {showCheckout && (
              <div className="w-full p-2 bg-white shadow-xl rounded-2xl border border-gray-200">
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
        </div>
      </div>

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
                    <span>From:</span> <input type="date" value={searchBillFromDate} onChange={(e) => setSearchBillFromDate(e.target.value)} className="border p-2 rounded-md" min={minFromToDate} max={maxFromToDate} />
                    <span>To:</span> <input type="date" value={searchBillToDate} onChange={(e) => setSearchBillToDate(e.target.value)} className="border p-2 rounded-md" min={minFromToDate} max={maxFromToDate} />
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
      {/* Modal for 'Issue Credit Note' */}
      {showApplyIssueCreditNoteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/12">
            {/* <h2 className="text-xl font-semibold mb-4">Apply Promotion</h2> */}
            <span>Credit Nte No.</span> <span>POSB/00015 Issued</span>
            <div className="mt-4 gap-4 flex justify-end">
              <Button className="px-3  bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={toggleIssueCreditNoteModal} >
                Ok
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for 'Search(Select Bill)' */}
      {showSelectBillModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Select Bill</h2>
            <input type="text" placeholder="Search Bill No..." value={selectBillSearchText} onChange={(e) => handleSelectBillSearch(e.target.value)}className="w-48 p-2 border border-gray-300 rounded-md mb-4" />
            <table className="w-full border border-gray-300 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-200 h-8">
                  <TableHead className="h-8">Select</TableHead>
                  <TableHead className="h-8">Bill No</TableHead>
                  <TableHead className="h-8">Bill Date</TableHead>
                  <TableHead className="h-8">No Of Item</TableHead>
                  <TableHead className="h-8">Amount</TableHead>
                  <TableHead className="h-8">Customer Name</TableHead>                  
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
                      <td className="p-2"><input type="checkbox" value={bill.billID} onChange={() => handleSelectBillCheckboxChange(bill.billID)}/></td>
                      <td className="p-2">{bill.billNo}</td>
                      <td className="p-2">{bill.billDate}</td>
                      <td className="p-2">{bill.totalNoOfItem}</td>
                      <td className="p-2">{bill.billNetPayableAmt}</td>
                      <td className="p-2">{bill.customerName}</td>
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
                <Button className="px-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"  onClick={toggleBillDetailsModal}  disabled={!selectedBillID}>
                  Bill Detail
                </Button>
                <Button
                  className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleSelectBillModal}  >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal for 'Bill Detail' */}
      {showBillDetailsModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Bill Details</h2>
            <input  type="text" placeholder="Search Bill Details..."  value={selectBillDetailsSearchText}onChange={(e) => handleSelectBillDetailsSearch(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-md mb-4"/>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead><input type="checkbox" onChange={handleSelectAllBillDetails} checked={(selectedBillDetailsID || "").split(",").length === (currentSelectBillDetails[0]?.objDetails?.length || 0)}/></TableHead> */}
                  {/* <TableHead><input type="checkbox" onChange={handleSelectAllBillDetails} checked={currentSelectBillDetails[0]?.objDetails?.length > 0 && selectedBillDetailsID?.split(",").length === currentSelectBillDetails[0].objDetails.length && currentSelectBillDetails[0].objDetails.every(item => selectedBillDetailsID?.split(",").includes(item.lineNum.toString()))} /></TableHead> */}
                  <TableHead><input type="checkbox" onChange={handleSelectAllBillDetails} checked={currentSelectBillDetails[0]?.objDetails?.length > 0 && (() => { const selected = selectedBillDetailsID?.split(",").filter(Boolean) || []; const total = currentSelectBillDetails[0].objDetails; return selected.length === total.length && total.every(item => selected.includes(item.lineNum.toString())); })()} />
                  {/* <input
                    type="checkbox"
                    onChange={handleSelectAllBillDetails}
                    checked={
                      currentSelectBillDetails[0]?.objDetails?.length > 0 &&
                      (() => {
                        const selected = selectedBillDetailsID?.split(",").filter(Boolean) || [];
                        const total = currentSelectBillDetails[0].objDetails;
                        return selected.length === total.length &&
                              total.every(item => selected.includes(item.lineNum.toString()));
                      })()
                    }
                  /> */}
                </TableHead>
                  <TableHead>Bill Date</TableHead>
                  <TableHead>BarCode</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Bill Basic Amt</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Return Qty.</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Return Amount</TableHead>
                  <TableHead>Disc. Amt</TableHead>
                  <TableHead>Promo Amt.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {loading ? (
                  <TableRow>
                    <td colSpan="13" className="text-center p-4">Loading...</td>
                  </TableRow>
                  ) : Array.isArray(currentSelectBillDetails) && currentSelectBillDetails.length > 0 &&
                    Array.isArray(currentSelectBillDetails[0].objDetails) && currentSelectBillDetails[0].objDetails.length > 0 ? (
                        currentSelectBillDetails[0].objDetails.map((item, index) => (
                          <TableRow key={index + 1}>
                            <td className="p-2">
                              <input type="checkbox" value={item.lineNum} onChange={() => handleSelectBillDetailsCheckboxChange(item.lineNum)} checked={(selectedBillDetailsID || "").split(",").includes(item.lineNum.toString())} />
                            </td>
                            <td className="p-2">{currentSelectBillDetails[0].billDate}</td>
                            <td className="p-2">{item.barcode}</td>
                            <td className="p-2">{item.itemCode}</td>
                            <td className="p-2">{item.itemName}</td>
                            <td className="p-2">{item.mrp}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">
                              {item.quantity}
                              {/* <input
                                type="number"
                                min="0"
                                max={item.quantity}
                                value={item.returnQty || ""}
                                onChange={(e) => handleReturnQtyChange(index, e.target.value)}
                                className="w-20 p-1 border rounded"
                              /> */}
                            </td>                            
                            <td className="p-2">{item.netPrice}</td>
                            <td className="p-2">{item.netAmt}</td>
                            <td className="p-2">
                              {item.netAmt}
                              {/* {item.returnQty && item.netPrice
                                ? (item.returnQty * item.netPrice).toFixed(2)
                                : "0.00"} */}
                            </td>
                            <td className="p-2">{item.discountAmt}</td>
                            <td className="p-2">{item.promotionAmt}</td>
                          </TableRow>
                        ))
                      ) : (
                    <TableRow>
                      <td colSpan="10" className="text-center">No Data Found</td>
                    </TableRow>
                )}
                <TableRow className="font-bold">
                  <TableCell colSpan={9} className="text-left">
                    Total
                  </TableCell>
                  <TableCell>
                    {Array.isArray(currentSelectBillDetails) && currentSelectBillDetails.length > 0 && Array.isArray(currentSelectBillDetails[0].objDetails) && currentSelectBillDetails[0].objDetails.length > 0 ? currentSelectBillDetails[0].objDetails.reduce((acc, item) => acc + (item.netAmt || 0), 0).toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(currentSelectBillDetails) && currentSelectBillDetails.length > 0 && Array.isArray(currentSelectBillDetails[0].objDetails) && currentSelectBillDetails[0].objDetails.length > 0 ? currentSelectBillDetails[0].objDetails.reduce((acc, item) => acc + (item.netAmt || 0), 0).toFixed(2) : "0.00"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setSelectBillDetailsCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={selectBillDetailsCurrentPage === 1} >
                Previous
              </Button>
              <span>
                Page {selectBillDetailsCurrentPage} of {totalSelectBillDetailsPages}
              </span>
              <Button onClick={() => setSelectBillDetailsCurrentPage((prev) => Math.min(prev + 1, totalSelectBillDetailsPages))  } disabled={selectBillDetailsCurrentPage === totalSelectBillDetailsPages} >
                Next
              </Button>
            </div>
            <div className="mt-4 flex justify-end items-end">
              <div className="flex gap-6 ">
                {/* <Button className="px-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleSelectAllBillDetails}>
                  Select All
                </Button> */}
                <Button className="px-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700" onClick={handleBillDetailsReturnClick} disabled={!selectedBillDetailsID}>
                  Return
                </Button>
                <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleBillDetailsModal}>
                  Close
                </Button>
              </div>
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
              <Button className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700" onClick={toggleImageModal} >Close</Button>
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
              <button className="px-4 py-2 bg-gray-300 rounded"onClick={() => setDeleteItemIndex(null)} >No</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={confirmDeleteItem} >Yes </button>
            </div>
          </div>
        </div>
      )}
      {/* Refund Bill Save Modal */}
      {isCheckoutSaveRefundModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] text-center">
            <div className="text-green-600 text-4xl mb-3">✔️</div>
            <p className="text-lg font-semibold mb-2">Refund Bill saved successfully!</p>
            {checkoutSaveRefundBillDocNum && (
              <p className="text-sm text-gray-600">
                Refund Bill Number: <strong>{checkoutSaveRefundBillDocNum}</strong>
              </p>
            )}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={handleBillPrint} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Print Bill
              </button>
              <button onClick={() => { handleAllStateClear(); setIsCheckoutSaveRefundModalOpen(false); }} className="px-4 py-2 bg-gray-300 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for 'Return Search Bill' */}
      {showSearchBillReturnModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Search Return Bill</h2>
            <div className="box overflow-y-auto w-full p-4">
              <div className="overflow-x-auto border rounded-md w-full p-4 space-y-4">
                <div>
                  <label className="font-medium block">Bill Date Between</label>
                  <div className="flex space-x-2">
                    <span>From:</span>
                    <input
                      type="date"
                      value={searchBillReturnFromDate}
                      onChange={(e) => setSearchBillReturnFromDate(e.target.value)}
                      className="border p-2 rounded-md"
                    />
                    <span>To:</span>
                    <input
                      type="date"
                      value={searchBillReturnToDate}
                      onChange={(e) => setSearchBillReturnToDate(e.target.value)}
                      className="border p-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium block">Phone Number</label>
                  <input
                    type="text"
                    value={searchBillReturnPhoneNumber}
                    onChange={(e) => setSearchBillReturnPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="border p-2 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="font-medium block">Customer Name</label>
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
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-6/12">
            <h2 className="text-xl font-semibold mb-4">Select Return Bill</h2>
            <input
              type="text"
              placeholder="Search Bill No..."
              value={selectBillReturnSearchText}
              onChange={(e) => handleSelectBillReturnSearch(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md mb-4"
            />
            <table className="w-full border border-gray-300 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-200 h-8">
                  <TableHead className="h-8">Bill No</TableHead>
                  <TableHead className="h-8">Bill Date</TableHead>
                  <TableHead className="h-8">No Of Item</TableHead>
                  <TableHead className="h-8">Amount</TableHead>
                  <TableHead className="h-8">Customer Name</TableHead>
                  <TableHead className="h-8">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingReturn ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center p-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredSelectBillReturnData.length ? (
                  filteredSelectBillReturnData.map((bill, index) => (
                    <TableRow key={index + 1}>
                      <td className="p-2">{bill.billNo}</td>
                      <td className="p-2">{bill.billDate}</td>
                      <td className="p-2">{bill.totalNoOfItem}</td>
                      <td className="p-2">{bill.billNetPayableAmt}</td>
                      <td className="p-2">{bill.customerName}</td>
                      <td className="p-2">
                        <Printer
                          onClick={() => handleReturnReprintBill(bill)} // 🔹 create this handler
                          className="w-5 h-5"
                          style={{ cursor: "pointer" }}
                        />
                      </td>
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
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() =>
                  setSelectBillReturnCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={selectBillReturnCurrentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {selectBillReturnCurrentPage} of {totalSelectBillReturnPages}
              </span>
              <Button
                onClick={() =>
                  setSelectBillReturnCurrentPage((prev) =>
                    Math.min(prev + 1, totalSelectBillReturnPages)
                  )
                }
                disabled={selectBillReturnCurrentPage === totalSelectBillReturnPages}
              >
                Next
              </Button>
            </div>
            <div className="mt-4 flex justify-end items-end">
              <div className="flex gap-6 ">
                <Button
                  className="px-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
                  onClick={toggleSelectBillReturnModal}
                >
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

export default BillingReturn