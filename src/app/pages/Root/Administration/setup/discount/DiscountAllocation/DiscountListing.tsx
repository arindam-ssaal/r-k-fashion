import { useState, useEffect } from 'react'
//import { useCookies } from 'react-cookie';

import DiscountAllocation from './page'
import { GetAPI } from '../../../../../../../services/apiCall'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function DiscountListing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [discountList, setDiscountList] = useState([])
  const [discountAllocationList, setDiscountAllocationList] = useState([])
  //const [cookies] = useCookies(['UserId', 'DefaultStoreId']);

  const handleOpen = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const fetchDiscountAllocationData = async () => {
    try {
      const PJsonData = {}
      const PType = ''
      const responseJson = await GetAPI('/api/Discount/GetAllDiscount', PType, PJsonData)
      const freshData = responseJson.data || []

      setDiscountList(freshData)
      console.log(freshData)
    } catch (error) {
      console.error('Error fetching ledger data:', error)
      setDiscountList([])
    }
  }

  useEffect(() => {
    fetchDiscountAllocationData()
  }, [])

  const fetchDiscountAllocationList = async () => {
    try {
      const PJsonData = {}
      const PType = ''
      const responseJson = await GetAPI(
        '/api/DiscountAllocations/GetAllDiscountAllocations',
        PType,
        PJsonData
      )
      const freshData = responseJson.data || []
      setDiscountAllocationList(freshData)
      console.log(freshData)
    } catch (error) {
      console.error('Error fetching ledger data:', error)
      setDiscountAllocationList([])
    }
  }

  useEffect(() => {
    fetchDiscountAllocationList()
  }, [])

  return (
    <div className="discount_allocation relative z-20">
      <div className="flex items-center py-4">
        <Input placeholder="Discount Allocation Search" className="max-w-sm" />

        <ul className="ml-auto flex mr-3 gap-4">
          <li>
            <Button onClick={handleOpen}>Add</Button>
          </li>
          <li>
            <Button variant={'outline'}>Export</Button>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="item p-3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead className="" style={{backgroundColor: '#0284c7'}}>
                <tr>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Discount Name</th>
                  <th className="border p-2 text-left">Store Name</th>
                  <th className="border p-2 text-left">Discount Allocation Details</th>
                </tr>
              </thead>
              <tbody style={{backgroundColor: '#fff', color: '#000'}}>
                {discountList.map((item: any, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.discountName}</td>
                    <td className="border p-2">{item.storeName}</td>
                    <td className="border p-2">{item.discountAllocationDetails}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="item p-3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead className="" style={{backgroundColor: '#0284c7'}}>
                <tr>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Discount Name</th>
                  <th className="border p-2 text-left">Store Name</th>
                  <th className="border p-2 text-left">Discount Allocation Details</th>
                </tr>
              </thead>
              <tbody style={{backgroundColor: '#fff', color: '#000'}}>
                {Array.isArray(discountAllocationList) &&
                  discountAllocationList.map((item: any, index: number) => (
                    <tr key={index + 1}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{item.discountName}</td>
                      <td className="border p-2">{item.storeName}</td>
                      <td className="border p-2">{item.discountAllocationDetails}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full h-full overflow-y-auto">
            <DiscountAllocation />
            <div className="text-right mt-4">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountListing
