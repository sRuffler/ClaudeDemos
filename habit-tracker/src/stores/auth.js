import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!session.value)
  const token = computed(() => session.value?.access_token ?? null)

  async function initAuth() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  async function signIn(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      session.value = data.session
      user.value = data.user
    } finally {
      loading.value = false
    }
  }

  async function signUp(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      session.value = data.session
      user.value = data.user
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    session.value = null
    user.value = null
  }

  return { user, session, loading, isAuthenticated, token, initAuth, signIn, signUp, signOut }
})
