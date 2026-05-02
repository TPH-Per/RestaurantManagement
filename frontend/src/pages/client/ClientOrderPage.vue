<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder }       from '@/composables/useOrder'
import { useMenu }        from '@/composables/useMenu'
import { useReservation } from '@/composables/useReservation'
import { canCreateOrder } from '@/domain/rules/reservation.rules'
import { isSellable }     from '@/domain/rules/fb.rules'
import { useNotificationStore } from '@/stores/notification.store'
import type { FB } from '@/domain/entities/fb.entity'

const props = defineProps({ tableId: { type: String, required: true } })
const route   = useRoute()
const router  = useRouter()
const notify  = useNotificationStore()

const menu        = useMenu()
const reservation = useReservation()
const order       = useOrder()

const sellableItems = computed(() => menu.items.value.filter(isSellable))
const subtotal = order.itemsTotal

onMounted(async () => {
  const reservationId = Number(route.query.reservationId)
  if (!reservationId) {
    notify.error('Please select a valid reservation first.')
    router.push('/my-reservations')
    return
  }

  await reservation.loadById(reservationId)
  const res = reservation.current.value

  if (!res || !canCreateOrder(res)) {
    notify.error('Orders can only be placed for CONFIRMED reservations.')
    router.push('/my-reservations')
    return
  }

  await menu.loadMenu()
  await order.create({ tableId: res.tableId, reservationId: res.reservationId })
})

async function addItem(fb: FB, qty: number) {
  await order.addItem(fb, qty)
}
</script>

<template>
  <main class="client-page order-page">
    <section class="order-list">
      <div class="reservation-context">
        <div>
          <p class="eyebrow">Reservation</p>
          <strong>{{ reservation?.customer_name || auth.fullName }}</strong>
          <p>Table {{ reservation?.table_id || props.tableId }} · {{ reservation?.reserved_at?.slice(0, 16) || 'Active order' }}</p>
        </div>
        <RouterLink to="/my-reservations" class="ghost-button">Change Reservation</RouterLink>
      </div>

      <div class="page-head">
        <div>
          <p class="eyebrow">Current order</p>
          <h2>Table {{ props.tableId }}</h2>
        </div>
      </div>

      <article v-for="row in order?.items || []" :key="row.order_item_id" class="order-row">
        <div class="order-row__thumb"></div>
        <div>
          <strong>Item {{ row.item_id }}</strong>
          <p>Qty {{ row.quantity }} · {{ row.unit_price.toLocaleString() }} ₫</p>
        </div>
        <strong>{{ row.subtotal.toLocaleString() }} ₫</strong>
        <button class="ghost-button" @click="removeItem(row)">×</button>
      </article>
    </section>

    <section class="order-menu">
      <div class="page-head">
        <div>
          <p class="eyebrow">Menu search</p>
          <h2>Search dishes by name</h2>
        </div>
      </div>

      <input v-model="searchQuery" class="workspace-search" placeholder="Type part of a name, e.g. yak" />

      <div class="order-menu__results">
        <article v-for="item in filteredMenuItems" :key="item.item_id" class="order-menu__item">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.item_type }} · {{ item.stock_status }}</p>
          </div>
          <div class="order-menu__meta">
            <span>{{ item.price.toLocaleString() }} ₫</span>
            <button class="ghost-button" @click="addToOrder(item)">Add</button>
          </div>
        </article>

        <div v-if="!filteredMenuItems.length" class="empty-state">
          No FB items match your search.
        </div>
      </div>
    </section>

    <aside class="order-summary">
      <h3>Totals</h3>
      <p>Subtotal: {{ subtotal.toLocaleString() }} ₫</p>
      <p class="total-line">Total: {{ total.toLocaleString() }} ₫</p>
      <button class="ghost-button" @click="callWaiter">Call Waiter</button>
      <button class="solid-button" @click="requestInvoice">Request Invoice</button>
    </aside>

    <div v-if="confirmOpen" class="confirm-overlay">
      <div class="confirm-card">
        <h3>Ready to close the order?</h3>
        <div class="confirm-actions">
          <button class="ghost-button" @click="confirmOpen = false">Cancel</button>
          <button class="solid-button" @click="confirmInvoice">Confirm</button>
        </div>
      </div>
    </div>
  </main>
</template>

