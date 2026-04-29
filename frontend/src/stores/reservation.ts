import { defineStore } from 'pinia'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { useClientAuthStore } from './clientAuth'

const KEY = 'perfood-reservation-session'
const canUseStorage = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'

const readSession = () => {
  if (!canUseStorage) return { reservations: [], activeReservation: null }
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{"reservations":[],"activeReservation":null}')
  } catch {
    return { reservations: [], activeReservation: null }
  }
}

const persist = (state) => {
  if (!canUseStorage) return
  sessionStorage.setItem(KEY, JSON.stringify(state))
}

export const useReservationStore = defineStore('reservation', {
  state: () => readSession(),
  getters: {
    active: (state) => state.activeReservation
  },
  actions: {
    async fetchMyReservations() {
      const auth = useClientAuthStore()
      this.reservations = await useReservation().my(auth.customerId)
      persist({ reservations: this.reservations, activeReservation: this.activeReservation })
      return this.reservations
    },
    setActiveReservation(id) {
      this.activeReservation = id
      persist({ reservations: this.reservations, activeReservation: this.activeReservation })
    }
  }
})
