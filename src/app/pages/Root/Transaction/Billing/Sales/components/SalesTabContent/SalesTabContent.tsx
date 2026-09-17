import SalesAdvance from '../SalesAdvance'
import SalesCashIn from '../SalesCashIn'
import SalesCashOut from '../SalesCashOut'
import SalesCheckout from '../SalesCheckout'
import SalesItemSearch from '../SalesItemSearch'
import { useSalesOptionStore } from '../SalesOptions/store/useSalesOptionsStore'
import SalesPosOrder from '../SalesPosOrder'

function SalesTabContent() {
  const option = useSalesOptionStore((state) => state.selectedOption)
  let content

  if (option === 'itemsearch') {
    content = <SalesItemSearch />
  }
  if (option === 'checkout') {
    content = <SalesCheckout />
  }
  if (option === 'holdbill') {
    content = <SalesPosOrder/>
  }
  if(option === 'Advance'){
    content = <SalesAdvance/>
  }
  if(option === 'cashin'){
    content = <SalesCashIn/>
  }
  if(option === 'cashout'){
    content = <SalesCashOut/>
  }
  return <div className="sales-contents">{content}</div>
}

export default SalesTabContent
