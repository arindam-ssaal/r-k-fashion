// hooks/useAuthRedirection.ts
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/store/useAuth'

interface UseAuthRedirectionProps {
  requireAuth: boolean
  redirectTo: string
}

const useAuthRedirection = ({ requireAuth, redirectTo }: UseAuthRedirectionProps) => {
  const user = useAuth((state) => state.user)
  const navigate = useNavigate()
  const isAuthenticated = Boolean(user)

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo, { replace: true })
    } else if (!requireAuth && isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, requireAuth, redirectTo])
}

export default useAuthRedirection
