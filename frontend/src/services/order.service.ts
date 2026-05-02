import apiClient from './api.client'
import type { Order }     from '@/domain/entities/order.entity'
import type { OrderItem } from '@/domain/entities/order-item.entity'

export interface CreateOrderPayload { tableId: number; reservationId?: number; customerId?: number }
export interface AddItemPayload     { fbId: number; quantity: number }

export const orderService = {
  create:     (b: CreateOrderPayload)         => apiClient.post<Order>('/orders', b).then(r => r.data),
  getById:    (id: number)                    => apiClient.get<Order>(`/orders/${id}`).then(r => r.data),
  addItem:    (orderId: number, b: AddItemPayload) => apiClient.post<OrderItem>(`/orders/${orderId}/items`, b).then(r => r.data),
  removeItem: (orderId: number, itemId: number)   => apiClient.delete(`/orders/${orderId}/items/${itemId}`),
  complete:   (orderId: number)               => apiClient.put(`/orders/${orderId}/complete`),
  cancel:     (orderId: number)               => apiClient.delete(`/orders/${orderId}`),
}