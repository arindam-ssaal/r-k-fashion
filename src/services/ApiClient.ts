import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import { decryptData, encryptData } from '../lib/utils'
import { useAuth } from '../store/useAuth'
import { ApiClientOptions } from '../types/auth'

class ApiClient {
  protected api: AxiosInstance
  protected withAuth: boolean
  protected enableRefreshToken: boolean

  constructor(
    endpoint: string,
    options: ApiClientOptions = { withAuth: false, enableRefreshToken: false }
  ) {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_DEV}/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      // timeout: 3000,
    })

    this.withAuth = options.withAuth || false // ✅ Default is public
    this.enableRefreshToken = options.enableRefreshToken || false

    this._initializeRequestInterceptor()
    if (this.withAuth) {
      this._initializeResponseInterceptor() // ✅ Interceptor only if withAuth
    }
  }

  private _initializeRequestInterceptor(): void {
    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (this.withAuth) {
        const token = useAuth.getState().accessToken
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${decryptData(token)}`
        }
      }
      return config
    })
  }

  // ✅ Response Interceptor: Handle Token Expiry
  private _initializeResponseInterceptor(): void {
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // ✅ 401 Unauthorized → Token Expired or Missing → Refresh Token Call
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          if (this.enableRefreshToken) {
            try {
              await this.refreshToken()

              const newAccessToken = useAuth.getState().accessToken

              if (newAccessToken && originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${decryptData(newAccessToken)}`
              }

              return this.api(originalRequest)
            } catch (_error) {
              console.error('Token Refresh Failed:', _error)
              useAuth.getState().clearAuth()
              window.location.reload()
            }
          } else {
            // ❌ No Refresh Token → Force Logout
            console.warn('Access Token Expired - Please login again.')
            useAuth.getState().clearAuth()
            window.location.reload()
          }
        }

        // 🚫 403 Forbidden → Force Logout
        if (error.response?.status === 403) {
          console.warn('Access Denied - Logging out...')
          useAuth.getState().clearAuth()
          window.location.reload()
        }

        return Promise.reject(error)
      }
    )
  }

  // ✅ Refresh Token Logic
  protected async refreshToken(): Promise<void> {
    try {
      const accessToken = useAuth.getState().accessToken
      const refreshToken = useAuth.getState().refreshToken

      if (!accessToken || !refreshToken) {
        throw new Error('No access or refresh token available')
      }

      const decryptedAccess = decryptData(accessToken)
      const decryptedRefresh = decryptData(refreshToken)

      const response = await this.api.post<{
        accessToken: string
        refreshToken: string
      }>('/auth/refresh-token', {
        accessToken: decryptedAccess,
        refreshToken: decryptedRefresh,
      })

      // ✅ Update Zustand Store with new tokens
      useAuth
        .getState()
        .updateTokens(
          encryptData(response.data.accessToken),
          encryptData(response.data.refreshToken)
        )
    } catch (error) {
      console.error('Refresh Token Error:', error)

      // ✅ Logout only if refresh token fails
      useAuth.getState().clearAuth()
      window.location.reload()
    }
  }

  // ✅ GET Request
  public async get<T>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.api.get<T>(url, {
        ...config,
        params,
        signal: config?.signal, // ✅ Pass signal for cancellation
      })
    } catch (error) {
      this.handleError(error, 'GET')
      throw error
    }
  }

  // ✅ POST Request
  public async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.api.post<T>(url, data, config)
    } catch (error) {
      this.handleError(error, 'POST')
      throw error
    }
  }

  // ✅ PUT Request
  public async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.api.put<T>(url, data, config)
    } catch (error) {
      this.handleError(error, 'PUT')
      throw error
    }
  }

  // ✅ DELETE Request
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.api.delete<T>(url, config)
    } catch (error) {
      this.handleError(error, 'DELETE')
      throw error
    }
  }

  public async uploadFile<T>(
    url: string,
    file: Blob | File,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.api.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  }

  public async postFlexible<T, D extends Record<string, unknown>>(
    url: string,
    data: D,
    contentType: 'application/json' | 'multipart/form-data' = 'application/json',
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const headers = {
      'Content-Type': contentType,
      ...config?.headers,
    }

    const payload = contentType === 'application/json' ? data : this.toFormData(data)

    return this.api.post<T>(url, payload, { ...config, headers })
  }

  private toFormData(data: Record<string, unknown>): FormData {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Blob || value instanceof File) {
        formData.append(key, value)
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, String(item)))
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    return formData
  }

  public async retryRequest<T>(
    request: () => Promise<AxiosResponse<T>>,
    retries: number = 3
  ): Promise<AxiosResponse<T>> {
    try {
      return await request()
    } catch (error) {
      if (retries <= 0) throw error
      console.warn(`Retrying request... (${3 - retries + 1})`)
      return this.retryRequest(request, retries - 1)
    }
  }

  private handleError(error: unknown, method: string) {
    if (axios.isCancel(error)) {
      console.warn(`${method} Request canceled`, error.message)
      return // Abort ka error ignore karo
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      let customMessage = 'Something went wrong' // Default error message

      // ✅ Custom error handling based on status codes
      switch (status) {
        case 400: {
          const validationErrors = error.response?.data?.errors
          if (validationErrors) {
            // Convert validation errors into a readable string
            customMessage = Object.entries(validationErrors)
              .map(([field, messages]) => {
                const formattedMessages = Array.isArray(messages)
                  ? messages.join(', ')
                  : String(messages)
                return `${field}: ${formattedMessages}`
              })
              .join('\n')
          } else {
            customMessage = 'Bad Request - Invalid data provided.'
          }
          break
        }
        case 401:
          customMessage = 'Unauthorized - Please log in again.'
          break
        case 403:
          customMessage = "Forbidden - You don't have permission."
          break
        case 404:
          customMessage = 'Resource not found - Check the URL.'
          break
        case 500:
          customMessage = 'Server Error - Please try again later.'
          break
        default:
          customMessage = error.response?.data?.message || customMessage
      }

      console.error(`${method} Error [${status}]:`, customMessage)
      throw new Error(customMessage)
    } else {
      console.error(`${method} Error:`, 'An unexpected error occurred.')
      throw new Error('An unexpected error occurred.')
    }
  }
}

export default ApiClient
