import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import allFootFallsData from './footFallData.json'
import { useFootFall } from './store/useFootFall'
import { Button } from '@/components/ui/button'

function FootFall() {
  const [selectedMonth, setSelectedMonth] = useState('September')
  const [currentData, setCurrentData] = useState(null)
  const [footfallValues, setFootfallValues] = useState({})
  const [view, setView] = useState('footfall') // 'footfall' or 'sales'
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

  useEffect(() => {
    const found = allFootFallsData.find((item) => item.month === selectedMonth)
    setCurrentData(found)
    if (found) {
      const initialValues = {}
      found.times.forEach((time) => {
        initialValues[time] = '' // start as empty string
      })
      setFootfallValues(initialValues)
    }
  }, [selectedMonth])

  if (!currentData) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading or No Data Found</div>
  }

  const footfallChartData = {
    labels: currentData.times,
    datasets: [
      {
        label: 'Footfall by Time',
        data: currentData.times.map((time) => Number(footfallValues[time] || 0)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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

  return (
    <div className="flex-1 p-4">
      <div className="rounded-lg bg-white shadow-sm p-4">
        <div className="flex items-end gap-10">
          <label className="text-sm font-semibold text-gray-700 mb-1"> Date : </label>
          <input
            type="date"
            className="w-[140px] h-[35px] px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm font-semibold text-gray-700 mb-1">Current Date : </label>
          <input
            type="date"
            className="w-[140px] h-[35px] px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Line Chart */}
        <div className="h-64 mt-8">
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
                {currentData.times.map((time) => (
                  <th
                    key={time}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                {currentData.times.map((time) => (
                  <td key={time} className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                    <input
                      type="number"
                      value={footfallValues[time] || ''}
                      onChange={(e) =>
                        setFootfallValues((prev) => ({
                          ...prev,
                          [time]: e.target.value,
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
        <Button type="submit" className="btn btn-primary">
          Update
        </Button>
      </div>
    </div>
  )
}

export default FootFall