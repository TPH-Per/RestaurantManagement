import { ref, computed } from 'vue'
import { orderService }  from '@/services/order.service'
import { canAddItem, canCreateInvoice, canCancel } from '@/domain/rules/order.rules'
import { isSellable } from '@/domain/rules/fb.rules'
import type { Order }     from '@/domain/entities/order.entity'
import type { FB }        from '@/domain/entities/fb.entity'
import { useNotificationStore } from '@/stores/notification.store'
import type { CreateOrderPayload } from '@/services/order.service'

export function useOrder(initialOrderId?: number) {
  const order   = ref<Order | null>(null)
  const loading = ref(false)
  const notify  = useNotificationStore()

  const itemsTotal    = computed(() => order.value?.items?.reduce((s, i) => s + i.quantity * i.unitPrice, 0) ?? 0)
  const isServable    = computed(() => order.value ? canAddItem(order.value)        : false)
  const isCompletable = computed(() => order.value ? canCreateInvoice(order.value)  : false)
  const isCancellable = computed(() => order.value ? canCancel(order.value)          : false)

  async function load(id: number) {
    loading.value = true
    try { order.value = await orderService.getById(id) }
    finally { loading.value = false }
  }

  async function create(payload: CreateOrderPayload) {
    loading.value = true
    try { order.value = await orderService.create(payload); return order.value }
    finally { loading.value = false }
  }

  async function addItem(fb: FB, quantity: number) {
    if (!order.value) return
    // Client-side domain rule check before hitting API (fast feedback)
    if (!isSellable(fb))        { notify.error('This item cannot be sold.'); return }
    if (!canAddItem(order.value)){ notify.error(`Cannot add items to a ${order.value.status} order.`); return }
    const item = await orderService.addItem(order.value.orderId, { fbId: fb.fbId, quantity })
    order.value = { ...order.value, items: [...(order.value.items ?? []), item] }
    return item
  }

  async function removeItem(itemId: number) {
    if (!order.value) return
    await orderService.removeItem(order.value.orderId, itemId)
    order.value = { ...order.value, items: order.value.items?.filter(i => i.orderItemId !== itemId) }
  }

  async function complete() { if (order.value) await orderService.complete(order.value.orderId) }
  async function cancel()   { if (order.value) await orderService.cancel(order.value.orderId)   }

  if (initialOrderId) load(initialOrderId)

  return { order, loading, itemsTotal, isServable, isCompletable, isCancellable,
           load, create, addItem, removeItem, complete, cancel }
}