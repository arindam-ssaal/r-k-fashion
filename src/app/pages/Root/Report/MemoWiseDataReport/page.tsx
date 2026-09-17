import { AllCommunityModule, ModuleRegistry, themeQuartz, type ColDef, type ValueFormatterParams, type IDatasource, type IGetRowsParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

import { GetAPI } from '../../../../../services/apiCall';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import './page.css';

ModuleRegistry.registerModules([AllCommunityModule])

type Store = {
  storeID: string
  storeName: string
}

type MemoWiseDataRow = {
  BillNo: string
  BillDate: string
  BillType: string
  StoreName: string
  ItmsGrpNam: string
  ItemCode: string
  ItemName: string
  ArticleName: string
  BrandName: string
  PURCHASERATE: number
  MRP: number
  'Terminal Name': string
  CustomerName: string
  Mobile: string
  TAXRATE: number
  HSNorSACcode: string
  'Promotion Name': string
  'Discount Name': string
  'Sale Qty': number
  'Return Qty': number
  'Gross Sales Amt': number
  PromotionAmt: number
  'Discount Amt': number
  'Net Amt': number
  'CR Note Adj No.': string
  ModeOfPaymentName: string
  Value: number
  SalesPersonID: string
  'Sales Person Name': string
  EntryDate: string
  DiVision: string
  Section: string
  Department: string
  TaxableAmt: number
  TaxAmt: number

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

  const gridRef = useRef<AgGridReact>(null);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);

  const [downloading, setDownloading] = useState(false);

  //! AG Grid State
  const [rowData, setRowData] = useState<MemoWiseDataRow[]>([]);
  const [colDefs] = useState<ColDef[]>([
    {
      headerName: 'SL No',
      filter: false,
      floatingFilter: false,
      sortable: false,
      width: 90,
      pinned: 'left',
      valueGetter: (params) => {
        const rowIndex = params.node?.rowIndex;
        return typeof rowIndex === 'number' ? rowIndex + 1 : 0;
      },
    },
    { field: 'BillNo', headerName: 'Bill No', filter: true, floatingFilter: true, width: 190 },
    {
      field: 'BillDate',
      headerName: 'Bill Date',
      filter: false,
      floatingFilter: false,
      valueFormatter: (params: ValueFormatterParams) =>
        params.value ? format(new Date(params.value), 'dd-MM-yyyy hh:mm:ss') : '',
    },
    { field: 'BillType', headerName: 'Bill Type', filter: true, floatingFilter: true, width: 110 },
    { field: 'StoreName', headerName: 'Store Name', filter: true, floatingFilter: true, width: 180 },
    { field: 'ItmsGrpNam', headerName: 'Item Group', filter: true, floatingFilter: true, width: 140 },
    { field: 'ItemCode', headerName: 'Item Code', filter: true, floatingFilter: true, width: 130 },
    { field: 'ItemName', headerName: 'Item Name', filter: true, floatingFilter: true, width: 220 },
    { field: 'ArticleName', headerName: 'Article Name', filter: true, floatingFilter: true, width: 180 },
    { field: 'BrandName', headerName: 'Brand Name', filter: true, floatingFilter: true, width: 170 },
    { field: 'PURCHASERATE', headerName: 'Purchase Rate', filter: true, floatingFilter: true, width: 140 },
    { field: 'MRP', headerName: 'MRP', filter: true, floatingFilter: true, width: 110 },
    { field: 'Terminal Name', headerName: 'Terminal Name', filter: true, floatingFilter: true, width: 150 },
    { field: 'CustomerName', headerName: 'Customer Name', filter: true, floatingFilter: true, width: 180 },
    { field: 'Mobile', headerName: 'Mobile', filter: true, floatingFilter: true, width: 130 },
    { field: 'TAXRATE', headerName: 'Tax Rate', filter: true, floatingFilter: true, width: 110 },
    { field: 'HSNorSACcode', headerName: 'HSN/SAC Code', filter: true, floatingFilter: true, width: 140 },
    { field: 'Promotion Name', headerName: 'Promotion Name', filter: true, floatingFilter: true, width: 170 },
    { field: 'Discount Name', headerName: 'Discount Name', filter: true, floatingFilter: true, width: 170 },
    { field: 'Sale Qty', headerName: 'Sale Qty', filter: true, floatingFilter: true, width: 110 },
    { field: 'Return Qty', headerName: 'Return Qty', filter: true, floatingFilter: true, width: 120 },
    { field: 'Gross Sales Amt', headerName: 'Gross Sales Amt', filter: true, floatingFilter: true, width: 150 },
    { field: 'PromotionAmt', headerName: 'Promotion Amt', filter: true, floatingFilter: true, width: 140 },
    { field: 'Discount Amt', headerName: 'Discount Amt', filter: true, floatingFilter: true, width: 140 },
    { field: 'Net Amt', headerName: 'Net Amt', filter: true, floatingFilter: true, width: 130 },
    { field: 'CR Note Adj No.', headerName: 'CR Note Adj No.', filter: true, floatingFilter: true, width: 150 },
    // { field: 'ModeOfPaymentName', headerName: 'Mode Of Payment', filter: true, floatingFilter: true, width: 160 },
    // { field: 'Value', headerName: 'Value', filter: true, floatingFilter: true, width: 120 },
    { field: 'SalesPersonID', headerName: 'Sales Person ID', filter: true, floatingFilter: true, width: 150 },
    { field: 'Sales Person Name', headerName: 'Sales Person Name', filter: true, floatingFilter: true, width: 170 },
    { field: 'EntryDate', headerName: 'Entry Date', filter: false, floatingFilter: false, width: 190, valueFormatter: (params: ValueFormatterParams) =>
      params.value ? format(new Date(params.value), 'dd-MM-yyyy hh:mm:ss') : '',
    },
    { field: 'DiVision', headerName: 'Division', filter: true, floatingFilter: true, width: 130 },
    { field: 'Section', headerName: 'Section', filter: true, floatingFilter: true, width: 130 },
    { field: 'Department', headerName: 'Department', filter: true, floatingFilter: true, width: 130},
    { field: 'TaxableAmt', headerName: 'Taxable Amt', filter: true, floatingFilter: true, width: 130 },
    { field: 'TaxAmt', headerName: 'Tax Amt', filter: true, floatingFilter: true, width: 110 },
  ]);
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

  const __handleExcelPrint = async () => {
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
        '?FromDate=' + fromDateFormatted +
        '&ToDate=' + toDateFormatted +
        '&StoreId=' + selectedStore +
        '&PageNo=' + pageNo +
        '&PageSize=' + pageSize;


      let response = await GetAPI(
        '/api/Report/MemoWiseData',
        PType,
        PJsonData,
        cookies
      );

      let responseData: MemoWiseDataRow[] = response?.data || [];
      
      //! Set AG Grid data
      setRowData(responseData);

      let formattedData = responseData.map((item) => ({
        ...item,
        BillDate: item.BillDate ? format(new Date(item.BillDate), 'dd-MM-yyyy') : '',
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      setWorkbook(wb);

      setPrint(true);
    } catch {
      setRowData([]);
      setPrint(false);
      toast.error('Failed to fetch memo wise data report', {
        style: { backgroundColor: '#f7edeb', color: '#ff6242' },
      });
    } finally {
      setPrinting(false); //! change
    }
  };
  const ____handleExcelPrint = async () => {
    if (!fromDate || !toDate) {
      let message = "";

      if (!fromDate) message = "Please select From Date";
      else if (!toDate) message = "Please select To Date";

      toast.error(message, {
        style: { backgroundColor: "#f7edeb", color: "#ff6242" },
      });
      return;
    }

    setPrint(false);
    setWorkbook(null);
    setPrinting(true);

    try {
      // Reset pagination
      //setPageNo(pageNo);
      //setPageSize(pageSize);

      // Call API first page
      await fetchMemoWiseData(pageNo,pageSize);

      // Show Grid
      setPrint(true);

      // Grid ready hole first page e niye jao
      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.api.paginationGoToFirstPage();
        }
      }, 100);

    } catch {
      setRowData([]);
      setTotalRecords(0);
      setPrint(false);

      toast.error("Failed to fetch memo wise data report", {
        style: {
          backgroundColor: "#f7edeb",
          color: "#ff6242",
        },
      });
    } finally {
      setPrinting(false);
    }
  };
  const handleExcelPrint = async () => {
    if (!fromDate || !toDate) {
      let message = "";

      if (!fromDate) message = "Please select From Date";
      else if (!toDate) message = "Please select To Date";

      toast.error(message, {
        style: {
          backgroundColor: "#f7edeb",
          color: "#ff6242",
        },
      });

      return;
    }

    setPrint(false);
    setWorkbook(null);
    setRowData([]);
    setTotalRecords(0);

    setPrinting(true);

    try {
      const hasData = await fetchMemoWiseData(pageNo, pageSize);

      if (!hasData) {
        setPrint(false);
        return;
      }

      setPrint(true);

      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.api.paginationGoToFirstPage();
        }
      }, 100);

    } catch {
      setRowData([]);
      setTotalRecords(0);
      setPrint(false);
      setWorkbook(null);

      toast.error("Failed to fetch voucher report", {
        style: {
          backgroundColor: "#f7edeb",
          color: "#ff6242",
        },
      });
    } finally {
      setPrinting(false);
    }
  };
  const __handleDownloadExcel = () => {
    if (!workbook) return;
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Report_${fromDate}_to_${toDate}.xlsx`);
  };
  const ____handleDownloadExcel = () => {
    setDownloading(true);

    const fromDateFormatted = formatApiDate(fromDate);
    const toDateFormatted = formatApiDate(toDate);

    const downloadUrl =
      //`http://deehub.connectcloud365.com:26100/api/Report/VoucherReportExcel` +
      import.meta.env.VITE_SERVER_DEV +
      '/api/Report/MemoWiseDataExcel' +
      `?fromDate=${fromDateFormatted}` +
      `&toDate=${toDateFormatted}` +
      `&StoreId=${selectedStore}`;

      // Backend directly returns Excel file
      window.location.href = downloadUrl;

      setDownloading(false);
  };
  const ______handleDownloadExcel = () => {
    if (downloading) return;

    setDownloading(true);

    const fromDateFormatted = formatApiDate(fromDate);
    const toDateFormatted = formatApiDate(toDate);

    const downloadUrl =
      import.meta.env.VITE_SERVER_DEV +
      '/api/Report/MemoWiseDataExcel' +
      `?fromDate=${fromDateFormatted}` +
      `&toDate=${toDateFormatted}` +
      `&StoreId=${selectedStore}`;

    window.location.href = downloadUrl;

    //setTimeout(() => {
      setDownloading(false);
    //}, 3000);
  };
  const handleDownloadExcel = async () => {
    if (downloading) return;

    setDownloading(true);

    try {
      const fromDateFormatted = formatApiDate(fromDate);
      const toDateFormatted = formatApiDate(toDate);

      const downloadUrl =
        import.meta.env.VITE_SERVER_DEV +
        '/api/Report/MemoWiseDataExcel' +
        '?FromDate=' + fromDateFormatted +
        '&ToDate=' + toDateFormatted +
        '&StoreId=' + selectedStore;

      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error('Excel download failed');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `MemoWiseDataReport_${fromDateFormatted}_to_${toDateFormatted}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Excel download error:', error);

      toast.error('Failed to download Excel', {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      });
    } finally {
      setDownloading(false);
    }
  };

  const __fetchMemoWiseData = async (page: number, size: number) => {
    const fromDateFormatted = formatApiDate(fromDate);
    const toDateFormatted = formatApiDate(toDate);

    let PType =
      '?FromDate=' + fromDateFormatted +
      '&ToDate=' + toDateFormatted +
      '&StoreId=' + selectedStore +
      '&PageNo=' + page +
      '&PageSize=' + size;

    const response = await GetAPI(
      '/api/Report/MemoWiseData',
      PType,
      {},
      cookies
    );

    setRowData(response.data.data);          // response onujayi change korbe
    setTotalRecords(response.data.totalCount);
  };
  const hasValidVoucherData = (rows: VoucherDataRow[]) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      return false;
    }

    return rows.some((row) =>
      Object.values(row).some(
        (value) => value !== null && value !== undefined && value !== ''
      )
    );
  };
  const fetchMemoWiseData = async (page: number, size: number) => {
    const fromDateFormatted = formatApiDate(fromDate);
    const toDateFormatted = formatApiDate(toDate);

    const PType =
      '?FromDate=' + fromDateFormatted +
      '&ToDate=' + toDateFormatted +
      '&StoreId=' + selectedStore +
      '&PageNo=' + page +
      '&PageSize=' + size;

    const response = await GetAPI(
      '/api/Report/MemoWiseData',
      PType,
      {},
      cookies
    );

    const rows: VoucherDataRow[] = response?.data?.data || [];
    const totalCount = response?.data?.totalCount || 0;

    // No data / all values null or empty
    if (!hasValidVoucherData(rows) || totalCount === 0) {
      setRowData([]);
      setTotalRecords(0);
      setWorkbook(null);
      return false;
    }

    // Set Grid data
    setRowData(rows);
    setTotalRecords(totalCount);

    // Create Excel Workbook
    const formattedData = rows.map((item) => ({
      ...item,
      SessionOpenDate: item.SessionOpenDate
        ? format(new Date(item.SessionOpenDate), 'dd-MM-yyyy hh:mm:ss')
        : '',
      SessionCloseDate: item.SessionCloseDate
        ? format(new Date(item.SessionCloseDate), 'dd-MM-yyyy hh:mm:ss')
        : '',
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Report");

    setWorkbook(wb);

    return true;
  };

  const handlePaginationChanged = useCallback(() => {

      if (!gridRef.current) return;

      const api = gridRef.current.api;

      const newPageNo = api.paginationGetCurrentPage() + 1;
      const newPageSize = api.paginationGetPageSize();

      if (newPageSize !== pageSize) {
          setPageSize(newPageSize);
          setPageNo(1);
          gridRef.current?.api.paginationGoToFirstPage();
          fetchMemoWiseData(1, newPageSize);
          return;
      }

      if (newPageNo !== pageNo) {
          setPageNo(newPageNo);
          fetchMemoWiseData(newPageNo, pageSize);
      }

  }, [pageNo, pageSize, fromDate, toDate, selectedStore]);

  // const datasource: IDatasource = {
  //   getRows: async (params: IGetRowsParams) => {
  //     const pageSizeLocal = 50; // or your pageSize state
  //     const pageNoLocal = Math.floor(params.startRow / pageSizeLocal) + 1;

  //     try {
  //       const fromDateFormatted = formatApiDate(fromDate);
  //       const toDateFormatted = formatApiDate(toDate);
  //       const query =
  //         `?FromDate=${fromDateFormatted}&ToDate=${toDateFormatted}` +
  //         `&StoreId=${selectedStore}&PageNo=${pageNoLocal}&PageSize=${pageSizeLocal}`;

  //       const response = await GetAPI('/api/Report/MemoWiseData', query, {}, cookies);
  //       const rows = response.data.data;
  //       const totalCount = response.data.totalCount;

  //       params.successCallback(rows, totalCount); // <-- ei totalCount ta grid ke real total janiye dey
  //     } catch {
  //       params.failCallback();
  //     }
  //   },
  // };


  const datasource: IDatasource = {
    getRows: async (params: IGetRowsParams) => {
      const pageSizeLocal = pageSize;
      const pageNoLocal = Math.floor(params.startRow / pageSizeLocal) + 1;

      try {
        const fromDateFormatted = formatApiDate(fromDate);
        const toDateFormatted = formatApiDate(toDate);

        const query =
          `?FromDate=${fromDateFormatted}&ToDate=${toDateFormatted}` +
          `&StoreId=${selectedStore}&PageNo=${pageNoLocal}&PageSize=${pageSizeLocal}`;

        const response = await GetAPI(
          '/api/Report/MemoWiseData',
          query,
          {},
          cookies
        );

        const rows: VoucherDataRow[] = response?.data?.data || [];
        const totalCount = response?.data?.totalCount || 0;

        if (!hasValidVoucherData(rows) || totalCount === 0) {
          params.successCallback([], 0);
          return;
        }

        params.successCallback(rows, totalCount);

      } catch {
        params.failCallback();
      }
    },
  };
  
  return (
    <div className="credit-note-register-page">
      <div className="border border-gray-400 p-4 mb-6 max-w-4xl mx-auto rounded-md" style={{background: 'white'}}>
        <div className="border border-gray-600 p-3 mb-4 relative">
          <h2 className="text-center text-lg font-semibold mb-4 bg-sky-400 rounded-sm px-2 inline-block absolute -top-3 left-1/2 transform -translate-x-1/2">
            Memo Wise Data Report (Excel)
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
              disabled={downloading}
            >
              {/* Download Excel */}
              {downloading ? "Downloading..." : "Download Excel"}
            </Button>
          </div>
        )}

        <div className="h-[600px] border border-dashed border-gray-300 rounded-lg p-4" style={{background: 'white'}}>
          {print && rowData.length > 0 ? (
            // <AgGridReact
            //   ref={gridRef}
            //   theme={myTheme}
            //   rowData={rowData}
            //   columnDefs={colDefs}
            //   defaultColDef={{
            //     minWidth: 150,
            //     resizable: true,
            //     sortable: true,
            //   }}
            //   pagination={true}
            //   //paginationPageSize={50}
            //   paginationPageSize={pageSize}
            //   //paginationPageSizeSelector={[25, 50, 100, 200]}
            //   paginationPageSizeSelector={[50, 100, 200]}
            //   enableCellTextSelection={true}
            //   onPaginationChanged={handlePaginationChanged}
            // />
            <AgGridReact
              ref={gridRef}
              theme={myTheme}
              rowModelType="infinite"
              datasource={datasource}
              cacheBlockSize={pageSize}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={pageSize}
              paginationPageSizeSelector={[50, 100, 200]}
              defaultColDef={{ minWidth: 150, resizable: true, sortable: true }}
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