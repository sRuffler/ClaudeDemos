<template>
  <div id="app-shell">
    <template v-if="authStore.isAuthenticated">
      <AppHeader />
      <AppTabBar />
      <main class="main-content">
        <RouterView />
      </main>
    </template>
    <template v-else-if="!authReady">
      <!-- Splash while restoring session -->
      <div class="app-loading">
        <ProgressSpinner />
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import AppHeader from './components/layout/AppHeader.vue'
import AppTabBar from './components/layout/AppTabBar.vue'
import { useAuthStore } from './stores/auth.js'

const authStore = useAuthStore()
const authReady = ref(false)

onMounted(async () => {
  await authStore.initAuth()
  authReady.value = true
})
</script>

<style scoped>
#app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: var(--p-surface-ground);
}

.app-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
