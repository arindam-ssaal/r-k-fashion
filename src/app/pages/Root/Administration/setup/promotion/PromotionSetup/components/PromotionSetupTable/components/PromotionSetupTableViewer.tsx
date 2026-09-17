import { useEffect, useState } from "react"

import { useFetchPromotionMasterById } from "../../../hooks_api/usePromotionData"

// PromotionSetupTableViewer.tsx
export default function PromotionSetupTableViewer({ id }: { id: number }) {
    const { fetchPromotionById } = useFetchPromotionMasterById()
    const [data, setData] = useState<any>(null)
  
    useEffect(() => {
      fetchPromotionById(id).then(setData)
    }, [id])
  
    if (!data) return <div>Loading...</div>
  
    return (
      <table className="border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{data.promotionID}</td>
            <td className="border px-4 py-2">{data.promotionName}</td>
            <td className="border px-4 py-2">{data.isActive ? 'Active' : 'Inactive'}</td>
          </tr>
        </tbody>
      </table>
    )
  }
  