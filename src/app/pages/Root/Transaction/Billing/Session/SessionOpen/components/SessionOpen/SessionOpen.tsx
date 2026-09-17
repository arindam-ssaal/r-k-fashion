import { useCookies } from 'react-cookie';
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';

import 'react-datepicker/dist/react-datepicker.css'
import { GetAPI ,PostAPI } from '../../../../../../../../../services/apiCall'
import { useAuth } from '../../../../../../../../../store/useAuth'
import useSessionType from '../../store/useSessionType'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { __getCookieValue } from '@/common/authCookies';

const denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1]

export default function SessionOpen() {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };
  const [date, setDate] = useState(format(new Date(), 'dd-MM-yyyy'))
  const [lastSettlementDate, setLastSettlementDate] = useState('')
  const [counts, setCounts] = useState<number[]>(Array(denominations.length).fill(0))
  const [showDenominations, setShowDenominations] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const closeModal = useSessionType((state) => state.close)
  const total = counts.reduce((sum, count, index) => sum + count * denominations[index],0)

  const setFloatingAmount = useSessionType((state) => state.setFloatingAmount)
  const floatingAmt = useSessionType((state) => state.floatingAmount)
  const setFloatingAmt = useSessionType((state) => state.setFloatingAmount)
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)


  
  
  const { user } = useAuth();
  // const [sessionAllData, setSessionAllData] = useState([]);
  const [sessionAllData, setSessionAllData] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [showListining, setShowListining] = useState(true);



      const fetchSessionOpenAllDetails = async () => {
      setLoading(true)
      try {
        const res = await GetAPI('/api/Session/GetAllSessionOpen?SessionOpenID=0', '', {}, cookies)
        
        const dataArray = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
        
        setSessionAllData(dataArray);
        
      } catch {
        setSessionAllData([]); 
      } finally {
        setLoading(false)
      }
    }

    const fetchLastSessionOpen = async () => {
      try {
        const res = await GetAPI('/api/Session/GetLastSessionOpen', '', {}, cookies)
        const data = res?.data ?? res
        if (!data) return

        setLastSettlementDate(data.sessionOpenDate || '')
        setFloatingAmt(data.floatingAmount ?? 0)

        const newCounts = Array(denominations.length).fill(0)
        ;(data.objDetails || []).forEach((detail: { typeOfCurrency: number; noOfCurrency: number }) => {
          const idx = denominations.indexOf(detail.typeOfCurrency)
          if (idx !== -1) newCounts[idx] = detail.noOfCurrency || 0
        })
        setCounts(newCounts)
      } catch {
        // ignore
      }
    }

    useEffect(() => {
    fetchSessionOpenAllDetails()
    fetchLastSessionOpen()
  }, [])

    

  useEffect(() => {
    console.log(total, floatingAmt);
    
    setFloatingAmount(floatingAmt) 
    setIsSaveDisabled(floatingAmt !== total)
  }, [total,floatingAmt])

  const handleCountChange = (index: number, value: string) => {
    const newCounts = [...counts]
    newCounts[index] = parseInt(value) || 0
    setCounts(newCounts)
  }

  const handleFloatingAmountChange = (value: string) => {
    setFloatingAmt(parseFloat(value) || 0)
  }

  // const incrementCount = (index: number) => {
  //   const newCounts = [...counts]
  //   newCounts[index] += 1
  //   setCounts(newCounts)
  // }

  // const decrementCount = (index: number) => {
  //   const newCounts = [...counts]
  //   if (newCounts[index] > 0) {
  //     newCounts[index] -= 1
  //     setCounts(newCounts)
  //   }
  // }

  const resetForm = () => {
    setDate(format(new Date(), 'dd-MM-yyyy'))
    setCounts(Array(denominations.length).fill(0))
    setFloatingAmt(0)
    setShowDenominations(false)
    setMessage(null)
  }

  const handleCancel = () => {
    resetForm()
    closeModal()
    setShowListining(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    
    const selectedDate = new Date(date.split('-').reverse().join('-'))
    const today = new Date()
    today.setHours(0, 0, 0, 0) 
    selectedDate.setHours(0, 0, 0, 0)
    
    if(selectedDate > today) {
      setMessage({ type: 'error', text: 'Future dates are not allowed' })
      setIsLoading(false)
      return
    }

    //if(!floatingAmt || floatingAmt <= 0) {
    //setMessage({ type: 'error', text: 'Floating amount must be greater than zero' })
    if(floatingAmt < 0) {
      setMessage({ type: 'error', text: 'The floating amount must be greater than or equal to zero' })
      setIsLoading(false)
      return
    }
    /*
    if(counts.every(count => count === 0)) {
      setMessage({ type: 'error', text: 'At least one denomination must be entered' })
      setIsLoading(false)
      return
    }
    */

    try {
      const sessionData = {
        sessionOpenID: 0, 
        sessionOpenDate: date, //format(new Date(date.split('-').reverse().join('-')), 'mm-dd-yyyy'), 
        storeID: __getCookieValue("DefaultStoreId"), 
        storeName: "", 
        floatingAmount: floatingAmt,
        totalAmount: total,
        enteredBy: parseInt(user?.id || "0"),
        usedFor: "I", 
        objDetails: denominations.map((denomination, index) => ({
          sessionOpenID: 0,
          lineNum: index + 1,
          typeOfCurrency: denomination,
          noOfCurrency: counts[index],
          totalValue: counts[index] * denomination
        })).filter(detail => detail.noOfCurrency > 0) 
      }

      const response = await PostAPI('/api/SessionRep/', 'PostSessionOpen', sessionData, '')
      
      if (response && response.data[0].returnCode === 'Y') {
        setMessage({ type: 'success', text: 'Session opened successfully!' })
        fetchSessionOpenAllDetails() // Refresh the table data
        setTimeout(() => {
          resetForm()
          closeModal()
        }, 1500)
      } else if (response && response.data[0].returnCode === 'F') {
        setMessage({ type: 'error', text: response.data[0].returnMsg || 'Failed to open session' })
      } else {
        setMessage({ type: 'error', text: 'Failed to open session' })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as {response?: {data?: {message?: string}}, message?: string})?.response?.data?.message 
          || (error as {message?: string})?.message 
          || 'An unexpected error occurred'
      
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full p-4 shadow-lg rounded-x" style={{background: 'white'}}>
      {showListining && (
        <div className="overflow-x-auto border rounded-md mb-6">
          <div className="flex justify-between items-center p-3">
            <h3 className="text-lg font-semibold" style={{color: 'black'}}>Session Open History</h3>
            {/* <Button 
                onClick={fetchSessionOpenAllDetails}
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
            <Button
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-3 py-1 text-sm"
              onClick={() => {
                setShowListining(false)
              }}
            >
              Add Session Open
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{color: 'black'}}>Session Open ID</TableHead>
                {/* <TableHead>Store ID</TableHead> */}
                <TableHead style={{color: 'black'}}>Date</TableHead>
                <TableHead style={{color: 'black'}}>Floating Amount</TableHead>
                <TableHead style={{color: 'black'}}>Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8" style={{color: 'black'}}>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Loading session data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sessionAllData.length > 0 ? (
                sessionAllData.map((session, index) => (
                  <TableRow key={session.sessionOpenID || index} style={{borderBottom: '2px solid #e5e7eb'}}>
                    <TableCell style={{color: 'black'}}>{session.sessionOpenID || 0}</TableCell>
                    {/* <TableCell>{session.storeID || '-'}</TableCell> */}
                    <TableCell style={{color: 'black'}}>{session.sessionOpenDate || '-'}</TableCell>
                    <TableCell style={{color: 'black'}}>{session.floatingAmount || 0}</TableCell>
                    <TableCell style={{color: 'black'}}>{session.totalAmount || 0}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center" style={{color: 'black'}}>
                    No session data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {!showListining && (
        <CardContent>
          <h2 className="text-xl font-bold mb-4 md:mb-6" style={{color: 'black'}}>Session Open</h2>

          <div className="space-y-4">
            {/* Last Settlement Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
              <Label className="text-base md:text-lg" style={{color: 'black'}}>Last Settlement Date</Label>
              <Input
                value={lastSettlementDate}
                readOnly
                className="border rounded p-2 md:p-1.5 w-full text-base md:text-lg"
              />
            </div>

            {/* Date Picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
              <Label className="text-base md:text-lg" style={{color: 'black'}}>Date</Label>
              <DatePicker
                selected={new Date(date.split('-').reverse().join('-'))}
                onChange={(newDate: Date | null) =>
                  newDate && setDate(format(newDate, 'dd-MM-yyyy'))
                }
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="border rounded p-2 md:p-1.5 w-full text-base md:text-lg"
              />
            </div>

            {/* Floating Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
              <Label className="text-base md:text-lg" style={{color: 'black'}}>Floating Amount</Label>
              <Input
                type="number"
                value={floatingAmt < 0 ? '' : floatingAmt}
                onChange={(e) => handleFloatingAmountChange(e.target.value)}
                className="border rounded p-2 md:p-1.5 w-full text-base md:text-lg"
              />
            </div>

            {/* Denominations Section */}
            <div className="my-4 py-4">
              <Card className="p-2 md:p-4 shadow-lg" style={{background: 'white'}}>
                <Button
                  className="w-full lg:w-auto mb-4 text-white py-2 text-base md:text-lg"
                  onClick={() => setShowDenominations(!showDenominations)}
                >
                  Denomination
                </Button>

                {showDenominations && (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {denominations.map((denom, index) => (
                        <div
                          key={denom}
                          className="flex flex-wrap items-center justify-between gap-2 py-2"
                        >
                          <span className="w-16 font-semibold text-sm md:text-base" style={{color: 'black'}}>
                            {denom}.00
                          </span>
                          <div className="flex items-center gap-1 md:gap-2 flex-1">
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
                              className="w-20 md:w-24 text-center border rounded-md shadow-sm py-1 text-base"
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

                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow">
                      <span className="text-base md:text-lg font-bold">Total</span>
                      <span className="text-lg md:text-xl font-semibold">{total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-end gap-2 mt-4">
              <Button
                className="bg-blue-600 text-white py-2 px-4 text-base md:text-lg w-full md:w-auto"
                disabled={isSaveDisabled || isLoading}
                onClick={handleSave}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                className="bg-gray-400 text-white py-2 px-4 text-base md:text-lg w-full md:w-auto"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}