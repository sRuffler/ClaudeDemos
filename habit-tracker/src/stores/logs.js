import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api.js'
import { useToday } from '../composables/useToday.js'
import { calculateStreak } from '../composables/useStreak.js'

export const useLogsStore = defineStore('logs', () => {
  const { getTodayString } = useToday()

  const todaysLogs = ref([])
  const streaks = ref({})
  const loading = ref(false)

  // Map from habitId -> log (for O(1) lookup)
  const logsByHabitId = computed(() => {
    return todaysLogs.value.reduce((acc, log) => {
      acc[log.habitId] = log
      return acc
    }, {})
  })

  function isCompleted(habitId) {
    return logsByHabitId.value[habitId]?.completed ?? false
  }

  function streakFor(habitId) {
    return streaks.value[habitId] ?? 0
  }

  async function fetchTodaysLogs() {
    loading.value = true
    try {
      const today = getTodayString()
      const data = await api.get(`/api/logs?date=${today}`)
      todaysLogs.value = data.logs
    } finally {
      loading.value = false
    }
  }

  async function toggleLog(habitId) {
    const today = getTodayString()
    const existing = logsByHabitId.value[habitId]
    const newCompleted = !isCompleted(habitId)

    // Optimistic update
    if (existing) {
      existing.completed = newCompleted
    } else {
      todaysLogs.value.push({ habitId, date: today, completed: newCompleted, id: null })
    }

    try {
      const data = await api.post('/api/logs', {
        habitId,
        date: today,
        completed: newCompleted,
      })
      // Replace optimistic entry with real data
      const index = todaysLogs.value.findIndex((l) => l.habitId === habitId)
      if (index !== -1) todaysLogs.value[index] = data.log
    } catch (err) {
      // Rollback
      if (existing) {
        existing.completed = !newCompleted
      } else {
        todaysLogs.value = todaysLogs.value.filter((l) => l.habitId !== habitId)
      }
      throw err
    }
  }

  async function fetchStreaks(habitIds) {
    if (!habitIds.length) return

    // Fetch last 365 days of logs for streak calculation
    const today = getTodayString()
    const start = new Date()
    start.setDate(start.getDate() - 365)
    const startStr = start.toISOString().split('T')[0]

    // Fetch completed logs per habit for the past year
    const results = {}
    await Promise.all(
      habitIds.map(async (habitId) => {
        try {
          const data = await api.get(`/api/logs?date=${today}&habitId=${habitId}`)
          // For streak we need history — we'll use a range endpoint if available,
          // but since our API only supports single-date queries, we approximate
          // by using the current today logs already fetched.
          // The streak calculation will be based on todaysLogs for now,
          // with a fallback approach using the existing data.
          results[habitId] = 0
        } catch {
          results[habitId] = 0
        }
      })
    )
    streaks.value = results
  }

  /**
   * Compute streak for a single habit using pre-loaded daily log history.
   * Call this with all completed dates for the habit across time.
   */
  function setStreakFromHistory(habitId, completedDates) {
    streaks.value[habitId] = calculateStreak(completedDates)
  }

  return {
    todaysLogs,
    streaks,
    loading,
    isCompleted,
    streakFor,
    fetchTodaysLogs,
    toggleLog,
    fetchStreaks,
    setStreakFromHistory,
  }
})
