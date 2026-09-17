import React, { useState, useEffect } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js'

import allSalesData from './adminData.json'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
)

const AdminDashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('September')
  const [selectedStore, setSelectedStore] = useState('Kolkata')
  const [currentData, setCurrentData] = useState(null)

  // Get unique stores and months for dropdown options
  const stores = [...new Set(allSalesData.map((item) => item.store))]
  const months = [...new Set(allSalesData.map((item) => item.month))]

  useEffect(() => {
    const foundData = allSalesData.find(
      (item) => item.month === selectedMonth && item.store === selectedStore
    )
    setCurrentData(foundData || null)
  }, [selectedMonth, selectedStore])

  if (!currentData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h2>
          No data found for {selectedStore} in {selectedMonth}
        </h2>
      </div>
    )
  }

  
  const categoryColors = {
    'Mens Wear': 'text-indigo-600',
    'Women Wear': 'text-pink-600',
    'Kids Wear': 'text-teal-600',
    Accessories: 'text-yellow-600',
  }

  // Backet Quantity Chart
  const quantityChartData = {
    labels: currentData.dates,
    datasets: [
      {
        label: 'Basket Quantity',
        data: currentData.basketQuantity.slice(1),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  // Basket Value Chart
  const valueChartData = {
    labels: currentData.dates,
    datasets: [
      {
        label: 'Basket Value',
        data: currentData.basketValue.slice(1),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  // Daily Sales Chart
  const dailySalesChartData = {
    labels: currentData.dates,
    datasets: [
      {
        label: 'Daily Sales',
        data: currentData.dates.map((date) => currentData.salesPerDay[date]),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  }

  // Category-wise Sales Chart
  const categoryWiseSalesChartData = {
    labels: currentData.dates,
    datasets: Object.entries(currentData.itemCategoryWiseSales).map(
      ([category, values], index) => ({
        label: category,
        data: values,
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)', // Indigo
          'rgba(236, 72, 153, 0.6)', // Pink
          'rgba(20, 184, 166, 0.6)', // Teal
          'rgba(253, 224, 71, 0.6)', // Yellow
        ][index],
      })
    ),
  }

  const footfallChartData = {
    labels: currentData.dates,
    datasets: [
      {
        label: 'Footfall',
        data: currentData.dates.map((date) => currentData.footfallAnalysis[date]),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
  const calculateBackgroundColor = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const monthIndex = months.indexOf(selectedMonth) + 1 // Get the index of the selected month (1-based)
    const averageSales = currentData.yearlySales / monthIndex // Average monthly sales for the year
    if (averageSales < currentData.monthlySales) {
      return 'bg-green-600 text-white'
    }
    const percentageDifference =
      (Math.abs(currentData.monthlySales - averageSales) / averageSales) * 100

    if (percentageDifference >= 0 && percentageDifference <= 10) {
      return 'bg-green-600 text-white'
    } else if (percentageDifference > 10 && percentageDifference <= 20) {
      return 'bg-amber-500 text-white'
    } else if (percentageDifference > 20) {
      return 'bg-red-600 text-white'
    } else {
      return 'bg-gray-200 text-gray-800'
    }
  }

  // Pie Chart Data for Category Performance
  const categoryPerformancePieData = {
    labels: currentData.categories.map((category) => category.name),
    datasets: [
      {
        data: currentData.categories.map((category) => category.sales),
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)', // Indigo
          'rgba(236, 72, 153, 0.6)', // Pink
          'rgba(20, 184, 166, 0.6)', // Teal
          'rgba(253, 224, 71, 0.6)', // Yellow
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)', // Indigo
          'rgba(236, 72, 153, 1)', // Pink
          'rgba(20, 184, 166, 1)', // Teal
          'rgba(253, 224, 71, 1)', // Yellow
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      {/* <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Sales Dashboard</h1>
        <div className="flex flex-1 gap-4">
          <select
            className="rounded-lg border px-4 py-2 flex-1"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border px-4 py-2 flex-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      <div className="flex flex-col gap-6">
        {/* Row with Monthly/Yearly Sales and Pie Chart */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Left Container: Monthly and Yearly Sales */}
          {/* <div className="flex-1 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Total Sales</h2>
            <div className="flex flex-col gap-4">
              <div className={`rounded-lg p-4 ${calculateBackgroundColor()}`}>
                <p className="text-sm font-medium">Monthly Sales</p>
                <p className="text-2xl font-bold">₹{currentData.monthlySales.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium">Yearly Sales</p>
                <p className="text-2xl font-bold">₹{currentData.yearlySales.toLocaleString()}</p>
              </div>
            </div>
          </div> */}

          {/* Right Container: Pie Chart */}
          {/* <div className="flex-1 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Category Performance Chart</h2>
            <div className="h-64">
              <Pie data={categoryPerformancePieData} options={chartOptions} />
            </div>
          </div> */}
        </div>

        {/* Basket Size Section */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Quantity Section */}
          <div className="flex-1 p-4 min-w-0">
            {/* <div className="rounded-lg bg-white shadow-sm">
              <div className="p-4">
                <h2 className="text-lg font-semibold">Average Basket Size (Quantity)</h2>
              </div>
              <div className="relative overflow-x-auto pb-2">
                <div className="block w-full px-4">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Store
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Till Date
                        </th>
                        {currentData.dates.map((date) => (
                          <th
                            key={date}
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            {date}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                          {currentData.store}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                          {currentData.basketQuantity[0]}
                        </td>
                        {currentData.basketQuantity.slice(1).map((value, index) => (
                          <td
                            key={index}
                            className="whitespace-nowrap px-4 py-4 text-sm text-gray-900"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div> */}
            {/* Quantity Bar Graph */}
            {/* <div className="mt-4 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Basket Quantity</h2>
              <div className="h-48">
                <Bar data={quantityChartData} options={chartOptions} />
              </div>
            </div> */}
          </div>

          {/* Value Section */}
          <div className="flex-1 p-4 min-w-0">
            {/* <div className="rounded-lg bg-white shadow-sm">
              <div className="p-4">
                <h2 className="text-lg font-semibold">Average Basket Size (Value)</h2>
              </div>
              <div className="relative overflow-x-auto pb-2">
                <div className="block w-full px-4">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Store
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Till Date
                        </th>
                        {currentData.dates.map((date) => (
                          <th
                            key={date}
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            {date}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                          {currentData.store}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                          ₹{currentData.basketValue[0]}
                        </td>
                        {currentData.basketValue.slice(1).map((value, index) => (
                          <td
                            key={index}
                            className="whitespace-nowrap px-4 py-4 text-sm text-gray-900"
                          >
                            ₹{value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div> */}
            {/* Value Bar Graph */}
            {/* <div className="mt-4 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Basket Value</h2>
              <div className="h-48">
                <Bar data={valueChartData} options={chartOptions} />
              </div>
            </div> */}
          </div>
        </div>

        {/* Daily Sales Section */}
        <div className="flex-1 p-4">
          {/* <div className="rounded-lg bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Daily Sales</h2>
            </div>
            <div className="relative overflow-x-auto pb-2">
              <div className="inline-block min-w-full px-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Store
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Till Date
                      </th>
                      {currentData.dates.map((date) => (
                        <th
                          key={date}
                          className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                        >
                          {date}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        {currentData.store}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        ₹{currentData.monthlySales.toLocaleString()}
                      </td>
                      {currentData.dates.map((date) => (
                        <td
                          key={date}
                          className="whitespace-nowrap px-4 py-4 text-sm text-gray-900"
                        >
                          ₹{currentData.salesPerDay[date].toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
          {/* Daily Sales Bar Graph */}
          {/* <div className="mt-4 rounded-lg bg-white p-6 shadow-sm">
            <div className="h-64">
              <Bar data={dailySalesChartData} options={chartOptions} />
            </div>
          </div> */}
        </div>

        {/* Category-wise Sales */}
        <div className="flex-1 p-4">
          {/* <div className="rounded-lg bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Item Category Wise Sales</h2>
            </div>
            <div className="relative overflow-x-auto pb-2">
              <div className="inline-block min-w-full px-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Store
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Till Date
                      </th>
                      {currentData.dates.map((date) => (
                        <th
                          key={date}
                          className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                        >
                          {date}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {Object.entries(currentData.itemCategoryWiseSales).map(([category, sales]) => {
                      const categoryTotal = currentData.categories.find(
                        (c) => c.name === category
                      )?.sales

                      return (
                        <tr key={category}>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                            {currentData.store}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                            {category}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                            ₹{categoryTotal?.toLocaleString()}
                          </td>
                          {sales.map((amount, index) => (
                            <td
                              key={index}
                              className="whitespace-nowrap px-4 py-4 text-sm text-gray-900"
                            >
                              ₹{amount.toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
          {/* Category-wise Sales Chart */}
          {/* <div className="mt-4 rounded-lg bg-white p-6 shadow-sm">
            <div className="h-64">
              <Bar data={categoryWiseSalesChartData} options={chartOptions} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
