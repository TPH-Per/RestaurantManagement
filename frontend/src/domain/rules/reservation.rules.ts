import type { TableReservation } from '../entities/table-reservation.entity'
import { ReservationStatus } from '../enums'

// FIX from ClientOrderPage.vue: was checking 'SERVING', correct is CONFIRMED
export const canCreateOrder = (r: TableReservation): boolean =>
  r.status === ReservationStatus.CONFIRMED