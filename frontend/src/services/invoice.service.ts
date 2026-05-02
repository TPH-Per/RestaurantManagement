import apiClient from './api.client'

export const invoiceService = {
  create:   (orderId: number) =>
    apiClient.post('/invoices', { orderId }).then(r => r.data),
  getById:  (id: number) => apiClient.get(`/invoices/${id}`).then(r => r.data),
  getAll:   ()           => apiClient.get('/invoices').then(r => r.data),
  pay:      (id: number, method: string, cashierId: number) =>
    apiClient.post(`/invoices/${id}/pay`, { method, cashierId }).then(r => r.data),
  applyDiscount: (id: number, code: string) =>
    apiClient.post(`/invoices/${id}/apply-discount`, { discountCode: code }).then(r => r.data),
}