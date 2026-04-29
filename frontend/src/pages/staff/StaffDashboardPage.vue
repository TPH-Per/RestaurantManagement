<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'

const router = useRouter()
const summary = ref({ activeTables: 0, totalTables: 0, todayOrders: 0, todayRevenue: 0, pendingReservations: 0 })
const orders = ref([])
const reservations = ref([])

const load = async () => {
  summary.value = await useDashboard().summary()
  orders.value = await useOrder().list()
  reservations.value = await useReservation().list()
}

onMounted(load)
</script>

<template>
  <main class="staff-page">
    <section class="kpi-grid">
      <article class="kpi-card">
        <p>Active Tables</p>
        <strong>{{ summary.activeTables }}/{{ summary.totalTables }}</strong>
      </article>
      <article class="kpi-card">
        <p>Today's Orders</p>
        <strong>{{ summary.todayOrders }}</strong>
      </article>
      <article class="kpi-card">
        <p>Today's Revenue</p>
        <strong>{{ summary.todayRevenue.toLocaleString() }} ₫</strong>
      </article>
      <article class="kpi-card">
        <p>Pending Reservations</p>
        <strong>{{ summary.pendingReservations }}</strong>
      </article>
    </section>

    <section class="staff-panels">
      <article class="staff-panel">
        <h3>Today's Orders</h3>
        <table>
          <thead><tr><th>ID</th><th>Table</th><th>Status</th><th>Subtotal</th><th></th></tr></thead>
          <tbody>
            <tr v-for="order in orders" :key="order.order_id">
              <td>{{ order.order_id }}</td>
              <td>{{ order.table_id }}</td>
              <td>{{ order.status }}</td>
              <td>{{ order.subtotal.toLocaleString() }} ₫</td>
              <td><button class="ghost-button" @click="router.push(`/staff/orders/${order.order_id}`)">View</button></td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="staff-panel">
        <h3>Pending Reservations</h3>
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Date</th><th>Guests</th><th></th></tr></thead>
          <tbody>
            <tr v-for="reservation in reservations" :key="reservation.reservation_id">
              <td>{{ reservation.customer_name }}</td>
              <td>{{ reservation.phone }}</td>
              <td>{{ reservation.reserved_at.slice(0, 10) }}</td>
              <td>{{ reservation.guest_count }}</td>
              <td><button class="ghost-button">Confirm</button></td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  </main>
</template>

