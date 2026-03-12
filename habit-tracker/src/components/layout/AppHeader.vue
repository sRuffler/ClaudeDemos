<template>
  <div class="app-header">
    <span class="app-title">Habit Tracker</span>
    <div class="header-right">
      <span class="user-email">{{ authStore.user?.email }}</span>
      <Button label="Logout" severity="secondary" size="small" @click="handleLogout" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.signOut()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-email {
  font-size: 0.875rem;
  opacity: 0.85;
}
</style>
