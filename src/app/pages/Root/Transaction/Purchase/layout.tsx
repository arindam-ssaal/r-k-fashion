import { Outlet } from 'react-router-dom'

function PurchaseLayout() {
  return (
    <div className='px-3'>
      {/* <h3>Purchase Layout</h3> */}
      <Outlet />
    </div>
  )
}

export default PurchaseLayout
