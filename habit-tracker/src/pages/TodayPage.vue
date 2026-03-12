<template>
  <div class="today-page">
    <div class="today-header">
      <h2>Today</h2>
      <span class="today-date">{{ formattedDate }}</span>
    </div>

    <ProgressBar v-if="habitsStore.loading || logsStore.loading" mode="indeterminate" style="height: 3px; margin-bottom: 1rem;" />

    <div v-if="!habitsStore.loading && habitsForToday.length === 0" class="empty-state">
      <i class="pi pi-sun" style="font-size: 2.5rem; color: var(--p-text-muted-color)" />
      <p>No habits scheduled for today.</p>
      <Button label="Manage Habits" severity="secondary" outlined @click="$router.push({ name: 'manage' })" />
    </div>

    <div v-else class="habit-list">
      <div class="progress-summary" v-if="habitsForToday.length > 0">
        <ProgressBar :value="completionPercent" :showValue="false" style="height: 8px" />
        <span class="progress-label">{{ completedCount }} / {{ habitsForToday.length }} completed</span>
      </div>

      <HabitCheckItem
        v-for="habit in habitsForToday"
        :key="habit.id"
        :habit="habit"
        :completed="logsStore.isCompleted(habit.id)"
        :streak="logsStore.streakFor(habit.id)"
        @toggle="handleToggle"
      />
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useHabitsStore } from '../stores/habits.js'
import { useLogsStore } from '../stores/logs.js'
import HabitCheckItem from '../components/today/HabitCheckItem.vue'

const habitsStore = useHabitsStore()
const logsStore = useLogsStore()
const toast = useToast()

const habitsForToday = computed(() => habitsStore.habitsForToday)

const completedCount = computed(
  () => habitsForToday.value.filter((h) => logsStore.isCompleted(h.id)).length
)

const completionPercent = computed(() =>
  habitsForToday.value.length
    ? Math.round((completedCount.value / habitsForToday.value.length) * 100)
    : 0
)

const formattedDate = computed(() => {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(async () => {
  await Promise.all([habitsStore.fetchHabits(), logsStore.fetchTodaysLogs()])
})

async function handleToggle(habitId) {
  try {
    await logsStore.toggleLog(habitId)
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 4000 })
  }
}
</script>

<style scoped>
.today-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.today-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.today-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.today-date {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.progress-summary {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.progress-label {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
  text-align: right;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--p-text-muted-color);
  text-align: center;
}
</style>
