import { defineStore } from 'pinia'

const KEY = 'perfood-cart-session'
const canUseStorage = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'

const readSession = () => {
  if (!canUseStorage) return { items: [], reservationId: null }
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{"items":[],"reservationId":null}')
  } catch {
    return { items: [], reservationId: null }
  }
}

const persist = (state) => {
  if (!canUseStorage) return
  sessionStorage.setItem(KEY, JSON.stringify(state))
}

export const useCartStore = defineStore('cart', {
  state: () => readSession(),
  getters: {
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0)
  },
  actions: {
    setReservationId(reservationId) {
      this.reservationId = reservationId
      persist({ items: this.items, reservationId: this.reservationId })
    },
    addItem(item) {
      this.items.push(item)
      persist({ items: this.items, reservationId: this.reservationId })
    },
    clear() {
      this.items = []
      this.reservationId = null
      persist({ items: this.items, reservationId: this.reservationId })
    }
  }
})
