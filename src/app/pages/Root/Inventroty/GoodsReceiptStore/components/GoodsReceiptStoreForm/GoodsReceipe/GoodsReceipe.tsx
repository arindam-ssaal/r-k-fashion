import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
const GoodsReceipe = () => {
  const [scanOption, setScanOption] = useState('auto')
  const [scanInput, setScanInput] = useState('')
  const [transferQty, setTransferQty] = useState('')
  const [scanQty, setScanQty] = useState('')
  const [damageQty, setDamageQty] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [documentNo, setDocumentNo] = useState('')

  const navigate = useNavigate()

  const backToLastpage = () => {
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
      receiptQty: 2,
      damage: 0,
      shortage: 0,
      remarks: '',
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
      packQty: 3,
      receiptQty: 3,
      damage: 5,
      shortage: 1,
      remarks: 'Receipt Damage Piece',
      article: "Girl'S - T-SHIRT",
    },
  ]

  return (
    <div className="p-4 space-y-4 w-full">
      <div className="flex gap-4">
        <Card className="w-1/3">
          <CardContent>
            <h2 className="text-lg font-bold">Goods Receipe</h2>
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
            </Table>
          </CardContent>
        </Card>

        <div className=" w-2/3">
          <Card className="w-full">
            <CardContent>
              <div className="p-4 border rounded-lg shadow-md w-full">
                <div className="mb-6 mt-2 flex items-center space-x-3 justify-between">
                  <div className="flex space-x-4">
                    <label className="font-semibold">Scan Option:</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="scanOption"
                          value="auto"
                          checked={scanOption === 'auto'}
                          onChange={() => setScanOption('auto')}
                        />
                        <span>Auto</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="scanOption"
                          value="manual"
                          checked={scanOption === 'manual'}
                          onChange={() => setScanOption('manual')}
                        />
                        <span>Manual</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-x-4">
                    <label className="font-semibold">Scan:</label>
                    <input
                      type="text"
                      className="border p-2 rounded w-60"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      placeholder="Enter scan value"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="w-56 font-medium text-gray-700">
                      Total Transferred Quantity:
                    </label>
                    <input
                      type="number"
                      className="border border-gray-300 p-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={transferQty}
                      onChange={(e) => setTransferQty(e.target.value)}
                      placeholder="Enter transferred qty"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-56 font-medium text-gray-700">Total Scan Quantity:</label>
                    <input
                      type="number"
                      className="border border-gray-300 p-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scanQty}
                      onChange={(e) => setScanQty(e.target.value)}
                      placeholder="Enter scan qty"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-56 font-medium text-gray-700">Total Damage Quantity:</label>
                    <input
                      type="number"
                      className="border border-gray-300 p-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={damageQty}
                      onChange={(e) => setDamageQty(e.target.value)}
                      placeholder="Enter damage qty"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Barcode</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Pack Qty</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Receipt Qty
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Damage</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Shortage</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Remarks</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Article</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {receiptData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-2 text-gray-800">{item.barcode}</td>
                        <td className="px-4 py-2 text-gray-800">{item.itemName}</td>
                        <td className="px-4 py-2 text-gray-800">{item.packQty}</td>
                        <td className="px-4 py-2 text-gray-800">{item.receiptQty}</td>
                        <td className="px-4 py-2 text-gray-800">{item.damage}</td>
                        <td className="px-4 py-2 text-gray-800">{item.shortage}</td>
                        <td className="px-4 py-2 text-gray-800">{item.remarks}</td>
                        <td className="px-4 py-2 text-gray-800">{item.article}</td>
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
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Action buttons and inputs */}
      <div className="flex space-x-4 mt-4 justify-end">
        <Button>Post Inventory</Button>
        <Button onClick={backToLastpage}>Back</Button>
        <div className="flex flex-col gap-4">
          {/* Document No */}
          <div className="flex items-center gap-4">
            <label className="whitespace-nowrap font-medium text-gray-700 mb-4 w-36">Document No:</label>
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
            <label className="whitespace-nowrap font-medium text-gray-700 w-36">Warehouse:</label>
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
  )
}

export default GoodsReceipe
