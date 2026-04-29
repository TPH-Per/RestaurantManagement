<script setup lang="ts">
import { useClientAuthStore } from '../../stores/clientAuth'
const auth = useClientAuthStore()
</script>

<template>
  <main class="client-page profile-page">
    <section class="profile-card">
      <p class="eyebrow">Profile</p>
      <h2>{{ auth.customer?.full_name }}</h2>
      <p>Phone: {{ auth.customer?.phone }}</p>
      <p>Membership: {{ auth.customer?.membership_level }}</p>
      <p>Points: {{ auth.customer?.loyalty_points }}</p>
    </section>
  </main>
</template>

