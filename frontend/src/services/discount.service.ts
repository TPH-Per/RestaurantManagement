import apiClient from './api.client'

export const discountService = {
  getAll:    ()           => apiClient.get('/discount-codes').then(r => r.data),
  validate:  (code: string) =>
    apiClient.get(`/discount-codes/validate/${code}`).then(r => r.data),
  create:    (b: any)     => apiClient.post('/discount-codes', b).then(r => r.data),
  toggle:    (id: number) => apiClient.put(`/discount-codes/${id}/toggle`),
}