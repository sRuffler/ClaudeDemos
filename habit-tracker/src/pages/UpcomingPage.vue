<template>
  <div class="upcoming-page">
    <h2>Upcoming — Next 7 Days</h2>

    <ProgressBar v-if="habitsStore.loading" mode="indeterminate" style="height: 3px" />

    <div class="days-list">
      <div v-for="day in upcomingDays" :key="day.dateStr" class="day-card">
        <div class="day-header">
          <span class="day-label">{{ day.label }}</span>
          <span class="day-date">{{ day.dateStr }}</span>
          <Tag
            v-if="day.habits.length > 0"
            :value="`${day.habits.length} habit${day.habits.length !== 1 ? 's' : ''}`"
            severity="secondary"
            class="habit-count"
          />
        </div>

        <div v-if="day.habits.length === 0" class="no-habits">
          <i class="pi pi-moon" /> No habits scheduled
        </div>

        <ul v-else class="habit-list">
          <li v-for="habit in day.habits" :key="habit.id" class="habit-item">
            <span class="habit-name">{{ habit.name }}</span>
            <span v-if="habit.description" class="habit-desc">{{ habit.description }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import { useHabitsStore } from '../stores/habits.js'
import { useToday } from '../composables/useToday.js'

const habitsStore = useHabitsStore()
const { getTodayString } = useToday()

onMounted(() => {
  if (habitsStore.habits.length === 0) habitsStore.fetchHabits()
})

const upcomingDays = computed(() => {
  const days = []
  const today = new Date(getTodayString() + 'T00:00:00')

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const dateStr = date.toLocaleDateString('en-CA') // YYYY-MM-DD in local time
    const habits = habitsStore.habitsForDate(dateStr)

    let label
    if (i === 1) {
      label = 'Tomorrow'
    } else {
      label = date.toLocaleDateString('en-US', { weekday: 'long' })
    }

    const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    days.push({ dateStr: shortDate, label, habits })
  }

  return days
})
</script>

<style scoped>
.upcoming-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.upcoming-page h2 {
  margin: 0 0 1.25rem;
  font-size: 1.5rem;
}

.days-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.day-card {
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius);
  background: var(--p-surface-card);
  overflow: hidden;
}

.day-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--p-surface-ground);
  border-bottom: 1px solid var(--p-content-border-color);
}

.day-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.day-date {
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
  flex: 1;
}

.habit-count {
  flex-shrink: 0;
}

.no-habits {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.habit-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.habit-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem 1rem;
}

.habit-item + .habit-item {
  border-top: 1px solid var(--p-content-border-color);
}

.habit-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.habit-desc {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}
</style>
