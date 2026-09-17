import { Outlet } from 'react-router-dom'

export const InventoryLayout = () => {
  return (
    <div className='p-5'>
  
     {/* <h3>Inventory</h3> */} 
      <div>
        <Outlet />
      </div>
    </div>
  )
}
