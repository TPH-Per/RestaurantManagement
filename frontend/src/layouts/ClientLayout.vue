<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Lenis from 'lenis'
import { useClientAuthStore } from '../stores/clientAuth'
import { useLanguageStore } from '../stores/useLanguageStore'
import { toast } from '../services/toast'

const router = useRouter()
const auth = useClientAuthStore()
const languageStore = useLanguageStore()
const { t } = useI18n()
const cursor = ref(null)
const ring = ref(null)
const scrolled = ref(false)
const mobileOpen = ref(false)
let lenis
let moveHandler

const baseLinks = computed(() => [
  { label: t('common.home'), to: '/' },
  { label: t('common.menu'), to: '/menu?intro=1' },
  { label: t('common.order'), to: '/reserve' }
])

const loggedInLinks = computed(() => [
  { label: 'My Reservations', to: '/my-reservations' },
  { label: 'My Invoices', to: '/my-invoices' },
  { label: 'Profile', to: '/profile' }
])

const navLinks = computed(() => [
  ...baseLinks.value,
  ...(auth.isLoggedIn ? loggedInLinks.value : []),
  ...(!auth.isLoggedIn ? [{ label: t('auth.signIn'), to: '/login' }] : [])
])

const logout = () => {
  auth.logout()
  toast.success('Signed out.')
  router.push('/')
  mobileOpen.value = false
}

const onScroll = () => {
  scrolled.value = window.scrollY > 80
}

onMounted(() => {
  lenis = new Lenis({ smoothWheel: true, lerp: 0.08 })
  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  moveHandler = (event) => {
    const x = event.clientX
    const y = event.clientY
    if (cursor.value && ring.value) {
      cursor.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }
  window.addEventListener('pointermove', moveHandler)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  if (moveHandler) window.removeEventListener('pointermove', moveHandler)
  window.removeEventListener('scroll', onScroll)
  lenis?.destroy()
})
</script>

<template>
  <div class="app-shell app-shell--client">
    <div ref="cursor" class="app-cursor"></div>
    <div ref="ring" class="app-cursor app-cursor--ring"></div>

    <header class="site-header site-header--client" :class="{ scrolled }">
      <div class="brand-block">
        <div class="brand-mark">IY</div>
        <div>
          <p class="brand-kicker">{{ t('hero.eyebrow') }}</p>
          <h1>Iyakaza</h1>
        </div>
      </div>

      <nav class="site-nav site-nav--desktop">
        <RouterLink v-for="link in navLinks" :key="link.label" :to="link.to">
          {{ link.label }}
        </RouterLink>
        <button v-if="auth.isLoggedIn" type="button" class="ghost-button" @click="logout">{{ t('auth.signOut') }}</button>
      </nav>

      <div class="lang-switcher">
        <button
          v-for="lang in languageStore.availableLanguages"
          type="button"
          :key="lang.code"
          :class="{ active: languageStore.locale === lang.code }"
          @click="languageStore.setLanguage(lang.code)"
        >
          {{ lang.flag }} {{ lang.name }}
        </button>
      </div>

      <button type="button" class="ghost-button mobile-menu-button" @click="mobileOpen = !mobileOpen">
        {{ mobileOpen ? t('auth.close') : t('common.menu') }}
      </button>
    </header>

    <div v-if="mobileOpen" class="mobile-nav-overlay" @click.self="mobileOpen = false">
      <nav class="mobile-nav-panel">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          type="button"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
        <button v-if="auth.isLoggedIn" type="button" class="solid-button" @click="logout">{{ t('auth.signOut') }}</button>
        <div class="lang-switcher lang-switcher--mobile">
          <button
            v-for="lang in languageStore.availableLanguages"
            type="button"
            :key="lang.code"
            :class="{ active: languageStore.locale === lang.code }"
            @click="languageStore.setLanguage(lang.code)"
          >
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
      </nav>
    </div>

    <RouterView v-slot="{ Component, route }">
      <transition name="page-slice" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </RouterView>
  </div>
</template>

