<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { toast } from '../../services/toast'
import { useClientAuthStore } from '../../stores/clientAuth'
import { useRouter } from 'vue-router'

const props = defineProps({ invoiceId: { type: String, required: true } })
const auth = useClientAuthStore()
const router = useRouter()
const invoice = ref(null)
const review = ref(null)
const staffName = ref('')
const menuItems = ref([])

const load = async () => {
  invoice.value = await useInvoice().get(props.invoiceId)
  review.value = await useReviews().getByInvoice(props.invoiceId)
  const staffList = await useStaff().list()
  menuItems.value = await useFb().list()
  if (!invoice.value || String(invoice.value.customer_id) !== String(auth.customerId)) {
    toast.error('You can only view your own invoice.')
    router.replace('/my-invoices')
    return
  }
  staffName.value = staffList.find((entry) => entry.staff_id === invoice.value?.processed_by)?.full_name || 'Staff'
}

const canReview = computed(() => invoice.value?.status === 'PAID' && !review.value)

onMounted(load)
</script>

<template>
  <main class="client-page invoice-detail-page">
    <section class="receipt-card">
      <div class="receipt-header"></div>
      <p class="invoice-code">{{ invoice?.invoice_code }}</p>
      <div class="receipt-meta">
        <span>{{ dayjs(invoice?.date).format('D MMMM YYYY') }}</span>
        <span>Table {{ invoice?.table_id }}</span>
      </div>
      <p class="receipt-staff">Served by {{ staffName }}</p>
      <div class="receipt-lines">
        <div v-for="row in invoice?.items || []" :key="row.order_item_id" class="receipt-line">
          <span>{{ menuItems.find((item) => item.item_id === row.item_id)?.name || `Item ${row.item_id}` }}</span>
          <span>{{ row.quantity }}</span>
          <span>{{ row.unit_price.toLocaleString() }}</span>
          <span>{{ row.subtotal.toLocaleString() }}</span>
        </div>
      </div>
      <div class="receipt-total">
        <span>Subtotal</span><strong>{{ invoice?.subtotal?.toLocaleString() }} ₫</strong>
      </div>
      <div v-if="invoice?.discount_amount" class="receipt-total receipt-total--discount">
        <span>Discount</span><strong>-{{ invoice?.discount_amount.toLocaleString() }} ₫</strong>
      </div>
      <div class="receipt-total receipt-total--grand">
        <span>Total</span><strong>{{ invoice?.total_amount?.toLocaleString() }} ₫</strong>
      </div>
      <div class="receipt-payment">Payment: {{ invoice?.payment_method }}</div>
      <div class="receipt-status status-badge" :class="`status-badge--${invoice?.status?.toLowerCase()}`">{{ invoice?.status }}</div>
      <div class="receipt-actions">
        <button class="ghost-button" @click="window.print()">Print / Save as PDF</button>
        <RouterLink v-if="canReview" :to="`/review/${invoiceId}`" class="solid-button">Leave a Review</RouterLink>
        <span v-else-if="review" class="review-submitted">Review Submitted ✓</span>
      </div>
    </section>
  </main>
</template>

