import apiClient from './api.client'

export const warehouseService = {
  getReport: () => apiClient.get('/warehouse/report').then(r => r.data),
  adjustInhouse:  (fbId: number, qty: number) =>
    apiClient.put('/warehouse/inhouse',   { fbId, newQuantity: qty }),
  adjustFreshRaw: (fbId: number, qty: number) =>
    apiClient.put('/warehouse/fresh-raw', { fbId, newQuantity: qty }),
}