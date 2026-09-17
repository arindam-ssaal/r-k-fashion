import DocumentSeries from '../DocumentSeries'
import Ledgers from '../Ledgers'
import Logistics from '../Logistics'
import MOP from '../MOP'
import PettyCashDetails from '../PettyCashDetails'
import StoreDetail from '../StoreDetail'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function StoreMasterTab() {
  return (
    <Tabs defaultValue="store-detail" className="mt-3">
      <TabsList className="mb-4  flex border-none">
        <TabsTrigger className="flex-1" value="store-detail">
          Store Detail
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="logistics">
          Logistics
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="mop-details">
          MOP Details
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="petty-cash">
          Petty Cash Details
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="document-series">
          Document Series
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="ledgers">
          Ledgers
        </TabsTrigger>
      </TabsList>

      <TabsContent value="store-detail">
        <StoreDetail />
      </TabsContent>
      <TabsContent value="logistics">
        <Logistics />
      </TabsContent>
      <TabsContent value="mop-details">
        <MOP />
      </TabsContent>
      <TabsContent value="petty-cash">
        <PettyCashDetails />
      </TabsContent>
      <TabsContent value="document-series">
        <DocumentSeries />
      </TabsContent>
      <TabsContent value="ledgers">
        <Ledgers />
      </TabsContent>
    </Tabs>
  )
}

export default StoreMasterTab
