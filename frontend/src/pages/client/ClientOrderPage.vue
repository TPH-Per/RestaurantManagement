<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { toast } from '../../services/toast'
import { useClientAuthStore } from '../../stores/clientAuth'
import { useReservationStore } from '../../stores/reservation'

const props = defineProps({ tableId: { type: String, required: true } })
const route = useRoute()
const router = useRouter()
const auth = useClientAuthStore()
const reservationStore = useReservationStore()
const order = ref(null)
const confirmOpen = ref(false)
const reservation = ref(null)
const menuItems = ref([])
const searchQuery = ref('')

const subtotal = computed(() => order.value?.subtotal || 0)
const total = computed(() => subtotal.value)
const filteredMenuItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return menuItems.value
  return menuItems.value.filter((item) => item.name.toLowerCase().includes(query))
})

const loadMenu = async () => {
  menuItems.value = await useFb().list({ type: 'All' })
}

const loadReservation = async () => {
  const reservationId = route.query.reservationId || reservationStore.activeReservation
  if (!reservationId) {
    toast.error('Please select a valid reservation first.')
    router.push('/my-reservations')
    return null
  }

  const currentReservation = await useReservation().get(reservationId)
  if (!currentReservation || currentReservation.status !== 'SERVING') {
    toast.error('Orders can only be placed for active SERVING sessions.')
    router.push('/my-reservations')
    return null
  }

  reservation.value = currentReservation
  return currentReservation
}

const ensureOrder = async () => {
  const currentReservation = await loadReservation()
  if (!currentReservation) return null

  if (order.value) return order.value

  const list = await useOrder().list()
  order.value = list.find((entry) => String(entry.table_id) === String(props.tableId))
  if (!order.value) {
    order.value = await useOrder().create({
      table_id: Number(props.tableId),
      reservation_id: currentReservation.reservation_id,
      notes: 'Client order'
    })
  }
  return order.value
}

const load = async () => {
  const currentReservation = await loadReservation()
  if (!currentReservation) return

  const list = await useOrder().list()
  order.value = list.find((entry) => String(entry.table_id) === String(props.tableId))
  if (!order.value) {
    order.value = await useOrder().create({
      table_id: Number(props.tableId),
      reservation_id: currentReservation.reservation_id,
      notes: 'Client order'
    })
  }
}

const requestInvoice = async () => {
  confirmOpen.value = true
}

const callWaiter = () => {
  toast.info('A waiter has been notified')
}

const confirmInvoice = async () => {
  try {
    const invoice = await useInvoice().create({ order_id: order.value.order_id })
    toast.success('Invoice created.')
    router.push(`/invoice/${invoice.invoice_id}`)
  } catch (error) {
    toast.error(error.message || 'Unable to create invoice.')
  }
}

const removeItem = async (row) => {
  await useOrderItem().remove(row.order_item_id)
  await load()
}

const addToOrder = async (item) => {
  try {
    const currentOrder = await ensureOrder()
    if (!currentOrder) return
    await useOrderItem().add(currentOrder.order_id, { item_id: item.item_id, quantity: 1, notes: '' })
    toast.success('Added to order.')
    await load()
  } catch (error) {
    toast.error(error.message || 'Unable to add item.')
  }
}

onMounted(async () => {
  await Promise.all([loadMenu(), load()])
})
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

