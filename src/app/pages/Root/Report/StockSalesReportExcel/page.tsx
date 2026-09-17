import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCookies } from 'react-cookie';
import { GetAPI } from '../../../../../services/apiCall';
import "./page.css";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

//! AG GRID Implementation
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

type Store = {
  storeID: string
  storeName: string
}

function StockSaleReportExcel() {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const getCookieValue = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  //! For dynamic store
  const [storeList, setStoreList] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  
  const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [print, setPrint] = useState(false);
  const [excelHtml, setExcelHtml] = useState<string>(''); 
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null); 
  const [printing, setPrinting] = useState(false); //! change

  //! AG Grid State
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs] = useState([
    { field: 'storeName', headerName: 'Store Name', filter: true, floatingFilter: true },
    { field: 'itemCode', headerName: 'Item Code', filter: true, floatingFilter: true },
    { field: 'itemName', headerName: 'Item Name', filter: true, floatingFilter: true, width: 300},
    { field: 'groupName', headerName: 'Group Name', filter: true, floatingFilter: true },
    { field: 'ageing', headerName: 'Ageing', filter: true, floatingFilter: true },
    { field: 'diVision', headerName: 'Division', filter: true, floatingFilter: true },
    { field: 'section', headerName: 'Section', filter: true, floatingFilter: true },
    { field: 'department', headerName: 'Department', filter: true, floatingFilter: true },
    { field: 'articleNo', headerName: 'Article No', filter: true, floatingFilter: true },
    { field: 'articleName', headerName: 'Article Name', filter: true, floatingFilter: true },
    { field: 'seasonCode', headerName: 'Season Code', filter: true, floatingFilter: true },
    { field: 'seasonName', headerName: 'Season Name', filter: true, floatingFilter: true },
    { field: 'styleNo', headerName: 'Style No', filter: true, floatingFilter: true },
    { field: 'designType', headerName: 'Design Type', filter: true, floatingFilter: true },
    { field: 'patternName', headerName: 'Pattern Name', filter: true, floatingFilter: true },
    { field: 'sizeCode', headerName: 'Size Code', filter: true, floatingFilter: true },
    { field: 'sizeName', headerName: 'Size Name', filter: true, floatingFilter: true },
    { field: 'designNo', headerName: 'Design No', filter: true, floatingFilter: true },
    { field: 'fabricName', headerName: 'Fabric Name', filter: true, floatingFilter: true },
    { field: 'brandName', headerName: 'Brand Name', filter: true, floatingFilter: true },
    { field: 'oldBarCode', headerName: 'Old Barcode', filter: true, floatingFilter: true },
    { field: 'poS_ENV_Bar_Code', headerName: 'POS ENV Barcode', filter: true, floatingFilter: true },
    { field: 'mrp', headerName: 'MRP', filter: true, floatingFilter: true },
    { field: 'opening', headerName: 'Opening Stock', filter: true, floatingFilter: true },
    { field: 'purchaseQty', headerName: 'Purchase Qty', filter: true, floatingFilter: true },
    { field: 'sellQty', headerName: 'Sell Qty', filter: true, floatingFilter: true },
    { field: 'returnQty', headerName: 'Return Qty', filter: true, floatingFilter: true },
    { field: 'closing', headerName: 'Closing Stock', filter: true, floatingFilter: true },
    { field: 'promotionAmt', headerName: 'Promotion Amount', filter: true, floatingFilter: true },
    { field: 'discountAmt', headerName: 'Discount Amount', filter: true, floatingFilter: true },
    { field: 'netAmt', headerName: 'Net Amount', filter: true, floatingFilter: true },
  ]);
  // const myTheme = themeQuartz.withParams({
  //   accentColor: '#0089b5',
  //   backgroundColor: '#0f1729',
  //   browserColorScheme: 'dark',
  //   chromeBackgroundColor: '#1c2640',
  //   foregroundColor: '#e4f1f9',
  //   headerBackgroundColor: '#1c2640',
  //   oddRowBackgroundColor: '#0d1420',
  //   borderColor: '#242d3d',
  // });

  const myTheme = themeQuartz.withParams({
    accentColor: '#4b5563',
    backgroundColor: '#f7f7f8',
    browserColorScheme: 'light',
    chromeBackgroundColor: '#ededf0',
    foregroundColor: '#2f343b',
    headerBackgroundColor: '#e6e7ea',
    oddRowBackgroundColor: '#f1f2f4',
    borderColor: '#d1d5db',
  });

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
        setStoreList([])
      } finally {
        setLoading(false)
      }
    }
    if (cookies.UserId) {
      fetchStoreDetails()
    }
  }, [])
  useEffect(() => {
    const defaultStoreId = getCookieValue("DefaultStoreId");
    if (defaultStoreId && defaultStoreId !== "") {
      setSelectedStore(defaultStoreId);
    }
  }, []);
  const handleExcelPrint = async () => {
    if (!fromDate || !toDate) { //|| !selectedStore
      let message = "";
      if (!fromDate) message = "Please select From Date";
      else if (!toDate) message = "Please select To Date";
      //else if (!selectedStore) message = "Please select a Store";

      toast.error(message, {
        style: { backgroundColor: "#f7edeb", color: "#ff6242" },
      });
      return;
    }

    setPrint(false);
    setWorkbook(null);
    setExcelHtml('');

    setPrinting(true); //! change
    try {
      const fromDateFormatted = fromDate.replace(/-/g, '');
      const toDateFormatted = toDate.replace(/-/g, '');

      let PJsonData = {};
      let PType =
        '?FromDate=' + fromDateFormatted +
        '&ToDate=' + toDateFormatted +
        '&StoreId=' + selectedStore;

      let response = await GetAPI(
        '/api/POSItemStockDetails/GetAllPOSItemStockDetails',
        PType,
        PJsonData,
        cookies
      );
      console.log("handleExcelPrint ==>", response);

      const columnMap = {
        //storeID: 'Store ID',
        storeName: 'Store Name',
        itemCode: 'Item Code',
        itemName: 'Item Name',
        groupName: 'Group Name',
        ageing: 'Ageing',
        diVision: 'Division',
        section: 'Section',
        department: 'Department',
        articleNo: 'Article No',
        articleName: 'Article Name',
        seasonCode: 'Season Code',
        seasonName: 'Season Name',
        styleNo: 'Style No',
        designType: 'Design Type',
        patternName: 'Pattern Name',
        sizeCode: 'Size Code',
        sizeName: 'Size Name',
        designNo: 'Design No',
        fabricName: 'Fabric Name',
        brandName: 'Brand Name',
        oldBarCode: 'Old Barcode',
        poS_ENV_Bar_Code: 'POS ENV Barcode',
        mrp: 'MRP',
        opening: 'Opening Stock',
        purchaseQty: 'Purchase Qty',
        sellQty: 'Sell Qty',
        returnQty: 'Return Qty',
        closing: 'Closing Stock',
        promotionAmt: 'Promotion Amount',
        discountAmt: 'Discount Amount',
        netAmt: 'Net Amount',
      };

      let responseData = response?.data || [];
      
      //! Set AG Grid data
      setRowData(responseData);
      
      let formattedData = responseData.map((item) => {
        let formattedRow: any = {};
        for (let key in columnMap) {
          formattedRow[columnMap[key]] = item[key];
        }
        return formattedRow;
      });

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      setWorkbook(wb);

      const html = XLSX.utils.sheet_to_html(ws, { editable: false });
      setExcelHtml(html);

      setPrint(true);
    } finally {
      setPrinting(false); //! change
    }
  };
  const handleDownloadExcel = () => {
    if (!workbook) return;
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Report_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div className="credit-note-register-page">
      <div className="border border-gray-400 p-4 mb-6 max-w-4xl mx-auto rounded-md" style={{background: 'white'}}>
        <div className="border border-gray-600 p-3 mb-4 relative">
          <h2 className="text-center text-lg font-semibold mb-4 bg-sky-400 rounded-sm px-2 inline-block absolute -top-3 left-1/2 transform -translate-x-1/2">
            Stock Sale Report (Excel)
          </h2>

          <div className="flex flex-col gap-4 mb-6 mt-6">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>Store</Label>
                <select
                  id="store-select"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  disabled={loading}
                  className="w-40 px-3 py-2 text-xs leading-tight border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  style={{backgroundColor:'white', color: 'black'}}
                >
                  {loading ? (
                    <option>Loading stores...</option>
                  ) : (
                    <>
                      <option className="" value="-1">All Store</option>
                      {storeList.map((store) => (
                        <option className="" key={store.storeID} value={store.storeID}>
                          {store.storeName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-400 rounded px-2 py-1 text-sm w-36"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-400 rounded px-2 py-1 text-sm w-36"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm border border-green-600"
              onClick={handleExcelPrint}
              disabled={printing}
            >
              {printing ? "Printing..." : "Print"}
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm border border-red-600"
              onClick={() => {
                setFromDate(format(new Date(), 'yyyy-MM-dd'))
                setToDate(format(new Date(), 'yyyy-MM-dd'))
                setSelectedStore(selectedStore)
                setPrint(false)
                setExcelHtml('')
                setWorkbook(null)
                setRowData([])
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

        {print && workbook && (
          <div className="flex justify-center mb-4">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm border border-blue-600"
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          </div>
        )}

        <div className="h-[600px] border border-dashed border-gray-300 rounded-lg p-4" style={{background: 'white'}}>
          {print && rowData.length > 0 ? (
            <AgGridReact
              theme={myTheme}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={{
                minWidth: 150,
                resizable: true,
                sortable: true,
              }}
              pagination={true}
              paginationPageSize={50}
              paginationPageSizeSelector={[25, 50, 100, 200]}
              enableCellTextSelection={true}
            />
          ) : (
            <div className="h-full flex items-center justify-center" style={{color: 'black'}}>
              <p>No Result...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StockSaleReportExcel;