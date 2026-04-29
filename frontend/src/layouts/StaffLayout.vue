<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from '../services/toast'
// Mock data removed

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const nav = [
  ['StaffDashboard', 'Dashboard'],
  ['StaffTables', 'Tables'],
  ['StaffOrders', 'Orders'],
  ['StaffMenu', 'Menu'],
  ['StaffReservations', 'Reservations'],
  ['StaffInvoices', 'Invoices'],
  ['StaffWarehouse', 'Warehouse'],
  ['StaffReceipts', 'Receipts'],
  ['StaffDiscounts', 'Discounts'],
  ['StaffCustomers', 'Customers'],
  ['StaffReviews', 'Reviews'],
  ['StaffCategories', 'Categories'],
  ['StaffManufacturers', 'Manufacturers']
]

const visibleNav = computed(() =>
  nav.filter(([name]) => name !== 'StaffDashboard' || auth.isAuthenticated)
)

const logout = () => {
  auth.logout()
  toast.success('Signed out.')
  router.push('/staff/login')
}
</script>

<template>
  <div class="staff-shell">
    <aside class="staff-sidebar">
      <div class="staff-sidebar__brand">
        <div class="brand-mark">PF</div>
        <div>
          <p class="brand-kicker">Staff mode</p>
          <strong>Per's Food</strong>
        </div>
      </div>

      <nav class="staff-nav">
        <RouterLink
          v-for="[name, label] in visibleNav"
          :key="name"
          :to="{ name }"
          :class="{ active: route.name === name }"
        >
          {{ label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="staff-main">
      <header class="staff-topbar">
        <div>
          <p class="brand-kicker">Operations</p>
          <h1>{{ {}[route.meta.pageKey || route.name]?.title || 'Dashboard' }}</h1>
        </div>
        <div class="staff-topbar__actions">
          <span class="account-chip">
            <span>{{ auth.user?.fullName || auth.user?.full_name }}</span>
            <small>{{ auth.role }}</small>
          </span>
          <button class="ghost-button" @click="logout">Logout</button>
        </div>
      </header>

      <RouterView />
    </div>
  </div>
</template>

