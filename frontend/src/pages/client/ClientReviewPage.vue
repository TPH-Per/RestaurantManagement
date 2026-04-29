<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { animate } from 'animejs'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { toast } from '../../services/toast'
import { useClientAuthStore } from '../../stores/clientAuth'

const props = defineProps({ invoiceId: { type: String, required: true } })
const router = useRouter()
const auth = useClientAuthStore()
const invoice = ref(null)
const review = ref(null)
const rating = ref(0)
const content = ref('')
const submitted = ref(false)

const charCount = computed(() => content.value.length)

const validate = async () => {
  invoice.value = await useInvoice().get(props.invoiceId)
  review.value = await useReviews().getByInvoice(props.invoiceId)

  if (!invoice.value || String(invoice.value.customer_id) !== String(auth.customerId)) {
    toast.error('You can only review your own invoice.')
    router.replace('/my-invoices')
    return false
  }

  if (invoice.value.status !== 'PAID') {
    toast.warning('You can only review a paid invoice')
    router.replace('/my-invoices')
    return false
  }

  if (review.value) {
    toast.info("You've already reviewed this visit")
    router.replace(`/my-invoices/${props.invoiceId}`)
    return false
  }

  return true
}

const setRating = (value) => {
  rating.value = value
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate('.review-star', { scale: [1, 1.12, 1], duration: 150, delay: 30, ease: 'outQuad' })
  }
}

const submit = async () => {
  if (!rating.value) return
  try {
    await useReviews().create({
      invoice_id: Number(props.invoiceId),
      customer_id: auth.customerId,
      rating: rating.value,
      content: content.value || 'Great visit!'
    })
    submitted.value = true
    toast.success('Review submitted!')
  } catch (error) {
    toast.error(error.message || 'Unable to submit review.')
  }
}

onMounted(validate)
</script>

<template>
  <main class="client-page review-page">
    <section v-if="!submitted" class="review-card">
      <p class="eyebrow">How was your experience?</p>
      <h2>{{ invoice ? `Invoice ${invoice.invoice_code} · ${invoice.date.slice(0, 10)}` : 'Loading...' }}</h2>
      <div class="stars">
        <button
          v-for="star in 5"
          :key="star"
          class="review-star"
          :class="{ active: star <= rating }"
          :disabled="!invoice"
          @mouseenter="setRating(star)"
          @click="setRating(star)"
        >
          ★
        </button>
      </div>
      <label class="floating">
        <span>Tell us about your visit...</span>
        <textarea v-model="content" maxlength="500" rows="5" />
        <small>{{ charCount }}/500</small>
      </label>
      <button class="solid-button" :disabled="!rating" @click="submit">Submit Review</button>
    </section>

    <section v-else class="review-success">
      <h2>Thank you for dining with us.</h2>
      <p>Your star rating has been saved.</p>
      <div class="stars stars--static">
        <span v-for="star in 5" :key="star" class="review-star" :class="{ active: star <= rating }">★</span>
      </div>
      <RouterLink :to="`/my-invoices/${invoiceId}`" class="ghost-button">Return to My Invoices</RouterLink>
    </section>
  </main>
</template>

