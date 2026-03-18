<template>
  <div class="detail-page">

    <div class="detail-header">
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

    <div v-if="isLoading" class="loader-detail">
      <div class="skeleton-poster"></div>
      <div class="skeleton-info">
        <div class="skeleton-line w50"></div>
        <div class="skeleton-line w30"></div>
        <div class="skeleton-line w80"></div>
        <div class="skeleton-line w70"></div>
      </div>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">!</div>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="film" class="detail-content">
      <div class="poster-wrapper">
        <img :src="film.picture" :alt="film.title" class="poster-img" />
        <div class="poster-glow"></div>
      </div>

      <div class="film-info">
        <div class="film-meta-top">
          <span class="film-date">{{ formatDate(film.createdAt) }}</span>
        </div>

        <h1 class="film-title">{{ film.title }}</h1>

        <div class="film-author">
          <div class="author-avatar">{{ film.author?.charAt(0).toUpperCase() }}</div>
          <div>
            <span class="author-label">Ajouté par</span>
            <span class="author-name">{{ film.author }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <p class="film-body">{{ film.body }}</p>

        <div class="film-actions">
          <button class="btn-edit" @click="goEdit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Modifier
          </button>
          <button class="btn-delete-action" @click="confirmDelete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showConfirm" class="modal-backdrop" @click.self="showConfirm = false">
      <div class="modal">
        <h3 class="modal-title">Supprimer ce film ?</h3>
        <p class="modal-text">Cette action est irréversible.</p>
        <div class="modal-actions">
          <button class="modal-cancel" @click="showConfirm = false">Annuler</button>
          <button class="modal-confirm" @click="handleDelete" :class="{ loading: isDeleting }">
            <span v-if="!isDeleting">Supprimer</span>
            <span v-else class="spinner"></span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFilmStore } from '@/stores/filmStore.js'
import { useTheme } from '@/composables/useTheme.js'

const props = defineProps({ id: String })
const router = useRouter()
const store = useFilmStore()
const { isDark, toggleTheme } = useTheme()

const film = ref(null)
const isLoading = ref(false)
const error = ref(null)
const showConfirm = ref(false)
const isDeleting = ref(false)

async function loadFilm() {
  isLoading.value = true
  error.value = null
  try {
    film.value = await store.fetchFilmById(props.id)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

function goEdit() {
  router.push({ name: 'FilmEdit', params: { id: props.id } })
}

function confirmDelete() { showConfirm.value = true }

async function handleDelete() {
  isDeleting.value = true
  try {
    await store.deleteFilm(props.id)
    router.push({ name: 'FilmList' })
  } finally {
    isDeleting.value = false
    showConfirm.value = false
  }
}

onMounted(loadFilm)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.detail-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-family: 'DM Sans', sans-serif;
  padding: 2rem 3rem;
  transition: background 0.3s ease, color 0.3s ease;
}

/* Header row */
.detail-header {
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
.detail-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3.5rem;
  align-items: start;
  animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Poster */
.poster-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  display: block;
  border-radius: 16px;
}

.poster-glow {
  position: absolute;
  bottom: -30px; left: 10%;
  width: 80%; height: 60px;
  background: var(--accent-bg);
  filter: blur(20px);
  border-radius: 50%;
  pointer-events: none;
}

/* Info */
.film-info {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.film-meta-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.film-date {
  font-size: 0.78rem;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.film-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.15;
  letter-spacing: -0.5px;
}

.film-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-label {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.author-name {
  display: block;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--accent);
}

.divider {
  height: 1px;
  background: var(--border-color);
}

.film-body {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
}

/* Actions */
.film-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-edit, .btn-delete-action {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: var(--accent-bg);
  border-color: var(--accent-border);
  color: var(--accent);
}
.btn-edit:hover {
  background: var(--accent-bg);
  border-color: var(--accent);
  filter: brightness(1.1);
}

.btn-delete-action {
  background: var(--danger-bg);
  border-color: var(--danger-border);
  color: var(--danger);
}
.btn-delete-action:hover {
  filter: brightness(1.15);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 360px;
  animation: fadeUp 0.25s ease both;
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.modal-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.modal-cancel {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.modal-cancel:hover {
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.modal-confirm {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  border: none;
  background: var(--danger);
  color: #fff;
  cursor: pointer;
  transition: filter 0.2s;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-confirm:hover { filter: brightness(1.1); }
.modal-confirm.loading { opacity: 0.7; pointer-events: none; }

/* Skeleton */
.loader-detail {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3.5rem;
}

.skeleton-poster {
  aspect-ratio: 2/3;
  border-radius: 16px;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-info {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-line {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.w30 { width: 30%; }
.w50 { width: 50%; }
.w70 { width: 70%; }
.w80 { width: 80%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: var(--text-muted);
}

.error-icon {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 2px solid var(--danger-border);
  color: var(--danger);
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Spinner */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 768px) {
  .detail-page { padding: 1.5rem; }
  .detail-content { grid-template-columns: 1fr; gap: 1.5rem; }
  .poster-img { max-width: 220px; }
  .film-title { font-size: 2rem; }
  .loader-detail { grid-template-columns: 1fr; }
}
</style>