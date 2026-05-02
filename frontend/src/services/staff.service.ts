import apiClient from './api.client'

export const staffService = {
  getAll:  ()         => apiClient.get('/staff').then(r => r.data),
  create:  (b: any)   => apiClient.post('/staff', b).then(r => r.data),
  toggle:  (id: number)=> apiClient.put(`/staff/${id}/toggle`),
}