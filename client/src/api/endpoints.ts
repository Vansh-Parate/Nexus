import { api } from './client'

export const authApi = {
  register: (data: { role: string; [k: string]: unknown }) => api.post('/auth/register', data),
  login: (email: string, password: string, role: string) =>
    api.post('/auth/login', { email, password, role }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

export const matchesApi = {
  list: (params?: { sector?: string; stage?: string; ticketMin?: number; ticketMax?: number }) =>
    api.get('/matches', { params }),
}

export const startupsApi = {
  list: (params?: Record<string, string | number>) => api.get('/startups', { params }),
  get: (id: string) => api.get(`/startups/${id}`),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/startups/${id}`, data),
}

export const investorsApi = {
  list: (params?: Record<string, string | number>) => api.get('/investors', { params }),
  get: (id: string) => api.get(`/investors/${id}`),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/investors/${id}`, data),
}

export const requestsApi = {
  list: () => api.get('/requests'),
  send: (toId: string, toRole: 'startup' | 'investor') =>
    api.post('/requests', { toId, toRole }),
  accept: (id: string) => api.post(`/requests/${id}/accept`),
  decline: (id: string) => api.post(`/requests/${id}/decline`),
}
