<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { toast } from '../../services/toast'
import { useRouter } from 'vue-router'

const router = useRouter()
const manufacturers = ref([])
const items = ref([])
const receipt = ref({ manufacturer_id: '', notes: '' })
const rows = ref([{ item_id: '', quantity: 1, import_price: 0 }])

const total = computed(() => rows.value.reduce((sum, row) => sum + Number(row.quantity || 0) * Number(row.import_price || 0), 0))

const load = async () => {
  manufacturers.value = await useManufacturers().list()
  items.value = await useFb().list()
}

const addRow = () => rows.value.push({ item_id: '', quantity: 1, import_price: 0 })
const removeRow = (index) => rows.value.splice(index, 1)

const submit = async () => {
  try {
    const created = await useReceipts().create({ manufacturer_id: Number(receipt.value.manufacturer_id), notes: receipt.value.notes, created_by: 1 })
    for (const row of rows.value) {
      await useReceipts().addItem(created.receipt_id, row)
    }
    toast.success('Receipt created')
    router.push('/staff/receipts')
  } catch (error) {
    toast.error(error.message || 'Unable to create receipt.')
  }
}

onMounted(load)
</script>

<template>
  <main class="staff-page">
    <section class="staff-panel">
      <h2>Create Receipt</h2>
      <select v-model="receipt.manufacturer_id">
        <option value="">Select manufacturer</option>
        <option v-for="manufacturer in manufacturers" :key="manufacturer.manufacturer_id" :value="manufacturer.manufacturer_id">
          {{ manufacturer.name }}
        </option>
      </select>

      <table class="receipt-builder">
        <thead><tr><th>Item</th><th>Qty</th><th>Import price</th><th></th></tr></thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td>
              <select v-model="row.item_id">
                <option value="">Select item</option>
                <option v-for="item in items" :key="item.item_id" :value="item.item_id">{{ item.name }}</option>
              </select>
            </td>
            <td><input v-model="row.quantity" type="number" min="1" /></td>
            <td><input v-model="row.import_price" type="number" min="0" /></td>
            <td><button class="ghost-button" @click="removeRow(index)">×</button></td>
          </tr>
        </tbody>
      </table>

      <button class="ghost-button" @click="addRow">+ Add Row</button>
      <p>Total: {{ total.toLocaleString() }} ₫</p>
      <textarea v-model="receipt.notes" placeholder="Notes"></textarea>
      <button class="solid-button" @click="submit">Submit Receipt</button>
    </section>
  </main>
</template>

