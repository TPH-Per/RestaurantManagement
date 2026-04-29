<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import gsap from 'gsap'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { useReservationStore } from '../../stores/reservation'
import { useClientAuthStore } from '../../stores/clientAuth'
import { toast } from '../../services/toast'
import { useRouter } from 'vue-router'

const reservations = ref([])
const auth = useClientAuthStore()
const store = useReservationStore()
const router = useRouter()

const load = async () => {
  const list = await store.fetchMyReservations()
  const invoices = await useInvoice().my(auth.customerId)
  reservations.value = list.map((reservation) => ({
    ...reservation,
    invoice_id: invoices.find((invoice) => invoice.order_id === reservation.order_id)?.invoice_id || null
  }))
}

const startOrder = async (reservation) => {
  store.setActiveReservation(reservation.reservation_id)
  router.push(`/order/${reservation.table_id}?reservationId=${reservation.reservation_id}`)
}

const bookAgain = () => {
  router.push('/reserve')
}

const viewInvoice = async (reservation) => {
  const invoices = await useInvoice().my(auth.customerId)
  const match = invoices.find((invoice) => invoice.order_id === reservation.order_id)
  if (match) router.push(`/my-invoices/${match.invoice_id}`)
}

onMounted(async () => {
  await load()
  gsap.from('.reservation-card', {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
  })
})
</script>

<template>
  <main class="client-page reservations-page">
    <section class="page-head">
      <div>
        <p class="eyebrow">Your Reservations</p>
        <h2>Reservations</h2>
      </div>
      <RouterLink to="/reserve" class="ghost-button">+ New Reservation</RouterLink>
    </section>

    <section v-if="reservations.length" class="reservation-list">
      <article v-for="reservation in reservations" :key="reservation.reservation_id" class="reservation-card">
        <div class="reservation-card__meta">
          <strong>Table {{ reservation.table_id }}</strong>
          <span>{{ dayjs(reservation.reserved_at).format('dddd, D MMMM YYYY · h:mm A') }}</span>
        </div>
        <p>Guests: {{ reservation.guest_count }}</p>
        <p>Status: <span class="status-badge" :class="`status-badge--${reservation.status.toLowerCase()}`">{{ reservation.status }}</span></p>
        <p v-if="reservation.notes" class="italic">{{ reservation.notes }}</p>
        <div class="reservation-card__actions">
          <button v-if="reservation.status === 'SERVING'" class="solid-button" @click="startOrder(reservation)">Order Now →</button>
          <button v-else-if="reservation.status === 'PENDING'" class="ghost-button" disabled>Awaiting Confirmation</button>
          <template v-else-if="reservation.status === 'COMPLETED'">
            <button class="ghost-button" @click="viewInvoice(reservation)">View Invoice</button>
            <RouterLink v-if="reservation.invoice_id" class="solid-button" :to="`/review/${reservation.invoice_id}`">Leave Review</RouterLink>
          </template>
          <button v-else class="ghost-button" @click="bookAgain">Book Again</button>
        </div>
      </article>
    </section>

    <section v-else class="empty-state">
      <p>No reservations yet.</p>
      <RouterLink to="/reserve" class="solid-button">Reserve a Table</RouterLink>
    </section>
  </main>
</template>

