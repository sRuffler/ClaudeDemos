<template>
  <div class="app-header">
    <span class="app-title">Habit Tracker</span>

    <Avatar
      :label="avatarLabel"
      shape="circle"
      class="user-avatar"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="user-menu"
    />

    <Popover ref="popover" id="user-menu">
      <div class="user-menu">
        <div class="user-email">{{ authStore.user?.email }}</div>
        <Divider />
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          severity="secondary"
          text
          fluid
          @click="handleLogout"
        />
      </div>
    </Popover>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from 'primevue/avatar'
import Popover from 'primevue/popover'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()
const popover = ref()

const avatarLabel = computed(() => {
  const email = authStore.user?.email ?? ''
  return email.charAt(0).toUpperCase()
})

function toggle(event) {
  popover.value.toggle(event)
}

async function handleLogout() {
  popover.value.hide()
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

.user-avatar {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.25);
  color: var(--p-primary-contrast-color);
  font-weight: 600;
  transition: background 0.2s;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.35);
}

.user-menu {
  min-width: 200px;
  padding: 0.25rem 0;
}

.user-email {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
  word-break: break-all;
}
</style>
