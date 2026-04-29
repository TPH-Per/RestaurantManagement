import { defineStore } from 'pinia'

const USERS_KEY = 'per-food-users'
const SESSION_KEY = 'per-food-session'
const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const readJson = (key, fallback) => {
  if (!canUseStorage) return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const persist = (key, value) => {
  if (!canUseStorage) return
  localStorage.setItem(key, JSON.stringify(value))
}

const normalizeEmail = (email) => email.trim().toLowerCase()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: readJson(USERS_KEY, []),
    session: readJson(SESSION_KEY, null)
  }),
  getters: {
    currentUser: (state) => state.session,
    isAuthenticated: (state) => Boolean(state.session)
  },
  actions: {
    syncStorage() {
      persist(USERS_KEY, this.users)
      persist(SESSION_KEY, this.session)
    },
    signUp({ fullName, email, password }) {
      const normalizedEmail = normalizeEmail(email)
      if (this.users.some((user) => user.email === normalizedEmail)) {
        throw new Error('EMAIL_EXISTS')
      }

      const account = {
        id: crypto.randomUUID?.() ?? `user-${Date.now()}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        role: 'Guest'
      }

      this.users = [...this.users, account]
      this.session = {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        role: account.role
      }
      this.syncStorage()
      return this.session
    },
    signIn({ email, password }) {
      const normalizedEmail = normalizeEmail(email)
      const account = this.users.find((user) => user.email === normalizedEmail)

      if (!account || account.password !== password) {
        throw new Error('INVALID_CREDENTIALS')
      }

      this.session = {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        role: account.role
      }
      this.syncStorage()
      return this.session
    },
    signOut() {
      this.session = null
      this.syncStorage()
    }
  }
})
