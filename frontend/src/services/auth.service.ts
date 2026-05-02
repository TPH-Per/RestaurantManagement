import apiClient from './api.client'
import type { StaffRole, MemberTier } from '@/domain/enums'

export interface StaffAuthDto {
  staffId: number; fullName: string; role: StaffRole; token: string;
}
export interface CustomerAuthDto {
  customerId: number; fullName: string; phone: string;
  email?: string; membershipLevel: MemberTier; token: string;
}
export interface LoginStaffRequest    { email: string; password: string }
export interface LoginCustomerRequest { phone: string; password: string }
export interface RegisterCustomerRequest {
  fullName: string; phone: string; password: string;
  email?: string; gender?: string; address?: string;
}

export const authService = {
  loginStaff:       (b: LoginStaffRequest)       => apiClient.post<StaffAuthDto>('/auth/staff/login',        b).then(r => r.data),
  loginCustomer:    (b: LoginCustomerRequest)     => apiClient.post<CustomerAuthDto>('/auth/customer/login',  b).then(r => r.data),
  registerCustomer: (b: RegisterCustomerRequest)  => apiClient.post<CustomerAuthDto>('/auth/customer/register',b).then(r => r.data),
}