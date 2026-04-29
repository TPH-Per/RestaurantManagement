<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from 'vue-i18n'
import { animate, stagger } from 'animejs'

gsap.registerPlugin(ScrollTrigger)
const { t } = useI18n()

const titleChars = ref([])
const subtitleRef = ref(null)
const ruleRef = ref(null)
const bestSellerRefs = ref([])
const heroTitle = computed(() => t('hero.title'))
const heroLetters = computed(() => Array.from(heroTitle.value))
const setTitleChar = (el, index) => {
  if (el) titleChars.value[index] = el
}
const setBestSellerRef = (el, index) => {
  if (el) bestSellerRefs.value[index] = el
}

const dishes = [
  { name: 'Crimson Omakase', note: 'A5 Wagyu · Charcoal Grilled', price: '$98' },
  { name: 'Black Garlic Ramen', note: 'Rich broth · Slow simmer', price: '$24' },
  { name: 'Yaki Skewers', note: 'Smoke kissed · Soy lacquer', price: '$18' },
  { name: 'Sakura Dessert Set', note: 'Matcha · Sweet finale', price: '$20' },
  { name: 'Midnight Tuna Bowl', note: 'Fresh cut · Gold sesame', price: '$26' }
]

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) {
    gsap.from(ruleRef.value, { scaleX: 0, transformOrigin: 'center', duration: 1.2, ease: 'expo.out' })
    animate(titleChars.value, { opacity: [0, 1], y: [30, 0], delay: stagger(40), duration: 900, ease: 'outExpo' })
    gsap.from(subtitleRef.value, { opacity: 0, y: 20, delay: 0.7, duration: 0.8 })
    animate('.hero-actions > *', { opacity: [0, 1], y: [14, 0], delay: stagger(80), duration: 700, ease: 'outExpo' })
  }

  if (!reduced) {
    gsap.from('.bestseller-card', {
      scrollTrigger: {
        trigger: '.bestseller-section',
        start: 'top 80%',
        once: true
      },
      x: 120,
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: {
        each: 0.15,
        from: 'start'
      }
    })
  }

  if (!reduced) {
    bestSellerRefs.value.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.04, y: -6, duration: 0.25, ease: 'power2.out' })
        gsap.to(card.querySelector('.bestseller-card__rule'), { scaleX: 1, duration: 0.25, ease: 'power2.out' })
        gsap.to(card.querySelector('.bestseller-card__thumb'), { filter: 'brightness(1.15)', duration: 0.25 })
        gsap.to(card.querySelector('.bestseller-card__order'), { autoAlpha: 1, y: 0, duration: 0.25 })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, y: 0, duration: 0.25, ease: 'power2.inOut' })
        gsap.to(card.querySelector('.bestseller-card__rule'), { scaleX: 0, duration: 0.25, ease: 'power2.inOut' })
        gsap.to(card.querySelector('.bestseller-card__thumb'), { filter: 'brightness(1)', duration: 0.25 })
        gsap.to(card.querySelector('.bestseller-card__order'), { autoAlpha: 0, y: 8, duration: 0.25 })
      })
    })
  }
})
</script>

<template>
  <main class="client-page">
    <section class="hero-landing">
      <div class="hero-landing__copy">
        <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
        <h2 class="hero-title">
          <span v-for="(letter, index) in heroLetters" :key="letter + index" :ref="(el) => setTitleChar(el, index)">
            {{ letter }}
          </span>
        </h2>
        <p ref="subtitleRef" class="hero-subtitle hero-subtitle--landing">{{ t('hero.subtitle') }}</p>
        <div class="hero-actions">
          <RouterLink to="/menu?intro=1" class="solid-button">{{ t('common.menu') }}</RouterLink>
          <RouterLink to="/reserve" class="ghost-button">{{ t('reserve.title') }}</RouterLink>
        </div>
      </div>

      <div class="hero-landing__panel">
        <div class="hero-rule" ref="ruleRef"></div>
        <div class="story-grid">
          <article>
            <h3>{{ t('hero.panelOneTitle') }}</h3>
            <p>{{ t('hero.panelOneBody') }}</p>
          </article>
          <article>
            <h3>{{ t('hero.panelTwoTitle') }}</h3>
            <p>{{ t('hero.panelTwoBody') }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bestseller-section">
      <div class="section-heading">
        <p class="eyebrow">{{ t('common.bestSellers') }}</p>
        <h3>{{ t('bestSellers.title') }}</h3>
      </div>
      <div class="bestseller-grid">
        <article
          v-for="(dish, index) in dishes"
          :key="dish.name"
          :ref="(el) => setBestSellerRef(el, index)"
          class="bestseller-card"
          :style="{ '--offset-x': `${index * 120}px`, '--offset-y': `${index * 60}px` }"
        >
          <div class="bestseller-card__thumb"></div>
          <p class="bestseller-card__note">{{ dish.note }}</p>
          <h4>{{ dish.name }}</h4>
          <strong>{{ dish.price }}</strong>
          <div class="bestseller-card__rule"></div>
          <button class="ghost-button bestseller-card__order">{{ t('menu.addToOrder') }}</button>
        </article>
      </div>
    </section>

    <section class="reserve-cta">
      <div>
        <p class="eyebrow">{{ t('reserve.eyebrow') }}</p>
        <h3>{{ t('reserve.title') }}</h3>
      </div>
      <RouterLink to="/reserve" class="solid-button">{{ t('reserve.confirmReservation') }}</RouterLink>
    </section>

    <footer class="client-footer">
      <div>
        <p class="eyebrow">{{ t('footer.kicker') }}</p>
        <strong>Per's Food</strong>
      </div>
      <div class="footer-links">
        <RouterLink to="/menu">{{ t('common.menu') }}</RouterLink>
        <RouterLink to="/reserve">{{ t('reserve.eyebrow') }}</RouterLink>
        <RouterLink to="/staff/login">Staff</RouterLink>
      </div>
    </footer>
  </main>
</template>

