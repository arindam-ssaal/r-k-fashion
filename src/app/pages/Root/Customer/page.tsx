import CustomerBox from '../Sales/components/CustomerBox'
import CustomersTable from '../Sales/components/CustomersTableData'
import SalesMutistep from '../Sales/components/SalesMultiStep'

import { Card, CardContent } from '@/components/ui/card'

function CustomerPage() {
  return (
    <div className=" grid gap-3 grid-cols-1 ">
      <div className="grid gap-3 grid-cols-[1.5fr,1fr] ">
        <div className="customer-box">
          <CustomerBox />
          <div className="mt-3">
            <Card>
              <CardContent className="space-y-4">
                <CustomersTable />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="sales btns flex flex-col">
          <SalesMutistep />
        </div>
      </div>
      {/* <SalesOptions /> */}
    </div>
  )
}

export default CustomerPage
