import type { Order } from '../entities/order.entity'
import { OrderStatus } from '../enums'

export const canAddItem      = (o: Order) => o.status === OrderStatus.PENDING || o.status === OrderStatus.SERVING
export const canCreateInvoice= (o: Order) => o.status === OrderStatus.COMPLETED
export const canCancel       = (o: Order) => o.status !== OrderStatus.COMPLETED