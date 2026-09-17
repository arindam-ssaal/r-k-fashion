import axios from 'axios'
import React, { createContext, useState, useEffect, useContext } from 'react'

// Create a context for authentication
const AuthContext = createContext<{
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
} | null>(null)

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Create an axios instance
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API URL
  withCredentials: true, // This is important for sending cookies
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me')
        setToken(response.data.accessToken)
      } catch (error) {
        console.error('Authentication check failed', error)
        setToken(null)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Add an interceptor to add the token to all requests
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    })

    // Add an interceptor to handle token refresh
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Attempt to refresh the token
            const refreshResponse = await api.post('/auth/refresh')
            const newToken = refreshResponse.data.accessToken
            setToken(newToken)

            // Retry the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            return api(originalRequest)
          } catch (refreshError) {
            // If refresh fails, log the user out
            setToken(null)
            throw refreshError
          }
        }

        return Promise.reject(error)
      }
    )

    // Clean up interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      setToken(response.data.accessToken)
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
      setToken(null)
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
