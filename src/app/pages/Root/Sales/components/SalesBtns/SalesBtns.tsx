import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

// import { Input } from '@/components/ui/input'

function SalesBtns() {
  const navigate = useNavigate()

  return (
    <ul className="btns flex items-center gap-3 mt-3">
      <li>
        <Button>Item View</Button>
      </li>
      <li>
        <Button onClick={() => navigate('customers')}>Customers</Button>
      </li>
      <li>
        <Button>Promotions</Button>
      </li>
      <li>
        <Button>Discounts</Button>
      </li>
    </ul>
  )
}

export default SalesBtns
