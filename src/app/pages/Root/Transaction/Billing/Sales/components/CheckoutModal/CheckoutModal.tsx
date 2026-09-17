import { Loader } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import useSales from '../../store/useSales'

import { usePaymodeMasterData } from '@/app/pages/Root/Administration/Master/PayModeMaster/hooks_api/usePaymodeMasterData'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


function CheckoutModal() {
  const selectedSalesData = useSales((state) => state.selectedSalesData)
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('')
  const subTotal = selectedSalesData.reduce((acc, item) => {
    return acc + item.amount
  }, 0)
  const [incre,setIcre]=useState(1);

  const shipping = 0
  const { paymodeMasterData, isLoading } = usePaymodeMasterData()

  const payModeOptions = useMemo(() => {
    if (!paymodeMasterData || paymodeMasterData.length === 0) return []

    return paymodeMasterData.map((paymode) => ({
      value: paymode.paymentModeName || '', // Ensure a fallback value
      label: paymode.paymentModeName || 'Unknown', // Prevent UI crash if value is undefined
      id: paymode.paymentModeID || 0, // Ensure an ID is always available
    }))
  }, [paymodeMasterData])

  const handleShowToast = () => {
    setIcre(incre+1);
   toast.custom((t) => (
      <div className="flex items-center justify-between gap-4 bg-white shadow-lg p-3 rounded-md border">
        <span className="">
          Bill No. QB000{incre} Added Successfully
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.dismiss(t)}
          className="text-sm"
        >
          Close
        </Button>
      </div>
    ));
  };

  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">CheckOuts</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2  items-start mt-3 ">
        <div className="items pe-4 border-e border-solid border-gray-100">
          <Label className="text-md inline-block mb-2">Paymode</Label>
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader size="20px" /> {/* Show loader while fetching */}
              <span className="ml-2 text-sm">Loading payment modes...</span>
            </div>
          ) : (
            <Select onValueChange={(value) => setSelectedPaymentMode(value)}>
              <SelectTrigger className="mt-0">
                <SelectValue placeholder="Select Paymode" />
              </SelectTrigger>
              <SelectContent>
                {payModeOptions.length > 0 ? (
                  payModeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No payment modes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
          {/* <div className="payments mt-5">
            <h3 className="heading-secondary mb-3">Select Payement Methods</h3>
            <RadioGroup defaultValue="comfortable " className="space-y-1 roles-radio">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="r1" />
                <Label htmlFor="r1">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit" id="r2" />
                <Label htmlFor="r2">Credit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gpay" id="r3" />
                <Label htmlFor="r3">GPay</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="debit" id="r4" />
                <Label htmlFor="r4">Debit</Label>
              </div>
            </RadioGroup>
          </div> */}
        </div>
        <div className="item ml-6 mb-6">
          Card Details
          <div className="items pt-5 space-y-5">
            <Label className=" flex flex-col items-start gap-3" htmlFor="CardNumber">
              Card Number
              <Input type="text" placeholder="CardNumber" id="CardNumber" />
            </Label>
            <div className="flex gap-2">
              <Label className=" flex flex-col items-start gap-3 w-48" htmlFor="ValidThrough">
                Valid Through
                <Input type="date" placeholder="ValidThrough" id="ValidThrough" />
              </Label>
              <Label className=" flex flex-col items-start gap-3" htmlFor="ValidThrough">
                CVV
                <Input type="number" max={999} placeholder="CVV" id="Cvv" />
              </Label>
            </div>
            <div className="">
              <DialogClose asChild>
                <Button
                  typeof="text"
                  id="Pay"
                  className="w-full mt-2"
                  onClick={()=>handleShowToast()}
                  >
                  Pay Securely ({subTotal + shipping})
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default CheckoutModal
