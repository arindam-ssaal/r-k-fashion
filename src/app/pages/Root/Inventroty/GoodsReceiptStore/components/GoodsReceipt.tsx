import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import GoodsReceipe from '../GoodsReceipe'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table } from '@/components/ui/table'

const GoodsReceipt = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [documentNo, setDocumentNo] = useState('')
  const [isGoodsReceiptOpen, setGoodsReceiptOpen] = useState(false)
  const navigate = useNavigate()

  const backToLastpage = () => {
    //  window.history.back()
    navigate(-1)
  }

  const documentData = [
    { documentNo: 'STK/1005', packetNo: 'PACK/1001', items: 12 },
    { documentNo: 'STK/1005', packetNo: 'PACK/1002', items: 16 },
    { documentNo: 'STK/1005', packetNo: 'PACK/1003', items: 22 },
    { documentNo: 'STK/1005', packetNo: 'PACK/1004', items: 21 },
    { documentNo: 'STK/1005', packetNo: 'PACK/1005', items: 24 },
    { documentNo: 'STK/1005', packetNo: 'PACK/1006', items: 11 },
    { documentNo: 'STK/1005', packetNo: 'PACK/1007', items: 9 },
  ]

  const receiptData = [
    {
      barcode: 'DE1001',
      itemName: 'L1001 Lushiplib T-Shirt (S)',
      packQty: 1,
      receiptQty: 1,
      damage: 0,
      shortage: 0,
      remarks: 'Receipt Damage Piece',
      article: "MEN'S - UPPER - T-SHIRT",
    },
    {
      barcode: 'DE1003',
      itemName: 'L1003 Lushiplib T-Shirt (L)',
      packQty: 2,
      receiptQty: 2,
      damage: 1,
      shortage: 0,
      remarks: 'Receipt Damage Piece',
      article: "MEN'S - UPPER - T-SHIRT",
    },
    {
      barcode: 'DE1004',
      itemName: 'L1004 Lushiplib T-Shirt (XL)',
      packQty: 1,
      receiptQty: 8,
      damage: 0,
      shortage: 0,
      remarks: 'Receipt Damage Piece',
      article: "Girl'S - T-SHIRT",
    },
  ]

  function createModalHandler() {
    setGoodsReceiptOpen(true)
    // modalToggler()
    // setModalMode('Create')
    //alert('Generate Receipt')
  }

  return (
    <>
      {isGoodsReceiptOpen ? (
        <GoodsReceipe />
      ) : (
        <>
          <div className="p-4 space-y-4 w-full">
            {/* Card container with flex to show side by side */}
            <div className="flex flex-wrap gap-4">
              <Card className="flex-1 min-w-[300px]">
                <CardContent>
                  {/* <h2 className="text-lg font-bold">Goods Receipt</h2> */}
                  <Table>
                    <thead>
                      <tr>
                        <th className="text-left">Document No</th>
                        <th className="text-left">Packet No</th>
                        <th className="text-left">No. of Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentData.map((doc, index) => (
                        <tr key={index}>
                          <td>{doc.documentNo}</td>
                          <td>{doc.packetNo}</td>
                          <td>{doc.items}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="text-left fw-bold">Total: </td>
                        <td></td>
                        <td className="text-left fw-bold">
                          {documentData.reduce((total, doc) => total + Number(doc.items || 0), 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </CardContent>
              </Card>

              <Card className="flex-1 min-w-[300px]">
                <CardContent>
                  <Table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">Barcode</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">
                          Item Name
                        </th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">
                          Pack Qty
                        </th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">
                          Receipt Qty
                        </th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">Damage</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">
                          Shortage
                        </th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">Remarks</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700">Article</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptData.map((item, index) => (
                        <tr
                          key={index}
                          className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-50 transition"
                        >
                          <td className="px-4 py-2">{item.barcode}</td>
                          <td className="px-4 py-2">{item.itemName}</td>
                          <td className="px-4 py-2">{item.packQty}</td>
                          <td className="px-4 py-2">{item.receiptQty}</td>
                          <td className="px-4 py-2">{item.damage}</td>
                          <td className="px-4 py-2">{item.shortage}</td>
                          <td className="px-4 py-2">{item.remarks}</td>
                          <td className="px-4 py-2">{item.article}</td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={2} className="px-4 py-2 text-right text-gray-700">
                          Total :
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {receiptData.reduce((sum, item) => sum + Number(item.packQty || 0), 0)}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {receiptData.reduce((sum, item) => sum + Number(item.receiptQty || 0), 0)}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {receiptData.reduce((sum, item) => sum + Number(item.damage || 0), 0)}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {receiptData.reduce((sum, item) => sum + Number(item.shortage || 0), 0)}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Action buttons and inputs */}
            <div className="flex space-x-4 mt-4 justify-end">
              <Button>Post Inventory</Button>
              <Button onClick={createModalHandler}>Reconcile Packet</Button>
              <Button onClick={backToLastpage}>Back</Button>
              <div className="flex flex-col gap-4">
                {/* Document No */}
                <div className="flex items-center gap-4">
                  <label className="whitespace-nowrap font-medium text-gray-700 mb-4 w-36">
                    Document No:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-52 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={documentNo}
                    onChange={(e) => setDocumentNo(e.target.value)}
                    placeholder="Enter Document No"
                  />
                </div>
                {/* Warehouse */}
                <div className="flex items-center gap-4">
                  <label className="whitespace-nowrap font-medium text-gray-700 w-36">
                    Warehouse:
                  </label>
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger className="w-52 h-10">
                      <SelectValue placeholder="Select a warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Warehouse</SelectLabel>
                        <SelectItem value="w001">Warehouse1</SelectItem>
                        <SelectItem value="w002">Warehouse2</SelectItem>
                        <SelectItem value="w003">Warehouse3</SelectItem>
                        <SelectItem value="w004">Warehouse4</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default GoodsReceipt
