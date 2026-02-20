import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

/** True if the error is due to connection refused/reset (e.g. backend not running) */
export function isNetworkError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { code?: string; message?: string }
  return (
    e.code === 'ERR_NETWORK' ||
    e.code === 'ECONNREFUSED' ||
    e.code === 'ECONNRESET' ||
    /ECONNREFUSED|ECONNRESET|Network Error/i.test(e.message || '')
  )
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
