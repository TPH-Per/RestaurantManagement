import apiClient from './api.client'

export const reviewService = {
  create:   (b: { invoiceId: number; stars: number; content: string }) =>
    apiClient.post('/reviews', b).then(r => r.data),
  getAll:   () => apiClient.get('/reviews').then(r => r.data),
  addReply: (reviewId: number, content: string) =>
    apiClient.post(`/reviews/${reviewId}/reply`, { content }).then(r => r.data),
  existsByInvoiceId: (invoiceId: number) =>
    apiClient.get(`/reviews/check/${invoiceId}`).then(r => r.data).catch(() => false),
}