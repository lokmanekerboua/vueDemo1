<template>
  <div class="login-page">

    <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Mode clair' : 'Mode sombre'">
      <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a1 1 0 0 0 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06a1 1 0 0 0 0-1.41 1 1 0 0 0-1.41 0zM7.05 18.36l-1.06 1.06a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
      </svg>
    </button>

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
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/>
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
import { useTheme } from '@/composables/useTheme.js'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()

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
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;
}

/* Theme toggle — positionné en haut à droite */
.theme-toggle {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-bg);
}

/* Background decoration */
.bg-deco { position: absolute; inset: 0; pointer-events: none; }
.deco-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.1;
}
.c1 {
  width: 400px; height: 400px;
  background: var(--accent);
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
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem;
  animation: fadeUp 0.5s ease both;
  transition: background 0.3s ease, border-color 0.3s ease;
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
  color: var(--text-primary);
  letter-spacing: -0.5px;
  margin-bottom: 0.4rem;
}

.login-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
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
  color: var(--text-muted);
  pointer-events: none;
  transition: all 0.2s ease;
}

.field-group.focused .field-label,
.field-group.filled .field-label {
  top: 0;
  font-size: 0.72rem;
  color: var(--accent);
}

.field-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: 'DM Sans', sans-serif;
  padding: 0.3rem 2rem 0.4rem 0;
  caret-color: var(--accent);
}

.field-line {
  height: 1px;
  background: var(--border-color);
  transition: background 0.2s, height 0.2s;
}

.field-group.focused .field-line {
  background: var(--accent);
  height: 2px;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 1.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.toggle-password:hover { color: var(--accent); }

/* Error */
.error-msg {
  font-size: 0.8rem;
  color: var(--danger);
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  margin-top: -0.5rem;
}

/* Button */
.btn-login {
  margin-top: 0.5rem;
  width: 100%;
  height: 48px;
  background: var(--accent);
  color: var(--accent-text);
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
.btn-login:hover { background: var(--accent-hover); }
.btn-login:active { transform: scale(0.98); }
.btn-login.loading { opacity: 0.7; pointer-events: none; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--accent-text);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Register link */
.register-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-muted);
}
.register-link a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}
.register-link a:hover { text-decoration: underline; }
</style>