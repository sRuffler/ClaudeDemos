<template>
  <div
    class="habit-check-item"
    :class="{ 'is-completed': completed }"
    @click="$emit('toggle', habit.id)"
  >
    <Checkbox
      :modelValue="completed"
      :binary="true"
      @click.stop
      @update:modelValue="$emit('toggle', habit.id)"
    />
    <div class="habit-info">
      <span class="habit-name">{{ habit.name }}</span>
      <span v-if="habit.description" class="habit-desc">{{ habit.description }}</span>
    </div>
    <StreakBadge :streak="streak" />
  </div>
</template>

<script setup>
import Checkbox from 'primevue/checkbox'
import StreakBadge from './StreakBadge.vue'

defineProps({
  habit: { type: Object, required: true },
  completed: { type: Boolean, default: false },
  streak: { type: Number, default: 0 },
})

defineEmits(['toggle'])
</script>

<style scoped>
.habit-check-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: var(--p-border-radius);
  background: var(--p-surface-card);
  border: 1px solid var(--p-content-border-color);
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  user-select: none;
}

.habit-check-item:hover {
  background: var(--p-surface-hover);
}

.habit-check-item.is-completed {
  opacity: 0.6;
}

.habit-check-item.is-completed .habit-name {
  text-decoration: line-through;
  color: var(--p-text-muted-color);
}

.habit-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
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
</style>
