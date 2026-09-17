import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/store/useAuth'

function RoleWiseRedirection() {
  const { user } = useAuth() // Fetch user details from auth
  const navigate = useNavigate() // React-router's hook for navigation

  useEffect(() => {
    if (user) {
      if (user.role === 'Cashier') {
        navigate('/billing')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, navigate])

  return <div>RoleWiseRedirection</div>
}

export default RoleWiseRedirection
