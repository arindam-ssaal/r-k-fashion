import CreditNote from '../CreditNote'
import General from '../General'
import GoodsReceiptReturn from '../GoodsReceiptReturn'
import POSBill from '../POSBill'
import PosOrder from '../PosOrder'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function OrganizationTab() {
  return (
    <Tabs defaultValue="general" className="">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="posBIll">POS Bill</TabsTrigger>
        <TabsTrigger value="creditNote">Credit Note</TabsTrigger>
        <TabsTrigger value="goodsReceiptReturn">Goods Receipt & Return</TabsTrigger>
        <TabsTrigger value="posOrder">POS Order</TabsTrigger>
      </TabsList>
      <div className="">
        <TabsContent value="general">
          <General />
        </TabsContent>
        <TabsContent value="posBIll">
          <POSBill />
        </TabsContent>
        <TabsContent value="creditNote">
          <CreditNote />
        </TabsContent>
        <TabsContent value="goodsReceiptReturn">
          <GoodsReceiptReturn />
        </TabsContent>
        <TabsContent value="posOrder">
          <PosOrder />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default OrganizationTab
