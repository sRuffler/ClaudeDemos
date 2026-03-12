<template>
  <TabMenu :model="items" class="app-tabmenu" />
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import TabMenu from 'primevue/tabmenu'

const router = useRouter()
const route = useRoute()

const items = [
  {
    label: 'Today',
    icon: 'pi pi-check-square',
    command: () => router.push({ name: 'today' }),
  },
  {
    label: 'Manage Habits',
    icon: 'pi pi-list',
    command: () => router.push({ name: 'manage' }),
  },
]
</script>

<style scoped>
.app-tabmenu {
  border-bottom: 1px solid var(--p-content-border-color);
}
</style>
