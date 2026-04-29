<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { toast } from '../../services/toast'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const form = reactive({ email: '', password: '' })

const submit = async () => {
  loading.value = true
  try {
    const staff = await auth.login(form)
    toast.success(`Welcome back, ${staff.fullName || staff.full_name}`)
    router.push('/staff/dashboard')
  } catch (error) {
    toast.error('Invalid email or password')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="staff-login">
    <form class="auth-card" @submit.prevent="submit">
      <p class="eyebrow">Staff login</p>
      <h2>Sign In</h2>
      <label>
        <span>Email</span>
        <input v-model="form.email" type="email" required />
      </label>
      <label>
        <span>Password</span>
        <input v-model="form.password" type="password" required />
      </label>
      <button class="solid-button" :disabled="loading">{{ loading ? 'Signing in...' : 'Sign In' }}</button>
    </form>
  </main>
</template>

