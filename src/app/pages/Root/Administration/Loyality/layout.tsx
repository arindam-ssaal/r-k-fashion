import { Outlet } from 'react-router-dom'

function LoyalityLayout() {
  return (
    <div className='relative z-50' style={{ backgroundColor: '#d6eaf8', color: 'black' }}>
        <Outlet />
    </div>
  )
}

export default LoyalityLayout
