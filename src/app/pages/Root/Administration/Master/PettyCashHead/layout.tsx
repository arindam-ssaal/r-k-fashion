import { Outlet } from 'react-router-dom'

function PettyCashHeadLayout() {
  return (
    <div className="text-center">
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default PettyCashHeadLayout