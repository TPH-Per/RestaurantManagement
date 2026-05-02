import { categoryService } from '@/services/category.service';
import { menuService } from '@/services/menu.service';
import { orderService } from '@/services/order.service';
import { reservationService } from '@/services/reservation.service';
import { invoiceService } from '@/services/invoice.service';
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'

import { toast } from '../../services/toast'
import { useRouter } from 'vue-router'
import { useClientAuthStore } from '../../stores/clientAuth'

const props = defineProps({ invoiceId: { type: String, required: true } })
const router = useRouter()
const auth = useClientAuthStore()
const invoice = ref(null)
const paid = ref(false)
const paymentMethod = ref('QR')

const load = async () => {
  invoice.value = await useInvoice().get(props.invoiceId)
  if (!invoice.value || String(invoice.value.customer_id) !== String(auth.customerId)) {
    toast.error('You can only view your own invoice.')
    router.replace('/my-invoices')
  }
}

const confirmPayment = async () => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to('.payment-button', { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 })
  }
  try {
    await useInvoice().pay(props.invoiceId, { payment_method: paymentMethod.value })
    paid.value = true
    toast.success('Payment Complete')
  } catch (error) {
    toast.error(error.message || 'Unable to pay invoice.')
  }
}

const total = computed(() => invoice.value?.total_amount || 0)

onMounted(load)
</script>

<template>
  <main class="client-page invoice-page">
    <section class="invoice-card">
      <p class="eyebrow">Invoice</p>
      <h2>{{ invoice?.invoice_code }}</h2>
      <div class="invoice-grid">
        <div>Table {{ invoice?.table_id }}</div>
        <div>Date {{ invoice?.date?.slice(0, 10) }}</div>
        <div>Processed by Staff {{ invoice?.processed_by }}</div>
      </div>
      <div class="invoice-lines">
        <div v-for="row in invoice?.items || []" :key="row.order_item_id" class="invoice-line">
          <span>Item {{ row.item_id }} x{{ row.quantity }}</span>
          <span>{{ row.subtotal.toLocaleString() }} ₫</span>
        </div>
      </div>
      <div class="invoice-total">
        <strong>Total</strong>
        <strong>{{ total.toLocaleString() }} ₫</strong>
      </div>
    </section>

    <section v-if="!paid" class="payment-panel">
      <h3>Payment method</h3>
      <div class="payment-methods">
        <button :class="{ active: paymentMethod === 'CASH' }" @click="paymentMethod = 'CASH'">CASH</button>
        <button :class="{ active: paymentMethod === 'CARD' }" @click="paymentMethod = 'CARD'">CARD</button>
        <button :class="{ active: paymentMethod === 'QR' }" @click="paymentMethod = 'QR'">QR</button>
      </div>
      <button class="solid-button payment-button" @click="confirmPayment">Confirm Payment</button>
      <button class="ghost-button" @click="window.print()">Print</button>
    </section>

    <section v-else class="payment-success">
      <h3>Payment Complete</h3>
      <RouterLink :to="`/review/${invoiceId}`" class="solid-button">Leave a Review</RouterLink>
    </section>
  </main>
</template>

