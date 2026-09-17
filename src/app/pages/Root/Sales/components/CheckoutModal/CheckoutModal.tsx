import { RightArr } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

function CheckoutModal() {
  return (
    <DialogContent showCloseIcon={false} className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <DialogClose asChild>
            <span className="cursor-pointer">
              <RightArr size="20px" />
            </span>
          </DialogClose>
          CheckOuts
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2  items-start mt-3 ">
        <div className="items pe-4 space-y-5 border-e border-solid border-gray-100">
          <Label className=" flex flex-col items-start gap-3" htmlFor="paymode">
            PayMode
            <Input type="text" placeholder="PayMode" id="paymode" />
          </Label>
          <Label className=" flex flex-col items-start gap-3" htmlFor="paymode">
            PayMode
            <Input type="text" placeholder="PayMode" id="paymode" />
          </Label>
          <Label className=" flex flex-col items-start gap-3" htmlFor="paymode">
            PayMode
            <Input type="text" placeholder="PayMode" id="paymode" />
          </Label>
          <div className="payments">
            <h3 className="heading-secondary mb-3">Select Payement Methods</h3>
            <RadioGroup defaultValue="comfortable " className="space-y-1">
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
          </div>
        </div>
        <div className="item ml-6 mb-6">
          Card Details
          <div className="items pt-12 space-y-5">
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
                <Input type="text" placeholder="CVV" id="Cvv" />
              </Label>
            </div>
            <div className="">
              <Button typeof="text" id="Pay" className="w-full mt-2">
                Pay Securely(100)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default CheckoutModal
