import apiClient from './api.client'

export const reservationService = {
  create:  (b: any)  => apiClient.post('/reservations', b).then(r => r.data),
  getMy:   ()        => apiClient.get('/reservations').then(r => r.data),
  confirm: (id: number) => apiClient.put(`/reservations/${id}/confirm`),
  cancel:  (id: number) => apiClient.put(`/reservations/${id}/cancel`),
  complete:(id: number) => apiClient.put(`/reservations/${id}/complete`),
  getAll:  ()        => apiClient.get('/reservations/all').then(r => r.data),
}