<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDebounce } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { toast } from '../../services/toast'

const props = defineProps({ id: { type: String, required: true } })
const route = useRoute()
const router = useRouter()
const order = ref(null)
const search = ref('')
const quantity = ref(1)
const selectedItem = ref(null)
const fbItems = ref([])
const selectedCategory = ref('')
const debouncedSearch = useDebounce(search, 300)

const load = async () => {
  order.value = await useOrder().get(props.id)
  fbItems.value = await useFb().list({ query: debouncedSearch.value, category_id: selectedCategory.value })
}

const addItem = async (item) => {
  try {
    await useOrderItem().add(props.id, { item_id: item.item_id, quantity: quantity.value, notes: '' })
    toast.success('Item added to order')
    await load()
  } catch (error) {
    toast.error(error.message || 'Unable to add item.')
  }
}

const createInvoice = async () => {
  try {
    const invoice = await useInvoice().create({ order_id: props.id })
    toast.success('Invoice created')
    router.push(`/staff/invoices/${invoice.invoice_id}`)
  } catch (error) {
    toast.error(error.message || 'Unable to create invoice.')
  }
}

watch([debouncedSearch, selectedCategory], load)
onMounted(load)
</script>

<template>
  <main class="staff-page staff-grid">
    <section class="staff-panel">
      <p class="eyebrow">Order</p>
      <h2>#{{ route.params.id }}</h2>
      <p>Status: {{ order?.status }}</p>
      <p>Notes: {{ order?.notes }}</p>
    </section>

    <section class="staff-panel">
      <div class="detail-toolbar">
        <input v-model="search" placeholder="Search items" />
        <input v-model="selectedCategory" placeholder="Category ID" />
      </div>
      <table>
        <thead><tr><th>Name</th><th>Qty</th><th>Price</th><th></th></tr></thead>
        <tbody>
          <tr v-for="row in order?.items || []" :key="row.order_item_id">
            <td>Item {{ row.item_id }}</td>
            <td>{{ row.quantity }}</td>
            <td>{{ row.unit_price.toLocaleString() }}</td>
            <td><button class="ghost-button">×</button></td>
          </tr>
        </tbody>
      </table>
      <button v-if="order?.status === 'COMPLETED'" class="solid-button" @click="createInvoice">Create Invoice</button>
    </section>

    <section class="staff-panel">
      <h3>Add Item</h3>
      <div class="qty-stepper">
        <button class="ghost-button" @click="quantity = Math.max(1, quantity - 1)">−</button>
        <strong>{{ quantity }}</strong>
        <button class="ghost-button" @click="quantity += 1">+</button>
      </div>
      <article v-for="item in fbItems" :key="item.item_id" class="mini-row">
        <div>
          <strong>{{ item.name }}</strong>
          <p>{{ item.item_type }}</p>
        </div>
        <button class="solid-button" @click="addItem(item)">Add to Order</button>
      </article>
    </section>
  </main>
</template>

