import { Outlet } from 'react-router-dom'

function StoreSpecificLayout() {
  return (
    <div className="customer-layout">
      <Outlet />
    </div>
  )
}

export default StoreSpecificLayout