import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { StaffRole } from '@/domain/enums'
import type { StaffAuthDto, CustomerAuthDto, LoginStaffRequest,
              LoginCustomerRequest, RegisterCustomerRequest } from '@/services/auth.service'

type AuthUser = (StaffAuthDto & { kind: 'staff' }) | (CustomerAuthDto & { kind: 'customer' }) | null

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user  = ref<AuthUser>(JSON.parse(localStorage.getItem('authUser') ?? 'null') as AuthUser)

  const isLoggedIn = computed(() => !!token.value)
  const isStaff    = computed(() => user.value?.kind === 'staff')
  const isCustomer = computed(() => user.value?.kind === 'customer')
  const isManager  = computed(() => user.value?.kind === 'staff' && user.value.role === StaffRole.MANAGER)
  const isAdmin    = computed(() => user.value?.kind === 'staff' && user.value.role === StaffRole.ADMIN)

  function persist(t: string, u: AuthUser) {
    token.value = t; user.value = u;
    localStorage.setItem('token',    t)
    localStorage.setItem('authUser', JSON.stringify(u))
  }

  async function loginStaff(p: LoginStaffRequest) {
    const d = await authService.loginStaff(p)
    persist(d.token, { ...d, kind: 'staff' })
    return d
  }
  async function loginCustomer(p: LoginCustomerRequest) {
    const d = await authService.loginCustomer(p)
    persist(d.token, { ...d, kind: 'customer' })
    return d
  }
  async function registerCustomer(p: RegisterCustomerRequest) {
    const d = await authService.registerCustomer(p)
    persist(d.token, { ...d, kind: 'customer' })
    return d
  }
  function logout() {
    token.value = null; user.value = null;
    localStorage.removeItem('token'); localStorage.removeItem('authUser')
  }

  return { token, user, isLoggedIn, isStaff, isCustomer, isManager, isAdmin,
           loginStaff, loginCustomer, registerCustomer, logout }
})