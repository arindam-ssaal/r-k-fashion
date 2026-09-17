import { AllCommunityModule, ModuleRegistry, themeQuartz, type ColDef, type ValueFormatterParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

import { GetAPI } from '../../../../../services/apiCall';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import "./page.css";

ModuleRegistry.registerModules([AllCommunityModule])

type Store = {
  storeID: string
  storeName: string
}

type CustomerMasterResponse = {
  'Last Purchase Date': string
  'Customer Name': string
  'Customer Mob No': string
  'Purchase Till Date': number
  'Last Purchase Amount': number
}

type CustomerMasterRow = {
  lastPurchaseDate: string
  customerName: string
  customerMobNo: string
  purchaseTillDate: number
  lastPurchaseAmount: number
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
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null); 
  const [printing, setPrinting] = useState(false); //! change

  //! AG Grid State
  const [rowData, setRowData] = useState<CustomerMasterRow[]>([]);
  const colDefs: ColDef<CustomerMasterRow>[] = [
    {
      headerName: 'SL No',
      minWidth: 90,
      maxWidth: 110,
      width: 100,
      flex: 0,
      sortable: false,
      filter: false,
      floatingFilter: false,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    },
    {
      field: 'lastPurchaseDate',
      headerName: 'Last Purchase Date',
      filter: false,
      floatingFilter: false,
      valueFormatter: (params: ValueFormatterParams<CustomerMasterRow, string>) =>
        params.value ? format(new Date(params.value), 'dd-MM-yyyy') : '',
    },
    { field: 'customerName', headerName: 'Customer Name', filter: true, floatingFilter: true },
    { field: 'customerMobNo', headerName: 'Customer Mob No', filter: true, floatingFilter: true },
    {
      field: 'purchaseTillDate',
      headerName: 'Purchase Till Date',
      filter: true,
      floatingFilter: true,
      valueFormatter: (params: ValueFormatterParams<CustomerMasterRow, number>) =>
        typeof params.value === 'number' ? params.value.toFixed(2) : '',
    },
    {
      field: 'lastPurchaseAmount',
      headerName: 'Last Purchase Amount',
      filter: true,
      floatingFilter: true,
      valueFormatter: (params: ValueFormatterParams<CustomerMasterRow, number>) =>
        typeof params.value === 'number' ? params.value.toFixed(2) : '',
    },
  ];
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

  const formatApiDate = (dateValue: string) => {
    const [year, month, day] = dateValue.split('-');
    return `${day}-${month}-${year}`;
  };

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

    setPrinting(true); //! change
    try {
      const fromDateFormatted = formatApiDate(fromDate);
      const toDateFormatted = formatApiDate(toDate);

      let PJsonData = {};
      let PType =
        '?ToDate=' + toDateFormatted +
        '&FromDate=' + fromDateFormatted +
        '&StoreId=' + selectedStore;

      let response = await GetAPI(
        '/api/Report/CustomerMasterData',
        PType,
        PJsonData,
        cookies
      );

      let responseData: CustomerMasterResponse[] = response?.data || [];

      const transformedData: CustomerMasterRow[] = responseData.map((item) => ({
        lastPurchaseDate: item['Last Purchase Date'],
        customerName: item['Customer Name'],
        customerMobNo: item['Customer Mob No'],
        purchaseTillDate: item['Purchase Till Date'],
        lastPurchaseAmount: item['Last Purchase Amount'],
      }));
      
      //! Set AG Grid data
      setRowData(transformedData);
      
      let formattedData = transformedData.map((item) => ({
        'Last Purchase Date': item.lastPurchaseDate
          ? format(new Date(item.lastPurchaseDate), 'dd-MM-yyyy')
          : '',
        'Customer Name': item.customerName,
        'Customer Mob No': item.customerMobNo,
        'Purchase Till Date': item.purchaseTillDate,
        'Last Purchase Amount': item.lastPurchaseAmount,
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      setWorkbook(wb);

      setPrint(true);
    } catch {
      setRowData([]);
      setPrint(false);
      toast.error('Failed to fetch customer master report data', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      });
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
            Customer Master Data Report (Excel)
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
                flex: 1,
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