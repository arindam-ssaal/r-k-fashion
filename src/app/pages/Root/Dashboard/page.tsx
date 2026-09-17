//import Dashboard from './components/Dashboard'
// import AdminDashboard from './components/AdminDashboard'

import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Dashboard from './components/Dashboard.jsx';
import DashboardBlank from './components/DashboardBlank.jsx';
import { __getCookieValue } from '@/common/authCookies';

const page = () => {

  const [today, setToday] = useState('')
  const [cookies] = useCookies(['UserId', 'DefaultStoreId', 'UserRole'])
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }
  console.log('UserRole ==>', cookies.UserRole)

  return (
    <>
    {/* <AdminDashboard /> */}
    <div className='overflow-y-scroll h-screen relative p-5' style={{
          // !chnage dark blue to sky blue on 27-04-2026
          background: 'linear-gradient(180deg, #0A1628 0%, #080E1A 100%)',
          // background: '#d6eaf8',
        }}>
        {/* { cookies.UserRole.toLowerCase() === 'admin' || cookies.UserRole.toLowerCase() === 'manager' ? <Dashboard /> : null }       */}
        { __getCookieValue("UserRole")?.toLowerCase() === 'admin' || __getCookieValue("UserRole")?.toLowerCase() === 'manager' ? <Dashboard /> : null } 
    </div>

    {/* <Dashboard /> */}
    </>
  )
}

export default page