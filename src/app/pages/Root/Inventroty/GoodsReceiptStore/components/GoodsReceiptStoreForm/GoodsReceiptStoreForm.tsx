import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import GoodsReceipt from './GoodsReceipt/GoodsReceipt'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const transferDetails = {
  transferNo: 'STK/1005',
  transferDate: '05-02-2025',
  transferFrom: 'Main Warehouse',
  noofPacket: '8',
  intransitDays: '11',
}

const packets = [
  { packetNo: 'PACK/1001', noOfItems: 12 },
  { packetNo: 'PACK/1002', noOfItems: 16 },
  { packetNo: 'PACK/1003', noOfItems: 22 },
  { packetNo: 'PACK/1004', noOfItems: 21 },
  { packetNo: 'PACK/1005', noOfItems: 24 },
  { packetNo: 'PACK/1006', noOfItems: 19 },
  { packetNo: 'PACK/1007', noOfItems: 11 },
  { packetNo: 'PACK/1008', noOfItems: 2 },
]

export function GoodsReceiptStoreForm() {
  const [isGoodsReceiptOpen, setGoodsReceiptOpen] = useState(false)
  const navigate = useNavigate()
  // const modalToggler = useGoodsReceiptStoreType((state) => state.toggleOpen)
  // const setModalMode = useGoodsReceiptStoreType((state) => state.setMode)

  function createModalHandler() {
    setGoodsReceiptOpen(true)
  }
  const backToLastpage = () => {
    navigate(-1);
  }

  return (
    <div className="flex gap-4">
      {isGoodsReceiptOpen ? (
        <GoodsReceipt />
      ) : (
        <>
          {/* <h1 className="text-xl font-bold mb-4">Good Transfer Details</h1> */}
          <div className="border p-4 rounded-md w-[600px]">
            <h2 className="font-semibold mb-2">Good Transfer Details</h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Transfer No.</TableCell>
                  <TableCell>{transferDetails.transferNo}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Transfer Date</TableCell>
                  <TableCell>{transferDetails.transferDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Transferred From</TableCell>
                  <TableCell>{transferDetails.transferFrom}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">No. of Packets</TableCell>
                  <TableCell>{transferDetails.noofPacket}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">In Transit Days</TableCell>
                  <TableCell>{transferDetails.intransitDays}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="border p-4 rounded-md w-full">
            {/* <h2 className="font-semibold mb-2">Packet Details</h2> */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document No.</TableHead>
                  <TableHead>Packet No.</TableHead>
                  <TableHead>No. of Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packets.map((packet, index) => (
                  <TableRow key={index}>
                    <TableCell>{transferDetails.transferNo}</TableCell>
                    <TableCell>{packet.packetNo}</TableCell>
                    <TableCell>{packet.noOfItems}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="font-medium">
                    Total
                  </TableCell>
                  <TableCell>{packets.reduce((total, p) => total + p.noOfItems, 0)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <Button onClick={createModalHandler} className="mt-4">
              Reconcile Stock
            </Button>
            {/* <Button onClick={backToTable} className='mt-4 m-4'>Back</Button> */}
            <Button
              onClick={backToLastpage}
              className="mt-4 m-4"
            >
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
