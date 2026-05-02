import apiClient from './api.client'

export const customerService = {
  getAll:  ()       => apiClient.get('/customers').then(r => r.data),
  getById: (id: number) => apiClient.get(`/customers/${id}`).then(r => r.data),
  update:  (id: number, data: any) => apiClient.put(`/customers/${id}`, data).then(r => r.data),
}