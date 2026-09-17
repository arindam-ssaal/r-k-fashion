import useSales from '../../store/useSales'
import CheckoutModal from '../CheckoutModal'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

function SalesCheckout() {
  const selectedSalesData = useSales((state) => state.selectedSalesData)

  const subTotal = selectedSalesData.reduce((acc, item) => {
    return acc + item.amount
  }, 0)

  const shipping = 0

  return (
    <Card>
      <CardHeader>
        <CardTitle> Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 py-2 border-y border-solid border-gray-300 mb-2">
          <div className="flex gap-2">
            <h3 className="text-sm">Subtotal</h3>
            <h4 className="ms-auto">${subTotal}</h4>
          </div>
          <div className="flex gap-2">
            <h3 className="text-sm">GST</h3>
            <h4 className="ms-auto">--</h4>
          </div>
          <div className="flex gap-2">
            <h3 className="text-sm">Shipping</h3>
            <h4 className="ms-auto">--</h4>
          </div>
        </div>
        <div className="flex gap-2">
          <h3 className="text-sm">Total(USD)</h3>
          <h4 className="ms-auto">${shipping + subTotal}</h4>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Confirm</Button>
          </DialogTrigger>
          <CheckoutModal />
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default SalesCheckout
