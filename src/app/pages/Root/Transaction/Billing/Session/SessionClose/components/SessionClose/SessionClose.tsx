import { format, set } from 'date-fns'
import { useState, useEffect } from 'react'
//import { useCookies } from 'react-cookie'
import { useCookies } from 'react-cookie'
import DatePicker from 'react-datepicker'
import { toast } from 'sonner'

import { GetAPI , PostAPI } from '../../../../../../../../../services/apiCall'
import useSessionType from '../../store/useSessionType'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { __getCookieValue } from '@/common/authCookies';


const denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1]
  

const SessionClose = () => {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
    const getCookieValue = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
  };
  const [date, setDate] = useState(format(new Date(), 'dd-MM-yyyy'))
  const [counts, setCounts] = useState<number[]>(Array(denominations.length).fill(0))
  const [showDenominations, setShowDenominations] = useState(false)
  const closeModal = useSessionType((state) => state.close)

  // New state variables for the additional fields
  const [totalSaleAmount, setTotalSaleAmount] = useState(0)
  const [totalReturnAmount, setTotalReturnAmount] = useState(0)
  const [netSale, setNetSale] = useState(0)
  const [totalCashCollection, setTotalCashCollection] = useState(0)
  const [totalCardCollection, setTotalCardCollection] = useState(0)
  const [totalUPICollection, setTotalUPICollection] = useState(0)
  const [totalCreditNoteReceived, setTotalCreditNoteReceived] = useState(0)
  const [todaysFootfall, setTodaysFootfall] = useState(0)

  //const [cookies] = useCookies(['UserId', 'DefaultStoreId'])
  // const [selectSessionCloseListData, setSelectSessionCloseListData] = useState<any[]>([])
  // const [filteredSelectSessionCloseListData, setFilteredSelectSessionCloseListData] = useState<any[]>([])

  const [sessionAllData, setSessionAllData] = useState<any[]>([])
  const [sessionByIdData, setSessionByIdData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingById, setLoadingById] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [showListining, setShowListining] = useState(true);
  // const [cookies] = useCookies(['UserId', 'DefaultStoreId'])
  const [closeData, setCloseData] = useState<any[]>([]);
  const [allHeaders, setAllHeaders] = useState<any[]>([]);
  const [pettyCashAmount, setPettyCashAmount] = useState(0);


  const total = counts.reduce((sum, count, index) => sum + count * denominations[index], 0)
  const expenses = useSessionType((state) => state.expenses)
  const setExpenses = useSessionType((state) => state.setExpenses)
  const floatingAmt =  parseFloat(allHeaders?.[0]?.floatingAmount) || 0;  //useSessionType((state) => state.floatingAmount)
  // const netcashAmt = (total + floatingAmt) - expenses

  const cashAmt = (closeData) ? closeData.find((item) => item.label.toLowerCase() === 'cash')?.value || 0 : 0;
  const varPettyCashAmount = parseFloat(allHeaders?.[0]?.pettyCashAmount) || 0;
  const netcashAmt = ((floatingAmt + cashAmt) - varPettyCashAmount);
  const shex = (total - netcashAmt); //((floatingAmt + cashAmt) - varPettyCashAmount - total); //total - floatingAmt - netcashAmt;


  const fetchSessionCloseAllDetails = async () => {
    setLoading(true)
    try {
      const res = await GetAPI('/api/Session/GetAllSessionClose?SessionCloseID=0', '', {}, cookies)

      const dataArray = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
      
      setSessionAllData(dataArray);
      
    } catch {
      setSessionAllData([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSessionCloseAllDetails()
  }, [date])

  const fetchSessionCloseAllDetails2 = async () => {
    setLoading(true)
    try {
      const res = await GetAPI(`/api/Session/GetSessionCloseData?StoreID=${__getCookieValue("DefaultStoreId")}&Date=${date}`, '', {}, cookies)
      //console.log("Session Close Response:", res.data);
      const datas = (res.data) ? [res.data] : [];
      setAllHeaders(datas);
      //console.log(datas, "Session Close Headers");      
      
      // Convert objPay array to the format needed for collection details
      const collectionData = res.data.objPay.map((item: { payModeName: string; value: number; noOfBill: number }) => ({
        label: item.payModeName,
        value: item.value,
        countLabel: 'No. of Bill',
        count: item.noOfBill
      }));
      
      setCloseData(collectionData);

      

    } catch {
      setCloseData([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSessionCloseAllDetails2()
  }, [date])

  const fetchSessionCloseByIdDetails = async () => {
    const sessionId = 1;
      setLoadingById(true)
      try {
        const res = await GetAPI(`/api/Session/GetSessionClose?SessionCloseID=${sessionId}`,'', {}, cookies)
        // GetAPI already returns parsed JSON data, no need to call .json()
        const dataArray = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
        setSessionByIdData(dataArray)
      } catch {
        setSessionByIdData([])
      } finally {
        setLoadingById(false)
      }
  }
  useEffect(() => {
    fetchSessionCloseByIdDetails()
  }, [])


  // const fetchSelectedSessionCloseDeatilsList = async () => {
//     setLoading(true)
//     try {
//       let PJsonData = {}
//       let PType = ''
//       let responseJson = await GetAPI(`/api/Session/GetAllSessionClose`, PType, PJsonData, cookies)
//       const responseJsonData = Array.isArray(responseJson.data) ? responseJson.data : []
//       setSelectSessionCloseListData(responseJsonData || [])
//       setFilteredSelectSessionCloseListData(responseJsonData || [])
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       setSelectSessionCloseListData([])
//       setFilteredSelectSessionCloseListData([])
//     } finally {
//       setLoading(false)
//     }
//   }
//   useEffect(() => {
//     fetchSelectedSessionCloseDeatilsList()
//   }, []) 


  const handleCountChange = (index: number, value: string) => {
    const newCounts = [...counts]
    newCounts[index] = parseInt(value) || 0
    setCounts(newCounts)
  }
  const handleExpensesChange = (value: string) => {
    setExpenses(parseInt(value) || 0)
  }
  const incrementCount = (index: number) => {
    const newCounts = [...counts]
    newCounts[index] += 1
    setCounts(newCounts)
  }
  const decrementCount = (index: number) => {
    const newCounts = [...counts]
    if (newCounts[index] > 0) {
      newCounts[index] -= 1
      setCounts(newCounts)
    }
  }
  const resetToDefault = () => {
    setDate(format(new Date(), 'dd-MM-yyyy'))
    setCounts(Array(denominations.length).fill(0))
    setExpenses(0)
    setShowDenominations(false)
    // Reset new fields
    setTotalSaleAmount(0)
    setTotalReturnAmount(0)
    setTotalCashCollection(0)
    setTotalCardCollection(0)
    setTotalUPICollection(0)
    setTotalCreditNoteReceived(0)
    setTodaysFootfall(0)
  }
  const handleSessionClose = async () => {
    try {
      setLoading1(true)
      
      // Validate future date
      const selectedDate = new Date(date.split('-').reverse().join('-'))
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
      selectedDate.setHours(0, 0, 0, 0)
      
      if(selectedDate > today) {
        toast.error('Future dates are not allowed', {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#f8d7da',
          },
        })
        setLoading1(false)
        return
      }

      if(counts.every(count => count === 0)) {
        toast.error('At least one denomination must be entered', {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#f8d7da',
          },
        })
        setLoading1(false)
        return
      }
      
      const objPay = closeData.map((item, index) => ({
        sessionCloseID: 0,
        lineNum: index + 1,
        payModeID: index + 1, 
        payModeName: item.label,
        value: item.value,
        noOfBill: item.count
      }))

      const objDetails = denominations.map((denom, index) => ({
        sessionCloseID: 0,
        lineNum: index + 1,
        typeOfCurrency: denom,
        noOfCurrency: counts[index],
        totalValue: counts[index] * denom
      })).filter(item => item.noOfCurrency > 0) 

      const payload = {
        sessionCloseID: 0,
        sessionCloseDate: date,
        storeID: __getCookieValue("DefaultStoreId"), 
        storeName: "", 
        totalBillAmt: allHeaders[0]?.billAmount || 0,
        totalBill: allHeaders[0]?.noOfBill || 0,
        totalReturnAmt: allHeaders[0]?.returnAmount || 0,
        totalReturnBill: allHeaders[0]?.noOfReturn || 0,
        totalHoldAmt: allHeaders[0]?.holdAmount || 0,
        totalHoldBill: allHeaders[0]?.noOfHold || 0,
        totalVoidAmt: allHeaders[0]?.voidAmount || 0,
        totalVoidBill: allHeaders[0]?.noOfVoid || 0,
        posOrderAmt: allHeaders[0]?.posOrderAmount || 0,
        posOrderBill: allHeaders[0]?.noOfPOSOrder || 0,
        posAdvanceAmt: allHeaders[0]?.posAdvanceAmount || 0,
        posAdvanceBill: allHeaders[0]?.noOfPOSAdvance || 0,
        totalDiscAmt: allHeaders[0]?.totalDiscountAmount || 0,
        totalDiscBill: allHeaders[0]?.noOfTotalDiscount || 0,
        //! new add two fields
        totalPromoAmt: allHeaders[0]?.totalPromotionAmount || 0, //0,
        totalPromoBill: allHeaders[0]?.noOfTotalPromotion || 0, //0,
        pettyCashAmount: varPettyCashAmount, //0,
        footFall: todaysFootfall || 0,
        totalAmount: total,
        floatingAmount: floatingAmt,
        expenseAmount: expenses,
        netCashAmount: netcashAmt,
        shortOrExcess: shex,
        enteredBy: parseInt(cookies.UserId) || 0,
        usedFor: "I",
        objPay: objPay,
        objDetails: objDetails
      }

      const response = await PostAPI('/api/SessionRep/PostSessionClose', '', payload, cookies)
      
      if (response.data[0].returnCode === 'Y') {
        toast.success('Session closed successfully!', {
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#f0f4f8',
          },
        })
        resetToDefault() 
        closeModal()
        fetchSessionCloseAllDetails();
      } else if (response.data && response.data[0].returnCode === 'F') {
        toast.error(response.data[0].returnMsg || 'Failed to close session', {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#f8d7da',
          },
        })
      } else if (response.data && response.data[0].returnCode === 'N') {
        toast.warning(response.data[0].returnMsg || 'Failed to close session', {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#fff3cd',
          },
        })
      } else {
        throw new Error('Failed to close session')
      }
    } catch {
      toast.error('Failed to close session. Please try again.', {
        position: 'top-right',
        duration: 4000,
      })
    } finally {
      setLoading1(false)
    }
  }
  const handleCancel = () => {
    resetToDefault() 
    closeModal()
    setShowListining(true)
  }
  function validationShort() {
    /*
    if (shex === 0) {
      if (window.confirm('Short value is 0. Are you sure you want to proceed?')) {
        handleSessionClose()
      }
    } else {
      handleSessionClose()
    }
    */
    if (shex === 0) {
      handleSessionClose();
    } else {
      toast.error('Short/Excess amount must be 0 before saving.', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#f8d7da',
        },
      });
      return; 
    }
  }
  const handleBillPrint = (sessionCloseDate) => {
    //window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank");
    let UserId = __getCookieValue("UserId");
    const parts = sessionCloseDate.split("-");
    const sessionCloseFormatted = parts[2] + parts[1] + parts[0];
    window.open(`${import.meta.env.VITE_SERVER_DEV_REPORT}` + `/web/WebForm1.aspx?id1=11&id2=${sessionCloseFormatted}&id3=2&uid=${UserId}`, "_blank");
  };  


  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full p-4 shadow-lg rounded-xl" style={{background: 'white'}}>
           {showListining && <div className="overflow-x-auto border rounded-md mb-6">
            <div className="flex justify-between items-center p-3">
              
              <h3 className="text-lg font-semibold" style={{color: 'black'}}>Session Close History</h3>
              {/* <Button 
                onClick={fetchSessionCloseAllDetails}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-3 py-1 text-sm"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Refresh'
                )}
              </Button> */}
              <Button className="bg-blue-600 hover:bg-blue-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-3 py-1 text-sm" onClick={() => {setShowListining(false)}}>Add Session Close</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{color: 'black'}}>Session Close ID</TableHead>
                  {/* <TableHead>Store ID</TableHead> */}
                  <TableHead style={{color: 'black'}}>Date</TableHead>
                  <TableHead style={{color: 'black'}}>Floating Amount</TableHead>
                  <TableHead style={{color: 'black'}}>Total Amount</TableHead>
                  <TableHead style={{color: 'black'}}>Print</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Loading session data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sessionAllData.length > 0 ? (
                  sessionAllData.map((session, index) => (
                    <TableRow key={session.sessionCloseID || index} style={{borderBottom: '2px solid #e5e7eb'}}>
                      <TableCell style={{color: 'black'}}>{session.sessionCloseID || 0 }</TableCell>
                      {/* <TableCell>{session.storeID || '-'}</TableCell> */}
                      <TableCell style={{color: 'black'}}>{session.sessionCloseDate || '-'}</TableCell>
                      <TableCell style={{color: 'black'}}>{session.floatingAmount || 0}</TableCell>
                      <TableCell style={{color: 'black'}}>{session.totalAmount || 0}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleBillPrint(session.sessionCloseDate)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                        >
                          Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No session data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>}
        {!showListining &&<CardContent>
          <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: 'black'}}>Session Close</h2>
  
          {/* Date Picker */}
          <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:items-center mb-4">
            <Label className="font-medium text-base md:text-lg" style={{color: 'black'}}>Date</Label>
            <DatePicker
              selected={new Date(date.split('-').reverse().join('-'))}
              onChange={(newDate: Date | null) => newDate && setDate(format(newDate, 'dd-MM-yyyy'))}
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="border rounded p-1.5 md:p-2 w-full text-sm md:text-base"
            />
          </div>

          
  
          {/* Billing & Collection Tables */}
          <div className="overflow-x-auto">
            <div className="mb-6 min-w-[500px]">
              <h3 className="font-medium text-base md:text-lg mb-2" style={{color: 'black'}}>Billing Details</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                <tbody>
                  {allHeaders.map((item, index) => (
                    <>
                      <tr key={`${index}-bill`} className="border border-gray-300">
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Total Bill Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.billAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Bill</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfBill}</td>
                      </tr>
                      <tr key={`${index}-return`} className="border border-gray-300" >
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Total Return Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.returnAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Return</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfReturn}</td>
                      </tr>
                      <tr key={`${index}-hold`} className="border border-gray-300" >
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Total Hold Bill Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.holdAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Hold Bill</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfHold}</td>
                      </tr>
                      <tr key={`${index}-void`} className="border border-gray-300">
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Total Void Bill Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.voidAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Void Bill</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfVoid}</td>
                      </tr>
                      <tr key={`${index}-pos`} className="border border-gray-300">
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>POS Order Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.posOrderAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Pos Order</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfPOSOrder}</td>
                      </tr>
                      <tr key={`${index}-advance`} className="border border-gray-300">
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>POS Advance Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.posAdvanceAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Advance</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfPOSAdvance}</td>
                      </tr>
                      <tr key={`${index}-discount`} className="border border-gray-300">
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Total Discount Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.totalDiscountAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Discount</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfTotalDiscount}</td>
                      </tr>
                      <tr key={`${index}-promotion`} className="border border-gray-300">
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Total Promotion Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.totalPromotionAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>No of Promotion</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.noOfTotalPromotion}</td>
                      </tr>
                      <tr key={`${index}-footfall`} className="border border-gray-300">
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Petty Cash Amount</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.pettyCashAmount}</td>
                        <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>Footfall</td>
                        <td className="p-2 text-start" style={{color: 'black'}}>{item.footFall}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
  
            <div className="mb-6 min-w-[500px]">
              <h3 className="font-medium text-base md:text-lg mb-2" style={{color: 'black'}}>Collection Details</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                <tbody>
                  {closeData.map((item, index) => (
                    <tr key={index} className="border border-gray-300">
                      <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.label}</td>
                      <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.value}</td>
                      <td className="p-2 text-start border-r border-gray-300" style={{color: 'black'}}>{item.countLabel}</td>
                      <td className="p-2 text-start" style={{color: 'black'}}>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> 
          <div className="flex flex-row gap-6 align-center justify-center">
              <Label className="font-bold text-md mt-2" style={{color: 'black'}}>Today's Footfall: </Label>
              <Input
                type="number"
                value={todaysFootfall}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setTodaysFootfall(parseInt(value) );
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === '.' || e.key === ',') {
                    e.preventDefault();
                  }
                }}
                className="border rounded p-1 w-3/4 text-md h-10"
                placeholder="Enter Footfall"
                
              />
              {/* <Label className="font-bold text-md" style={{color: 'black'}}>Petty Cash Amount: </Label>
              <Input
                type="number"
                value={pettyCashAmount}
              onChange={(e) => {setPettyCashAmount(parseInt(e.target.value))}}
                placeholder="Enter Petty Cash Amount"

              /> */}
            </div>

         
  
          {/* Denominations Section */}
          <div className="my-4 py-4">
            <Card className="p-3 md:p-4 shadow-lg" style={{background: 'white'}}>
              <Button
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base"
                onClick={() => setShowDenominations(!showDenominations)}
              >
                Denomination
              </Button>
  
              {showDenominations && (
                <>
                  <div className="grid gap-2 md:gap-3">
                    {denominations.map((denom, index) => (
                      <div key={denom} className="flex flex-wrap items-center justify-between gap-2 border-b py-2">
                        <span className="w-16 font-semibold text-sm md:text-base" style={{color: 'black'}}>{denom}.00</span>
                        <div className="flex items-center gap-1 md:gap-2">
                          {/* <Button
                            className="bg-red-500 text-white px-2 md:px-3 py-1 text-sm md:text-base"
                            onClick={() => decrementCount(index)}
                          >
                            -
                          </Button> */}
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={counts[index] === 0 ? '' : counts[index]}
                            onChange={(e) => handleCountChange(index, e.target.value)}
                            className="w-16 md:w-20 text-center border rounded-md shadow-sm text-sm md:text-base"
                          />
                          {/* <Button
                            className="bg-green-500 text-white px-2 md:px-3 py-1 text-sm md:text-base hover:bg-green-600"
                            onClick={() => incrementCount(index)}
                          >
                            +
                          </Button> */}
                        </div>
                        <span className="font-semibold text-sm md:text-base" style={{color: 'black'}}>
                          = {(counts[index] * denom).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
  
                  <div className="mt-4 p-3 rounded-lg shadow text-sm md:text-base" style={{background: 'white'}}>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 font-medium">
                      <span style={{color: 'black'}}>Total</span>
                      <span className="text-right" style={{color: 'black'}}>{total.toFixed(2)}</span>
  
                      <span style={{color: 'black'}}>Floating Amount</span>
                      <span className="text-right" style={{color: 'black'}}>{floatingAmt}</span>
  
                      <span style={{color: 'black'}}>Expenses</span>
                      {/* <Input
                        type="text"
                        //value={expenses === 0 ? '' : expenses}
                        value={varPettyCashAmount === 0 ? '' : varPettyCashAmount.toFixed(2)}
                        onChange={(e) => handleExpensesChange(e.target.value)}
                        className="w-24 md:w-32 ml-auto text-sm md:text-base text-right"
                      /> */}
                      <span className="text-right" style={{color: 'black'}}>{varPettyCashAmount === 0 ? '' : varPettyCashAmount.toFixed(2)}</span>
  
  
                      <span style={{color: 'black'}}>Net Cash Amt. <span style={{color:'red', fontSize:'13px'}}>(Floating Amt. + Cash Collection Amt. - Expenses)</span></span>
                      <span className="text-right" style={{color: 'black'}}>{netcashAmt.toFixed(2)}</span>
                      
                      <span style={{color: 'black'}}>Short/Excess <span style={{color:'red', fontSize:'13px'}}>(Denomination Amt. - Net Cash Amt.)</span></span>    
                      <span className="text-right" style={{color: 'black'}}>{(shex < 0) ? <span style={{color:'red'}}>{shex.toFixed(2)}</span> : shex.toFixed(2)}</span><br/>
                      
                      {/* <span style={{animation:'blink 1s step-start 0s infinite',}}>You have short amount</span>     */}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
  
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 justify-end mt-4">
            <Button 
              className="bg-blue-600 text-white text-sm md:text-base px-4 py-2"
              onClick={validationShort}
              disabled={loading1}
            >
              {loading1 ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              className="bg-gray-400 text-white text-sm md:text-base px-4 py-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </CardContent>}
      </Card>
    // </div>
  )
}

export default SessionClose