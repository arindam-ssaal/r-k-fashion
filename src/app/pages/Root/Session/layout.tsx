import { Outlet } from 'react-router-dom'

function SessionLayout() {
  return (
    <div className="sales-layout px-4 ">
      <div className="sales-header py-5">
        <h3 className="page-title">Sessions </h3>
      </div>
      <Outlet />
    </div>
  )
}

export default SessionLayout
