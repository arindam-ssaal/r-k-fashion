import PromotionBox from './components/PromotionBox'
import SalesBtns from './components/SalesBtns'
import SalesOptions from './components/SalesOptions'
import SalesScanner from './components/SalesScanner'
import SalesTabContent from './components/SalesTabContent/SalesTabContent'
import SalesTable from './components/SalesTable'

import { Card, CardContent } from '@/components/ui/card'

function SalesPage() {
  return (
    <>
      <div className=" grid gap-3 grid-cols-[1fr,80px] ">
        <div className="grid gap-3 grid-cols-[2fr,1fr] ">
          <div className="customer-box">
            <div className="">
              <Card>
                <CardContent className="space-y-4">
                  <SalesScanner />
                  <SalesTable />
                </CardContent>
              </Card>
              <SalesBtns />
            </div>
          </div>
          <div className="sales btns flex flex-col">
            <SalesTabContent />
            <PromotionBox />
          </div>
        </div>
        <SalesOptions />
      </div>
    </>
  )
}

export default SalesPage
