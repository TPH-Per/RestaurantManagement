import apiClient from './api.client'

export const manufacturerService = {
  getAll:  ()       => apiClient.get('/manufacturers').then(r => r.data),
  create:  (b: any) => apiClient.post('/manufacturers', b).then(r => r.data),
}