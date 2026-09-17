import { Outlet } from 'react-router-dom'

 const BillingLayout = () => {
  return (
    <div className='pt-5 px-2' style={{ backgroundColor: '#d6eaf8' }}>
      {/* <h3>Billing</h3> */}
      <div>
        <Outlet />
      </div>
    </div>
  )
}
export default BillingLayout
