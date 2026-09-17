import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div className="sales-layout">
      <Outlet />
    </div>
  )
}

export default DashboardLayout
