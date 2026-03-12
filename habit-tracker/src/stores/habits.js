import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api.js'

function parseDays(daysStr) {
  if (!daysStr) return [0, 1, 2, 3, 4, 5, 6]
  return daysStr.split(',').map(Number)
}

export const useHabitsStore = defineStore('habits', () => {
  const habits = ref([])
  const loading = ref(false)
  const error = ref(null)

  const activeHabits = computed(() => habits.value.filter((h) => h.isActive))

  const habitsForToday = computed(() => {
    const day = new Date().getDay()
    return activeHabits.value.filter((h) => parseDays(h.days).includes(day))
  })

  function habitsForDate(dateStr) {
    const day = new Date(dateStr + 'T00:00:00').getDay()
    return activeHabits.value.filter((h) => parseDays(h.days).includes(day))
  }

  function habitById(id) {
    return habits.value.find((h) => h.id === id)
  }

  async function fetchHabits() {
    loading.value = true
    error.value = null
    try {
      const data = await api.get('/api/habits')
      habits.value = data.habits
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createHabit(payload) {
    const data = await api.post('/api/habits', payload)
    habits.value.push(data.habit)
    return data.habit
  }

  async function updateHabit(id, payload) {
    const index = habits.value.findIndex((h) => h.id === id)
    const original = { ...habits.value[index] }
    if (index !== -1) Object.assign(habits.value[index], payload) // optimistic
    try {
      const data = await api.put(`/api/habits/${id}`, payload)
      if (index !== -1) habits.value[index] = data.habit
      return data.habit
    } catch (err) {
      if (index !== -1) habits.value[index] = original // rollback
      throw err
    }
  }

  async function deleteHabit(id) {
    const index = habits.value.findIndex((h) => h.id === id)
    const original = habits.value[index]
    if (index !== -1) habits.value.splice(index, 1) // optimistic
    try {
      await api.delete(`/api/habits/${id}`)
    } catch (err) {
      if (original) habits.value.splice(index, 0, original) // rollback
      throw err
    }
  }

  async function reorderHabits(orderedIds) {
    const original = habits.value.map((h) => ({ ...h }))

    // Optimistically update sortOrder
    orderedIds.forEach((id, i) => {
      const h = habits.value.find((h) => h.id === id)
      if (h) h.sortOrder = i
    })
    habits.value = [...habits.value].sort((a, b) => a.sortOrder - b.sortOrder)

    try {
      await api.put('/api/habits/reorder', {
        order: orderedIds.map((id, i) => ({ id, sortOrder: i })),
      })
    } catch (err) {
      habits.value = original // rollback
      throw err
    }
  }

  return {
    habits,
    loading,
    error,
    activeHabits,
    habitsForToday,
    habitsForDate,
    habitById,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
  }
})
