<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { toast } from '../../services/toast'
// Mock data removed

const route = useRoute()
const router = useRouter()
const query = ref('')
const rows = ref([])
const fbRows = ref([])

const pageKey = computed(() => route.meta.pageKey)
const config = computed(() => ({})[pageKey.value] || { columns: [], source: '' })
const meta = computed(() => ({})[pageKey.value] || { title: 'Workspace', description: '' })

const load = async () => {
  const source = config.value.source
  if (!source) return
  rows.value = await api[source].list()
  fbRows.value = await useFb().list()
}

const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? rows.value.filter((row) => JSON.stringify(row).toLowerCase().includes(q)) : rows.value
})

const displayRows = computed(() =>
  filteredRows.value.map((row) => ({
    raw: row,
    cells: formatRow(row)
  }))
)

const formatRow = (row) => {
  switch (pageKey.value) {
    case 'staff-tables':
      return [row.table_number, row.capacity, row.location, row.status]
    case 'staff-orders':
      return [row.order_id, row.table_id, row.status, row.subtotal?.toLocaleString?.() || row.subtotal]
    case 'staff-menu':
      return [row.image_url ? 'Image' : '—', row.name, row.category_id, row.item_type, row.price?.toLocaleString?.() || row.price, row.stock_status, row.show_on_menu ? 'Visible' : 'Hidden']
    case 'staff-reservations':
      return [row.reservation_id, row.customer_name, row.phone, row.table_id, row.reserved_at.slice(0, 10), row.guest_count, row.status]
    case 'staff-invoices':
      return [row.invoice_code, row.order_id, row.table_id, row.subtotal, row.discount_amount, row.total_amount, row.status, row.payment_method]
    case 'staff-warehouse':
      return [row.name, row.item_type, row.current_stock, row.current_stock <= 5 ? 'LOW_STOCK' : 'NORMAL', row.last_updated || '-']
    case 'staff-receipts':
      return [row.receipt_id, row.manufacturer_id, row.receipt_date, row.total_amount, row.created_by]
    case 'staff-discounts':
      return [row.code, row.discount_type, row.discount_value, row.min_order_amount, row.max_discount_amount || '-', `${row.used_count}/${row.usage_limit}`, row.is_active ? 'Yes' : 'No']
    case 'staff-customers':
      return [row.customer_id, row.full_name, row.phone, row.gender, row.address, row.membership_level, row.loyalty_points]
    case 'staff-staff-management':
      return [row.full_name, row.email, row.phone, row.role, row.department, row.hire_date, row.is_active ? 'Yes' : 'No']
    case 'staff-reviews':
      return [row.invoice_id, row.customer_id, `${row.rating}★`, row.content.slice(0, 80), row.date.slice(0, 10), row.replied ? 'Yes' : 'No']
    case 'staff-categories':
      return [row.name, row.type, row.min_price, row.max_price, fbRows.value.filter((item) => item.category_id === row.category_id).length]
    case 'staff-manufacturers':
      return [row.name, row.address, row.phone, row.is_inhouse ? 'Yes' : 'No', fbRows.value.filter((item) => item.manufacturer_id === row.manufacturer_id).length]
    default:
      return []
  }
}

const actionLabel = (row) => {
  if (pageKey.value === 'staff-orders') return 'View'
  if (pageKey.value === 'staff-invoices') return 'View'
  if (pageKey.value === 'staff-receipts') return 'View'
  if (pageKey.value === 'staff-tables') return row.status === 'AVAILABLE' ? 'Occupy' : 'Release'
  if (pageKey.value === 'staff-discounts') return row.is_active ? 'Deactivate' : 'Activate'
  if (pageKey.value === 'staff-staff-management') return 'Deactivate'
  if (pageKey.value === 'staff-categories') return 'Delete'
  if (pageKey.value === 'staff-manufacturers') return 'Delete'
  if (pageKey.value === 'staff-reservations') return row.status === 'CONFIRMED' ? 'Start Serving' : (row.status === 'SERVING' ? 'Complete' : '—')
  return 'Action'
}

const runAction = async (row) => {
  try {
    switch (pageKey.value) {
      case 'staff-orders':
        return router.push(`/staff/orders/${row.order_id}`)
      case 'staff-invoices':
        return router.push(`/staff/invoices/${row.invoice_id}`)
      case 'staff-receipts':
        return toast.info(`Receipt #${row.receipt_id}`)
      case 'staff-tables':
        await useTable().setStatus(row.table_id, row.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE')
        break
      case 'staff-discounts':
        await useDiscounts().update(row.discount_code_id, { is_active: !row.is_active })
        break
      case 'staff-staff-management':
        await useStaff().deactivate(row.staff_id)
        break
      case 'staff-categories':
        await useCategory().delete(row.category_id)
        break
      case 'staff-manufacturers':
        await useManufacturers().delete(row.manufacturer_id)
        break
      case 'staff-reservations':
        if (row.status === 'CONFIRMED') await useReservation().setStatus(row.reservation_id, 'SERVING')
        else if (row.status === 'SERVING') await useReservation().setStatus(row.reservation_id, 'COMPLETED')
        break
      default:
        toast.info('Action not implemented yet.')
    }
    toast.success('Action successful')
    await load()
  } catch (error) {
    toast.error(error.message || 'Something went wrong. Please try again.')
  }
}

onMounted(load)
watch(pageKey, load)
</script>

<template>
  <main class="staff-page">
    <section class="workspace-head">
      <div>
        <p class="eyebrow">{{ meta.title }}</p>
        <h2>{{ meta.description }}</h2>
      </div>
      <input v-model="query" class="workspace-search" placeholder="Search..." />
    </section>

    <section class="staff-panel">
      <table>
        <thead>
          <tr>
            <th v-for="column in config.columns" :key="column">{{ column }}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in displayRows" :key="row.raw.category_id || row.raw.manufacturer_id || row.raw.table_id || row.raw.order_id || row.raw.reservation_id || row.raw.invoice_id || row.raw.receipt_id || row.raw.staff_id || row.raw.review_id || row.raw.customer_id || row.raw.discount_code_id">
            <td v-for="(cell, index) in row.cells" :key="index">{{ cell }}</td>
            <td><button class="ghost-button" @click="runAction(row.raw)">{{ actionLabel(row.raw) }}</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

