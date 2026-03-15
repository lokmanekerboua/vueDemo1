<template>
  <div class="page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Cinéthèque</h1>
        <span class="badge-count">{{ filmCount }} film{{ filmCount > 1 ? 's' : '' }}</span>
      </div>
    </header>

    <main class="page-main">
      <div v-if="isLoading" class="loader-grid">
        <div v-for="n in 4" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line w60"></div>
            <div class="skeleton-line w40"></div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">!</div>
        <p>{{ error }}</p>
      </div>

      <div v-else class="films-grid">
        <div
            v-for="(film, index) in films"
            :key="film.id"
            class="film-card"
            :style="{ animationDelay: `${index * 80}ms` }"
        >
          <RouterLink :to="{ name: 'FilmDetail', params: { id: film.id } }" class="card-link">
            <div class="card-img-wrapper">
              <img :src="film.picture" :alt="film.title" class="card-img" />
              <div class="card-overlay">
                <span class="overlay-label">Voir le film</span>
              </div>
            </div>
            <div class="card-body">
              <h2 class="card-title">{{ film.title }}</h2>
              <div class="card-meta">
                <span class="card-author">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                  {{ film.author }}
                </span>
                <span class="card-date">{{ formatDate(film.createdAt) }}</span>
              </div>
            </div>
          </RouterLink>
          <button class="btn-delete" @click="deleteFilm(film.id)" title="Supprimer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFilmStore } from '@/stores/filmStore.js'

const store = useFilmStore()
const { films, isLoading, error, filmCount } = storeToRefs(store)
const { fetchFilms, deleteFilm } = store

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(fetchFilms)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  min-height: 100vh;
  background: #0f0f13;
  color: #e8e6e1;
  font-family: 'JetBrains Mono', Consolas,monospace;
}

.page-header {
  padding: 2.5rem 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.header-content {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #f5f3ee;
  letter-spacing: -0.5px;
}

.badge-count {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(255, 200, 80, 0.12);
  color: #ffc850;
  border: 1px solid rgba(255, 200, 80, 0.2);
}

.page-main {
  padding: 2rem 2.5rem;
}

/* Grid */
.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}

/* Card */
.film-card {
  position: relative;
  border-radius: 12px;
  background: #1a1a22;
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  animation: fadeUp 0.4s ease both;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.film-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,200,80,0.25);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Image */
.card-img-wrapper {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #111;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.film-card:hover .card-img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.film-card:hover .card-overlay {
  opacity: 1;
}

.overlay-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.6);
  padding: 6px 14px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

/* Body */
.card-body {
  padding: 0.85rem 1rem 1rem;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f0ede8;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-author {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: #ffc850;
  font-weight: 500;
}

.card-date {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.35);
}

/* Delete button */
.btn-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.6);
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s, color 0.2s;
  backdrop-filter: blur(4px);
}

.film-card:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  background: rgba(220, 60, 60, 0.85);
  color: #fff;
}

/* Skeleton */
.loader-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}

.skeleton-card {
  border-radius: 12px;
  background: #1a1a22;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
}

.skeleton-img {
  aspect-ratio: 2/3;
  background: linear-gradient(90deg, #222 25%, #2a2a32 50%, #222 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 10px;
  border-radius: 6px;
  background: linear-gradient(90deg, #222 25%, #2a2a32 50%, #222 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.w60 { width: 60%; }
.w40 { width: 40%; }

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
</style>