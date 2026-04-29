<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from 'vue-i18n'
import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'
import { toast } from '../../services/toast'
import { useClientAuthStore } from '../../stores/clientAuth'
import { useReservationStore } from '../../stores/reservation'
import { useSafeGsap } from '../../composables/useGsap'

gsap.registerPlugin(ScrollTrigger)
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const auth = useClientAuthStore()
const reservations = useReservationStore()
const { animate, from, fromTo } = useSafeGsap()

const categories = ref([])
const items = ref([])
const activeIndex = ref(0)
const drawerItem = ref(null)
const introVisible = ref(false)
const menuVisible = ref(false)
const turning = ref(false)
const bookRoot = ref(null)
const pageRight = ref(null)
const pageLeft = ref(null)
const bookCover = ref(null)
const bookOverlay = ref(null)
const orderId = ref(null)

const activeCategory = computed(() => categories.value[activeIndex.value] || null)
const activeItems = computed(() => items.value.filter((item) => item.category_id === activeCategory.value?.category_id))

const load = async () => {
  categories.value = await useCategory().list()
  items.value = await useFb().list({ type: 'All' })
}

const showIntro = async () => {
  introVisible.value = true
  await nextTick()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    introVisible.value = false
    menuVisible.value = true
    return
  }

  const tl = gsap.timeline({
    onComplete: () => {
      introVisible.value = false
      menuVisible.value = true
    }
  })
  tl.to(bookOverlay.value, { opacity: 0.85, duration: 0.3, ease: 'power2.out' })
    .fromTo(bookRoot.value, { y: '-100vh', rotation: -5, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.9, ease: 'bounce.out' }, '<')
    .to(bookRoot.value, { x: [-4, 4, -3, 3, 0], duration: 0.3, ease: 'power2.out' })
    .to(bookCover.value, { rotateY: -180, duration: 0.8, ease: 'power2.inOut', transformOrigin: 'left center', transformPerspective: 1200 })
}

const openDrawer = (item) => {
  drawerItem.value = item
  animate('.menu-drawer__panel', { x: [30, 0], opacity: [0, 1], duration: 240 })
}

const closeDrawer = () => {
  drawerItem.value = null
}

const ensureReservationOrder = async () => {
  if (!auth.isLoggedIn) {
    toast.error('Please sign in first.')
    router.push({ name: 'ClientLogin', state: { redirectAfterLogin: '/menu?intro=1' } })
    return null
  }

  if (!reservations.activeReservation) {
    toast.error('Please select a valid reservation to order from')
    router.push('/my-reservations')
    return null
  }

  if (!orderId.value) {
    const reservation = await useReservation().get(reservations.activeReservation)
    if (!reservation || reservation.status !== 'SERVING') {
      toast.error('You must have an active SERVING reservation to place orders.')
      router.push('/my-reservations')
      return null
    }
    const order = await useOrder().create({
      table_id: reservation.table_id,
      reservation_id: reservation.reservation_id,
      notes: 'Client menu order'
    })
    orderId.value = order.order_id
  }

  return orderId.value
}

const addToOrder = async (item) => {
  const order = await ensureReservationOrder()
  if (!order) return
  try {
    await useOrderItem().add(order, { item_id: item.item_id, quantity: 1, notes: '' })
    toast.success('Added to order.')
    drawerItem.value = null
  } catch (error) {
    toast.error(error.message || 'Unable to add item.')
  }
}

const flipCategory = async (direction) => {
  if (!categories.value.length || turning.value) return
  const next = direction === 'next'
    ? (activeIndex.value + 1) % categories.value.length
    : (activeIndex.value - 1 + categories.value.length) % categories.value.length

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    activeIndex.value = next
    return
  }

  turning.value = true
  const exitRotation = direction === 'next' ? -180 : 180
  const enterRotation = direction === 'next' ? 180 : -180

  gsap.to(pageRight.value, {
    rotateY: exitRotation,
    duration: 0.42,
    ease: 'power2.inOut',
    transformOrigin: 'left center',
    transformPerspective: 1400,
    onComplete: () => {
      activeIndex.value = next
      gsap.fromTo(
        pageRight.value,
        { rotateY: enterRotation },
        {
          rotateY: 0,
          duration: 0.42,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          transformPerspective: 1400,
          onComplete: () => {
            turning.value = false
          }
        }
      )
    }
  })
}

onMounted(async () => {
  await load()
  if (route.query.intro === '1') {
    await showIntro()
  } else {
    menuVisible.value = true
  }
  await nextTick()
  from('.menu-spread__page', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.08
  })
})
</script>

<template>
  <main class="client-page menu-book-page">
      <div v-if="introVisible" class="menu-book-overlay" ref="bookOverlay">
        <div class="menu-book" ref="bookRoot">
          <div class="book-cover" ref="bookCover">
          <div class="book-cover__title">{{ t('menu.coverTitle') }}</div>
          </div>
        </div>
      </div>

      <section v-if="menuVisible" class="menu-book-shell">
        <aside class="book-spine">
        <p class="eyebrow">{{ t('menu.categories') }}</p>
        <button
          v-for="(category, index) in categories"
          :key="category.category_id"
          class="spine-tab"
          :class="{ active: activeIndex === index }"
          @click="activeIndex = index"
        >
          {{ category.name }}
        </button>
      </aside>

        <section class="menu-spread">
          <article class="menu-spread__page menu-spread__page--left">
          <p class="eyebrow">{{ t('menu.pageTitle') }}</p>
          <h2>{{ activeCategory?.name }}</h2>
          <p>{{ activeCategory?.type }}</p>
          <p>{{ activeItems.length }} {{ t('menu.dishesInCategory') }}</p>
          <button class="ghost-button" @click="flipCategory('prev')">{{ t('menu.previousCategory') }}</button>
          </article>

        <article class="menu-spread__page menu-spread__page--right" ref="pageRight" :class="{ turning }">
          <div class="menu-spread__items">
            <div
              v-for="item in activeItems"
              :key="item.item_id"
              class="menu-item-row"
              @click="openDrawer(item)"
            >
              <div>
                <strong>{{ item.name }}</strong>
                <p>{{ item.item_type }} · {{ item.stock_status }}</p>
              </div>
              <div class="menu-item-row__right">
                <span>{{ item.price.toLocaleString() }} ₫</span>
                <button class="ghost-button" @click.stop="addToOrder(item)">{{ t('menu.addToOrder') }}</button>
              </div>
            </div>
          </div>
          <div class="menu-spread__footer">
            <span>{{ activeIndex + 1 }} / {{ categories.length }}</span>
            <button class="ghost-button" @click="flipCategory('next')">{{ t('menu.nextCategory') }}</button>
          </div>
        </article>
      </section>
    </section>

    <aside v-if="drawerItem" class="menu-drawer">
        <div class="menu-drawer__panel">
          <button class="drawer__close" @click="closeDrawer">×</button>
          <p class="eyebrow">{{ drawerItem.item_type }}</p>
          <h3>{{ drawerItem.name }}</h3>
          <p>{{ drawerItem.unit }} · {{ drawerItem.price.toLocaleString() }} ₫</p>
          <button class="solid-button" @click="addToOrder(drawerItem)">{{ t('menu.addToOrder') }}</button>
        </div>
      </aside>
    </main>
  </template>

