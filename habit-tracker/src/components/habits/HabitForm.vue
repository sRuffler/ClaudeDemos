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
        <label for="habit-freq">Frequency</label>
        <Select
          id="habit-freq"
          v-model="form.frequency"
          :options="frequencyOptions"
          optionLabel="label"
          optionValue="value"
          fluid
        />
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
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'

const props = defineProps({
  visible: Boolean,
  habit: { type: Object, default: null },
})

const emit = defineEmits(['update:visible', 'saved'])

const frequencyOptions = [
  { label: 'Every day', value: 'DAILY' },
  { label: 'Weekdays (Mon–Fri)', value: 'WEEKDAYS' },
  { label: 'Weekends (Sat–Sun)', value: 'WEEKENDS' },
]

const form = ref({ name: '', description: '', frequency: 'DAILY' })
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
        frequency: props.habit?.frequency ?? 'DAILY',
      }
      errors.value = {}
      submitError.value = ''
    }
  }
)

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required'
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
      frequency: form.value.frequency,
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
