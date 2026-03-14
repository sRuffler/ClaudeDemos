<template>
  <div class="manage-page">
    <div class="manage-header">
      <h2>Manage Habits</h2>
      <Button label="Add Habit" icon="pi pi-plus" @click="openForm(null)" />
    </div>

    <ProgressBar v-if="habitsStore.loading" mode="indeterminate" style="height: 3px" />

    <div v-if="!habitsStore.loading && habitsStore.activeHabits.length === 0" class="empty-state">
      <i class="pi pi-list" style="font-size: 2.5rem; color: var(--p-text-muted-color)" />
      <p>No habits yet. Add your first habit to get started!</p>
    </div>

    <div v-else class="habit-list-wrapper">
      <draggable v-model="draggableHabits" item-key="id" handle=".drag-handle" class="habit-list" @end="handleReorder">
        <template #item="{ element }">
          <HabitListItem :habit="element" @edit="openForm" @delete="handleDelete" />
        </template>
      </draggable>
    </div>

    <HabitForm v-model:visible="formVisible" :habit="editingHabit" @saved="handleSaved" />

    <ConfirmDialog />

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import draggable from 'vuedraggable'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useHabitsStore } from '../stores/habits.js'
import HabitListItem from '../components/habits/HabitListItem.vue'
import HabitForm from '../components/habits/HabitForm.vue'

const habitsStore = useHabitsStore()
const toast = useToast()

const formVisible = ref(false)
const editingHabit = ref(null)

// Two-way binding for draggable — mirrors activeHabits, writeable for drag reorder
const draggableHabits = computed({
  get: () => habitsStore.activeHabits,
  set: (val) => {
    habitsStore.habits = [
      ...habitsStore.habits.filter((h) => !h.isActive),
      ...val,
    ]
  },
})

onMounted(() => habitsStore.fetchHabits())

function openForm(habit) {
  editingHabit.value = habit
  formVisible.value = true
}

async function handleReorder() {
  try {
    await habitsStore.reorderHabits(draggableHabits.value.map((h) => h.id))
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Reorder failed', detail: err.message, life: 4000 })
  }
}

async function handleSaved(payload) {
  try {
    if (editingHabit.value) {
      await habitsStore.updateHabit(editingHabit.value.id, payload)
      toast.add({ severity: 'success', summary: 'Saved', detail: 'Habit updated.', life: 3000 })
    } else {
      await habitsStore.createHabit(payload)
      toast.add({ severity: 'success', summary: 'Created', detail: 'Habit added.', life: 3000 })
    }
    formVisible.value = false
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 4000 })
  }
}

async function handleDelete(id) {
  try {
    await habitsStore.deleteHabit(id)
    toast.add({ severity: 'info', summary: 'Deleted', detail: 'Habit removed.', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 4000 })
  }
}
</script>

<style scoped>
.manage-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.manage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.manage-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.habit-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reorder-hint {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
  margin: 0 0 0.25rem;
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
