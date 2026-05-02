import apiClient from './api.client'
import type { TableDto } from '@/domain/entities/table.entity'

export const tableService = {
  getAll:       ()              => apiClient.get<TableDto[]>('/tables').then(r => r.data),
  create:       (b: any)        => apiClient.post<TableDto>('/tables', b).then(r => r.data),
  updateStatus: (id: number, status: string) =>
    apiClient.put(`/tables/${id}/status`, JSON.stringify(status),
      { headers: { 'Content-Type': 'application/json' } }),
}