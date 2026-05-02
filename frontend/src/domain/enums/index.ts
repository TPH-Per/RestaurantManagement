// Must exactly match RestaurantMS.Domain/Enums/

export enum FBType {
  REGULAR   = 'REGULAR',
  INHOUSE   = 'INHOUSE',
  FRESH_RAW = 'FRESH_RAW',
}
export enum OrderStatus {
  PENDING = 'PENDING', SERVING = 'SERVING',
  COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED',
}
export enum InvoiceStatus {
  UNPAID = 'UNPAID', PAID = 'PAID', REFUNDED = 'REFUNDED',
}
export enum ReservationStatus {
  PENDING = 'PENDING', CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED', NO_SHOW = 'NO_SHOW',
}
export enum TableStatus {
  AVAILABLE = 'AVAILABLE', OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED', MAINTENANCE = 'MAINTENANCE',
}
export enum StaffRole {
  MANAGER = 'MANAGER',
  ADMIN   = 'ADMIN',
  // NO 'WAITER' \u{2014} that role does not exist in the business spec
}
export enum MemberTier  { NORMAL='NORMAL', SILVER='SILVER', GOLD='GOLD', VIP='VIP' }
export enum StockStatus { NORMAL='NORMAL', LOW_STOCK='LOW_STOCK', OUT_OF_STOCK='OUT_OF_STOCK' }
export enum PaymentMethod { CASH='CASH', CARD='CARD', QR='QR', TRANSFER='TRANSFER' }
export enum DiscountType  { PERCENT='PERCENT', FIXED='FIXED' }