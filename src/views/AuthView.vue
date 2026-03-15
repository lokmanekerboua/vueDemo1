<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">Cinéthèque</h1>
        <p class="login-subtitle">Connectez-vous pour continuer</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field-group" :class="{ focused: focusedField === 'email', filled: form.email }">
          <label class="field-label">Email</label>
          <input
              v-model="form.email"
              type="email"
              class="field-input"
              autocomplete="email"
              @focus="focusedField = 'email'"
              @blur="focusedField = null"
          />
          <div class="field-line"></div>
        </div>

        <div class="field-group" :class="{ focused: focusedField === 'password', filled: form.password }">
          <label class="field-label">Mot de passe</label>
          <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              autocomplete="current-password"
              @focus="focusedField = 'password'"
              @blur="focusedField = null"
          />
          <div class="field-line"></div>
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          </button>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" class="btn-login" :class="{ loading: isLoading }">
          <span v-if="!isLoading">Se connecter</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <p class="register-link">
        Pas encore de compte ?
        <RouterLink to="/register">S'inscrire</RouterLink>
      </p>
    </div>

    <!-- background decoration -->
    <div class="bg-deco">
      <div class="deco-circle c1"></div>
      <div class="deco-circle c2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'

const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref(null)
const isLoading = ref(false)
const showPassword = ref(false)
const focusedField = ref(null)

async function handleLogin() {
  error.value = null
  isLoading.value = true
  try {
    const { data } = await apiClient.post('/auth/login', form.value)
    localStorage.setItem('jwt_token', data.token)
    router.push({ name: 'FilmList' })
  } catch (err) {
    error.value = err.response?.data?.message ?? 'Email ou mot de passe incorrect'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.login-page {
  min-height: 100vh;
  background: #0f0f13;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Background decoration */
.bg-deco { position: absolute; inset: 0; pointer-events: none; }
.deco-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}
.c1 {
  width: 400px; height: 400px;
  background: #ffc850;
  top: -100px; right: -100px;
}
.c2 {
  width: 300px; height: 300px;
  background: #c850ff;
  bottom: -80px; left: -80px;
}

/* Card */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  margin: 1.5rem;
  background: #1a1a22;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 2.5rem;
  animation: fadeUp 0.5s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Header */
.login-header { text-align: center; margin-bottom: 2.5rem; }

.login-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #f5f3ee;
  letter-spacing: -0.5px;
  margin-bottom: 0.4rem;
}

.login-subtitle {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.35);
}

/* Form */
.login-form { display: flex; flex-direction: column; gap: 1.8rem; }

.field-group {
  position: relative;
  padding-top: 1.2rem;
}

.field-label {
  position: absolute;
  top: 1.4rem;
  left: 0;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.35);
  pointer-events: none;
  transition: all 0.2s ease;
}

.field-group.focused .field-label,
.field-group.filled .field-label {
  top: 0;
  font-size: 0.72rem;
  color: #ffc850;
}

.field-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #f0ede8;
  font-size: 0.95rem;
  font-family: 'DM Sans', sans-serif;
  padding: 0.3rem 2rem 0.4rem 0;
  caret-color: #ffc850;
}

.field-line {
  height: 1px;
  background: rgba(255,255,255,0.12);
  transition: background 0.2s, height 0.2s;
}

.field-group.focused .field-line {
  background: #ffc850;
  height: 2px;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 1.5rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.toggle-password:hover { color: #ffc850; }

/* Error */
.error-msg {
  font-size: 0.8rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.08);
  border: 1px solid rgba(255,107,107,0.2);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  margin-top: -0.5rem;
}

/* Button */
.btn-login {
  margin-top: 0.5rem;
  width: 100%;
  height: 48px;
  background: #ffc850;
  color: #0f0f13;
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login:hover { background: #ffd470; }
.btn-login:active { transform: scale(0.98); }
.btn-login.loading { opacity: 0.7; pointer-events: none; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: #0f0f13;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Register link */
.register-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.3);
}

.register-link a {
  color: #ffc850;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-link a:hover { text-decoration: underline; }
</style>