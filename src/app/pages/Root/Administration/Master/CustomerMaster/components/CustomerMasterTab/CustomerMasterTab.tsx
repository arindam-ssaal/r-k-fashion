import { useCustomerMaster } from '../../store/useCustomerMaster'
import Communication from '../CustomerForm/components/Communication'
import LoyaltyPoints from '../CustomerForm/components/LoyaltyPoints/LoyaltyPoints'
import Membership from '../CustomerForm/components/MemberShip'
import Personal from '../CustomerForm/components/Personal'
import PurchaseHistory from '../CustomerForm/components/PurchaseHistory'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function CustomerMasterTab() {
  const mode = useCustomerMaster((state) => state.mode)

  return (
    <Tabs defaultValue="personal" className="mt-3">
      <TabsList className="mb-4  flex border-none">
        <TabsTrigger className="flex-1" value="personal">
          Personal
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="communication">
          Communication
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="membership">
          Membership
        </TabsTrigger>

        {mode !== 'Create' && (
          <>
            <TabsTrigger className="flex-1" value="purchaseHistory">
              Purchase History
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="loyaltyPoints">
              Loyalty Points
            </TabsTrigger>
          </>
        )}
      </TabsList>
      {/* Perspnal Tab */}
      <div className="h-[400px] border p-4 border-black border-solid overflow-y-auto">
        <TabsContent value="personal">
          <Personal />
        </TabsContent>
        {/* Communication Tab */}
        <TabsContent value="communication">
          <Communication />
        </TabsContent>
        {/* Membership Tab */}
        <TabsContent value="membership">
          <Membership />
        </TabsContent>
        {/* Purchase History Tab */}
        <TabsContent value="purchaseHistory">
          <PurchaseHistory />
        </TabsContent>

        {/* Loyalty Points Tab */}
        <TabsContent value="loyaltyPoints">
          <LoyaltyPoints />
        </TabsContent>
      </div>
    </Tabs>
  )
}
export default CustomerMasterTab
