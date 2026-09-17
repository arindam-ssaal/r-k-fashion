import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { PostAPI, GetAPI } from '@/services/apiCall';

const SlotMasterPage = () => {
  const [cookies] = useCookies(['UserId', 'DefaultStoreId']);
  const [loading, setLoading] = useState(false);
  const [getSlotValue, setGetSlotValue] = useState(false);
  
  const [formData, setFormData] = useState({
    docEntry: -1,
    startTime: '',
    endTime: '',
    slotMinutes: '',
    usedFor: 'I', 
  });

  const [slotDetails, setSlotDetails] = useState([]);
  const [slotsGenerated, setSlotsGenerated] = useState(false);

  //! Fetch existing slots on page load
  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await GetAPI('/api/Foot/GetSlot', '', {}, cookies);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setGetSlotValue(true);
        // Transform API response to match table format
        const transformedSlots = response.data.map((slot) => ({
          docEntry: slot.docEntry,
          slotID: slot.slotID,
          slotDesc: slot.slotDesc,
          fromTime: formatNumericToTime(slot.fromTime),
          toTime: slot.toTime === 0 ? '00:00' : formatNumericToTime(slot.toTime)
        }));

        setSlotDetails(transformedSlots);
        if (transformedSlots.length > 0) {
          setSlotsGenerated(true);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load slots from server');
      setLoading(false);
    }
  };

  //! Format time from HH:MM to numeric format (HHMM)
  const formatTimeToNumeric = (timeString) => {
    if (!timeString) return 0;
    return parseInt(timeString.replace(':', ''));
  };

  //! Format numeric time to HH:MM string format
  const formatNumericToTime = (numericTime) => {
    if (!numericTime) return '00:00';
    const timeStr = numericTime.toString().padStart(4, '0');
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${hours}:${minutes}`;
  };

  //! Generate slots based on start time, end time, and duration
  const handleGenerateSlots = () => {
    // Validate inputs
    if (!formData.startTime) {
      toast.error('Start time is required');
      return;
    }
    if (!formData.endTime) {
      toast.error('End time is required');
      return;
    }
    if (!formData.slotMinutes || formData.slotMinutes <= 0) {
      toast.error('Valid slot duration is required');
      return;
    }

    // Parse start and end time
    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const [endHour, endMinute] = formData.endTime.split(':').map(Number);

    // Convert to minutes
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Validate time range
    if (endTimeInMinutes <= startTimeInMinutes) {
      toast.error('End time must be after start time');
      return;
    }

    const duration = parseInt(formData.slotMinutes);
    const totalMinutes = endTimeInMinutes - startTimeInMinutes;

    // Check if slots can be evenly divided
    if (totalMinutes % duration !== 0) {
      toast.warning(`Total time (${totalMinutes} min) is not evenly divisible by slot duration (${duration} min). Last slot will be adjusted.`);
    }

    // Generate slots
    const generatedSlots = [];
    let currentTime = startTimeInMinutes;
    let slotIndex = 1;

    while (currentTime < endTimeInMinutes) {
      const fromHour = Math.floor(currentTime / 60);
      const fromMinute = currentTime % 60;
      const fromTimeStr = `${String(fromHour).padStart(2, '0')}:${String(fromMinute).padStart(2, '0')}`;

      const nextTime = Math.min(currentTime + duration, endTimeInMinutes);
      const toHour = Math.floor(nextTime / 60);
      const toMinute = nextTime % 60;
      const toTimeStr = `${String(toHour).padStart(2, '0')}:${String(toMinute).padStart(2, '0')}`;

      generatedSlots.push({
        docEntry: 0,
        slotID: slotIndex,
        slotDesc: `${fromTimeStr}-${toTimeStr}`,
        fromTime: fromTimeStr,
        toTime: toTimeStr
      });

      currentTime = nextTime;
      slotIndex++;
    }

    setSlotDetails(generatedSlots);
    setSlotsGenerated(true);
    toast.success(`${generatedSlots.length} slots generated successfully!`);
  };

  const handleGenerateSlotsfromAPI = async () => {
    // Validate inputs
    if (!formData.startTime) {
      toast.error('Start time is required');
      return;
    }
    if (!formData.endTime) {
      toast.error('End time is required');
      return;
    }
    if (!formData.slotMinutes || formData.slotMinutes <= 0) {
      toast.error('Valid slot duration is required');
      return;
    }

    try {
      setLoading(true);
      
      // Convert time to numeric format for API
      const fromTime = formatTimeToNumeric(formData.startTime);
      const toTime = formatTimeToNumeric(formData.endTime);
      const slotMinutes = parseInt(formData.slotMinutes);

      // Build query parameters
      const queryParams = `?FromTime=${fromTime}&ToTime=${toTime}&SlotMinutes=${slotMinutes}`;
      
      // Call the API
      const response = await GetAPI('/api/Foot/GetDataSlot', queryParams, {}, cookies);
      
      if (response.data && Array.isArray(response.data)) {
        // Transform API response to match table format
        const transformedSlots = response.data.map((slot) => ({
          docEntry: slot.docEntry,
          slotID: slot.slotID,
          slotDesc: slot.slotDesc,
          fromTime: formatNumericToTime(slot.fromTime),
          toTime: slot.toTime === 0 ? '00:00' : formatNumericToTime(slot.toTime)
        }));

        setSlotDetails(transformedSlots);
        setSlotsGenerated(true);
        toast.success(`${transformedSlots.length} slots generated successfully from API!`);
      } else {
        toast.error('Invalid response from API');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching slots from API:', error);
      toast.error('Failed to fetch slots from API. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    if (!formData.startTime) {
      toast.error('Start time is required');
      return false;
    }
    if (!formData.endTime) {
      toast.error('End time is required');
      return false;
    }
    if (!formData.slotMinutes) {
      toast.error('Slot minutes is required');
      return false;
    }

    if (!slotsGenerated || slotDetails.length === 0) {
      toast.error('Please generate slots first by clicking "Generate Slots" button');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Prepare API payload
    const payload = {
      docEntry: formData.docEntry,
      startTime: formatTimeToNumeric(formData.startTime),
      endTime: formatTimeToNumeric(formData.endTime),
      slotMinutes: parseInt(formData.slotMinutes),
      enteredBy: cookies.UserId || 0,
      usedFor: formData.usedFor,
      slotDetails: slotDetails.map((slot, index) => ({
        docEntry: slot.docEntry,
        slotID: slot.slotID || index + 1,
        slotDesc: slot.slotDesc,
        fromTime: formatTimeToNumeric(slot.fromTime),
        toTime: formatTimeToNumeric(slot.toTime)
      }))
    };

    try {
      setLoading(true);
      const response = await PostAPI('/api/FootRep/PostSlotMaster', '', payload, cookies);
      
      if (response.data && response.data[0]?.returnCode === 'Y') {
        toast.success(response.data[0]?.returnMsg || 'Slot master created successfully!', {
          style: { backgroundColor: '#e3ffea', color: '#3ed665' },
        });
        
        setFormData({
          docEntry: -1,
          startTime: '',
          endTime: '',
          slotMinutes: '',
          usedFor: 'I',
        });
        setSlotDetails([]);
        setSlotsGenerated(false);
      } else if (response.data && response.data[0]?.returnCode === 'F') {
        toast.error(response.data[0]?.returnMsg || 'Failed to create slot master', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        });
      } else if (response.data && response.data[0]?.returnCode === 'N') {
        toast.error(response.data[0]?.returnMsg || 'Operation failed', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        });
      } else {
        toast.error('Unexpected response from server', {
          style: { backgroundColor: '#f7edeb', color: '#ff6242' },
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error creating slot master:', error);
      toast.error('Failed to create slot master. Please try again.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      docEntry: -1,
      startTime: '',
      endTime: '',
      slotMinutes: '',
      usedFor: 'I',
    });
    setSlotDetails([]);
    setSlotsGenerated(false);
  };

  return (
    <div className="flex-1 p-6">
      <div className="rounded-lg  shadow-sm p-6">
        <h2 className="text-2xl font-bold  mb-6" style={{ color: '#000' }}>Create Slot Master</h2>
        
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold  mb-2" style={{color:'black'}}>
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={getSlotValue}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold  mb-2" style={{color:'black'}}>
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={getSlotValue}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#000' }}>
                Slot Duration (Minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.slotMinutes}
                onChange={(e) => handleInputChange('slotMinutes', e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={getSlotValue}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleGenerateSlotsfromAPI}
              className="btn btn-primary"
              type="button"
              disabled={loading || getSlotValue}
            >
              {loading ? 'Generating...' : 'Generate Slots'}
            </Button>
          </div>
        </div>

        {slotsGenerated && slotDetails.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{color: '#000' }}>
                Generated Slots ({slotDetails.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" style={{ backgroundColor: '#fff', color: '#000' }}>
                <thead className="" style={{ backgroundColor: '#fff', color: '#000' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold " style={{ color: '#000' }}>
                      Slot #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold " style={{ color: '#000' }}>
                      Slot Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold " style={{ color: '#000' }}>
                      From Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold " style={{ color: '#000' }}>
                      To Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200" style={{ backgroundColor: '#fff', color: '#000' }}>
                  {slotDetails.map((slot, index) => (
                    <tr key={index} className="">
                      <td className="px-4 py-4 text-sm " style={{ color: '#000' }}>
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm " style={{ color: '#000' }}>
                        {slot.slotDesc}
                      </td>
                      <td className="px-4 py-4 text-sm " style={{ color: '#000' }}>
                        {slot.fromTime}
                      </td>
                      <td className="px-4 py-4 text-sm " style={{ color: '#000' }}>
                        {slot.toTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!slotsGenerated && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-800 text-sm">
              Enter Start Time, End Time, and Slot Duration above, then click "Generate Slots" to create the slot schedule.
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-end items-center pt-6">
          <Button 
            type="button" 
            onClick={handleReset}
            variant="outline"
            disabled={loading || getSlotValue} 
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading || getSlotValue}
          >
            {loading ? 'Saving...' : 'Create Slot Master'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlotMasterPage; 
// ---new one automatic