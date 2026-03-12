<template>
  <div class="habit-list-item">
    <div class="habit-info">
      <span class="habit-name">{{ habit.name }}</span>
      <span v-if="habit.description" class="habit-desc">{{ habit.description }}</span>
    </div>
    <div class="habit-actions">
      <Tag :value="frequencyLabel" severity="secondary" />
      <Button icon="pi pi-pencil" severity="secondary" text rounded @click="$emit('edit', habit)" aria-label="Edit" />
      <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDelete" aria-label="Delete" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps({
  habit: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const confirm = useConfirm()

const frequencyLabel = computed(() => {
  const map = { DAILY: 'Daily', WEEKDAYS: 'Weekdays', WEEKENDS: 'Weekends' }
  return map[props.habit.frequency] ?? props.habit.frequency
})

function confirmDelete() {
  confirm.require({
    message: `Delete "${props.habit.name}"? This cannot be undone.`,
    header: 'Delete Habit',
    icon: 'pi pi-exclamation-triangle',
    acceptSeverity: 'danger',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    accept: () => emit('delete', props.habit.id),
  })
}
</script>

<style scoped>
.habit-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--p-border-radius);
  background: var(--p-surface-card);
  border: 1px solid var(--p-content-border-color);
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.habit-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.habit-desc {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.habit-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}
</style>
