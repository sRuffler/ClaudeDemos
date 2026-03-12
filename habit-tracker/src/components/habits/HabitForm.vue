<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="habit ? 'Edit Habit' : 'New Habit'"
    modal
    :style="{ width: '480px' }"
    :breakpoints="{ '640px': '95vw' }"
  >
    <form @submit.prevent="handleSubmit" class="habit-form">
      <div class="field">
        <label for="habit-name">Name <span class="required">*</span></label>
        <InputText
          id="habit-name"
          v-model="form.name"
          placeholder="e.g. Morning workout"
          :class="{ 'p-invalid': errors.name }"
          fluid
          maxlength="100"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <div class="field">
        <label for="habit-desc">Description</label>
        <Textarea
          id="habit-desc"
          v-model="form.description"
          placeholder="Optional details..."
          rows="3"
          fluid
          autoResize
        />
      </div>

      <div class="field">
        <label for="habit-days">Days <span class="required">*</span></label>
        <MultiSelect
          id="habit-days"
          v-model="form.days"
          :options="dayOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select days"
          :class="{ 'p-invalid': errors.days }"
          fluid
          display="chip"
        />
        <small v-if="errors.days" class="p-error">{{ errors.days }}</small>
      </div>

      <Message v-if="submitError" severity="error" :closable="false">{{ submitError }}</Message>
    </form>

    <template #footer>
      <Button label="Cancel" severity="secondary" outlined @click="$emit('update:visible', false)" />
      <Button
        :label="habit ? 'Save Changes' : 'Create Habit'"
        :loading="saving"
        @click="handleSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'
import Message from 'primevue/message'

const props = defineProps({
  visible: Boolean,
  habit: { type: Object, default: null },
})

const emit = defineEmits(['update:visible', 'saved'])

const dayOptions = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 0 },
]

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

function parseDaysFromHabit(habit) {
  if (!habit?.days) return [...ALL_DAYS]
  return habit.days.split(',').map(Number)
}

const form = ref({ name: '', description: '', days: [...ALL_DAYS] })
const errors = ref({})
const saving = ref(false)
const submitError = ref('')

watch(
  () => props.visible,
  (val) => {
    if (val) {
      form.value = {
        name: props.habit?.name ?? '',
        description: props.habit?.description ?? '',
        days: parseDaysFromHabit(props.habit),
      }
      errors.value = {}
      submitError.value = ''
    }
  }
)

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required'
  if (!form.value.days || form.value.days.length === 0) errors.value.days = 'Select at least one day'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  saving.value = true
  submitError.value = ''
  try {
    emit('saved', {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      days: [...form.value.days].sort((a, b) => a - b),
    })
  } catch (err) {
    submitError.value = err.message || 'Failed to save habit.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.habit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 0.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field label {
  font-weight: 500;
  font-size: 0.875rem;
}

.required {
  color: var(--p-red-500);
}
</style>
