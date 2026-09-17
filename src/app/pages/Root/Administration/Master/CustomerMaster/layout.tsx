import { Outlet } from 'react-router-dom'

function CustomerMasterLayout() {
  return (
    <div className="customer-layout">
      <Outlet />
    </div>
  )
}

export default CustomerMasterLayout
