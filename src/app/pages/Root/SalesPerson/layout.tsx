import { Outlet } from 'react-router-dom'

function SalesPersonLayout() {
  return (
    <div className='px-4 py-4'>
      {/* <h3 className=' text-xl font-bold text-gray-700 mb-4'>Salesperson</h3> */}
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default SalesPersonLayout
