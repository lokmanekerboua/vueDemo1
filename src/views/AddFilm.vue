<template>
  <div class="page">

    <div class="page-top">
      <RouterLink :to="{ name: 'FilmList' }" class="btn-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Retour
      </RouterLink>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Mode clair' : 'Mode sombre'">
        <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a1 1 0 0 0 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06a1 1 0 0 0 0-1.41 1 1 0 0 0-1.41 0zM7.05 18.36l-1.06 1.06a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
        </svg>
      </button>
    </div>

    <div class="page-layout">

      <!-- Form -->
      <div class="form-section">
        <div class="form-header">
          <h1 class="form-title">Ajouter un film</h1>
          <p class="form-subtitle">Renseignez les informations du film</p>
        </div>

        <form @submit.prevent="handleSubmit" class="film-form">

          <div class="field-group" :class="{ focused: focused === 'title', filled: form.title }">
            <label class="field-label">Titre</label>
            <input v-model="form.title" type="text" class="field-input"
                   @focus="focused = 'title'" @blur="focused = null" />
            <div class="field-line"></div>
            <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
          </div>

          <div class="field-group" :class="{ focused: focused === 'body', filled: form.body }">
            <label class="field-label">Description</label>
            <textarea v-model="form.body" class="field-input field-textarea" rows="4"
                      @focus="focused = 'body'" @blur="focused = null"></textarea>
            <div class="field-line"></div>
            <span v-if="errors.body" class="field-error">{{ errors.body }}</span>
          </div>

          <div class="field-group" :class="{ focused: focused === 'author', filled: form.author }">
            <label class="field-label">Auteur</label>
            <input v-model="form.author" type="text" class="field-input"
                   @focus="focused = 'author'" @blur="focused = null" />
            <div class="field-line"></div>
            <span v-if="errors.author" class="field-error">{{ errors.author }}</span>
          </div>

          <div class="field-group" :class="{ focused: focused === 'picture', filled: form.picture }">
            <label class="field-label">URL de l'affiche</label>
            <input v-model="form.picture" type="url" class="field-input"
                   @focus="focused = 'picture'" @blur="focused = null"
                   placeholder="https://image.tmdb.org/..." />
            <div class="field-line"></div>
            <span v-if="errors.picture" class="field-error">{{ errors.picture }}</span>
          </div>

          <div v-if="globalError" class="error-msg">{{ globalError }}</div>
          <div v-if="success" class="success-msg">Film ajouté avec succès !</div>

          <div class="form-actions">
            <RouterLink :to="{ name: 'FilmList' }" class="btn-cancel">Annuler</RouterLink>
            <button type="submit" class="btn-submit" :class="{ loading: isLoading }">
              <span v-if="!isLoading">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
                </svg>
                Ajouter le film
              </span>
              <span v-else class="spinner"></span>
            </button>
          </div>

        </form>
      </div>

      <!-- Preview -->
      <div class="preview-section">
        <p class="preview-label">Aperçu</p>
        <div class="preview-card" :class="{ 'has-image': previewUrl }">
          <div class="preview-img-wrapper">
            <img v-if="previewUrl" :src="previewUrl" :alt="form.title" class="preview-img"
                 @error="previewUrl = null" />
            <div v-else class="preview-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.2">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <span>Aperçu de l'affiche</span>
            </div>
          </div>
          <div class="preview-body">
            <h3 class="preview-title">{{ form.title || 'Titre du film' }}</h3>
            <div class="preview-author" v-if="form.author">
              <div class="author-avatar">{{ form.author.charAt(0).toUpperCase() }}</div>
              <span>{{ form.author }}</span>
            </div>
            <p class="preview-desc">{{ form.body || 'Description du film...' }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFilmStore } from '@/stores/filmStore.js'
import { useTheme } from '@/composables/useTheme.js'

const router = useRouter()
const store = useFilmStore()
const { isDark, toggleTheme } = useTheme()

const form = ref({ title: '', body: '', author: '', picture: '' })
const errors = ref({})
const globalError = ref(null)
const success = ref(false)
const isLoading = ref(false)
const focused = ref(null)
const previewUrl = ref(null)

let previewTimer = null
watch(() => form.value.picture, (val) => {
  clearTimeout(previewTimer)
  if (!val) { previewUrl.value = null; return }
  previewTimer = setTimeout(() => { previewUrl.value = val }, 600)
})

function validate() {
  const e = {}
  if (!form.value.title.trim()) e.title = 'Le titre est requis'
  else if (form.value.title.length < 2) e.title = 'Minimum 2 caractères'
  if (!form.value.body.trim()) e.body = 'La description est requise'
  if (!form.value.author.trim()) e.author = "L'auteur est requis"
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  globalError.value = null
  success.value = false
  if (!validate()) return
  isLoading.value = true
  try {
    await store.createFilm(form.value)
    success.value = true
    setTimeout(() => router.push({ name: 'FilmList' }), 1200)
  } catch (err) {
    globalError.value = err.response?.data?.message ?? 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-family: 'DM Sans', sans-serif;
  padding: 2rem 3rem;
  transition: background 0.3s ease, color 0.3s ease;
}

/* Top bar */
.page-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}
.btn-back:hover { color: var(--accent); }

/* Theme toggle */
.theme-toggle {
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
  flex-shrink: 0;
}
.theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-bg);
}

/* Layout */
.page-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 4rem;
  align-items: start;
}

/* Form header */
.form-header { margin-bottom: 2.5rem; }

.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  margin-bottom: 0.4rem;
}

.form-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.film-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Fields */
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
  padding: 0.3rem 0 0.4rem;
  caret-color: var(--accent);
  resize: none;
}

.field-input::placeholder {
  color: var(--text-hint);
  font-size: 0.82rem;
}

.field-textarea { line-height: 1.7; padding-top: 0.4rem; }

.field-line {
  height: 1px;
  background: var(--border-color);
  transition: background 0.2s, height 0.2s;
}

.field-group.focused .field-line {
  background: var(--accent);
  height: 2px;
}

.field-error {
  display: block;
  margin-top: 5px;
  font-size: 0.75rem;
  color: var(--danger);
}

/* Messages */
.error-msg {
  font-size: 0.82rem;
  color: var(--danger);
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  border-radius: 8px;
  padding: 0.65rem 1rem;
}

.success-msg {
  font-size: 0.82rem;
  color: var(--success);
  background: var(--success-bg);
  border: 1px solid var(--success-border);
  border-radius: 8px;
  padding: 0.65rem 1rem;
}

/* Actions */
.form-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn-cancel {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s;
}
.btn-cancel:hover {
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 0.65rem 1.6rem;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: var(--accent-text);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  min-width: 150px;
  justify-content: center;
}
.btn-submit:hover { background: var(--accent-hover); }
.btn-submit:active { transform: scale(0.98); }
.btn-submit.loading { opacity: 0.7; pointer-events: none; }

/* Preview */
.preview-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-hint);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.preview-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.3s, background 0.3s;
  animation: fadeUp 0.4s ease both;
}

.preview-card.has-image { border-color: var(--accent-border); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.preview-img-wrapper {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.preview-card:hover .preview-img { transform: scale(1.03); }

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-hint);
  font-size: 0.8rem;
}

.preview-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.preview-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.preview-author span {
  font-size: 0.8rem;
  color: var(--accent);
  font-weight: 500;
}

.preview-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Spinner */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(0,0,0,0.15);
  border-top-color: var(--accent-text);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 900px) {
  .page { padding: 1.5rem; }
  .page-layout { grid-template-columns: 1fr; gap: 2.5rem; }
  .preview-section { order: -1; }
}
</style>