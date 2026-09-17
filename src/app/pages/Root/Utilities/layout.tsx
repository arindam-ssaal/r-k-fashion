import { Outlet } from 'react-router-dom'

function UtilitiesLayout() {
  return (
    <div className="sales-layout px-4 ">
      <div className="sales-header py-5">
        <h3 className="page-title">Utilities </h3>
      </div>
      <Outlet />
    </div>
  )
}

export default UtilitiesLayout
