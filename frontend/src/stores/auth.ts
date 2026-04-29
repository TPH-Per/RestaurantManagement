import { defineStore } from 'pinia'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'

const KEY = 'iyakaza-staff-session'
const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const readSession = () => {
  if (!canUseStorage) return { token: '', user: null }
  const raw = localStorage.getItem(KEY)
  if (!raw) return { token: '', user: null }
  try {
    return JSON.parse(raw)
  } catch {
    return { token: '', user: null }
  }
}

const persist = (session) => {
  if (!canUseStorage) return
  localStorage.setItem(KEY, JSON.stringify(session))
}

export const useAuthStore = defineStore('auth', {
  state: () => readSession(),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    role: (state) => state.user?.role || ''
  },
  actions: {
    async login(payload) {
      const { token, staff } = await useAuth().login(payload)
      this.token = token
      this.user = {
        staffId: staff.staff_id,
        fullName: staff.full_name,
        role: staff.role,
        email: staff.email
      }
      persist({ token: this.token, user: this.user })
      return this.user
    },
    logout() {
      this.token = ''
      this.user = null
      persist({ token: '', user: null })
    }
  }
})
