import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCookies } from 'react-cookie';
import { GetAPI } from '../../../../../services/apiCall';

type Store = {
  storeID: string
  storeName: string
}

function HourlySalesReport() {
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
  const [reportUrl, setReportUrl] = useState('');

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
        // Failed to load store list
        setStoreList([])
      } finally {
        setLoading(false)
      }
    }
    if (cookies.UserId) {
      fetchStoreDetails()
    }

    fetchStoreDetails()
  }, [])
  useEffect(() => {
    const defaultStoreId = getCookieValue("DefaultStoreId");
    if (defaultStoreId && defaultStoreId !== "") {
      setSelectedStore(defaultStoreId);
    }
  }, []);
  const handleBillPrint = () => {
    //alert(selectedStore);
    if (!fromDate || !toDate || !selectedStore) {
      let message = "";
      if (!fromDate) message = "Please select From Date";
      else if (!toDate) message = "Please select To Date";
      else if (!selectedStore) message = "Please select a Store";

      toast.error(message, {
        style: { backgroundColor: "#f7edeb", color: "#ff6242" },
      });
      return;
    }

    setPrint(false);
    setReportUrl('');

    setTimeout(() => {      
      const fromDateFormatted = fromDate.replace(/-/g, '');
      const toDateFormatted = toDate.replace(/-/g, '');
      const UserId = getCookieValue('UserId');
      const report_id = 16;
      const url = `${import.meta.env.VITE_SERVER_DEV_REPORT}/web/WebForm1.aspx?id1=${report_id}&id2=${fromDateFormatted}|${toDateFormatted}|${selectedStore}&id3=2&uid=${UserId}`;

      setReportUrl(url);
      setPrint(true);
    }, 0);
  }

  return (
    <div className="credit-note-register-page">
      <div className="border border-gray-400 p-4 mb-6  max-w-4xl mx-auto rounded-md" style={{background: 'white'}}>
        <div className="border border-gray-600 p-3 mb-4 relative">
          <h2 className="text-center text-lg font-semibold mb-4 bg-sky-400 rounded-sm px-2 inline-block absolute -top-3 left-1/2 transform -translate-x-1/2">
            Hourly Sales Report
          </h2>

          <div className="flex flex-col gap-4 mb-6 mt-6">
            {/* All Fields in One Row */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap" style={{color: 'black'}}>Store</Label>
                <select
                  id="store-select"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  disabled={loading}
                  className="w-40 px-3 py-2 text-xs leading-tight bg-sky-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <option>Loading stores...</option>
                  ) : (
                    <>
                      <option className="" value="">
                        Select Store
                      </option>
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
              onClick={handleBillPrint}
            >
              Print
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm border border-red-600"
              onClick={() => {
                setFromDate(format(new Date(), 'yyyy-MM-dd'))
                setToDate(format(new Date(), 'yyyy-MM-dd'))
                setSelectedStore(selectedStore)
                setPrint(false)
                setReportUrl('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Results/Data Display Section */}
      <div className="border border-gray-300 shadow-sm rounded-lg p-6 max-w-full mx-auto" style={{background: 'white'}}>
        <div className="border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-lg font-medium" style={{color: 'black'}}>Report Results</h3>
          <p className="text-sm mt-1" style={{color: 'black'}}>
            Data will appear here after generating the report
          </p>
        </div>

        <div className="h-screen border border-dashed border-gray-300 rounded-lg p-4" style={{background: 'white'}}>
          {print && reportUrl ? (
            <iframe
              src={reportUrl}
              title="Hourly Sales Report"
              className="w-full h-full border-0 rounded-lg"
            ></iframe>
          ) : (
            <p style={{color: 'black'}}>No Result...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default HourlySalesReport