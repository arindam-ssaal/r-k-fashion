import Billwise from './components/Billwise'
import ItemWise from './components/ItemWise'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function BillHistory() {
  return (
    <Card className="bill-history">
      <CardHeader>
        <h3 className="heading-secondary">Bill History</h3>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Billwise</TabsTrigger>
            <TabsTrigger value="password">ItemWise</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Billwise />
          </TabsContent>
          <TabsContent value="password">
            <ItemWise />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default BillHistory
