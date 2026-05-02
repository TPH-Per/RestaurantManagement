<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Invoice } from '@/domain/entities/invoice.entity'
import { canReview }    from '@/domain/rules/invoice.rules'
import { useReview }    from '@/composables/useReview'

const props  = defineProps<{ invoice: Invoice }>()
const review = useReview()

// Domain rule gates the entire form \u{2014} not a UI-level hack
const reviewAllowed = computed(() => canReview(props.invoice))
const stars   = ref(5)
const content = ref('')

async function submit() {
  if (!reviewAllowed.value) return       // double guard
  await review.create(props.invoice.invoiceId, stars.value, content.value)
}
</script>

<template>
  <section class="review-section">
    <!-- Show locked message until invoice is PAID -->
    <div v-if="!reviewAllowed" class="review-locked">
      Review becomes available after payment is completed.
    </div>
    <form v-else @submit.prevent="submit">
      <!-- star picker + textarea -->
      <button type="submit">Submit Review</button>
    </form>
  </section>
</template>