import apiClient from './api.client'

export const receiptService = {
  create: (manufacturerId: number, items: any[]) =>
    apiClient.post('/receipts', { manufacturerId, items }).then(r => r.data),
  getAll: () => apiClient.get('/receipts').then(r => r.data),
  delete: (id: number) => apiClient.delete(`/receipts/${id}`),
}