import apiClient from './api.client'

export const categoryService = {
  getAll:  ()       => apiClient.get('/categories').then(r => r.data),
  create:  (b: any) => apiClient.post('/categories', b).then(r => r.data),
  delete:  (id: number) => apiClient.delete(`/categories/${id}`),
}