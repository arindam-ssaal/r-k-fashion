import React, { useEffect, useState, useRef } from 'react';
import { Blinds, ChartSpline, DiamondPercent, ShoppingBag, Stamp, TextSearch, TicketX,  } from 'lucide-react';
import { Zap, Keyboard, Search, ShoppingCart, User, PauseCircle, RefreshCcw, Printer, PercentCircle, Tag, X } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import TootlTipWrapper from '@/components/TootlTipWrapper';
import { Link } from "react-router-dom";
import { toast } from 'sonner';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useCookies } from 'react-cookie';
import { useFootFall } from './store/useFootFall';
import allFootFallsData from './footFallData.json';
import { GetAPI,PostAPI } from '../../../../../../services/apiCall';
import { set } from 'date-fns';

const FootFall = () => {
    const apiToday = new Date().toLocaleDateString('en-GB').split('/').join('-'); 
    console.log('API Today:', apiToday);
    // const todayISO = new Date().toISOString().split('T')[0];
    const [today, setToday] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
    const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
    };
    //console.log(cookies, cookies.DefaultStoreId)
    //console.log("Cookies from document.cookie:", document.cookie);
    const [loading, setLoading] = useState(false);

    // Format time function
    const formatTime = (timeValue) => {
        if (!timeValue) return '';
        const timeStr = timeValue.toString().padStart(4, '0');
        const hours = timeStr.substring(0, 2);
        const minutes = timeStr.substring(2, 4);
        return `${hours}:${minutes}`;
    };

    const formatSlotDesc = (slot) => {
        if (slot.slotDesc && slot.slotDesc.startsWith('>')) {
            return slot.slotDesc; // Keep special slots like ">2200" as is
        }
        if (slot.fromTime && slot.toTime) {
            return `${formatTime(slot.fromTime)} - ${formatTime(slot.toTime)}`;
        }
        if (slot.fromTime && !slot.toTime) {
            return `>${formatTime(slot.fromTime)}`;
        }
        return slot.slotDesc || '';
    };

    const [selectedMonth, setSelectedMonth] = useState('September')
    const [currentData, setCurrentData] = useState(null)
    const [slotListData, setSlotListData] = useState([])
    const [footfallValues, setFootfallValues] = useState({})
    const [apiFootfallValues, setApiFootfallValues] = useState({}) // For graph blue line
    const [view, setView] = useState('footfall') // 'footfall' or 'sales'
    const [docEntry, setDocEntry] = useState(-1) // Store DocEntry from API
    const closeModal = useFootFall((state) => state.close)
    ChartJS.register(
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement,
        Filler,
        Tooltip,
        Legend
    )

    const fetchServerDate = async () => {
        try {
        setLoading(true);
        let PJsonData = {};
        let PType = '';
        //let cookies = '';
        let responseJson = await GetAPI('/api/Bill/GetServerDate', PType, PJsonData, cookies);
        console.log('fetchServerDate=>', responseJson.data); 
        const serverDate = responseJson.data || '';
        let formattedDate = '';
        if (serverDate) {
            const parts = serverDate.split('-');
            if (parts.length === 3) {
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            } else {
                formattedDate = serverDate; 
            }
        }
        setToday(serverDate);
        setCurrentDate(formattedDate);
        
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
        const fetchSlotListData = async () => {
        try {
            setLoading(true);
            let PJsonData = {};
            let PType = ''; //'?StoreID=' + cookies.DefaultStoreId;
            //let cookies = '';
            let responseJson = await GetAPI('/api/Foot/GetSlot', PType, PJsonData, cookies);
            console.log('fetchSlotListData=>', responseJson); 
              
            setSlotListData(responseJson.data || []);
            setLoading(false);
        } catch (error) {
            setSlotListData([]);
            setLoading(false);
        }
        }

        //if (cookies.AuthToken) {
            fetchSlotListData();
        //}
    }, []);

    useEffect(() => {
        const found = allFootFallsData.find((item) => item.month === selectedMonth)
        setCurrentData(found)
        
        // Initialize footfall values from dynamic slot data
        if (slotListData.length > 0) {
          const initialValues = {}
          slotListData.forEach((slot) => {
            initialValues[slot.slotID] = '' // start as empty string
          })
          setFootfallValues(initialValues)
        }
      }, [selectedMonth, slotListData]);

    //! /api/Foot/GetFootFallData with params FromDate, ToDate, StoreID
    // useEffect(() => {
    //     const fetchFootFallData = async () => {
    //         if (!selectedDate || !currentDate || slotListData.length === 0) {
    //             console.log('Skipping API call - missing data:', { selectedDate, currentDate, slotListDataLength: slotListData.length });
    //             return;
    //         }
            
    //         try {
    //             setLoading(true);
    //             const formatDateForAPI = (dateStr) => {
    //                 if (!dateStr) return '';
    //                 return new Date(dateStr).toLocaleDateString('en-GB').replace(/\//g, '-');
    //             };

    //             const fromDate = formatDateForAPI(selectedDate);
    //             const toDate = formatDateForAPI(currentDate);
    //             const storeID = 1;

    //             let PType = `?FromDate=${fromDate}&ToDate=${toDate}&StoreID=${storeID}`;
    //             let PJsonData = {};
                
    //             console.log('Calling GetFootFallData API with:', PType);
    //             let responseJson = await GetAPI('/api/Foot/GetFootFallData', PType, PJsonData, cookies);
    //             console.log('GetFootFallData API Response=>', responseJson);
                
    //             if (responseJson.data && Array.isArray(responseJson.data)) {
    //                 if (responseJson.data.length === 0) {
    //                     toast.error('No data in this date range', {
    //                         style: { backgroundColor: '#f7edeb', color: '#ff6242' },
    //                     });
    //                 } else if (responseJson.data.length > 0) {
    //                     toast.success('Data loaded successfully', {
    //                         style: { backgroundColor: '#e3ffea', color: '#3ed665' },
    //                     });
                        
    //                     const apiData = responseJson.data[0];
    //                     console.log('API Data received:', apiData);
                        
    //                     const updatedApiValues = {};
    //                     slotListData.forEach((slot) => {
    //                         let timeKey = '';
    //                         if (slot.slotDesc && slot.slotDesc.startsWith('>')) {
    //                             timeKey = slot.slotDesc; 
    //                         } else if (slot.fromTime && slot.toTime) {
    //                             const fromTimeStr = slot.fromTime.toString().padStart(4, '0');
    //                             const toTimeStr = slot.toTime.toString().padStart(4, '0');
    //                             timeKey = `${fromTimeStr}-${toTimeStr}`;
    //                         }
                            
    //                         console.log(`Mapping slot ${slot.slotID} with timeKey: ${timeKey}, value from API:`, apiData[timeKey]);
                            
    //                         if (timeKey && apiData[timeKey] !== undefined) {
    //                             updatedApiValues[slot.slotID] = apiData[timeKey];
    //                         } else {
    //                             updatedApiValues[slot.slotID] = 0;
    //                         }
    //                     });
                        
    //                     console.log('Updated API footfall values for graph (blue line):', updatedApiValues);
    //                     setApiFootfallValues(updatedApiValues);
    //                 }
    //             }
                
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching footfall data:', error);
    //             toast.error('Failed to fetch footfall data');
    //             setLoading(false);
    //         }
    //     };

    //     fetchFootFallData();
    // }, [selectedDate]);
    const fetchFootFallData = async () => {
            // Validate selectedDate first
            if (!selectedDate) {
                toast.error('Please select a date to fetch footfall data', {
                    style: { backgroundColor: '#f7edeb', color: '#ff6242' },
                });
                return;
            }

            // Check other required data
            if (!currentDate || slotListData.length === 0) {
                console.log('Skipping API call - missing data:', { currentDate, slotListDataLength: slotListData.length });
                toast.error('Required data is missing. Please try again.', {
                    style: { backgroundColor: '#f7edeb', color: '#ff6242' },
                });
                return;
            }
            
            try {
                setLoading(true);
                const formatDateForAPI = (dateStr) => {
                    if (!dateStr) return '';
                    return new Date(dateStr).toLocaleDateString('en-GB').replace(/\//g, '-');
                };

                const fromDate = formatDateForAPI(selectedDate);
                const toDate = formatDateForAPI(currentDate);
                const storeID = 1;

                let PType = `?FromDate=${fromDate}&ToDate=${toDate}&StoreID=${storeID}`;
                let PJsonData = {};
                
                console.log('Calling GetFootFallData API with:', PType);
                let responseJson = await GetAPI('/api/Foot/GetFootFallData', PType, PJsonData, cookies);
                console.log('GetFootFallData API Response=>', responseJson);
                
                if (responseJson.data && Array.isArray(responseJson.data)) {
                    if (responseJson.data.length === 0) {
                        toast.error('No data in this date range', {
                            style: { backgroundColor: '#f7edeb', color: '#ff6242' },
                        });
                    } else if (responseJson.data.length > 0) {
                        toast.success('Data loaded successfully', {
                            style: { backgroundColor: '#e3ffea', color: '#3ed665' },
                        });
                        
                        const apiData = responseJson.data[0];
                        console.log('API Data received:', apiData);
                        
                        const updatedApiValues = {};
                        slotListData.forEach((slot) => {
                            let timeKey = '';
                            if (slot.slotDesc && slot.slotDesc.startsWith('>')) {
                                timeKey = slot.slotDesc; 
                            } else if (slot.fromTime && slot.toTime) {
                                const fromTimeStr = slot.fromTime.toString().padStart(4, '0');
                                const toTimeStr = slot.toTime.toString().padStart(4, '0');
                                timeKey = `${fromTimeStr}-${toTimeStr}`;
                            }
                            
                            console.log(`Mapping slot ${slot.slotID} with timeKey: ${timeKey}, value from API:`, apiData[timeKey]);
                            
                            if (timeKey && apiData[timeKey] !== undefined) {
                                updatedApiValues[slot.slotID] = apiData[timeKey];
                            } else {
                                updatedApiValues[slot.slotID] = 0;
                            }
                        });
                        
                        console.log('Updated API footfall values for graph (blue line):', updatedApiValues);
                        setApiFootfallValues(updatedApiValues);
                    }
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching footfall data:', error);
                toast.error('Failed to fetch footfall data');
                setLoading(false);
            }
        };

    //! /api/Foot/GetFootFallDataToday - Load today's footfall data into input fields
    useEffect(() => {
        const fetchFootFallDataToday = async () => {
            // if (!today || slotListData.length === 0) {
            //     console.log('Skipping GetFootFallDataToday - missing data:', { today, slotListDataLength: slotListData.length });
            //     return;
            // }
            
            try {
                setLoading(true);
                const storeID = cookies.DefaultStoreId || 1;
                
                // Format date in DD/MM/YYYY format for API
                // const formatDateForAPI = (dateStr) => {
                //     if (!dateStr) return '';
                //     // dateStr is already in DD-MM-YYYY format from server
                //     return dateStr.replace(/-/g, '/');
                // };

                // const toDate = formatDateForAPI(today);
                let PType = `?ToDate=${apiToday}&StoreId=${storeID}`;
                let PJsonData = {};
                
                console.log('Calling GetFootFallDataToday API with:', PType);
                let responseJson = await GetAPI('/api/Foot/GetFootFallDataToday', PType, PJsonData, cookies);
                console.log('GetFootFallDataToday API Response=>', responseJson);
                
                if (responseJson.data && Array.isArray(responseJson.data) && responseJson.data.length > 0) {
                    const todayData = responseJson.data[0];
                    console.log('Today Footfall Data received:', todayData);
                    
                    // alert(`Today's footfall data received. DocEntry: ${todayData.DocEntry}`); // Alert to confirm data reception
                    // Store DocEntry from API response
                    if (todayData.DocEntry !== undefined) {
                        setDocEntry(todayData.DocEntry);
                        console.log('DocEntry set to:', todayData.DocEntry);
                        // alert(`DocEntry for today's data: ${todayData.DocEntry}`); // Alert to confirm docEntry value
                    }
                    
                    const updatedFootfallValues = {};
                    slotListData.forEach((slot) => {
                        let timeKey = '';
                        if (slot.slotDesc && slot.slotDesc.startsWith('>')) {
                            timeKey = slot.slotDesc; 
                        } else if (slot.fromTime && slot.toTime) {
                            const fromTimeStr = slot.fromTime.toString().padStart(4, '0');
                            const toTimeStr = slot.toTime.toString().padStart(4, '0');
                            timeKey = `${fromTimeStr}-${toTimeStr}`;
                        }
                        
                        console.log(`Mapping slot ${slot.slotID} with timeKey: ${timeKey}, value from API:`, todayData[timeKey]);
                        
                        if (timeKey && todayData[timeKey] !== undefined) {
                            updatedFootfallValues[slot.slotID] = todayData[timeKey];
                        } else {
                            updatedFootfallValues[slot.slotID] = '';
                        }
                    });
                    
                    console.log('Updated footfall input values (red line):', updatedFootfallValues);
                    setFootfallValues(updatedFootfallValues);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching today footfall data:', error);
                toast.error('Failed to fetch today footfall data');
                setLoading(false);
            }
        };

        fetchFootFallDataToday();
    }, [today, slotListData]);
    
    if (!currentData || slotListData.length === 0) {
        return <div className="min-h-screen bg-gray-50 p-6">Loading or No Data Found</div>
    }
    
    const footfallChartData = {
        labels: slotListData.map(slot => formatSlotDesc(slot)),
        datasets: [
            {
            label: 'Selected Range Footfall',
            data: slotListData.map((slot) => Number(apiFootfallValues[slot.slotID] || 0)),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.3,
            },
            {
            label: 'Today Footfall',
            data: slotListData.map((slot) => Number(footfallValues[slot.slotID] || 0)),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.3,
            },
        ],
    }
    
    const salesChartData = {
        labels: currentData.dates,
        datasets: [
            {
            label: 'Sales per Day',
            data: currentData.dates.map((d) => currentData.salesPerDay[d]),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.3,
            },
        ],
    }
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
            beginAtZero: true,
            },
        },
    }

    const handleSave = async () => {
        // Validate that at least one footfall value is entered
        const hasValues = Object.values(footfallValues).some(val => val && val !== '0');
        if (!hasValues) {
            toast.error('Please enter at least one footfall count');
            return;
        }

        // // Validate selectedDate
        // if (!selectedDate) {
        //     toast.error('Please select a date');
        //     return;
        // }

        // Format date to DD-MM-YYYY
        const formatDateForAPI = (dateStr) => {
            if (!dateStr) return '';
            return new Date(dateStr).toLocaleDateString('en-GB').replace(/\//g, '-');
        };

        const footFallDetails = slotListData.map((slot) => ({
            docEntry: docEntry,
            slotID: slot.slotID,
            storeID: cookies.DefaultStoreId || 1,
            slotDesc: formatSlotDesc(slot),
            fromTime: slot.fromTime,
            toTime: slot.toTime || 0,
            footFallCount: Number(footfallValues[slot.slotID] || 0)
        }));

        const formData = {
            docEntry: docEntry,
            // docDate: formatDateForAPI(selectedDate),
            docDate: apiToday,
            storeID: cookies.DefaultStoreId || 1,
            enteredBy: cookies.UserId || 1,
            usedFor: docEntry && docEntry !== -1 ? "U" : "I",
            footFallDetails: footFallDetails
        };

        try {
            setLoading(true);
            console.log('Sending footfall data:', formData);
            const response = await PostAPI('/api/FootRep/PostFootfallMaster', '', formData, cookies);
            console.log('Save response:', response);
            
            if (response.data[0].returnCode === 'Y') {
                toast.success('Footfall data saved successfully!', {
                    style: { backgroundColor: '#e3ffea', color: '#3ed665' },
                });
                window.location.reload();
            } else if (response.data[0].returnCode === 'F') {
                toast.error(response.data[0].returnMsg, {
                    style: { backgroundColor: '#f7edeb', color: '#ff6242' },
                });
            } else if (response.data[0].returnCode === 'N') {
                toast.error(response.data[0].returnMsg, {
                    style: { backgroundColor: '#f7edeb', color: '#ff6242' },
                });
            } else {
                toast.error('Failed to save footfall data. Please try again.', {
                    style: { backgroundColor: '#f7edeb', color: '#ff6242' },
                });
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error saving footfall data:', error);
            toast.error('Failed to save footfall data');
            setLoading(false);
        }
    }

  

    return (
        <div className="flex-1 p-4">
        <div className="rounded-lg bg-white shadow-sm p-4">
            <div className="flex items-end gap-10">
            <label className="text-sm font-semibold text-gray-700 mb-1">Form Date : </label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={currentDate}
                className="w-[140px] h-[35px] px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold text-gray-700 mb-1">To Date : </label>
            <input
                type="date"
                value={currentDate}
                disabled
                className="w-[140px] h-[35px] px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
            />
            <div>
                <Button onClick={fetchFootFallData} className='btn btn-primary'>
                    <Search className="w-4 h-4 mr-2" />
                    Check Footfall In Range
                </Button>
            </div>
            </div>

            {/* Line Chart */}
            <div className="h-64 mt-8 w-[2000px]">
            <Line
                data={view === 'footfall' ? footfallChartData : salesChartData}
                options={chartOptions}
            />
            </div>
        </div>

        <div className="relative overflow-x-auto pb-2 mt-16">
            <div className="inline-block min-w-full px-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {slotListData.map((slot) => (
                    <th
                        key={slot.slotID}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                        {formatSlotDesc(slot)}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                    {slotListData.map((slot) => (
                    <td key={slot.slotID} className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        <input
                        type="text"
                        value={footfallValues[slot.slotID] || ''}
                        onChange={(e) =>
                            setFootfallValues((prev) => ({
                            ...prev,
                            [slot.slotID]: e.target.value,
                            }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </td>
                    ))}
                </tr>
                </tbody>
            </table>
            </div>
        </div>

        {/* Submit Section */}
        <div className="h-[60px] sticky bottom-0 right-0 flex gap-3 justify-end items-center">
            <Button type="button" onClick={closeModal} disabled>
            Cancel
            </Button>
            <Button type="submit" className="btn btn-primary" onClick={handleSave}>
            Update
            </Button>
        </div>
        </div>
    )
}

export default FootFall