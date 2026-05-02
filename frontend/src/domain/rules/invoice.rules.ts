import type { Invoice } from '../entities/invoice.entity'
import { InvoiceStatus } from '../enums'

export const canPay           = (inv: Invoice) => inv.status === InvoiceStatus.UNPAID
export const canReview        = (inv: Invoice) => inv.status === InvoiceStatus.PAID
export const canApplyDiscount = (inv: Invoice) => inv.status === InvoiceStatus.UNPAID