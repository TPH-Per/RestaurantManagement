<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useClientAuthStore } from '../../stores/clientAuth'
import { toast } from '../../services/toast'

const router = useRouter()
const { t } = useI18n()
const auth = useClientAuthStore()
const mode = ref('signin')
const showPassword = ref(false)
const redirectAfterLogin = window.history.state?.redirectAfterLogin || '/'

const signInSchema = computed(() =>
  toTypedSchema(
    z.object({
      phone: z.string().min(9, t('auth.phoneNumber')),
      password: z.string().min(8, t('auth.password'))
    })
  )
)

const registerSchema = computed(() =>
  toTypedSchema(
    z.object({
      full_name: z.string().min(2, t('auth.fullName')),
      phone: z.string().min(9, t('auth.phoneNumber')),
      password: z.string().min(8, t('auth.password')),
      confirmPassword: z.string().min(8),
      gender: z.enum(['Male', 'Female', 'Other']),
      address: z.string().optional()
    }).refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordMismatch'),
      path: ['confirmPassword']
    })
  )
)

const submitSignIn = async (values, { resetForm }) => {
  try {
    const customer = await auth.signIn(values)
    toast.success(t('auth.welcomeBackMessage', { name: customer.full_name }))
    router.replace(redirectAfterLogin || '/')
  } catch {
    toast.error(t('auth.phoneError'))
  } finally {
    resetForm()
  }
}

const submitRegister = async (values, { resetForm }) => {
  try {
    await auth.register(values)
    toast.success(t('auth.accountCreatedMessage'))
    router.replace('/reserve')
  } catch (error) {
    toast.error(error.message || t('auth.unableCreateAccount'))
  } finally {
    resetForm()
  }
}
</script>

<template>
  <main class="client-page login-page">
    <section class="auth-panel">
      <p class="eyebrow">Per's Food</p>
      <h2>{{ mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle') }}</h2>

      <div class="auth-tabs">
        <button type="button" :class="{ active: mode === 'signin' }" @click="mode = 'signin'">{{ t('auth.signIn') }}</button>
        <button type="button" :class="{ active: mode === 'register' }" @click="mode = 'register'">{{ t('auth.createAccount') }}</button>
      </div>

      <Form
        v-if="mode === 'signin'"
        :validation-schema="signInSchema"
        :initial-values="{ phone: '', password: '' }"
        @submit="submitSignIn"
      >
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.phoneNumber') }}</span>
            <ErrorMessage name="phone" as="span" class="field-error-inline" />
          </div>
          <Field name="phone" />
        </label>
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.password') }}</span>
            <ErrorMessage name="password" as="span" class="field-error-inline" />
          </div>
          <div class="password-row">
            <Field :type="showPassword ? 'text' : 'password'" name="password" />
            <button type="button" class="ghost-button" @click="showPassword = !showPassword">{{ showPassword ? t('auth.hide') : t('auth.show') }}</button>
          </div>
        </label>
        <button class="solid-button auth-submit" type="submit">{{ t('auth.signIn') }}</button>
      </Form>

      <Form
        v-else
        :validation-schema="registerSchema"
        :initial-values="{ full_name: '', phone: '', password: '', confirmPassword: '', gender: 'Male', address: '' }"
        @submit="submitRegister"
      >
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.fullName') }}</span>
            <ErrorMessage name="full_name" as="span" class="field-error-inline" />
          </div>
          <Field name="full_name" />
        </label>
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.phoneNumber') }}</span>
            <ErrorMessage name="phone" as="span" class="field-error-inline" />
          </div>
          <Field name="phone" />
        </label>
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.password') }}</span>
            <ErrorMessage name="password" as="span" class="field-error-inline" />
          </div>
          <div class="password-row">
            <Field :type="showPassword ? 'text' : 'password'" name="password" />
            <button type="button" class="ghost-button" @click="showPassword = !showPassword">{{ showPassword ? t('auth.hide') : t('auth.show') }}</button>
          </div>
        </label>
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.confirmPassword') }}</span>
            <ErrorMessage name="confirmPassword" as="span" class="field-error-inline" />
          </div>
          <Field :type="showPassword ? 'text' : 'password'" name="confirmPassword" />
        </label>
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.gender') }}</span>
            <ErrorMessage name="gender" as="span" class="field-error-inline" />
          </div>
          <Field as="select" name="gender">
            <option value="Male">{{ t('auth.male') }}</option>
            <option value="Female">{{ t('auth.female') }}</option>
            <option value="Other">{{ t('auth.other') }}</option>
          </Field>
        </label>
        <label class="field-group">
          <div class="field-head">
            <span>{{ t('auth.address') }}</span>
            <ErrorMessage name="address" as="span" class="field-error-inline" />
          </div>
          <Field name="address" />
        </label>
        <button class="solid-button auth-submit" type="submit">{{ t('auth.createAccount') }}</button>
      </Form>
    </section>
  </main>
</template>

