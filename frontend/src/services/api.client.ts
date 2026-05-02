import axios, { type AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5158/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from localStorage on every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize error shape: { success: false, error: { code, message } } -> typed reject
apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  err => {
    const e = err.response?.data?.error
    return Promise.reject({
      message: e?.message ?? 'Unexpected error',
      code:    e?.code    ?? 'UNKNOWN',
      status:  err.response?.status ?? 0,
    })
  }
)

export default apiClient