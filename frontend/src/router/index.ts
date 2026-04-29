import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useClientAuthStore } from '../stores/clientAuth'
import { useReservationStore } from '../stores/reservation'
import { toast } from '../services/toast'

import ClientLayout from '../layouts/ClientLayout.vue'
import StaffLayout from '../layouts/StaffLayout.vue'

import ClientLandingPage from '../pages/client/ClientLandingPage.vue'
import ClientMenuPage from '../pages/client/ClientMenuPage.vue'
import ClientReservePage from '../pages/client/ClientReservePage.vue'
import ClientOrderPage from '../pages/client/ClientOrderPage.vue'
import ClientInvoicePage from '../pages/client/ClientInvoicePage.vue'
import ClientReviewPage from '../pages/client/ClientReviewPage.vue'
import ClientLoginPage from '../pages/client/ClientLoginPage.vue'
import ClientReservationsPage from '../pages/client/ClientReservationsPage.vue'
import ClientInvoicesPage from '../pages/client/ClientInvoicesPage.vue'
import ClientInvoiceDetailPage from '../pages/client/ClientInvoiceDetailPage.vue'
import ClientProfilePage from '../pages/client/ClientProfilePage.vue'

import StaffLoginPage from '../pages/staff/StaffLoginPage.vue'
import StaffDashboardPage from '../pages/staff/StaffDashboardPage.vue'
import StaffWorkspacePage from '../pages/staff/StaffWorkspacePage.vue'
import StaffOrderDetailPage from '../pages/staff/StaffOrderDetailPage.vue'
import StaffInvoiceDetailPage from '../pages/staff/StaffInvoiceDetailPage.vue'
import StaffReceiptNewPage from '../pages/staff/StaffReceiptNewPage.vue'

const routes = [
  {
    path: '/',
    component: ClientLayout,
    children: [
      { path: '', name: 'ClientLanding', component: ClientLandingPage },
      { path: 'menu', name: 'ClientMenu', component: ClientMenuPage },
      { path: 'reserve', name: 'ClientReserve', component: ClientReservePage, meta: { clientAuth: true } },
      { path: 'login', name: 'ClientLogin', component: ClientLoginPage },
      { path: 'my-reservations', name: 'ClientReservations', component: ClientReservationsPage, meta: { clientAuth: true } },
      { path: 'order/:tableId', name: 'ClientOrder', component: ClientOrderPage, props: true, meta: { clientAuth: true, reservationRequired: true } },
      { path: 'invoice/:invoiceId', name: 'ClientInvoice', component: ClientInvoicePage, props: true, meta: { clientAuth: true } },
      { path: 'my-invoices', name: 'ClientInvoices', component: ClientInvoicesPage, meta: { clientAuth: true } },
      { path: 'my-invoices/:invoiceId', name: 'ClientInvoiceDetail', component: ClientInvoiceDetailPage, props: true, meta: { clientAuth: true } },
      { path: 'review/:invoiceId', name: 'ClientReview', component: ClientReviewPage, props: true, meta: { clientAuth: true } },
      { path: 'profile', name: 'ClientProfile', component: ClientProfilePage, meta: { clientAuth: true } }
    ]
  },
  { path: '/staff/login', name: 'StaffLogin', component: StaffLoginPage },
  {
    path: '/staff',
    component: StaffLayout,
    children: [
      { path: 'dashboard', name: 'StaffDashboard', component: StaffDashboardPage, meta: { requiresAuth: true, pageKey: 'staff-dashboard' } },
      { path: 'tables', name: 'StaffTables', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-tables' } },
      { path: 'orders', name: 'StaffOrders', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-orders' } },
      { path: 'orders/:id', name: 'StaffOrderDetail', component: StaffOrderDetailPage, props: true, meta: { requiresAuth: true } },
      { path: 'menu', name: 'StaffMenu', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-menu' } },
      { path: 'reservations', name: 'StaffReservations', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-reservations' } },
      { path: 'invoices', name: 'StaffInvoices', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-invoices' } },
      { path: 'invoices/:id', name: 'StaffInvoiceDetail', component: StaffInvoiceDetailPage, props: true, meta: { requiresAuth: true } },
      { path: 'warehouse', name: 'StaffWarehouse', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-warehouse' } },
      { path: 'receipts', name: 'StaffReceipts', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-receipts' } },
      { path: 'receipts/new', name: 'StaffReceiptNew', component: StaffReceiptNewPage, meta: { requiresAuth: true } },
      { path: 'discounts', name: 'StaffDiscounts', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-discounts' } },
      { path: 'customers', name: 'StaffCustomers', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-customers' } },
      { path: 'staff-management', name: 'StaffStaffManagement', component: StaffWorkspacePage, meta: { requiresAuth: true, requiredRole: ['ADMIN'], pageKey: 'staff-staff-management' } },
      { path: 'reviews', name: 'StaffReviews', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-reviews' } },
      { path: 'categories', name: 'StaffCategories', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-categories' } },
      { path: 'manufacturers', name: 'StaffManufacturers', component: StaffWorkspacePage, meta: { requiresAuth: true, pageKey: 'staff-manufacturers' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const clientAuth = useClientAuthStore()
  const reservation = useReservationStore()
  const auth = useAuthStore()

  if (to.meta.clientAuth && !clientAuth.isLoggedIn) {
    toast.error('Please sign in first.')
    return { name: 'ClientLogin', state: { redirectAfterLogin: to.fullPath } }
  }

  if (to.meta.reservationRequired) {
    if (!reservation.reservations.length && clientAuth.customerId) {
      await reservation.fetchMyReservations()
    }
    const reservationId = to.query.reservationId
    const active = reservation.reservations.find((item) => String(item.reservation_id) === String(reservationId))
    if (!reservationId || !active) {
      toast.error('Please select a valid reservation to order from')
      return { name: 'ClientReservations' }
    }
    if (active.status !== 'CONFIRMED') {
      toast.error('Please use a confirmed reservation.')
      return { name: 'ClientReservations' }
    }
    reservation.setActiveReservation(Number(reservationId))
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    toast.error('Access denied — please sign in first.')
    return { name: 'StaffLogin' }
  }

  if (to.meta.requiredRole && !to.meta.requiredRole.includes(auth.role)) {
    toast.error('Access denied — insufficient permissions.')
    return { name: 'StaffDashboard' }
  }
})

export default router
