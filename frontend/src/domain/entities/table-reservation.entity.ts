import type { ReservationStatus } from '../enums'
export interface TableReservation {
  reservationId: number; customerId: number; tableId: number;
  reservedAt: string; guestCount: number; notes?: string; status: ReservationStatus;
}

// Also create: category.entity.ts, manufacturer.entity.ts, warehouse.entity.ts,
// table.entity.ts, receipt.entity.ts, receipt-detail.entity.ts,
// discount-code.entity.ts, review.entity.ts, review-reply.entity.ts,
// customer.entity.ts, staff.entity.ts