<template>
  <div class="habit-list-item">
    <span class="drag-handle pi pi-bars" />
    <div class="habit-info">
      <span class="habit-name">{{ habit.name }}</span>
      <span v-if="habit.description" class="habit-desc">{{ habit.description }}</span>
    </div>
    <div class="habit-actions">
      <Tag :value="daysLabel" severity="secondary" />
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

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAYS = [1, 2, 3, 4, 5]
const WEEKENDS = [0, 6]
const ALL = [0, 1, 2, 3, 4, 5, 6]

const daysLabel = computed(() => {
  const days = (props.habit.days ?? '0,1,2,3,4,5,6')
    .split(',')
    .map(Number)
    .sort((a, b) => a - b)

  if (days.length === 7) return 'Every day'
  if (days.length === 5 && WEEKDAYS.every((d) => days.includes(d))) return 'Weekdays'
  if (days.length === 2 && WEEKENDS.every((d) => days.includes(d))) return 'Weekends'

  // Show abbreviated day names in Mon–Sun order (1..6,0)
  const ordered = [1, 2, 3, 4, 5, 6, 0].filter((d) => days.includes(d))
  return ordered.map((d) => DAY_ABBR[d]).join(', ')
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
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--p-border-radius);
  background: var(--p-surface-card);
  border: 1px solid var(--p-content-border-color);
}

.drag-handle {
  cursor: grab;
  color: var(--p-text-muted-color);
  flex-shrink: 0;
  font-size: 0.9rem;
}

.drag-handle:active {
  cursor: grabbing;
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
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
