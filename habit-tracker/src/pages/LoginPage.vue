<template>
  <div class="login-wrapper">
    <Card class="login-card">
      <template #header>
        <div class="login-card-header">
          <h1>Habit Tracker</h1>
          <p>Build better habits, one day at a time.</p>
        </div>
      </template>

      <template #content>
        <div class="login-tabs">
          <Button
            label="Sign In"
            :outlined="mode !== 'signin'"
            @click="mode = 'signin'"
          />
          <Button
            label="Sign Up"
            :outlined="mode !== 'signup'"
            @click="mode = 'signup'"
          />
        </div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="field">
            <label for="email">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              :class="{ 'p-invalid': errors.email }"
              fluid
              autocomplete="email"
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <Password
              id="password"
              v-model="password"
              placeholder="Password"
              :feedback="mode === 'signup'"
              toggleMask
              :class="{ 'p-invalid': errors.password }"
              fluid
              :inputProps="{ autocomplete: mode === 'signup' ? 'new-password' : 'current-password' }"
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <Message v-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>
          <Message v-if="successMessage" severity="success" :closable="false">{{ successMessage }}</Message>

          <Button
            :label="mode === 'signin' ? 'Sign In' : 'Create Account'"
            type="submit"
            :loading="authStore.loading"
            fluid
            class="mt-2"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Message from 'primevue/message'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const mode = ref('signin')
const email = ref('')
const password = ref('')
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

function validate() {
  errors.value = {}
  if (!email.value) errors.value.email = 'Email is required'
  if (!password.value) errors.value.password = 'Password is required'
  else if (password.value.length < 6) errors.value.password = 'Password must be at least 6 characters'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!validate()) return

  try {
    if (mode.value === 'signin') {
      await authStore.signIn(email.value, password.value)
      router.push({ name: 'today' })
    } else {
      await authStore.signUp(email.value, password.value)
      if (authStore.session) {
        router.push({ name: 'today' })
      } else {
        successMessage.value = 'Account created! Check your email to confirm your address.'
      }
    }
  } catch (err) {
    errorMessage.value = err.message || 'Authentication failed. Please try again.'
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--p-surface-ground);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.login-card-header {
  text-align: center;
  padding: 1.5rem 1.5rem 0;
}

.login-card-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
  color: var(--p-primary-color);
}

.login-card-header p {
  margin: 0;
  color: var(--p-text-muted-color);
  font-size: 0.9rem;
}

.login-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.mt-2 {
  margin-top: 0.5rem;
}
</style>
