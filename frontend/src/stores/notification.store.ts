import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationLevel = 'success' | 'error' | 'info' | 'warning'
export interface Notification { id: number; message: string; level: NotificationLevel }

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  let seq = 0

  function push(message: string, level: NotificationLevel) {
    const id = ++seq
    notifications.value.push({ id, message, level })
    setTimeout(() => { notifications.value = notifications.value.filter(n => n.id !== id) }, 4000)
  }

  return {
    notifications,
    success: (msg: string) => push(msg, 'success'),
    error:   (msg: string) => push(msg, 'error'),
    info:    (msg: string) => push(msg, 'info'),
    warning: (msg: string) => push(msg, 'warning'),
  }
})

// frontend/src/composables/
// useOrder.ts         \u{2190} \u{2713} done above
// useMenu.ts          \u{2192} load items, filter by isSellable(), CRUD (manager)
// useWarehouse.ts     \u{2192} loadReport(), adjustStock() \u{2014} INHOUSE vs FRESH_RAW
// useReceipt.ts       \u{2192} createReceipt(mfgId, items[]), listReceipts()
// useTable.ts         \u{2192} loadTables(), updateStatus(id, status)
// useReservation.ts   \u{2192} create(), getMyReservations(), confirm(), cancel()
// useInvoice.ts       \u{2192} create (canCreateInvoice check), applyDiscount, pay (canPay check)
// useReview.ts        \u{2192} create (canReview check), addReply
// useCustomer.ts      \u{2192} getById(), update()
// useStaff.ts         \u{2192} getAll(), create(), toggle() \u{2014} Manager-only UI
// useDiscount.ts      \u{2192} validate(), create(), toggle()

// KEY RULE for every composable:
// Before calling a service write method, check the domain rule:
async function pay(invoiceId: number, method: PaymentMethod) {
  const inv = invoice.value
  if (!inv || !canPay(inv)) {         // \u{2190} domain rule check
    notify.error('Invoice cannot be paid in its current state.')
    return
  }
  await invoiceService.pay(invoiceId, { method })
}