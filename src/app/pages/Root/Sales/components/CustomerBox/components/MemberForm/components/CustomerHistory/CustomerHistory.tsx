import SalesMutistep from '../../../../../SalesMultiStep'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'

function CustomerHistory() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-max mt-auto" type={'submit'}>
          {'History'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] w-[700px]">
        <DialogHeader>
          <h2 className="text-xl font-semibold">Customer </h2>
        </DialogHeader>
        <SalesMutistep />
      </DialogContent>
    </Dialog>
  )
}

export default CustomerHistory
