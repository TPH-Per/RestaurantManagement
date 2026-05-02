<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tableService }        from '@/services/table.service'
import { orderService }        from '@/services/order.service'
import { menuService }         from '@/services/menu.service'
import { reservationService }  from '@/services/reservation.service'
import { invoiceService }      from '@/services/invoice.service'
import { warehouseService }    from '@/services/warehouse.service'
import { receiptService }      from '@/services/receipt.service'
import { discountService }     from '@/services/discount.service'
import { customerService }     from '@/services/customer.service'
import { staffService }        from '@/services/staff.service'
import { reviewService }       from '@/services/review.service'
import { categoryService }     from '@/services/category.service'
import { manufacturerService } from '@/services/manufacturer.service'
import { useNotificationStore } from '@/stores/notification.store'

const route  = useRoute()
const router = useRouter()
const notify = useNotificationStore()
const rows   = ref<any[]>([])
const query  = ref('')

const pageKey = computed(() => route.meta.pageKey as string)

// Map pageKey -> service call
const loadMap: Record<string, () => Promise<any[]>> = {
  'staff-tables':           () => tableService.getAll(),
  'staff-orders':           () => orderService.getAll(),
  'staff-menu':             () => menuService.getFBMenu(true),
  'staff-reservations':     () => reservationService.getAll(),
  'staff-invoices':         () => invoiceService.getAll(),
  'staff-warehouse':        () => warehouseService.getReport(),
  'staff-receipts':         () => receiptService.getAll(),
  'staff-discounts':        () => discountService.getAll(),
  'staff-customers':        () => customerService.getAll(),
  'staff-staff-management': () => staffService.getAll(),
  'staff-reviews':          () => reviewService.getAll(),
  'staff-categories':       () => categoryService.getAll(),
  'staff-manufacturers':    () => manufacturerService.getAll(),
}

const load = async () => {
  const loader = loadMap[pageKey.value]
  if (!loader) return
  try { rows.value = await loader() }
  catch (err: any) { notify.error(err.message ?? 'Failed to load data') }
}

// Map pageKey -> action call
const runAction = async (row: any) => {
  try {
    switch (pageKey.value) {
      case 'staff-orders':       return router.push('/staff/orders/' + row.orderId)
      case 'staff-invoices':     return router.push('/staff/invoices/' + row.invoiceId)
      case 'staff-tables':
        await tableService.updateStatus(row.tableId,
          row.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE')
        break
      case 'staff-discounts':
        await discountService.toggle(row.discountCodeId)
        break
      case 'staff-staff-management':
        await staffService.toggle(row.staffId)
        break
      case 'staff-categories':
        await categoryService.delete(row.categoryId)
        break
      case 'staff-reservations':
        if (row.status === 'PENDING')    await reservationService.confirm(row.reservationId)
        else if (row.status === 'CONFIRMED') await reservationService.complete(row.reservationId)
        break
      default:
        notify.info('Action not implemented for this workspace.')
        return
    }
    notify.success('Action successful')
    await load()
  } catch (err: any) {
    notify.error(err.message ?? 'Action failed')
  }
}

const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? rows.value.filter(r => JSON.stringify(r).toLowerCase().includes(q)) : rows.value
})

onMounted(load)
watch(pageKey, load)
</script>
<template>
  <div class="staff-workspace">
    <h2>Workspace</h2>
    <div v-for="row in filteredRows" :key="row.id">
      <pre>{{ row }}</pre>
      <button @click="runAction(row)">Action</button>
    </div>
  </div>
</template>