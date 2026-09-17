import { Outlet } from 'react-router-dom'

function ItemMasterLayout() {
  return (
    <div className="customer-layout">
      <Outlet />
    </div>
  )
}

export default ItemMasterLayout
