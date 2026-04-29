import { defineStore } from 'pinia'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'

const KEY = 'perfood-client-session'
const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const readSession = () => {
  if (!canUseStorage) return { token: '', customer: null }
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{"token":"","customer":null}')
  } catch {
    return { token: '', customer: null }
  }
}

const persist = (session) => {
  if (!canUseStorage) return
  localStorage.setItem(KEY, JSON.stringify(session))
}

export const useClientAuthStore = defineStore('clientAuth', {
  state: () => readSession(),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    fullName: (state) => state.customer?.full_name || '',
    customerId: (state) => state.customer?.customer_id || ''
  },
  actions: {
    login(token, customer) {
      this.token = token
      this.customer = customer
      persist({ token, customer })
    },
    async signIn(payload) {
      const { token, customer } = await useAuth().clientLogin(payload)
      this.login(token, customer)
      return customer
    },
    async register(payload) {
      const response = await useCustomer().register(payload)
      // The response might be { token, customer } or just the customer data
      const token = response.token || `client-token-${response.customer?.customer_id || response.customer_id}`
      const customer = response.customer || response
      this.login(token, customer)
      return customer
    },
    logout() {
      this.token = ''
      this.customer = null
      if (canUseStorage) {
        sessionStorage.removeItem('perfood-reservation-session')
        sessionStorage.removeItem('perfood-cart-session')
      }
      persist({ token: '', customer: null })
    }
  }
})
