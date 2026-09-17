import React, { useState, useEffect, useRef  } from 'react';
import { Blinds, ChartSpline, DiamondPercent, ShoppingBag, Stamp, TextSearch, TicketX } from 'lucide-react';
//import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Table, TableBody, TableFooter, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'
import TootlTipWrapper from '@/components/TootlTipWrapper';
import { Link } from "react-router-dom";
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { GetAPI,PostAPI } from '../../../../../services/apiCall';


export default function GoodsReceiptStore() {  
  const dropdownRef = useRef(null); 
  const today = new Date().toISOString().split('T')[0];
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };
  //console.log(cookies, cookies.DefaultStoreId)
  //console.log("Cookies from document.cookie:", document.cookie);
  const [loading, setLoading] = useState(false); 
  const [actionText, setActionText] = useState('');
  //const [goodsReceiptSearchText, setGoodsReceiptSearchText] = useState("");
  const [goodsReceiptListData, setGoodsReceiptListData] = useState([]);
  //const [filteredGoodsReceiptData, setFilteredGoodsReceiptData] = useState([]);
  //const [goodsReceiptCurrentPage, setGoodsReceiptCurrentPage] = useState(1);
  const goodsReceiptPerPage = 5;
  //const [selectedGoodsReceiptID, setSelectedGoodsReceiptID] = useState(null);
  /*const [selectedGoodsReceiptData, setSelectedGoodsReceiptData] = useState(null);
  const [storedGoodsReceipt, setStoredGoodsReceipt] = useState(null); 
  const [goodsReceiptSaveData, setGoodsReceiptSaveData] = useState({
  });  
  const [goodsReceiptErrors, setGoodsReceiptErrors] = useState({});*/
  const [filterGoodsReceiptList, setFilterGoodsReceiptList] = useState('All');
  const [currentPageGoodsReceiptList, setCurrentPageGoodsReceiptList] = useState(1);
  const [activeDropdownGoodsReceiptList, setActiveDropdownGoodsReceiptList] = useState(null);

  const [showGenerateReceiptDetails, setShowGenerateReceiptDetails] = useState(false);
  const [generateReceiptTransferDetails, setGenerateReceiptTransferDetails] = useState({});
  const [generateReceiptPacketsList, setGenerateReceiptPacketsList] = useState([]);
  const [originalGenerateReceiptPacketsList, setOriginalGenerateReceiptPacketsList] = useState([]);

  const [showReconcileStockDetails, setShowReconcileStockDetails] = useState(false);
  const [generateReceiptPacketsItemsList, setGenerateReceiptPacketsItemsList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [activeReconcileStockPacketIndex, setActiveReconcileStockPacketIndex] = useState(null);

  const [showReconcilePacketDetails, setShowReconcilePacketDetails] = useState(false);
  const [generateReceiptPacketsList2, setGenerateReceiptPacketsList2] = useState([]);
  const [scanOption, setScanOption] = useState('auto');
  const [scanInput, setScanInput] = useState('');
  const [totalTransferQty, setTotalTransferQty] = useState('');
  const [totalScanQty, setTotalScanQty] = useState('');
  const [totalDamageQty, setTotalDamageQty] = useState('');
  const [totalShortageQty, setTotalShortageQty] = useState('');
  //const [allPacketsItemsData, setAllPacketsItemsData] = useState([]);
  //const [selectedPacketNo, setSelectedPacketNo] = useState(null);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [finalSaveUpdatedObj, setFinalSaveUpdatedObj] = useState([]);





  useEffect(() => {
    const fetchGoodsReceiptListData = async () => {
      try {
        setLoading(true);
        let PJsonData = {};
        let PType = '';
        let cookies = '';
        let responseJsonArr = await GetAPI('/api/StockReceipt/GetAllStockReceipt', PType, PJsonData, cookies);
        //console.log('fetchGoodsReceiptListData=>', responseJsonArr);
        responseJsonArr = responseJsonArr.data;        
        const updatedResponseJsonArr = responseJsonArr.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        /* 
        let responseJson = [
          { id: 1, date: '2021-10-10', transferNo: '123', source: 'success', packets: 22, quantity: 100, status: 'Received' },
          { id: 2, date: '2022-10-10', transferNo: '44', source: 'success', packets: 12, quantity: 55, status: 'Not Received' },
          { id: 3, date: '2025-03-16', transferNo: '40', source: 'success', packets: 22, quantity: 85, status: 'Not Received' },
          { id: 4, date: '2022-12-12', transferNo: '66', source: 'success', packets: 125, quantity: 545, status: 'Received' },
          { id: 5, date: '2012-12-10', transferNo: '89', source: 'success', packets: 99, quantity: 32, status: 'Received' },
        ];
        */       
        
        setGoodsReceiptListData(updatedResponseJsonArr || []);
        //setGoodsReceiptListData(responseJson.data || []);
        //setFilteredGoodsReceiptData(responseJson || []);
      } catch (error) {
        setGoodsReceiptListData([]);
        //setFilteredGoodsReceiptData([]);
      } finally {
        setLoading(false);
      }
    }

    //if (cookies.AuthToken) {
      fetchGoodsReceiptListData();
    //}
  }, []);
  const filteredGoodsReceiptListData = goodsReceiptListData.filter(item => {
      if (filterGoodsReceiptList === 'All') return true;
      return item.status === filterGoodsReceiptList;
  });
  const totalPagesGoodsReceiptListData = Math.ceil(filteredGoodsReceiptListData.length / goodsReceiptPerPage);
  const paginatedGoodsReceiptListData = filteredGoodsReceiptListData.slice(
    (currentPageGoodsReceiptList - 1) * goodsReceiptPerPage,
    currentPageGoodsReceiptList * goodsReceiptPerPage
  );
  useEffect(() => {
    const handleGoodsReceiptListDropdownClickOutside = (e) => {
      if (!e.target.closest('.inline-block.text-left')) {
        setActiveDropdownGoodsReceiptList(null);
      }
    };

    document.addEventListener('mousedown', handleGoodsReceiptListDropdownClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleGoodsReceiptListDropdownClickOutside);
    };
  }, []);
  const handleDropdownToggleGoodsReceiptList = (id) => {
    setActiveDropdownGoodsReceiptList((prev) => (prev === id ? null : id));
  };





  const handleGoodsReceiptListFilter = (value) => {
    setFilterGoodsReceiptList(value);
    setCurrentPageGoodsReceiptList(1);
  };
  const handleGoodsReceiptView = async (item) => {
    setActionText('View');
    //alert(`View: ${JSON.stringify(item)}`);

    let PJsonData = {};
    let PType = '?DocumentNo=' + item.documentNo;
    let cookies = '';
    let responseJson = await GetAPI('/api/StockReceipt/GetStockReceipt', PType, PJsonData, cookies);
    const jsonData = responseJson.data;
    //console.log(jsonData)

    setGenerateReceiptTransferDetails({
      documentNo: jsonData.documentNo,
      documentDate: jsonData.documentDate,
      refDocumentNo: jsonData.refDocumentNo,
      refDocumentDate: jsonData.refDocumentDate,
      fromWhsCode: jsonData.fromWhsCode,
      fromWhsName: jsonData.fromWhsName,
      toWhsCode: jsonData.toWhsCode,
      toWhsName: jsonData.toWhsName,
      noOfPacket: jsonData.noOfPacket,
      transitDays: jsonData.transitDays,
      saPrefNo: jsonData.saPrefNo,
      saPrefDate: jsonData.saPrefDate,
      status: jsonData.status,
      usedFor: "U",

      transferNo: jsonData.documentNo,
      transferDate: jsonData.documentDate,
      transferFrom: jsonData.fromWhsName,
      noofPacket: jsonData.noOfPacket,
      intransitDays: jsonData.transitDays,
    });

    /*
    const formattedPackets = jsonData.objPackage.map((p) => ({
      documentNo: p.documentNo,
      packetNo: p.packetNo,
      noOfItems: p.noOfItem,
    }));
    setGenerateReceiptPacketsList(formattedPackets);
    */
    setGenerateReceiptPacketsList(jsonData.objPackage);
    setOriginalGenerateReceiptPacketsList(jsonData.objPackage);

    setShowGenerateReceiptDetails(true);    
  }
  const handleGoodsReceiptEdit = (item) => alert(`Edit: ${JSON.stringify(item)}`);
  //const handleGenerateReceipt = (item) => alert(`Generate Receipt for ID: ${item.id}`);
  const handleGenerateReceipt = async (item) => {
    setActionText('GenerateRecipt');
    /*
    const jsonData = {
        "documentNo": "STK/1005",
        "documentDate": "05-02-2025",
        "refDocumentNo": "",
        "refDocumentDate": "",
        "fromWhsCode": "",
        "fromWhsName": "Main Warehouse",
        "toWhsCode": "",
        "toWhsName": "",
        "noOfPacket": 8,
        "transitDays": 11,
        "saPrefNo": "",
        "saPrefDate": "",
        "status": "",
        "usedFor": "",
        "objPackage": [
          {
            "documentNo": "STK/1005",
            "lineNum": 1,
            "packetNo": "PACK/1001",
            "noOfItem": 12,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 1,
                "baseLine": 0,
                "itemCode": "L1001",
                "itemName": "Lushiplib T-Shirt (S)",
                "barcode": "DE1001",
                "packQty": 1,
                "receiveQty": 1,
                "damageQty": 0,
                "shortageQty": 0,
                "remarks": "Receipt Damage Piece"
              },
          {
                "documentNo": "STK/1005",
                "lineNum": 2,
                "baseLine": 0,
                "itemCode": "L1003",
                "itemName": "Lushiplib T-Shirt (L)",
                "barcode": "DE1003",
                "packQty": 2,
                "receiveQty": 2,
                "damageQty": 1,
                "shortageQty": 0,
                "remarks": "Receipt Damage Piece"
              },
          {
                "documentNo": "STK/1005",
                "lineNum": 3,
                "baseLine": 0,
                "itemCode": "L1004",
                "itemName": "Lushiplib T-Shirt (XL)",
                "barcode": "DE1004",
                "packQty": 8,
                "receiveQty": 8,
                "damageQty": 0,
                "shortageQty": 0,
                "remarks": "Receipt Damage Piece"
              }		
            ]
          },
          {
            "documentNo": "STK/1005",
            "lineNum": 2,
            "packetNo": "PACK/1002",
            "noOfItem": 16,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 2,
                "baseLine": 0,
                "itemCode": "L1003",
                "itemName": "Lushiplib T-Shirt (L)",
                "barcode": "DE1007",
                "packQty": 2,
                "receiveQty": 2,
                "damageQty": 1,
                "shortageQty": 0,
                "remarks": "Receipt Damage Piece"
              },
          {
                "documentNo": "STK/1005",
                "lineNum": 2,
                "baseLine": 0,
                "itemCode": "L1003",
                "itemName": "Lushiplib T-Shirt (L)",
                "barcode": "DE1003",
                "packQty": 2,
                "receiveQty": 2,
                "damageQty": 1,
                "shortageQty": 0,
                "remarks": "Receipt Damage Piece"
              }
            ]
          },
          {
            "documentNo": "STK/1005",
            "lineNum": 3,
            "packetNo": "PACK/1003",
            "noOfItem": 22,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 3,
                "baseLine": 0,
                "itemCode": "L1004",
                "itemName": "Lushiplib T-Shirt (XL)",
                "barcode": "DE1004",
                "packQty": 1,
                "receiveQty": 8,
                "damageQty": 0,
                "shortageQty": 0,
                "remarks": "Receipt Damage Piece"
              }
            ]
          },
          {
            "documentNo": "STK/1005",
            "lineNum": 4,
            "packetNo": "PACK/1004",
            "noOfItem": 21,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 4,
                "baseLine": 0,
                "itemCode": "L1001",
                "itemName": "Lushiplib T-Shirt (S)",
                "barcode": "DE1001",
                "packQty": 1,
                "receiveQty": 1,
                "damageQty": 0,
                "shortageQty": 0,
                "remarks": "Receipt OK"
              }
            ]
          },
          {
            "documentNo": "STK/1005",
            "lineNum": 5,
            "packetNo": "PACK/1005",
            "noOfItem": 24,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 5,
                "baseLine": 0,
                "itemCode": "L1003",
                "itemName": "Lushiplib T-Shirt (L)",
                "barcode": "DE1003",
                "packQty": 2,
                "receiveQty": 2,
                "damageQty": 0,
                "shortageQty": 1,
                "remarks": "Shortage Noted"
              }
            ]
          },
          {
            "documentNo": "STK/1005",
            "lineNum": 6,
            "packetNo": "PACK/1006",
            "noOfItem": 19,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 6,
                "baseLine": 0,
                "itemCode": "L1004",
                "itemName": "Lushiplib T-Shirt (XL)",
                "barcode": "DE1004",
                "packQty": 1,
                "receiveQty": 1,
                "damageQty": 1,
                "shortageQty": 0,
                "remarks": "Damaged During Transit"
              }
            ]
          },
          {
            "documentNo": "STK/1005",
            "lineNum": 7,
            "packetNo": "PACK/1007",
            "noOfItem": 11,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 7,
                "baseLine": 0,
                "itemCode": "L1001",
                "itemName": "Lushiplib T-Shirt (S)",
                "barcode": "DE1001",
                "packQty": 1,
                "receiveQty": 1,
                "damageQty": 0,
                "shortageQty": 0,
                "remarks": "Verified OK"
              }
            ]
          },
          {
            "documentNo": "STK/1005",
            "lineNum": 8,
            "packetNo": "PACK/1008",
            "noOfItem": 2,
            "objItem": [
              {
                "documentNo": "STK/1005",
                "lineNum": 8,
                "baseLine": 0,
                "itemCode": "L1004",
                "itemName": "Lushiplib T-Shirt (XL)",
                "barcode": "DE1004",
                "packQty": 1,
                "receiveQty": 1,
                "damageQty": 0,
                "shortageQty": 0,
                "remarks": "Receipt Complete"
              }
            ]
          }
        ]
    };
    */
    let PJsonData = {};
    let PType = '?DocumentNo=' + item.documentNo;
    let cookies = '';
    let responseJson = await GetAPI('/api/StockReceipt/GetStockReceipt', PType, PJsonData, cookies);
    const jsonData = responseJson.data;
    //console.log(jsonData)

    setGenerateReceiptTransferDetails({
      documentNo: jsonData.documentNo,
      documentDate: jsonData.documentDate,
      refDocumentNo: jsonData.refDocumentNo,
      refDocumentDate: jsonData.refDocumentDate,
      fromWhsCode: jsonData.fromWhsCode,
      fromWhsName: jsonData.fromWhsName,
      toWhsCode: jsonData.toWhsCode,
      toWhsName: jsonData.toWhsName,
      noOfPacket: jsonData.noOfPacket,
      transitDays: jsonData.transitDays,
      saPrefNo: jsonData.saPrefNo,
      saPrefDate: jsonData.saPrefDate,
      status: jsonData.status,
      usedFor: "U",

      transferNo: jsonData.documentNo,
      transferDate: jsonData.documentDate,
      transferFrom: jsonData.fromWhsName,
      noofPacket: jsonData.noOfPacket,
      intransitDays: jsonData.transitDays,
    });

    /*
    const formattedPackets = jsonData.objPackage.map((p) => ({
      documentNo: p.documentNo,
      packetNo: p.packetNo,
      noOfItems: p.noOfItem,
    }));
    setGenerateReceiptPacketsList(formattedPackets);
    */
    setGenerateReceiptPacketsList(jsonData.objPackage);
    setOriginalGenerateReceiptPacketsList(jsonData.objPackage);

    setShowGenerateReceiptDetails(true);
  };


  


  const openReconcileStock = () => {
    setGenerateReceiptPacketsItemsList([]);

    setShowGenerateReceiptDetails(false);
    setShowReconcileStockDetails(true);
  };
  const goBackToGenerateReceipt = () => {
    setShowReconcileStockDetails(false);
    setShowGenerateReceiptDetails(true);

    setShowConfirmationModal(false);
    setShowSuccessModal(false);

    setFinalSaveUpdatedObj([]);
  };
  /*
  const handleItemChange = (index, field, value) => {
    const updatedList = [...generateReceiptPacketsItemsList];
    updatedList[index][field] = field === 'remarks' ? value : Number(value);
    setGenerateReceiptPacketsItemsList(updatedList);
  };
  */
  const handleItemChange = (index, field, value) => {
    const updatedList = [...generateReceiptPacketsItemsList];
    const currentItem = { ...updatedList[index] };

    const newValue = field === 'remarks' ? value : Number(value);
    currentItem[field] = newValue;

    const packQty = Number(currentItem.packQty || 0);
    const damageQty = Number(currentItem.damageQty || 0);
    const shortageQty = Number(currentItem.shortageQty || 0);

    if (field === 'damageQty' || field === 'shortageQty') {
      const newReceiveQty = packQty - damageQty - shortageQty;
      currentItem.receiveQty = newReceiveQty >= 0 ? newReceiveQty : 0;
    }

    if (field === 'receiveQty') {
      const total = currentItem.receiveQty + damageQty + shortageQty;
      if (total > packQty) {
        currentItem.receiveQty = packQty - damageQty - shortageQty;
      }
    }

    updatedList[index] = currentItem;
    setGenerateReceiptPacketsItemsList(updatedList);
  };
  /*
  const handlePostInventoryReconcileStock = () => {
    for (let i = 0; i < generateReceiptPacketsItemsList.length; i++) {
      const row = generateReceiptPacketsItemsList[i];
      const totalQty = Number(row.receiveQty || 0) + Number(row.damageQty || 0) + Number(row.shortageQty || 0);

      if (!row.remarks || row.remarks.trim() === '') {
        alert(`Row ${i + 1}: Remarks is required.`);
        return;
      }

      if (Number(row.packQty) !== totalQty) {
        alert(`Row ${i + 1}: Sum of Receive, Damage, and Shortage must equal Pack Qty.`);
        return;
      }
    }
    console.log('Post Inventory data:', generateReceiptPacketsItemsList);
  };
  */
  /*
  const handlePostInventoryReconcileStock = () => {
    for (const packet of generateReceiptPacketsList) {
      const packetNo = packet.packetNo;
      const items = packet.objItem || [];

      for (const item of items) {
        const packQty = Number(item.packQty || 0);
        const receiptQty = Number(item.receiveQty || 0);
        const damageQty = Number(item.damageQty || 0);
        const shortageQty = Number(item.shortageQty || 0);

        const total = receiptQty + damageQty + shortageQty;

        if (packQty !== total) {
          alert(`Quantity mismatch in Packet ${packetNo}, Barcode: ${item.barcode}\nExpected PackQty (${packQty}) = Receipt (${receiptQty}) + Damage (${damageQty}) + Shortage (${shortageQty})`);
          console.log(generateReceiptPacketsList)
          return;
        }
        // (Optional) You can add remark validation if needed here
      }
    }

    console.log("All packet quantities are valid. Proceeding...",generateReceiptPacketsList);
  };
  */
  const handlePostInventoryReconcileStock = () => {
    let updatedList = [...generateReceiptPacketsList];

    if (activeReconcileStockPacketIndex !== null) {
      updatedList[activeReconcileStockPacketIndex] = {
        ...updatedList[activeReconcileStockPacketIndex],
        objItem: generateReceiptPacketsItemsList
      };
    }

    updatedList = updatedList.map(packet => {
      const adjustedItems = (packet.objItem || []).map(item => {
        const packQty = Number(item.packQty || 0);
        const damageQty = Number(item.damageQty || 0);
        const shortageQty = Number(item.shortageQty || 0);
        const receiveQty = Math.max(packQty - damageQty - shortageQty, 0);

        return {
          ...item,
          packQty,
          damageQty,
          shortageQty,
          receiveQty,
        };
      });

      return {
        ...packet,
        objItem: adjustedItems
      };
    });

    for (const packet of updatedList) {
      const packetNo = packet.packetNo;
      const items = packet.objItem || [];

      for (const item of items) {
        const packQty = Number(item.packQty || 0);
        const receiptQty = Number(item.receiveQty || 0);
        const damageQty = Number(item.damageQty || 0);
        const shortageQty = Number(item.shortageQty || 0);
        const total = receiptQty + damageQty + shortageQty;

        if (packQty !== total) {
          alert(`❌ Quantity mismatch in Packet ${packetNo}, Barcode: ${item.barcode}\nExpected PackQty (${packQty}) = Receipt (${receiptQty}) + Damage (${damageQty}) + Shortage (${shortageQty})`);
          return;
        }
      }
    }

    //console.log("Inventory valid:", updatedList);
    setFinalSaveUpdatedObj(updatedList);
    setShowConfirmationModal(true);
  };





  const openReconcilePacket = () => {    
    setGenerateReceiptPacketsItemsList([]); //Temporay
    setActiveReconcileStockPacketIndex(null);

    setShowReconcileStockDetails(false);
    setShowReconcilePacketDetails(true);


    //setGenerateReceiptPacketsList([]);
    setGenerateReceiptPacketsList(originalGenerateReceiptPacketsList);

    const originalGenerateReceiptPacketsList_2 = originalGenerateReceiptPacketsList.map(packet => ({
      ...packet,
      objItem: packet.objItem.map(item => ({
        ...item,
        receiveQty: 0,
        damageQty: 0,
        shortageQty: 0
      }))
    }));
    //setGenerateReceiptPacketsList2([]);
    setGenerateReceiptPacketsList2(originalGenerateReceiptPacketsList_2);
    //console.log("openReconcilePacket=>",generateReceiptPacketsList2);
  };
  const goBackToReconcileStock = () => {
    setGenerateReceiptPacketsItemsList([]); //Temporay
    setActiveReconcileStockPacketIndex(null);

    setShowReconcilePacketDetails(false);
    setShowReconcileStockDetails(true);

    setGenerateReceiptPacketsList(originalGenerateReceiptPacketsList);

    setScanOption('auto');
    setScanInput('');
    setTotalTransferQty('');
    setTotalScanQty('');
    setTotalDamageQty('');
    setTotalShortageQty('');
  };
  /*
  const handleScanItemChange = (index, field, value) => {
    const updatedList = [...generateReceiptPacketsItemsList];
    const currentItem = { ...updatedList[index] };

    const newValue = field === 'remarks' ? value : Number(value);
    currentItem[field] = newValue;

    const packQty = Number(currentItem.packQty || 0);
    const damageQty = Number(currentItem.damageQty || 0);
    const shortageQty = Number(currentItem.shortageQty || 0);

    if (field === 'damageQty' || field === 'shortageQty') {
      const newReceiveQty = packQty - damageQty - shortageQty;
      currentItem.receiveQty = newReceiveQty >= 0 ? newReceiveQty : 0;
    }

    if (field === 'receiveQty') {
      const total = currentItem.receiveQty + damageQty + shortageQty;
      if (total > packQty) {
        currentItem.receiveQty = packQty - damageQty - shortageQty;
      }
    }

    updatedList[index] = currentItem;
    setGenerateReceiptPacketsItemsList(updatedList);
  };
  */
  const handleScanItemChange = (index, field, value) => {
    const updatedList = [...generateReceiptPacketsItemsList];
    const currentItem = { ...updatedList[index] };

    const newValue = field === 'remarks' ? value : Number(value);
    currentItem[field] = newValue;

    const packQty = Number(currentItem.packQty || 0);
    const damageQty = field === 'damageQty' ? newValue : Number(currentItem.damageQty || 0);
    const shortageQty = field === 'shortageQty' ? newValue : Number(currentItem.shortageQty || 0);
    const receiveQty = field === 'receiveQty' ? newValue : Number(currentItem.receiveQty || 0);

    const total = damageQty + shortageQty + receiveQty;

    if (total > packQty) {
      alert("Total (receive + damage + shortage) exceeds Pack Qty!");
      return; // ❌ Reject update
    }

    // ✅ All good
    currentItem.damageQty = damageQty;
    currentItem.shortageQty = shortageQty;
    currentItem.receiveQty = receiveQty;

    updatedList[index] = currentItem;
    setGenerateReceiptPacketsItemsList(updatedList);
    updateScanTotals(updatedList); // Ensure total reflects manual entry
  }; 
  useEffect(() => {
    const handleScanKeyDown = (e) => {
      if (e.key === 'Enter' && scanInput.trim() !== '') {
        const updatedItems = [...generateReceiptPacketsItemsList];
        let updated = false;

        const newList = updatedItems.map((item) => {
          if (item.barcode?.toLowerCase() === scanInput.trim().toLowerCase()) {
            const totalQty = Number(item.receiveQty || 0) + Number(item.damageQty || 0) + Number(item.shortageQty || 0);

            if (totalQty < Number(item.packQty)) {
              updated = true;
              return {
                ...item,
                receiveQty: Number(item.receiveQty || 0) + 1,
              };
            }
          }
          return item;
        });

        if (updated) {
          setGenerateReceiptPacketsItemsList(newList);
          updateScanTotals(newList);
        }

        setScanInput('');
      }
    };

    document.addEventListener('keydown', handleScanKeyDown);
    return () => document.removeEventListener('keydown', handleScanKeyDown);
  }, [scanInput, generateReceiptPacketsItemsList]);
  const updateScanTotals = (items) => {
    const totalScan = items.reduce((sum, item) => sum + Number(item.receiveQty || 0), 0);
    const totalDamage = items.reduce((sum, item) => sum + Number(item.damageQty || 0), 0);
    const totalShortage = items.reduce((sum, item) => sum + Number(item.shortageQty || 0), 0);

    setTotalScanQty(totalScan);
    setTotalDamageQty(totalDamage);
    setTotalShortageQty(totalShortage);
  };
  useEffect(() => {
    const scanQty = generateReceiptPacketsItemsList.reduce((sum, item) => sum + Number(item.receiveQty || 0), 0);
    const damageQty = generateReceiptPacketsItemsList.reduce((sum, item) => sum + Number(item.damageQty || 0), 0);
    const shortageQty = generateReceiptPacketsItemsList.reduce((sum, item) => sum + Number(item.shortageQty || 0), 0);

    setTotalScanQty(scanQty);
    setTotalDamageQty(damageQty);
    setTotalShortageQty(shortageQty);
  }, [generateReceiptPacketsItemsList]);
  const handlePostInventoryReconcilePacket = () => {
    let updatedList = [...generateReceiptPacketsList2];
    //console.log(updatedList)

    /**/
    if (activeReconcileStockPacketIndex !== null) {
      updatedList[activeReconcileStockPacketIndex] = {
        ...updatedList[activeReconcileStockPacketIndex],
        objItem: generateReceiptPacketsItemsList
      };
    } 
    //console.log(updatedList)

    for (const packet of updatedList) {
      const packetNo = packet.packetNo;
      const items = packet.objItem || [];

      for (const item of items) {
        const packQty = Number(item.packQty || 0);
        const receiptQty = Number(item.receiveQty || 0);
        const damageQty = Number(item.damageQty || 0);
        const shortageQty = Number(item.shortageQty || 0);
        const total = receiptQty + damageQty + shortageQty;

        if (packQty !== total) {
          alert(`❌ Quantity mismatch in Packet ${packetNo}, Barcode: ${item.barcode}\nExpected PackQty (${packQty}) = Receipt (${receiptQty}) + Damage (${damageQty}) + Shortage (${shortageQty})`);
          return;
        }
      }
    }

    //console.log("Inventory valid:", updatedList);
    setFinalSaveUpdatedObj(updatedList);
    setShowConfirmationModal(true);
  };





  const handleFinalSaveUpdateObj = async () => {
    //console.log("Final data to save:", finalSaveUpdatedObj);

    const formData = {
      ...generateReceiptTransferDetails,
      storeID: 0,
      storeCode: "",
      storeName: "",
      saPrefEntry: "0",
      //: getCookieValue("UserId"),
      objPackage: finalSaveUpdatedObj
    };
    console.log("✅ handleFinalSaveUpdateObj=>",formData);

    try {
      let cookies = '';
      const response = await PostAPI("/api/StockReceiptRep/UpdateStockReceipt", '', formData, cookies);
      console.log("Goods Receipt has been updated successfully:", response);

      if (response.data[0].returnCode === "Y") {
        toast.success(response.data[0].returnMsg, { style: { backgroundColor: '#e3ffea', color: '#3ed665' } });//response.data[0].returnMsg
        //handleAllStateClear();
        setShowReconcilePacketDetails(false);
        setShowReconcileStockDetails(false);
        setShowGenerateReceiptDetails(false);        
        setShowSuccessModal(true);  
        
        let PJsonData = {};
        let PType = '';
        let cookies = '';
        let responseJsonArr = await GetAPI('/api/StockReceipt/GetAllStockReceipt', PType, PJsonData, cookies);
        responseJsonArr = responseJsonArr.data;        
        const updatedResponseJsonArr = responseJsonArr.map((item, index) => ({
          ...item,
          id: index + 1
        }));  
        setGoodsReceiptListData(updatedResponseJsonArr || []);       
      } else if (response.data[0].returnCode === "F") {
        toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      } else if (response.data[0].returnCode === "N") {
        toast.error(response.data[0].returnMsg, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      } else {
        toast.error('Failed to Update Goods Receipt. Please try again.', { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      }      
    } catch (error) {
      //console.error("Error Update Goods Receipt:", error);
      toast.error(error.message, { style: {backgroundColor: '#f7edeb',color: '#ff6242',}, });
      setShowSuccessModal(false);
    } 

    setShowConfirmationModal(false);
  };





  return (
    <>
      <div className="w-full">

        {!(showGenerateReceiptDetails || showReconcileStockDetails || showReconcilePacketDetails) && 
          <div className="p-4 text-sm">
            <h2 className="text-base font-semibold mb-3">Goods Receipt At Store</h2>

            {/* Filter Buttons */}
            <div className="flex justify-end gap-2 mb-2">
              <button className="bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleGoodsReceiptListFilter('All')}>
                All
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleGoodsReceiptListFilter('C')}>
                Received
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleGoodsReceiptListFilter('O')}>
                Not Received
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-8 bg-gray-100 text-xs font-semibold border border-gray-300 py-2 px-3 rounded">
              {/* <div>Select</div> */}
              <div>No</div> 
              <div>Document No</div>
              <div>Document Date</div>  
              <div>From Warehouse</div>  
              <div>To Warehouse</div>   
              {/* <div>Transit Days</div> */}
              <div>No of Packets</div>
              <div>Current Status</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div className="text-center p-4 text-gray-500 text-xs border border-t-0 border-gray-300">Loading...</div>
            ) : paginatedGoodsReceiptListData.length === 0 ? (
              <div className="text-center p-4 text-gray-500 text-xs border border-t-0 border-gray-300">No record found</div>
            ) : (
              paginatedGoodsReceiptListData.map((item, index) => (
                <div key={item.id} className="grid grid-cols-8 text-xs items-center border-t border-gray-200 px-3 py-2 hover:bg-gray-50 relative">
                  {/* <div className="text-left"><input type="checkbox" /></div> */}
                  <div className="text-left">{(currentPageGoodsReceiptList - 1) * goodsReceiptPerPage + index + 1}</div>
                  <div className="text-left">{item.documentNo}</div>
                  <div className="text-left">{item.documentDate}</div>
                  <div className="text-left">{item.fromWhsName}</div>
                  <div className="text-left">{item.toWhsName}</div>
                  {/* <div className="text-left">{item.transitDays}</div> */}
                  <div className="text-left">{item.noOfPacket}</div>
                  <div className="text-left">{(item.status === 'O') ? 'Open' : 'Closed'}</div>
                  <div className="text-right space-x-2 relative">
                    {item.status === 'O' && (
                      <button
                        className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                        onClick={() => handleGenerateReceipt(item)}
                      >
                        Generate Receipt
                      </button>
                    )}    
                    {/* 3-dots section */}
                    <div className="relative inline-block text-left">
                      <button
                        className="p-1 text-gray-600 hover:text-black"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click bubbling
                          handleDropdownToggleGoodsReceiptList(item.id);
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                        </svg>
                      </button>

                      {activeDropdownGoodsReceiptList === item.id && (
                        <div
                          className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow text-xs z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                            onClick={() => {
                              setActiveDropdownGoodsReceiptList(null);
                              handleGoodsReceiptView(item);
                            }}
                          >
                            View
                          </button>
                          {/* <button
                            className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                            onClick={() => {
                              setActiveDropdownGoodsReceiptList(null);
                              handleGoodsReceiptEdit(item);
                            }}
                          >
                            Edit
                          </button> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-xs">
              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                onClick={() => setCurrentPageGoodsReceiptList((prev) => Math.max(prev - 1, 1))}
                disabled={currentPageGoodsReceiptList === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPageGoodsReceiptList} of {totalPagesGoodsReceiptListData}
              </span>
              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                onClick={() => setCurrentPageGoodsReceiptList((prev) => Math.min(prev + 1, totalPagesGoodsReceiptListData))}
                disabled={currentPageGoodsReceiptList === totalPagesGoodsReceiptListData}
              >
                Next
              </button>
            </div>
          </div>
        }

        {/*Generate Receipt open  */}
        {showGenerateReceiptDetails && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Goods Receipt</h2>
            <div className="flex flex-wrap gap-4">
              {/* Goods Transfer Details */}
              <div className="border p-4 rounded-md w-[600px]">
                <h2 className="font-semibold mb-2">Good Transfer Details</h2>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Transfer No.</TableCell>
                      <TableCell>{generateReceiptTransferDetails.transferNo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Transfer Date</TableCell>
                      <TableCell>{generateReceiptTransferDetails.transferDate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Transferred From</TableCell>
                      <TableCell>{generateReceiptTransferDetails.transferFrom}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">No. of Packets</TableCell>
                      <TableCell>{generateReceiptTransferDetails.noofPacket}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">In Transit Days</TableCell>
                      <TableCell>{generateReceiptTransferDetails.intransitDays}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Packet Details */}
              <div className="border p-4 rounded-md flex-1 min-w-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document No.</TableHead>
                      <TableHead>Packet No.</TableHead>
                      <TableHead>No. of Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generateReceiptPacketsList.map((packet, index) => (
                      <TableRow key={index}>
                        <TableCell>{packet.documentNo}</TableCell>
                        <TableCell>{packet.packetNo}</TableCell>
                        <TableCell>{packet.noOfItem}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="font-medium">
                        Total
                      </TableCell>
                      <TableCell>{generateReceiptPacketsList.reduce((total, p) => total + p.noOfItem, 0)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
                <Button onClick={openReconcileStock} className="mt-4">                   
                  Reconcile Stock
                </Button>
                <Button className="mt-4 m-4" onClick= {() => { setShowGenerateReceiptDetails(false); setActionText(''); }}>Back</Button>
              </div>
            </div>
          </div>
        )}

        {/*Reconcile Stock open  */}
        {showReconcileStockDetails && (
          <div className="mt-4">
            <div className="p-4 space-y-4 w-full">
              <div className="flex flex-wrap gap-4">
                <Card className="flex-1 min-w-[300px]">
                  <CardContent>
                    {/* <h2 className="text-lg font-bold">Goods Receipt</h2> */}
                    <h2 className="text-lg font-bold">Goods Receipt</h2>
                    <Table>
                      <thead>
                        <tr>
                          <th className="text-left">Document No</th>
                          <th className="text-left">Packet No</th>
                          <th className="text-left">No. of Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateReceiptPacketsList.map((packet, index) => (
                          // <tr key={index} onClick={() => setGenerateReceiptPacketsItemsList(packet.objItem)} className="cursor-pointer hover:bg-blue-100">
                          <tr
                              key={index}
                              onClick={() => {
                                if (activeReconcileStockPacketIndex !== null) {
                                  const tempList = [...generateReceiptPacketsList];
                                  tempList[activeReconcileStockPacketIndex] = {
                                    ...tempList[activeReconcileStockPacketIndex],
                                    objItem: generateReceiptPacketsItemsList,
                                  };
                                  setGenerateReceiptPacketsList(tempList);
                                }

                                const adjustedItems = packet.objItem.map((item) => {
                                  const packQty = Number(item.packQty || 0);
                                  const damageQty = Number(item.damageQty || 0);
                                  const shortageQty = Number(item.shortageQty || 0);
                                  const receiveQty = Math.max(packQty - damageQty - shortageQty, 0);

                                  return {
                                    ...item,
                                    packQty,
                                    damageQty,
                                    shortageQty,
                                    receiveQty,
                                  };
                                });

                                setGenerateReceiptPacketsItemsList(adjustedItems);
                                setActiveReconcileStockPacketIndex(index);
                              }}
                              className="cursor-pointer hover:bg-blue-100"
                            >
                            <td>{packet.documentNo}</td>
                            <td>{packet.packetNo}</td>
                            <td>{packet.noOfItem}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="text-left fw-bold">Total: </td>
                          <td></td>
                          <td className="text-left fw-bold">
                            {generateReceiptPacketsList.reduce((total, doc) => total + Number(doc.noOfItem || 0), 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="flex-1 min-w-[300px]">
                  <CardContent>
                    <Table className="w-full table-auto border-collapse text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Barcode
                          </th>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Item Name
                          </th>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Pack Qty
                          </th>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Receipt Qty
                          </th>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Damage
                          </th>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Shortage
                          </th>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Remarks
                          </th>
                          {/* <th className="text-left px-4 py-2 font-semibold text-gray-700">
                            Article
                          </th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {generateReceiptPacketsItemsList.map((item, index) => (
                          <tr
                            key={index}
                            className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-50 transition"
                          >
                            <td className="px-4 py-2">{item.barcode}</td>
                            <td className="px-4 py-2">{item.itemName}</td>
                            <td className="px-4 py-2">{item.packQty}</td>
                            <td className="px-4 py-2">{item.receiveQty}</td>
                            <td>
                              <input
                                type="number"
                                className="w-20 px-1.5 py-0.1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={item.damageQty}
                                onChange={(e) => handleItemChange(index, 'damageQty', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="w-20 px-1.5 py-0.1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={item.shortageQty}
                                onChange={(e) => handleItemChange(index, 'shortageQty', e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={item.remarks}
                                onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                              />
                            </td>
                            {/* <td className="px-4 py-2">{item.damageQty}</td>
                            <td className="px-4 py-2">{item.shortageQty}</td>
                            <td className="px-4 py-2">{item.remarks}</td> */}
                            {/* <td className="px-4 py-2">{item.article}</td> */}
                          </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="bg-gray-100 font-semibold">
                          <td colSpan={2} className="px-4 py-2 text-right text-gray-700">
                            Total :
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {generateReceiptPacketsItemsList.reduce((sum, item) => sum + Number(item.packQty || 0), 0)}
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {generateReceiptPacketsItemsList.reduce(
                              (sum, item) => sum + Number(item.receiveQty || 0),
                              0
                            )}
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {generateReceiptPacketsItemsList.reduce((sum, item) => sum + Number(item.damageQty || 0), 0)}
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {generateReceiptPacketsItemsList.reduce((sum, item) => sum + Number(item.shortageQty || 0), 0)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tbody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Action buttons and inputs */}
              <div className="flex space-x-4 mt-4 justify-end">
                <Button onClick={handlePostInventoryReconcileStock}  style={{ display: actionText === 'View' ? 'none' : 'block' }}>Post Inventory</Button>
                <Button onClick={openReconcilePacket} style={{ display: actionText === 'View' ? 'none' : 'block' }}>Scan Item / Reconcile Packet</Button>
                <Button onClick={goBackToGenerateReceipt}>Back</Button>
                <div className="flex flex-col gap-4">
                  {/* Document No */}
                  <div className="flex items-center gap-4">
                    <label className="whitespace-nowrap font-medium text-gray-700 mb-4 w-36">
                      Document No:
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 w-52 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={generateReceiptTransferDetails.documentNo}
                      // onChange={(e) => setDocumentNo(e.target.value)}
                      disabled
                      placeholder="Enter Document No"
                    />
                  </div>
                  {/* Warehouse */}
                  <div className="flex items-center gap-4" hidden={true} style={{display:'none'}}>
                    <label className="whitespace-nowrap font-medium text-gray-700 w-36">
                      Warehouse:
                    </label>
                    <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                      <SelectTrigger className="w-52 h-10">
                        <SelectValue placeholder="Select a warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Warehouse</SelectLabel>
                          <SelectItem value="w001">Warehouse1</SelectItem>
                          <SelectItem value="w002">Warehouse2</SelectItem>
                          <SelectItem value="w003">Warehouse3</SelectItem>
                          <SelectItem value="w004">Warehouse4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*Reconcile Packet open  */}
        {showReconcilePacketDetails && (
          <div className="mt-4">
            <div className="p-4 space-y-4 w-full">
              <div className="flex gap-4">
                <Card className="w-1/3">
                  <CardContent>
                    <h2 className="text-lg font-bold">Goods Receipe</h2>
                    <Table>
                      <thead>
                        <tr>
                          <th className="text-left">Document No</th>
                          <th className="text-left">Packet No</th>
                          <th className="text-left">No. of Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {console.log(generateReceiptPacketsList2)} */}
                        {generateReceiptPacketsList2.map((packet, index) => (
                          // <tr key={index} onClick={() => setGenerateReceiptPacketsItemsList(packet.objItem)} className="cursor-pointer hover:bg-blue-100">
                          <tr
                              key={index}
                              onClick={() => {
                                if (activeReconcileStockPacketIndex !== null) {
                                  const tempList = [...generateReceiptPacketsList2];
                                  tempList[activeReconcileStockPacketIndex] = {
                                    ...tempList[activeReconcileStockPacketIndex],
                                    objItem: generateReceiptPacketsItemsList,
                                  };
                                  setGenerateReceiptPacketsList2(tempList);
                                }

                                const adjustedItems = packet.objItem.map((item) => ({
                                  ...item,
                                  packQty: Number(item.packQty || 0),
                                  damageQty: Number(item.damageQty || 0),
                                  shortageQty: Number(item.shortageQty || 0),
                                  receiveQty: Number(item.receiveQty || 0), // Don't auto-calculate
                                }));

                                setGenerateReceiptPacketsItemsList(adjustedItems);
                                setActiveReconcileStockPacketIndex(index);

                                // const totals = calculateTotals(adjustedItems);
                                // setTotalScanQty(totals.scan);
                                // setTotalDamageQty(totals.damage);
                                // setTotalShortageQty(totals.shortage);
                              }}
                              className="cursor-pointer hover:bg-blue-100"
                            >
                            <td>{packet.documentNo}</td>
                            <td>{packet.packetNo}</td>
                            <td>{packet.noOfItem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardContent>
                </Card>

                <div className=" w-2/3">
                  <Card className="w-full">
                    <CardContent>
                      <div className="p-4 border rounded-lg shadow-md w-full">
                        <div className="mb-6 mt-2 flex items-center space-x-3 justify-between">
                          <div className="flex space-x-4">
                            <label className="font-semibold">Scan Option:</label>
                            <div className="flex space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="scanOption"
                                  value="auto"
                                  checked={scanOption === 'auto'}
                                  onChange={() => setScanOption('auto')}
                                />
                                <span>Auto</span>
                              </label>
                              {/* <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="scanOption"
                                  value="manual"
                                  checked={scanOption === 'manual'}
                                  onChange={() => setScanOption('manual')}
                                />
                                <span>Manual</span>
                              </label> */}
                            </div>
                          </div>
                          <div className="space-x-4">
                            <label className="font-semibold">Scan:</label>
                            <input
                              type="text"
                              className="border p-2 rounded w-60"
                              value={scanInput}
                              onChange={(e) => setScanInput(e.target.value)}
                              placeholder="Enter scan value"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <label className="w-56 font-medium text-gray-700">
                              Total Transferred Quantity:
                            </label>
                            <input
                              type="number"
                              className="border border-gray-300 p-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={totalTransferQty}
                              onChange={(e) => setTotalTransferQty(e.target.value)}
                              disabled
                              placeholder="Enter transferred qty"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="w-56 font-medium text-gray-700">
                              Total Scan Quantity:
                            </label>
                            <input
                              type="number"
                              className="border border-gray-300 p-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={totalScanQty}
                              onChange={(e) => setTotalScanQty(e.target.value)}
                              disabled
                              placeholder="Enter scan qty"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="w-56 font-medium text-gray-700">
                              Total Damage Quantity:
                            </label>
                            <input
                              type="number"
                              className="border border-gray-300 p-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={totalDamageQty}
                              onChange={(e) => setTotalDamageQty(e.target.value)}
                              disabled
                              placeholder="Enter damage qty"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="w-56 font-medium text-gray-700">
                              Total Shortage Quantity:
                            </label>
                            <input
                              type="number"
                              className="border border-gray-300 p-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={totalShortageQty}
                              onChange={(e) => setTotalShortageQty(e.target.value)}
                              disabled
                              placeholder="Enter damage qty"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full">
                    <CardContent>
                      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Barcode
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Item Name
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Pack Qty
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Receipt Qty
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Damage
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Shortage
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Remarks
                              </th>
                              {/* <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Article
                              </th> */}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">                            
                            {generateReceiptPacketsItemsList.map((item, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors duration-200"
                              >
                                <td className="px-4 py-2 text-gray-800">{item.barcode}</td>
                                <td className="px-4 py-2 text-gray-800">{item.itemName}</td>
                                <td className="px-4 py-2 text-gray-800">{item.packQty}</td>
                                <td className="px-4 py-2 text-gray-800">
                                  <input
                                    type="number"
                                    value={item.receiveQty}
                                    onChange={(e) => handleScanItemChange(index, 'receiveQty', e.target.value)}
                                    //disabled={scanOption === 'Auto'}
                                    disabled={true}
                                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white disabled:bg-gray-100"
                                  />
                                </td>
                                <td className="px-4 py-2 text-gray-800">
                                  <input
                                    type="number"
                                    value={item.damageQty}
                                    onChange={(e) => handleScanItemChange(index, 'damageQty', e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                  />
                                </td>
                                <td className="px-4 py-2 text-gray-800">
                                  <input
                                    type="number"
                                    value={item.shortageQty}
                                    onChange={(e) => handleScanItemChange(index, 'shortageQty', e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                  />
                                </td>
                                <td className="px-4 py-2 text-gray-800">
                                  <input
                                    type="text"
                                    value={item.remarks}
                                    onChange={(e) => handleScanItemChange(index, 'remarks', e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                  />
                                </td>
                                {/* 
                                <td className="px-4 py-2 text-gray-800">{item.receiveQty}</td>
                                <td className="px-4 py-2 text-gray-800">{item.damageQty}</td>
                                <td className="px-4 py-2 text-gray-800">{item.shortageQty}</td>
                                <td className="px-4 py-2 text-gray-800">{item.remarks}</td> 
                                */}
                                {/* <td className="px-4 py-2 text-gray-800">{item.article}</td> */}
                              </tr>
                            ))}

                            {/* Total Row */}
                            <tr className="bg-gray-100 font-semibold">
                              <td colSpan={2} className="px-4 py-2 text-right text-gray-700">
                                Total :
                              </td>
                              <td className="px-4 py-2 text-gray-900">
                                {generateReceiptPacketsItemsList.reduce(
                                  (sum, item) => sum + Number(item.packQty || 0),
                                  0
                                )}
                              </td>
                              <td className="px-4 py-2 text-gray-900">
                                {generateReceiptPacketsItemsList.reduce(
                                  (sum, item) => sum + Number(item.receiveQty || 0),
                                  0
                                )}
                              </td>
                              <td className="px-4 py-2 text-gray-900">
                                {generateReceiptPacketsItemsList.reduce(
                                  (sum, item) => sum + Number(item.damageQty || 0),
                                  0
                                )}
                              </td>
                              <td className="px-4 py-2 text-gray-900">
                                {generateReceiptPacketsItemsList.reduce(
                                  (sum, item) => sum + Number(item.shortageQty || 0),
                                  0
                                )}
                              </td>
                              <td colSpan={2}></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* Action buttons and inputs */}
              <div className="flex space-x-4 mt-4 justify-end">
                <Button onClick={handlePostInventoryReconcilePacket}  style={{ display: actionText === 'View' ? 'none' : 'block' }}>Post Inventory</Button>
                <Button onClick={goBackToReconcileStock}>Back</Button>
                <div className="flex flex-col gap-4">
                  {/* Document No */}
                  <div className="flex items-center gap-4">
                    <label className="whitespace-nowrap font-medium text-gray-700 mb-4 w-36">
                      Document No:
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 w-52 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={generateReceiptTransferDetails.documentNo}
                      // onChange={(e) => setDocumentNo(e.target.value)}
                      disabled
                      placeholder="Enter Document No"
                    />
                  </div>
                  {/* Warehouse */}
                  <div className="flex items-center gap-4" hidden={true} style={{display:'none'}}>
                    <label className="whitespace-nowrap font-medium text-gray-700 w-36">
                      Warehouse:
                    </label>
                    <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                      <SelectTrigger className="w-52 h-10">
                        <SelectValue placeholder="Select a warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Warehouse</SelectLabel>
                          <SelectItem value="w001">Warehouse1</SelectItem>
                          <SelectItem value="w002">Warehouse2</SelectItem>
                          <SelectItem value="w003">Warehouse3</SelectItem>
                          <SelectItem value="w004">Warehouse4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm min-h-[200px] flex flex-col justify-between">
              <p className="text-lg font-semibold mb-6">Are you sure you want to Save this item?</p>
              <div className="flex justify-end gap-2 mt-auto">
                <button onClick={() => setShowConfirmationModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                  No
                </button>
                <button onClick={handleFinalSaveUpdateObj} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Successfull Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="text-green-600 text-4xl mb-3">✔️</div>
              <p className="text-lg font-semibold mb-2">Saved successfully!</p>
              <p className="text-sm text-gray-600">
                Receipt Number: <strong>{/* {receiptNumber} */}</strong>                
              </p>
              <div className="flex justify-center gap-3 mt-4">                
                <button  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Print Bill</button> {/* onClick={handleBillPrint} */}
                <button onClick={() => setShowSuccessModal(false)} className="px-4 py-2 bg-gray-300 rounded">Close</button>
              </div>
            </div>
          </div>
        )}        

      </div>
    </>
  )
}