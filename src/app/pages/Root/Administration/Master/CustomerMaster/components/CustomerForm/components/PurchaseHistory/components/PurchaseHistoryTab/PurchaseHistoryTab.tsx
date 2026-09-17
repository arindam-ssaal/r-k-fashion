import { useState } from 'react'

import Billwise from './components/BillWise'
import ItemWise from './components/ItemWise'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const billInformation = [
  {
    billNo: 'POSB/120',
    billDate: '02-05-2024',
    billAmount: '250.00',
    paymentMethod: 'Credit Card',
  },
  {
    billNo: 'POSB/12',
    billDate: '02-06-2024',
    billAmount: '150.00',
    paymentMethod: 'PayPal',
  },
  {
    billNo: 'POSB/189',
    billDate: '02-05-2023',
    billAmount: '350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    billNo: 'POSB/110',
    billDate: '02-05-2014',
    billAmount: '450.00',
    paymentMethod: 'Credit Card',
  },
  {
    billNo: 'POSB/89',
    billDate: '15-09-2024',
    billAmount: '550.00',
    paymentMethod: 'PayPal',
  },
  {
    billNo: 'POSB/12',
    billDate: '02-05-2024',
    billAmount: '200.00',
    paymentMethod: 'Bank Transfer',
  },
]

function PurchaseHistoryTab() {
  const [itemDetail, setItemDetail] = useState<null | string>(null)
  const [itemMode, setItemMode] = useState<'IW' | 'BW'>('IW')
  function detailHandler(x: string) {
    //console.log(x)
    setItemDetail(x)
  }

  function itemModeHandler(mode: 'BW' | 'IW') {
    setItemMode(mode)
    // console.log(mode);
  }

  return (
    <>
      <div>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Bill No.</TableHead>
              <TableHead>Bill Date</TableHead>
              <TableHead>Bill Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billInformation.map((bill) => (
              <TableRow key={bill.billNo}>
                <TableCell className="font-medium">{bill.billNo}</TableCell>
                <TableCell>{bill.billDate}</TableCell>
                <TableCell>{bill.billAmount}</TableCell>
                <TableCell className="text-right">
                  <Button type="button" onClick={() => detailHandler(bill.billNo)}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {/* <TableCell colSpan={3}>Total</TableCell>
           <TableCell className="text-right">$2,500.00</TableCell> */}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {itemDetail && (
        <>
          <div className="mt-10">
            <h1>Purchase History</h1>
            <RadioGroup defaultValue="mode" className="flex gap-3 items-center mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="BW"
                  id="BW"
                  defaultValue={itemMode}
                  onClick={() => itemModeHandler('BW')}
                />
                <Label htmlFor="BW">Bill Wise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  defaultValue={itemMode}
                  value="IW"
                  id="IW"
                  onClick={() => itemModeHandler('IW')}
                />
                <Label htmlFor="IW">Item Wise</Label>
              </div>
            </RadioGroup>
          </div>
          {itemMode === 'IW' ? <ItemWise /> : <Billwise />}
        </>
      )}
    </>
  )
}

export default PurchaseHistoryTab
