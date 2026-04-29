<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import gsap from 'gsap'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { useClientAuthStore } from '../../stores/clientAuth'

const auth = useClientAuthStore()
const invoices = ref([])
const filter = ref('All')
const startDate = ref('')
const endDate = ref('')

const load = async () => {
  invoices.value = await useInvoice().my(auth.customerId)
}

const filtered = computed(() => {
  if (filter.value === 'All') return [...invoices.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  return [...invoices.value]
    .filter((invoice) => invoice.status === filter.value.toUpperCase())
    .filter((invoice) => (!startDate.value || dayjs(invoice.date).isAfter(startDate.value, 'day')) && (!endDate.value || dayjs(invoice.date).isBefore(endDate.value, 'day')))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

onMounted(async () => {
  await load()
  gsap.from('.invoice-preview-card', {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.75,
    ease: 'power3.out'
  })
})
</script>

<template>
  <main class="client-page invoices-page">
    <section class="page-head">
      <div>
        <p class="eyebrow">Your Invoices</p>
        <h2>Invoices</h2>
      </div>
      <div class="filter-pills">
        <button :class="{ active: filter === 'All' }" @click="filter = 'All'">All</button>
        <button :class="{ active: filter === 'Unpaid' }" @click="filter = 'Unpaid'">Unpaid</button>
        <button :class="{ active: filter === 'Paid' }" @click="filter = 'Paid'">Paid</button>
        <button :class="{ active: filter === 'Refunded' }" @click="filter = 'Refunded'">Refunded</button>
      </div>
      <div class="date-filters">
        <input v-model="startDate" type="date" />
        <input v-model="endDate" type="date" />
      </div>
    </section>

    <section v-if="filtered.length" class="invoice-preview-list">
      <article v-for="invoice in filtered" :key="invoice.invoice_id" class="invoice-preview-card">
        <p class="invoice-code">{{ invoice.invoice_code }}</p>
        <p>{{ dayjs(invoice.date).format('D MMMM YYYY') }}</p>
        <p>Table {{ invoice.table_id }}</p>
        <span class="status-badge" :class="`status-badge--${invoice.status.toLowerCase()}`">{{ invoice.status }}</span>
        <strong>{{ invoice.total_amount.toLocaleString() }} ₫</strong>
        <RouterLink :to="`/my-invoices/${invoice.invoice_id}`" class="ghost-button">View Details →</RouterLink>
      </article>
    </section>

    <section v-else class="empty-state">
      <p>No invoices yet.</p>
      <RouterLink to="/menu" class="solid-button">View Menu</RouterLink>
    </section>
  </main>
</template>

