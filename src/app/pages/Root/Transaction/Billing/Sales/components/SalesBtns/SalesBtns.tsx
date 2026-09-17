import { useNavigate } from 'react-router-dom'

import { useCustomerMaster } from '@/app/pages/Root/Administration/Master/CustomerMaster/store/useCustomerMaster'
import { Button } from '@/components/ui/button'

// import { Input } from '@/components/ui/input'

function SalesBtns() {
  const navigate = useNavigate()
const openModal=useCustomerMaster(state=>state.toggleOpen)
  return (
    <ul className="btns flex items-center gap-3 mt-3 w-[600px] overflow-y-auto">
       <li>
        <Button className="px-3" onClick={() => {
          navigate('/administration/master/customer-master')
          openModal();

        }}>Tag Customers</Button>
      </li>
      <li>
        <Button className="px-3" onClick={() => {
          navigate('/administration/setup/promotion/promotion-setup')

        }}>Apply Promotions</Button>
      </li>
      <li>
        <Button className="px-3" onClick={() => {
          navigate('/administration/setup/discount/discount-setup')

        }}>Apply Discounts</Button>
      </li>
      <li>
        <Button className="px-3">Hold Bill</Button>
      </li>
      <li>
        <Button className="px-3">Recall Bill</Button>
      </li>
      <li>
        <Button className="px-3">Void Bill</Button>
      </li>
      <li>
        <Button className="px-3">Reprint Bill</Button>
      </li>
      <li>
        <Button className="px-3">Save</Button>
      </li>
      {/* <li>
        <Button>Item View</Button>
      </li> */}
    </ul>
  )
}

export default SalesBtns
