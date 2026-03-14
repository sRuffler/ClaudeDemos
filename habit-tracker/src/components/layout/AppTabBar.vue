<template>
  <TabMenu :model="items" class="app-tabmenu" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import TabMenu from 'primevue/tabmenu'

const router = useRouter()

const items = [
  {
    label: 'Today',
    icon: 'pi pi-check-square',
    command: () => router.push({ name: 'today' }),
  },
  {
    label: 'Upcoming',
    icon: 'pi pi-calendar',
    command: () => router.push({ name: 'upcoming' }),
  },
  {
    label: 'Manage',
    icon: 'pi pi-list',
    command: () => router.push({ name: 'manage' }),
  },
]
</script>

<style scoped>
.app-tabmenu :deep(.p-tabmenu-tablist) {
  flex-wrap: nowrap;
}

.app-tabmenu :deep(.p-tabmenu-item-label) {
  white-space: nowrap;
}
</style>
