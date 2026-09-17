import { Outlet } from 'react-router-dom'

function SalesPersonMasterLayout() {
  return (
    <div className="sales-person__layout">
      <Outlet />
    </div>
  )
}

export default SalesPersonMasterLayout
