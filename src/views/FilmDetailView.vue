<template>
  <div class="detail-page">

    <!-- Back button -->
    <RouterLink :to="{ name: 'FilmList' }" class="btn-back">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      Retour
    </RouterLink>

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
      <!-- Poster -->
      <div class="poster-wrapper">
        <img :src="film.picture" :alt="film.title" class="poster-img" />
        <div class="poster-glow"></div>
      </div>

      <!-- Info -->
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
          <button class="btn-delete" @click="confirmDelete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm delete modal -->
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

const props = defineProps({ id: String })
const router = useRouter()
const store = useFilmStore()

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

function confirmDelete() {
  showConfirm.value = true
}

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
  background: #0f0f13;
  color: #e8e6e1;
  font-family: 'DM Sans', sans-serif;
  padding: 2rem 3rem;
}

/* Back */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  margin-bottom: 2.5rem;
  transition: color 0.2s;
}
.btn-back:hover { color: #ffc850; }

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
  bottom: -30px;
  left: 10%;
  width: 80%;
  height: 60px;
  background: rgba(255, 200, 80, 0.15);
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
  color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.05);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
}

.film-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #f5f3ee;
  line-height: 1.15;
  letter-spacing: -0.5px;
}

.film-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 200, 80, 0.15);
  border: 1px solid rgba(255, 200, 80, 0.3);
  color: #ffc850;
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
  color: rgba(255,255,255,0.3);
}

.author-name {
  display: block;
  font-size: 0.88rem;
  font-weight: 500;
  color: #ffc850;
}

.divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
}

.film-body {
  font-size: 1rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.8;
}

/* Actions */
.film-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-edit, .btn-delete {
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
  background: rgba(255,200,80,0.08);
  border-color: rgba(255,200,80,0.25);
  color: #ffc850;
}
.btn-edit:hover {
  background: rgba(255,200,80,0.15);
  border-color: rgba(255,200,80,0.5);
}

.btn-delete {
  background: rgba(255,80,80,0.06);
  border-color: rgba(255,80,80,0.2);
  color: #ff6b6b;
}
.btn-delete:hover {
  background: rgba(255,80,80,0.12);
  border-color: rgba(255,80,80,0.4);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal {
  background: #1a1a22;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 360px;
  animation: fadeUp 0.25s ease both;
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: #f5f3ee;
  margin-bottom: 0.5rem;
}

.modal-text {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.35);
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
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.2s;
}
.modal-cancel:hover { color: #fff; border-color: rgba(255,255,255,0.25); }

.modal-confirm {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  border: none;
  background: #e05555;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-confirm:hover { background: #c94444; }
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
  background: linear-gradient(90deg, #1a1a22 25%, #222230 50%, #1a1a22 75%);
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
  background: linear-gradient(90deg, #1a1a22 25%, #222230 50%, #1a1a22 75%);
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
  color: rgba(255,255,255,0.4);
}

.error-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(220,60,60,0.4);
  color: #dc3c3c;
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