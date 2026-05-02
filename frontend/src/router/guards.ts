import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function requireAuth(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
  const auth = useAuthStore()
  if (!auth.isLoggedIn) return next({ name: 'Login', query: { redirect: _to.fullPath } })
  next()
}
export function requireStaff(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!useAuthStore().isStaff) return next({ name: 'Forbidden' })
  next()
}
export function requireManager(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!useAuthStore().isManager) return next({ name: 'Forbidden' })
  next()
}
export function requireCustomer(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!useAuthStore().isCustomer) return next({ name: 'ClientLogin' })
  next()
}

// router/index.ts \u{2014} apply guards
const routes = [
  { path: '/staff/login',     name: 'Login',         component: () => import('@/pages/staff/StaffLoginPage.vue') },
  { path: '/login',           name: 'ClientLogin',   component: () => import('@/pages/client/ClientLoginPage.vue') },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      { path: 'dashboard',   name: 'Dashboard',    component: () => import('@/pages/dashboard/DashboardPage.vue') },
      { path: 'menu',        name: 'Menu',         component: () => import('@/pages/menu/MenuPage.vue') },
      { path: 'tables',      name: 'Tables',       component: () => import('@/pages/tables/TablesPage.vue') },
      { path: 'orders/:id',  name: 'Order',        component: () => import('@/pages/orders/OrderPage.vue') },
      { path: 'invoices/:id',name: 'Invoice',      component: () => import('@/pages/invoices/InvoicePage.vue') },
      { path: 'warehouse',   name: 'Warehouse',    component: () => import('@/pages/warehouse/WarehousePage.vue') },
      { path: 'staff',       name: 'Staff',        component: () => import('@/pages/staff/StaffPage.vue'),       beforeEnter: requireManager },
      { path: 'receipts',    name: 'Receipts',     component: () => import('@/pages/warehouse/ReceiptsPage.vue'), beforeEnter: requireManager },
    ]
  }
]