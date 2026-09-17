import SalesCheckout from '../SalesCheckout'
import SalesItemSearch from '../SalesItemSearch'
import { useSalesOptionStore } from '../SalesOptions/store/useSalesOptionsStore'

function SalesTabContent() {
  const option = useSalesOptionStore((state) => state.selectedOption)
  let content

  if (option === 'itemsearch') {
    content = <SalesItemSearch />
  }
  if (option === 'checkout') {
    content = <SalesCheckout />
  }
  return <div className="sales-contents">{content}</div>
}

export default SalesTabContent
