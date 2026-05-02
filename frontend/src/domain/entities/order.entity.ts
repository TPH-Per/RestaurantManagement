import type { OrderStatus } from '../enums'
import type { OrderItem }   from './order-item.entity'
export interface Order {
  orderId: number; tableId: number; reservationId?: number;
  customerId?: number; status: OrderStatus; createdAt: string; items?: OrderItem[];
}