<template>
  <div class="page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Cinéthèque</h1>
          <span class="badge-count">{{ filmCount }} film{{ filmCount > 1 ? 's' : '' }}</span>
        </div>
        <div class="header-right">
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Mode clair' : 'Mode sombre'">
            <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a1 1 0 0 0 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06a1 1 0 0 0 0-1.41 1 1 0 0 0-1.41 0zM7.05 18.36l-1.06 1.06a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          </button>
          <RouterLink :to="{ name: 'FilmAdd' }" class="btn-add">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Ajouter un film
          </RouterLink>
        </div>
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
import { useTheme } from '@/composables/useTheme.js'

const store = useFilmStore()
const { films, isLoading, error, filmCount } = storeToRefs(store)
const { fetchFilms, deleteFilm } = store
const { isDark, toggleTheme } = useTheme()

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
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-family: 'DM Sans', sans-serif;
  transition: background 0.3s ease, color 0.3s ease;
}

.page-header {
  padding: 2.5rem 2.5rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.badge-count {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--accent-border);
}

.page-main {
  padding: 2rem 2.5rem;
}

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

/* Add button */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.55rem 1.2rem;
  border-radius: 10px;
  background: var(--accent);
  color: var(--accent-text);
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}

.btn-add:hover { background: var(--accent-hover); }
.btn-add:active { transform: scale(0.97); }

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
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  overflow: hidden;
  animation: fadeUp 0.4s ease both;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.3s ease;
}

.film-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hover);
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

.card-img-wrapper {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.film-card:hover .card-img { transform: scale(1.05); }

.card-overlay {
  position: absolute;
  inset: 0;
  background: var(--card-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.film-card:hover .card-overlay { opacity: 1; }

.overlay-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.6);
  padding: 6px 14px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 0.85rem 1rem 1rem;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
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
  color: var(--accent);
  font-weight: 500;
}

.card-date {
  font-size: 0.7rem;
  color: var(--text-muted);
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

.film-card:hover .btn-delete { opacity: 1; }
.btn-delete:hover { background: rgba(220,60,60,0.85); color: #fff; }

/* Skeleton */
.loader-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}

.skeleton-card {
  border-radius: 12px;
  background: var(--bg-secondary);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.skeleton-img {
  aspect-ratio: 2/3;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
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
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
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
  color: var(--text-muted);
}

.error-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--danger-border);
  color: var(--danger);
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>