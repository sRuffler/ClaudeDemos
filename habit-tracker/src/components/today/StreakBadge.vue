<template>
  <span v-if="streak > 0" class="streak-badge" :title="`${streak}-day streak`">
    🔥 {{ streak }}
  </span>
</template>

<script setup>
defineProps({
  streak: { type: Number, default: 0 },
})
</script>

<style scoped>
.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--p-orange-100);
  color: var(--p-orange-700);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
}
</style>
