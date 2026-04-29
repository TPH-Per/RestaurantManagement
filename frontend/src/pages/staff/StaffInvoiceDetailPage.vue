<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'

const props = defineProps({ id: { type: String, required: true } })
const invoice = ref(null)

onMounted(async () => {
  invoice.value = await useInvoice().get(props.id)
})
</script>

<template>
  <main class="staff-page">
    <section class="invoice-card invoice-card--staff">
      <p class="eyebrow">Invoice Detail</p>
      <h2>{{ invoice?.invoice_code }}</h2>
      <p>Order {{ invoice?.order_id }} · Table {{ invoice?.table_id }}</p>
      <div v-for="row in invoice?.items || []" :key="row.order_item_id" class="invoice-line">
        <span>Item {{ row.item_id }}</span>
        <span>{{ row.subtotal.toLocaleString() }} ₫</span>
      </div>
      <strong class="invoice-total__value">{{ invoice?.total_amount?.toLocaleString() }} ₫</strong>
    </section>
  </main>
</template>

