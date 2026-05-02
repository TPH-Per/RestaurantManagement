import { categoryService } from '@/services/category.service';
import { menuService } from '@/services/menu.service';
import { orderService } from '@/services/order.service';
import { reservationService } from '@/services/reservation.service';
import { invoiceService } from '@/services/invoice.service';
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
const getRecommendedTableCapacity = (guests: number) => guests <= 2 ? 2 : guests <= 4 ? 4 : guests <= 6 ? 6 : guests <= 8 ? 8 : 10;
const getTableCapacityLabel = (cap: number) => cap === 2 ? 'Small' : cap === 4 ? 'Medium' : cap === 6 ? 'Large' : 'Extra Large';
const isTableAllowedForGuests = (guests: number, capacity: number) => guests <= capacity && guests > capacity - 2;
import { toast } from '../../services/toast'
import { useClientAuthStore } from '../../stores/clientAuth'
import { useReservationStore } from '../../stores/reservation'
import { useTable } from '../../composables/useTable'

const router = useRouter()
const auth = useClientAuthStore()
const reservationStore = useReservationStore()
const form = ref({
  full_name: auth.customer?.full_name || '',
  phone: auth.customer?.phone || '',
  date: '',
  time: '19:00',
  guests: 2,
  table_id: '',
  notes: ''
})
const tables = ref([])
const submitted = ref(false)
const loading = ref(false)
const count = computed(() => form.value.notes.length)
const guestCount = computed(() => Number(form.value.guests) || 0)
const recommendedCapacity = computed(() => getRecommendedTableCapacity(guestCount.value))
const eligibleTables = computed(() =>
  tables.value.filter((table) => table.status === 'AVAILABLE' && table.capacity === recommendedCapacity.value)
)

const syncTableSelection = () => {
  if (form.value.table_id && eligibleTables.value.some((table) => table.table_id === Number(form.value.table_id))) {
    return
  }
  form.value.table_id = eligibleTables.value[0]?.table_id || ''
}

const loadTables = async () => {
  tables.value = await useTable().list()
  syncTableSelection()
}

watch(recommendedCapacity, syncTableSelection)
watch(eligibleTables, syncTableSelection, { deep: true })

const submit = async () => {
  loading.value = true
  try {
    if (!form.value.table_id) {
      throw new Error('Please choose a table that matches your party size.')
    }

    const selectedTable = tables.value.find((table) => table.table_id === Number(form.value.table_id))
    if (!selectedTable || !isTableAllowedForGuests(guestCount.value, selectedTable.capacity)) {
      throw new Error('Please choose a table that matches your party size.')
    }

    await useReservation().create({
      customer_id: auth.customerId,
      customer_name: form.value.full_name,
      phone: form.value.phone,
      table_id: Number(form.value.table_id),
      reserved_at: `${form.value.date}T${form.value.time}:00Z`,
      guest_count: form.value.guests,
      notes: form.value.notes
    })
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo('.reserve-success', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
    }
    submitted.value = true
    toast.success("Your table awaits. We'll contact you shortly.")
    await reservationStore.fetchMyReservations()
    const mine = reservationStore.reservations.at(-1)
    if (mine) reservationStore.setActiveReservation(mine.reservation_id)
    router.push('/my-reservations')
  } catch (error) {
    const message =
      error?.message === 'TABLE_NOT_FOUND' ||
      error?.message === 'TABLE_UNAVAILABLE' ||
      error?.message === 'TABLE_CAPACITY_MISMATCH' ||
      error?.message === 'INVALID_GUEST_COUNT'
        ? 'Please choose a table that matches your party size.'
        : error?.message || 'Unable to create reservation.'
    toast.error(message)
  } finally {
    loading.value = false
  }
}

onMounted(loadTables)
</script>

<template>
  <main class="client-page reserve-page">
    <section class="reserve-visual"></section>
    <section class="reserve-form-wrap">
      <form v-if="!submitted" class="reserve-form" @submit.prevent="submit">
        <p class="eyebrow">{{ $t('reserve.eyebrow') }}</p>
        <h2>{{ $t('reserve.title') }}</h2>
        <label class="floating">
          <span>{{ $t('reserve.fullName') }}</span>
          <input v-model="form.full_name" required />
        </label>
        <label class="floating">
          <span>{{ $t('reserve.phoneNumber') }}</span>
          <input v-model="form.phone" required />
        </label>
        <label class="floating">
          <span>{{ $t('reserve.date') }}</span>
          <input v-model="form.date" type="date" required />
        </label>
        <label class="floating">
          <span>{{ $t('reserve.time') }}</span>
          <input v-model="form.time" type="time" required />
        </label>
        <label class="floating">
          <span>{{ $t('reserve.guests') }}</span>
          <input v-model.number="form.guests" type="number" min="1" max="20" required />
          <small>{{ $t('reserve.tableSizeMatch', { count: recommendedCapacity, label: getTableCapacityLabel(recommendedCapacity) }) }}</small>
        </label>
        <label class="floating">
          <span>{{ $t('reserve.table') }}</span>
          <select v-model="form.table_id" required :disabled="!eligibleTables.length">
            <option value="" disabled>
              {{ eligibleTables.length ? $t('reserve.chooseTable') : $t('reserve.noTableAvailable') }}
            </option>
            <option v-for="table in eligibleTables" :key="table.table_id" :value="table.table_id">
              {{ table.table_number }} · {{ table.capacity }} {{ $t('reserve.seats') }} · {{ table.location }}
            </option>
          </select>
          <small v-if="eligibleTables.length">{{ $t('reserve.tablesAvailableCount', { count: eligibleTables.length }) }}</small>
          <small v-else>{{ $t('reserve.noTableCapacity') }}</small>
        </label>
        <label class="floating">
          <span>{{ $t('reserve.notes') }}</span>
          <textarea v-model="form.notes" maxlength="200" rows="4"></textarea>
          <small>{{ count }}/200</small>
        </label>
        <button class="solid-button" :disabled="loading || !form.table_id || !eligibleTables.length">
          {{ loading ? $t('reserve.sending') : $t('reserve.confirmReservation') }}
        </button>
      </form>

      <div v-else class="reserve-success">
        <p class="eyebrow">{{ $t('reserve.confirmed') }}</p>
        <h2>{{ $t('reserve.yourTableAwaits') }}</h2>
        <p>{{ $t('reserve.contactSoon') }}</p>
        <RouterLink to="/menu" class="ghost-button">{{ $t('reserve.backToMenu') }}</RouterLink>
      </div>
    </section>
  </main>
</template>

