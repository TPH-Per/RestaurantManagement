import type { InvoiceStatus, PaymentMethod } from '../enums'
export interface Invoice {
  invoiceId: number; orderId: number; subtotal: number;
  discountAmount: number; total: number; status: InvoiceStatus;
  paymentMethod?: PaymentMethod; discountCodeId?: number; cashierId?: number; paidAt?: string;
}