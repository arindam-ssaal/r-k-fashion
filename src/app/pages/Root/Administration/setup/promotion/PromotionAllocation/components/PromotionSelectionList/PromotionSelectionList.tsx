import { useEffect, useState } from 'react'
//import { useCookies } from 'react-cookie'

import { Promotion, usePromotionSelectionListStore } from './store/usePromotionSelctionListStore'
//import { GetAPI } from '../../../../../../../../../services/apiCall'
import { usePromotionAllocationStore } from '../../store/usePromotionAllocationStore'

import { Button } from '@/components/ui/button'

function PromotionSelectionList() {
  const promotions = usePromotionSelectionListStore((state) => state.promotions)
  const selectedRowIndex = usePromotionSelectionListStore((state) => state.selectedRowIndex)
  const closeSelector = usePromotionSelectionListStore((state) => state.closeSelector)
  const addSelectedPromotion = usePromotionSelectionListStore((state) => state.addSelectedPromotion)
  const setPromotions = usePromotionSelectionListStore((state) => state.setPromotions)
  const close = usePromotionAllocationStore((state) => state.close)
  // const [cookies] = useCookies();
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    async function fetchPromotions() {
      try {
        // const response = await GetAPI("/api/Promotion/GetAllPromotion","PromotionID=0",{},cookies);

        //const response = await fetch('http://dts.connectcloud365.com:53952/api/Promotion/GetAllPromotion?PromotionID=0')
        const response = await fetch(`${import.meta.env.VITE_SERVER_DEV}`+'/api/Promotion/GetAllPromotion?PromotionID=0')
        console.log('Response:', response)
        const data = await response.json()
        setPromotions(data)
      } catch (error) {
        console.error('Error fetching promotions:', error)
      }
    }
    fetchPromotions()
  }, [setPromotions])

  const handleSelect = (promotion: Promotion) => {
    if (selectedRowIndex !== null) {
      addSelectedPromotion(selectedRowIndex, promotion)
    }
    closeModal()
  }

  function closeModal() {
    closeSelector()
    close()
    usePromotionSelectionListStore.getState().addSelectedPromotion(-1, undefined)
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPromotions = promotions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(promotions.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="border p-4 mt-4">
      <ul className="space-y-3">
        {currentPromotions.map((promo) => (
          <li key={promo.promotionID} className="flex justify-between items-center">
            <span>{promo.promotionName}</span>
            <Button className="text-white" onClick={() => handleSelect(promo)}>
              Select
            </Button>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="back-red-600 text-c-white"
        >
          Previous
        </Button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="back-red-600 text-c-white"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default PromotionSelectionList
