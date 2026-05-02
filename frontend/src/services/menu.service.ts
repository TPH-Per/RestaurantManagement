import apiClient from './api.client'

export const menuService = {
  getFBMenu: (includeInhouse = false) =>
    apiClient.get(`/fb?includeInhouse=${includeInhouse}`).then(r => r.data),
  createFB:  (b: any)    => apiClient.post('/fb', b).then(r => r.data),
  updateFB:  (id: number, b: any) => apiClient.put(`/fb/${id}`, b).then(r => r.data),
  deleteFB:  (id: number)=> apiClient.delete(`/fb/${id}`),
}